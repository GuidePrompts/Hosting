import os
import tempfile
import zipfile
from pathlib import Path
from docker import from_env
from ..models import Project
from .docker_utils import create_container

client = from_env()

def build_and_run(project: Project, uploaded_file, env_vars: dict):
    with tempfile.TemporaryDirectory() as tmpdir:
        file_path = os.path.join(tmpdir, "source.zip")
        with open(file_path, "wb") as f:
            f.write(uploaded_file.file.read())

        if zipfile.is_zipfile(file_path):
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                zip_ref.extractall(tmpdir)
            build_path = tmpdir
        else:
            # Single file - assume it's main.py, put in a subdir
            build_path = os.path.join(tmpdir, "code")
            os.mkdir(build_path)
            os.rename(file_path, os.path.join(build_path, "main.py"))

        # Determine start command based on project type
        if project.type == "flask":
            # Check if app.py or main.py exists
            if (Path(build_path) / "app.py").exists():
                command = "python app.py"
            else:
                command = "python main.py"
            env_vars["PORT"] = "80"
            ports = {'80/tcp': None}
        elif project.type == "telegram":
            command = "python main.py" if (Path(build_path) / "main.py").exists() else "python bot.py"
            ports = None
        elif project.type == "discord":
            command = "python main.py" if (Path(build_path) / "main.py").exists() else "python bot.py"
            ports = None
        else:
            command = "python main.py"
            ports = None

        # Install dependencies if requirements.txt exists
        req_file = Path(build_path) / "requirements.txt"
        if req_file.exists():
            # We'll install by running pip inside container at start
            # Prepend pip install to command
            command = f"pip install -r requirements.txt && {command}"

        # Prepare volume mount
        volumes = {build_path: {"bind": "/app", "mode": "ro"}}
        working_dir = "/app"

        image = "python:3.10-slim"

        container_id = create_container(
            image=image,
            env_vars=env_vars,
            name=f"project-{project.id}",
            command=["/bin/sh", "-c", command],
            ports=ports,
            volumes=volumes,
            working_dir=working_dir
        )

        project.container_id = container_id
        project.status = "running"
        if project.type == "flask":
            # Get mapped port
            container = client.containers.get(container_id)
            project.port = container.attrs['NetworkSettings']['Ports']['80/tcp'][0]['HostPort']
        return project
