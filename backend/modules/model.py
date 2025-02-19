from pydantic import BaseModel, EmailStr, conint, StringConstraints
from typing import Literal
from datetime import date
from typing import Annotated

class Student(BaseModel):
    name: str
    dob: Annotated[str, StringConstraints(pattern=r"\d{4}-\d{2}-\d{2}")]  # Format: YYYY-MM-DD
    class_id: int
    class_teacher: str
    guardian_name: str
    guardian_mob: conint(ge=1000000000, le=9999999999)  # 10-digit mobile number
    guardian_mail: EmailStr
    student_gender: Literal["Male", "Female", "Other"]

class Grade(BaseModel):
    student_id: int
    subject: str
    marks: conint(ge=0, le=100)  
    test_date: Annotated[str, StringConstraints(pattern=r"\d{4}-\d{2}-\d{2}")]
    test_type: Literal["Midterm", "Final"]

class Attendance(BaseModel):
    student_id: int
    attendance_date: Annotated[str, StringConstraints(pattern=r"\d{4}-\d{2}-\d{2}")]
    attendance_status: Literal["P", "A"]
