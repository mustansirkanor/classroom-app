import os
from dotenv import load_dotenv
import google.generativeai as genai

def ask_gemini(prompt):
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not found in environment variables")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)
    return response.text

def make_student_overview(text):
    prompt = (
        "You are an expert teacher. "
        "Read the following educational text and create a clear, concise overview for students: "
        f"\n\n{text}"
        "\n\nOverview:"
    )
    return ask_gemini(prompt)

def make_student_assessment(text, num_questions=5):
    prompt = (
        f"You are an expert teacher. Based on the following educational text, "
        f"create an assessment with {num_questions} questions for students. "
        "Make sure questions test their understanding, include a mix of multiple choice and short answer types. "
        "Don't include answers—just the questions.\n\n"
        f"{text}\n\nAssessment:"
    )
    return ask_gemini(prompt)

def make_student_podcast(text):
    prompt = (
        "Pretend you are a solo podcast host. Read the following educational text, then write a short podcast script "
        "where you explain the material in a friendly and engaging way for students—like you're talking to your audience, not just reading an essay. "
        "Keep it conversational and interesting.\n\n"
        f"{text}\n\nPodcast Script:"
    )
    return ask_gemini(prompt)
