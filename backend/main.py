from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
import shutil

from database import engine, get_db, Base
import models

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MyTravelApp Vault API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "/app/data/uploads" if os.path.exists("/app/data") else "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    uploadedBy: str = Form(...),
    family: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        # Generate unique ID and save file to disk
        doc_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1]
        safe_filename = f"{doc_id}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, safe_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_size = os.path.getsize(file_path)

        # Save metadata to database
        db_doc = models.Document(
            id=doc_id,
            name=file.filename,
            type=file.content_type,
            size=file_size,
            url=f"/api/documents/{doc_id}/download",
            uploadedBy=uploadedBy,
            family=family
        )
        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)

        return {"success": True, "document": db_doc}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents/list")
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(models.Document).order_by(models.Document.uploadedAt.desc()).all()
    return {"documents": docs}

@app.get("/api/documents/{doc_id}/download")
def download_document(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    file_extension = ""
    # Try to find the file
    for filename in os.listdir(UPLOAD_DIR):
        if filename.startswith(doc_id):
            file_path = os.path.join(UPLOAD_DIR, filename)
            return FileResponse(path=file_path, filename=doc.name, media_type=doc.type)
            
    raise HTTPException(status_code=404, detail="File physical payload missing")

@app.delete("/api/documents/{doc_id}")
def delete_document(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Delete physical file
    for filename in os.listdir(UPLOAD_DIR):
        if filename.startswith(doc_id):
            try:
                os.remove(os.path.join(UPLOAD_DIR, filename))
            except Exception:
                pass
                
    # Delete DB record
    db.delete(doc)
    db.commit()
    
    return {"success": True}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
