from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import json
from .. import models, schemas, dependencies
from ..services.deployer import build_and_run

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/", response_model=schemas.ProjectOut)
async def create_project(
    name: str = Form(...),
    type: models.ProjectType = Form(...),
    env_vars: str = Form("{}"),
    file: UploadFile = File(...),
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    try:
        env_dict = json.loads(env_vars)
    except:
        raise HTTPException(400, "Invalid env_vars JSON")

    project = models.Project(
        name=name,
        type=type,
        user_id=current_user.id,
        env_vars=env_dict
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    try:
        updated_project = build_and_run(project, file, env_dict)
        db.commit()
        return updated_project
    except Exception as e:
        project.status = "error"
        db.commit()
        raise HTTPException(500, f"Deployment failed: {e}")

@router.get("/", response_model=List[schemas.ProjectOut])
def list_projects(
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    projects = db.query(models.Project).filter(models.Project.user_id == current_user.id).all()
    return projects

@router.get("/{project_id}", response_model=schemas.ProjectOut)
def get_project(
    project_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(404, "Project not found")
    return project

@router.post("/{project_id}/stop")
def stop_project(
    project_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(404, "Project not found")
    from ..services.docker_utils import stop_container
    if project.container_id:
        stop_container(project.container_id)
        project.status = "stopped"
        db.commit()
    return {"status": "stopped"}

@router.post("/{project_id}/start")
def start_project(
    project_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    # Re-run using stored data (simplified - would need to rebuild or restart)
    # For now just update status
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(404, "Project not found")
    # In a real implementation, you'd restart the container
    project.status = "running"
    db.commit()
    return {"status": "started"}

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(404, "Project not found")
    from ..services.docker_utils import stop_container
    if project.container_id:
        stop_container(project.container_id)
    db.delete(project)
    db.commit()
    return {"status": "deleted"}
