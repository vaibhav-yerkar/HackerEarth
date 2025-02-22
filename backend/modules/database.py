from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
import json
import os

load_dotenv()

class database:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY")
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)

    def add_student(self,student_dict):
        data = self.supabase.table("students").insert(student_dict).execute()
    
    def add_score(self,grade_dict):
        data = self.supabase.table("grade").insert(grade_dict).execute()

    def add_attendance(self,student_id,attendance_date,attendance_status):
        attendance_dict = {
            "student_id":student_id,
            "attendance_date":attendance_date,
            "attendance_remarks":attendance_status
        }
        data = self.supabase.table("attendance").insert(attendance_dict).execute()
        return {'message':'Attendance Marked'}
        

    def get_students_profile(self,guardian_mob,dob):
        data = self.supabase.table("students").select("*").eq("guardian_mob",guardian_mob).eq("dob",dob).execute()
        student_profile = data.json()
        json_data = json.loads(student_profile)
        json_data = json_data['data']
        if json_data :
            return json_data[0]
        else:
            return {'error':'No student found'}
        
    def get_all_students(self):
        data = self.supabase.table("students").select("*").execute()
        student_profile = data.json()
        json_data = json.loads(student_profile)
        json_data = json_data['data']
        if json_data :
            return {'Students':json_data}
        else:
            return {'error':'No student found'}
        
    def get_student_score(self,student_id):
        data = self.supabase.table("grade").select("*").eq("student_id",student_id).execute()
        student_profile = data.json()
        json_data = json.loads(student_profile)
        json_data = json_data['data']
        if json_data :
            return {'Scores':json_data}
        else:
            return {'error':'No Scores found'}
    
    def get_student_attendance(self,student_id):
        data = self.supabase.table("attendance").select("*").eq("student_id",student_id).execute()
        student_profile = data.json()
        json_data = json.loads(student_profile)
        json_data = json_data['data']
        if json_data :
            return {'Attendance':json_data}
        else:
            return {'error':'No Attrendance found'}
        
    def delete_student(self,student_id):
        data = self.supabase.table("students").delete().eq("student_id",student_id).execute()
        return {'message':'Student deleted'}
    
    def modify_student(self,student_id,student_dict):
        data = self.supabase.table("students").update(student_dict).eq("student_id",student_id).execute()
        return {'message':'Student updated'}
    
    def modify_remark(self,student_id,remark):
        data = self.supabase.table("students").update({"Remark":remark}).eq("student_id",student_id).execute()
        return {'message':'Remark updated'}

    def add_event(self,event_dict):
        data = self.supabase.table("events").insert(event_dict).execute()
        return {'message':'Event added'}
    
    def get_events(self):
        data = self.supabase.table("events").select("*").execute()
        event_data = data.json()
        json_data = json.loads(event_data)
        json_data = json_data['data']
        if json_data :
            return {'Events':json_data}
        else:
            return {'error':'No Events found'}
        
    def delete_event(self,event_id):
        data = self.supabase.table("events").delete().eq("id",event_id).execute()
        return {'message':'Event deleted'}
    
    def modify_event(self,event_id,event_dict):
        data = self.supabase.table("events").update(event_dict).eq("id",event_id).execute()
        return {'message':'Event updated'}

    