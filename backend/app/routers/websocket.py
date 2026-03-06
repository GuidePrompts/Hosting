from fastapi import WebSocket, WebSocketDisconnect, APIRouter, Depends
from sqlalchemy.orm import Session
import docker
import asyncio
from .. import models, dependencies

router = APIRouter()

@router.websocket("/ws/logs/{project_id}")
async def websocket_logs(
    websocket: WebSocket,
    project_id: int,
    token: str,
    db: Session = Depends(dependencies.get_db)
):
    await websocket.accept()
    # Authenticate via token
    email = await dependencies.get_current_user_ws(websocket, token)
    if not email:
        await websocket.close(code=1008)
        return

    # Verify project belongs to user
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        await websocket.close(code=1008)
        return
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == user.id
    ).first()
    if not project or not project.container_id:
        await websocket.close(code=1008)
        return

    client = docker.from_env()
    try:
        container = client.containers.get(project.container_id)
        for line in container.logs(stream=True, follow=True):
            await websocket.send_text(line.decode().strip())
    except docker.errors.NotFound:
        await websocket.send_text("Container not found")
    except WebSocketDisconnect:
        pass
    finally:
        await websocket.close()
