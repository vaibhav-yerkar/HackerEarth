from groq import Groq

class ParentalMonitoringSystem:
    def __init__(self, api_key):
        """
        Initialize the Groq client and LLM.
        """
        self.client = Groq(api_key=api_key)
        self.llm = self.client.chat.completions.create

    def choose_api(self, question):
        """
        Choose the appropriate API based on the parent's question.
        """
        prompt_for_choosing_api = f"""
        {question}
        You have the following APIs:
        1. Attendance: http://127.0.0.1:8000/get_student_attendance/
        2. Marks: http://127.0.0.1:8000/get_student_score/
        3. Events: http://127.0.0.1:8000/get_event_details/
        4. School-related information: http://127.0.0.1:8000/get_school_details/

        Based on the question, return only the appropriate API URL as output. Provide no explanation, no additional text, and no formatting—just the exact API URL. Do not include anything else in the response. Just return 1 most similar link.
        """
        response = self.llm(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt_for_choosing_api}],
            temperature=0.7
        )
        return response.choices[0].message.content

    def clean_text(self, data):
        """
        Clean and process the context data.
        """
        if 'Attendance' in data:
            result = []
            for record in data['Attendance']:
                date = record.get('attendance_date')
                remarks = record.get('attendance_remarks')
                result.append({'Date': date, 'Remarks': remarks})
            return result
        else:
            return "No Attendance Data Found"
        
    def get_context_text(self,question,student_id):
        url = self.choose_api(question)
        url =  f"{url}{student_id}"
        context_text = ""
        return context_text

    def generate_response(self, question, context_text):
        """
        Generate a response based on the parent's question and context.
        """
        cleaned_context_text = self.clean_text(context_text)

        prompt = f"""
        You are a chat assistant for a parental monitoring system that helps parents track their child's progress.

        - Parent's question: {question}
        - Context from the database/backend: {cleaned_context_text}

        Instructions:
        1. If the parent's question mentions a technical issue, ask them to contact 9XXXXXXXXX.
        2. If the question is about attendance, then answer accordingly. If overall attendance is requested, calculate and provide the overall attendance percentage: (total attendance_remarks = P) / (total attendance_remarks = P or A). If there is no record of the date, the lecture didn't happen.
        3. If the question is about overall improvement, analyze the marks provided in the context and summarize the child's progress.
        4. For questions about events, provide a pointwise response.
        5. Keep responses precise and focused. Avoid unnecessary details.

        Your response should directly address the parent's question based on the given context.
        Just return the answer in one line. No explanation needed, not even the question.
        """

        response = self.llm(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        return response.choices[0].message.content


