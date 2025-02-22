from fastapi import FastAPI, HTTPException
import uvicorn
from modules.database import database  as Database
from modules.model import Student, Grade, Attendance,chatbot_response,Event
from modules.chatbot import ParentalMonitoringSystem
from dotenv import load_dotenv
import os

app = FastAPI(title="Student Management API")
chatbot = ParentalMonitoringSystem()
db = Database()


@app.get("/")
def home():
    return {"message": "Welcome to Student Management System"}

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

@app.post("/add_event")
def add_event(event: Event):
    return db.add_event(event.dict())

@app.get("/get_events")
def get_events():
    return db.get_events()

@app.delete("/delete_event/{event_id}")
def delete_event(event_id: int):
    return db.delete_event(event_id)

@app.put("/modify_event/{event_id}")
def modify_event(event_id: int, event: Event):
    return db.modify_event(event_id, event.dict())

@app.post("/chatbot")
def chatbot_response(chatbot_response: chatbot_response):
    response = chatbot.generate_response(chatbot_response.question, chatbot_response.student_id)
    return {"response": response}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
