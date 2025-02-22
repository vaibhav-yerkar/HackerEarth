import requests
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("API_KEY")
class ParentalMonitoringSystem:
    def __init__(self):
        self.api_key = os.getenv("API_KEY")
        self.client = Groq(api_key=api_key)
        self.llm = self.client.chat.completions.create

    def choose_api(self, question):
        prompt_for_choosing_api = f"""
        {question}
        You have the following APIs:
        1. Attendance: http://127.0.0.1:8000/get_student_attendance/
        2. Marks: http://127.0.0.1:8000/get_student_score/
        3. Events: http://127.0.0.1:8000/get_events/
        4. School-related information: http://127.0.0.1:8000/get_school_details/

        Based on the question, return only the appropriate API URL as output. Provide no explanation, no additional text, and no formatting—just the exact API URL. Do not include anything else in the response. Just return 1 most similar link.
        """
        response = self.llm(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt_for_choosing_api}],
            temperature=0.7
        )
        return response.choices[0].message.content

    def fetch_data(self, url, student_id):
        """
        Fetch data from the appropriate API.
        """
        try:
            response = requests.get(f"{url}{student_id}")
            if response.status_code == 200:
                return response.json()
            else:
                return None
        except Exception as e:
            return None

    def clean_text(self, data):
        if "Attendance" in data:
            attendance_records = data["Attendance"]
            total_lectures = len(attendance_records)
            present_count = sum(1 for record in attendance_records if record["attendance_remarks"] == "P")

            if total_lectures > 0:
                attendance_percentage = round((present_count / total_lectures) * 100, 2)
                return f"Overall attendance percentage is {attendance_percentage}%."
            else:
                return "No Attendance Data Found."

        elif "Scores" in data:
            subject_scores = {}
            for record in data["Scores"]:
                subject = record["subject"]
                marks = record["marks"]
                test_date = record["test_date"]

                if subject not in subject_scores or test_date > subject_scores[subject]["test_date"]:
                    subject_scores[subject] = {
                        "marks": marks,
                        "test_date": test_date
                    }

            if subject_scores:
                marks_summary = ", ".join([f"{sub}: {details['marks']} (Latest)" for sub, details in subject_scores.items()])
                return f"Latest scores - {marks_summary}."
            else:
                return "No Marks Data Found."

        else:
            return "No relevant data found."

    def get_context_text(self, question, student_id):
        url = self.choose_api(question)
        data = self.fetch_data(url, student_id)
        if data:
            return self.clean_text(data)
        return "No data available."

    def generate_response(self, question, student_id):
        context_text = self.get_context_text(question, student_id)

        prompt = f"""
        You are a chat assistant for a parental monitoring system that helps parents track their child's progress.

        - Parent's question: {question}
        - Context from the database/backend: {context_text}

        Instructions:
        1. If the parent's question mentions a technical issue, ask them to contact 9XXXXXXXXX.
        2. If the question is about attendance, then answer accordingly. If overall attendance is requested, provide the percentage.
        3. If the question is about marks, provide the latest test scores for each subject.
        4. Keep responses precise and focused. Avoid unnecessary details.

        Just return the answer in one line. No explanation needed, not even the question.
        """

        response = self.llm(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5
        )
        return response.choices[0].message.content
