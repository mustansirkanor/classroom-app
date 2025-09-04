from fastapi import FastAPI, File, UploadFile
from pypdf import PdfReader
from io import BytesIO
import os
from gemini import make_student_overview, make_student_assessment, make_student_podcast

app = FastAPI()

def read_pdf(contents):
    # Use BytesIO instead of writing to disk
    pdf_buffer = BytesIO(contents)
    reader = PdfReader(pdf_buffer)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def call_gemini(text, task):
    if task == "overview":
        return make_student_overview(text)
    elif task == "assessment":  # Fixed typo
        return make_student_assessment(text, 10)
    elif task == "podcast":
        return make_student_podcast(text)

@app.get("/")
async def root():
    return {"message": "API is running"}

@app.post("/brief-overview")
async def overview(file: UploadFile = File(...)):
    contents = await file.read()
    text = read_pdf(contents)
    result = call_gemini(text, "overview")
    return {"result": result}

@app.post("/assessment")  # Fixed typo in endpoint
async def assessment(file: UploadFile = File(...)):
    contents = await file.read()
    text = read_pdf(contents)
    result = call_gemini(text, "assessment")  # Fixed typo
    return {"result": result}

@app.post("/podcast")
async def podcast(file: UploadFile = File(...)):
    contents = await file.read()
    text = read_pdf(contents)
    result = call_gemini(text, "podcast")
    return {"result": result}
