import docker
from docker.errors import NotFound, APIError
from ..config import settings

client = docker.from_env()

def create_container(image: str, env_vars: dict, name: str, command: str = None, ports: dict = None, volumes: dict = None, working_dir: str = None):
    try:
        container = client.containers.run(
            image,
            command=command,
            name=name,
            environment=env_vars,
            ports=ports,
            volumes=volumes,
            working_dir=working_dir,
            detach=True,
            network=settings.DOCKER_NETWORK,
            mem_limit="512m",
            nano_cpus=int(0.5 * 1e9),
            restart_policy={"Name": "unless-stopped"},
            remove=False
        )
        return container.id
    except APIError as e:
        raise Exception(f"Docker error: {e}")

def stop_container(container_id: str):
    try:
        container = client.containers.get(container_id)
        container.stop()
        container.remove()
    except NotFound:
        pass

def get_container_logs(container_id: str, tail=100):
    try:
        container = client.containers.get(container_id)
        return container.logs(stdout=True, stderr=True, tail=tail).decode()
    except NotFound:
        return "Container not found"
