import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY")
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)

    def add_student(self, student_dict):
        self.supabase.table("students").insert(student_dict).execute()

    def add_score(self, grade_dict):
        self.supabase.table("grade").insert(grade_dict).execute()

    def add_attendance(self, student_id, attendance_date, attendance_status):
        attendance_dict = {
            "student_id": student_id,
            "attendance_date": attendance_date,
            "attendance_remarks": attendance_status
        }
        self.supabase.table("attendance").insert(attendance_dict).execute()
        return {'message': 'Attendance Marked'}

    def get_students_profile(self, guardian_mob, dob):
        data = self.supabase.table("students").select("*").eq("guardian_mob", guardian_mob).eq("dob", dob).execute()
        json_data = json.loads(data.json()).get('data', [])
        return json_data[0] if json_data else {'error': 'No student found'}

    def get_all_students(self):
        data = self.supabase.table("students").select("*").execute()
        json_data = json.loads(data.json()).get('data', [])
        return {'Students': json_data} if json_data else {'error': 'No student found'}

    def get_student_score(self, student_id):
        data = self.supabase.table("grade").select("*").eq("student_id", student_id).execute()
        json_data = json.loads(data.json()).get('data', [])
        return {'Scores': json_data} if json_data else {'error': 'No Scores found'}

    def get_student_attendance(self, student_id):
        data = self.supabase.table("attendance").select("*").eq("student_id", student_id).execute()
        json_data = json.loads(data.json()).get('data', [])
        return {'Attendance': json_data} if json_data else {'error': 'No Attendance found'}

    def delete_student(self, student_id):
        self.supabase.table("students").delete().eq("student_id", student_id).execute()
        return {'message': 'Student deleted'}

    def modify_student(self, student_id, student_dict):
        self.supabase.table("students").update(student_dict).eq("student_id", student_id).execute()
        return {'message': 'Student updated'}

    def modify_remark(self, student_id, remark):
        self.supabase.table("students").update({"Remark": remark}).eq("student_id", student_id).execute()
        return {'message': 'Remark updated'}

    def modify_score(self, student_id, score_dict):
        self.supabase.table("grade").update(score_dict).eq("student_id", student_id).execute()
        return {'message': 'Score updated'}