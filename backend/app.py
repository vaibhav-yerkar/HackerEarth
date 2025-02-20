from fastapi import FastAPI, HTTPException
import uvicorn
from backend.modules.database import Database
from backend.modules.model import Student, Grade, Attendance
from backend.modules.chatbot import ParentalMonitoringSystem
from backend.modules.audio_notes import AudioGenerator

app = FastAPI(title="Student Management API")
db = Database()
chatbot = ParentalMonitoringSystem(api_key="your_api_key")
audio_generator = AudioGenerator()

@app.post("/add_student")
def add_student(student: Student):
    db.add_student(student.dict())
    return {"message": "Student added successfully"}

@app.post("/add_score")
def add_score(grade: Grade):
    db.add_score(grade.dict())
    return {"message": "Score added successfully"}

@app.post("/add_attendance")
def add_attendance(attendance: Attendance):
    return db.add_attendance(attendance.student_id, attendance.attendance_date, attendance.attendance_status)

@app.get("/get_students_profile")
def get_students_profile(guardian_mob: int, dob: str):
    student = db.get_students_profile(guardian_mob, dob)
    if "error" in student:
        raise HTTPException(status_code=404, detail=student["error"])
    return student

@app.get("/get_all_students")
def get_all_students():
    return db.get_all_students()

@app.get("/get_student_score/{student_id}")
def get_student_score(student_id: int):
    return db.get_student_score(student_id)

@app.get("/get_student_attendance/{student_id}")
def get_student_attendance(student_id: int):
    return db.get_student_attendance(student_id)

@app.delete("/delete_student/{student_id}")
def delete_student(student_id: int):
    return db.delete_student(student_id)

@app.put("/modify_student/{student_id}")
def modify_student(student_id: int, student: Student):
    return db.modify_student(student_id, student.dict())

@app.put("/modify_remark/{student_id}")
def modify_remark(student_id: int, remark: str):
    return db.modify_remark(student_id, remark)

@app.post("/chatbot")
def chatbot_response(question: str, student_id: int):
    context_text = chatbot.get_context_text(question, student_id)
    response = chatbot.generate_response(question, context_text)
    return {"response": response}

@app.post("/generate-audio/")
def generate_audio(text: str, lang: str = "en"):
    audio = audio_generator.generate_audio(text, lang)
    if audio:
        return {"message": "Audio generated successfully"}
    raise HTTPException(status_code=500, detail="Failed to generate audio")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
