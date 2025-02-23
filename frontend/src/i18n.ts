import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Common
      "app.name": "YetAnotherERP",
      loading: "Loading...",
      noData: "No data available",

      // Navigation
      "nav.dashboard": "Dashboard",
      "nav.calendar": "Calendar",
      "nav.attendance": "Attendance",
      "nav.admin": "Admin Panel",
      "nav.logout": "Logout",

      // Home Page
      "home.welcome": "Welcome to",
      "home.subtitle.parent":
        "Stay connected with {{name}}'s educational journey through our comprehensive school management system",
      "home.subtitle.teacher":
        "Empower your teaching experience with our comprehensive school management system",
      "home.subtitle.guest":
        "A comprehensive school management system for parents and teachers",
      "home.features": {
        analytics: "Performance Analytics",
        "analytics.desc":
          "Track academic progress with detailed insights and visual analytics",
        calendar: "Academic Calendar",
        "calendar.desc": "Stay updated with events, exams, and important dates",
        attendance: "Attendance Tracking",
        "attendance.desc":
          "Monitor attendance patterns and view detailed reports",
        admin: "Admin Panel",
        "admin.desc": "Manage students, classes, and administrative tasks",
      },

      // Dashboard
      "dashboard.title": "Student Dashboard",
      "dashboard.academic.progress": "Academic Progress",
      "dashboard.current.average": "Current Average",
      "dashboard.attendance": "Attendance",
      "dashboard.present.days": "Present Days",
      "dashboard.upcoming": "Upcoming",
      "dashboard.events": "Events",
      "dashboard.performance": "Subject Performance Trends",
      "dashboard.remarks": "Recent Remarks",
      "dashboard.no.remarks": "No remarks",
      "dashboard.select_student": "Select Student",
      "dashboard.upcoming.events": "Upcoming Events",
      "dashboard.upcoming.description": "Scheduled for this month",

      // Admin Panel
      "admin.title": "Admin Panel",
      "admin.students": "Students",
      "admin.total.students": "Total Students",
      "admin.events": "Events",
      "admin.total.events": "Total Events",
      "admin.quick.actions": "Quick Actions",
      "admin.actions": {
        "add.student": "Add Student",
        "add.desc": "Register new student",
        "delete.student": "Delete Student",
        "delete.desc": "Remove student record",
        "modify.student": "Modify Details",
        "modify.desc": "Update student information",
        "add.marks": "Add Marks",
        "marks.desc": "Enter assessment scores",
        "create.event": "Create Event",
        "event.desc": "Schedule new event",
      },
      "admin.leaderboard": "Student Leaderboard",

      // Admin Modals
      "admin.modals": {
        "add.title": "Add New Student",
        "delete.title": "Delete Student",
        "modify.title": "Modify Student Details",
        "marks.title": "Add Student Marks",
        "student.name": "Student Name",
        "student.dob": "Date of Birth",
        "student.class": "Class",
        "student.gender": "Gender",
        "guardian.name": "Guardian Name",
        "guardian.phone": "Guardian Phone",
        "guardian.email": "Guardian Email",
        "confirm.delete": "Are you sure you want to delete this student?",
        "select.student": "Select Student",
        "select.subject": "Select Subject",
        "enter.marks": "Enter Marks",
        "test.type": "Test Type",
        "test.date": "Test Date",
        "student.class_teacher": "Class Teacher",
        "student.guardian_name": "Guardian Name",
        "student.guardian_mob": "Guardian Phone Number",
        "student.guardian_mail": "Guardian Email Address",
        "student.gender_male": "Male",
        "student.gender_female": "Female",
        "enter.test_date": "Test Date",
        "select.test_type": "Select Test Type",
      },

      // Calendar
      "calendar.title": "Calendar",
      "calendar.events.for": "Events for {{date}}",
      "calendar.no.events": "No events for this date",

      // Forms and Modals
      "form.title": "Title",
      "form.description": "Description",
      "form.date": "Date",
      "form.time": "Time",
      "form.submit": "Submit",
      "form.cancel": "Cancel",
      "form.save": "Save",
      "form.edit": "Edit",
      "form.done": "Done",
      "form.creating": "Creating...",
      "form.sending": "Creating & Sending Notifications...",

      // Login
      "login.title": "Please sign in to continue",
      "login.as.parent": "Login as Parent",
      "login.as.teacher": "Login as Teacher",
      "login.phone": "Phone Number",
      "login.dob": "Student's Date of Birth",
      "login.username": "Username",
      "login.password": "Password",
      "login.submit": "Sign in",
      "login.loading": "Signing in...",

      // Interactive Analytics Section
      "analytics.interactive.title": "Interactive Performance Analytics",
      "analytics.interactive.subtitle":
        "Track academic progress with detailed subject-wise analysis",
      "analytics.track.title": "Track Progress Over Time",
      "analytics.track.description":
        "Monitor academic performance trends with interactive graphs. Switch between subjects or view overall progress to identify areas for improvement.",
      "analytics.comparison": "Compare performance across different subjects",
      "analytics.identify":
        "Identify strength areas and improvement opportunities",
      "analytics.insights": "Get detailed insights with interactive tooltips",

      // Quick Stats
      "stats.title": "Quick Stats",
      "stats.current.average": "Current Average",
      "stats.improvement": "Improvement",
      "stats.best.subject": "Best Subject",
      "stats.focus.area": "Focus Area",

      // Features Section
      "features.title": "Key Features",
      "features.reports.title": "Comprehensive Reports",
      "features.reports.desc": "Detailed academic performance analysis",
      "features.notifications.title": "Real-time Notifications",
      "features.notifications.desc":
        "Stay updated with important announcements",
      "features.achievements.title": "Achievement Tracking",
      "features.achievements.desc": "Monitor and celebrate student success",
    },
  },
  hi: {
    translation: {
      // Common
      "app.name": "यट अनदर ईआरपी",
      loading: "लोड हो रहा है...",
      noData: "कोई डेटा उपलब्ध नहीं है",

      // Navigation
      "nav.dashboard": "डैशबोर्ड",
      "nav.calendar": "कैलेंडर",
      "nav.attendance": "उपस्थिति",
      "nav.admin": "एडमिन पैनल",
      "nav.logout": "लॉग आउट",

      // Home Page
      "home.welcome": "आपका स्वागत है,",
      "home.subtitle.parent":
        "हमारी व्यापक स्कूल प्रबंधन प्रणाली के माध्यम से {{name}} की शैक्षिक यात्रा से जुड़े रहें",
      "home.subtitle.teacher":
        "हमारी व्यापक स्कूल प्रबंधन प्रणाली के साथ अपने शिक्षण अनुभव को सशक्त बनाएं",
      "home.subtitle.guest":
        "अभिभावकों और शिक्षकों के लिए एक व्यापक स्कूल प्रबंधन प्रणाली",
      "home.features": {
        analytics: "प्रदर्शन विश्लेषण",
        "analytics.desc":
          "विस्तृत अंतर्दृष्टि और दृश्य विश्लेषण के साथ शैक्षिक प्रगति को ट्रैक करें",
        calendar: "शैक्षणिक कैलेंडर",
        "calendar.desc":
          "कार्यक्रमों, परीक्षाओं और महत्वपूर्ण तिथियों से अपडेट रहें",
        attendance: "उपस्थिति ट्रैकिंग",
        "attendance.desc":
          "उपस्थिति पैटर्न की निगरानी करें और विस्तृत रिपोर्ट देखें",
        admin: "एडमिन पैनल",
        "admin.desc": "छात्रों, कक्षाओं और प्रशासनिक कार्यों का प्रबंधन करें",
      },

      // Dashboard
      "dashboard.title": "छात्र डैशबोर्ड",
      "dashboard.academic.progress": "शैक्षणिक प्रगति",
      "dashboard.current.average": "वर्तमान औसत",
      "dashboard.attendance": "उपस्थिति",
      "dashboard.present.days": "उपस्थित दिन",
      "dashboard.upcoming": "आगामी",
      "dashboard.events": "कार्यक्रम",
      "dashboard.performance": "विषय प्रदर्शन रुझान",
      "dashboard.remarks": "हाल की टिप्पणियां",
      "dashboard.no.remarks": "कोई टिप्पणी नहीं",
      "dashboard.select_student": "छात्र चुनें",
      "dashboard.upcoming.events": "आगामी कार्यक्रम",
      "dashboard.upcoming.description": "इस महीने के लिए निर्धारित",

      // Admin Panel
      "admin.title": "एडमिन पैनल",
      "admin.students": "छात्र",
      "admin.total.students": "कुल छात्र",
      "admin.events": "कार्यक्रम",
      "admin.total.events": "कुल कार्यक्रम",
      "admin.quick.actions": "त्वरित कार्य",
      "admin.actions": {
        "add.student": "छात्र जोड़ें",
        "add.desc": "नया छात्र पंजीकृत करें",
        "delete.student": "छात्र हटाएं",
        "delete.desc": "छात्र रिकॉर्ड हटाएं",
        "modify.student": "विवरण संशोधित करें",
        "modify.desc": "छात्र जानकारी अपडेट करें",
        "add.marks": "अंक जोड़ें",
        "marks.desc": "मूल्यांकन स्कोर दर्ज करें",
        "create.event": "कार्यक्रम बनाएं",
        "event.desc": "कार्यक्रम शेड्यूल करें",
      },
      "admin.leaderboard": "छात्र लीडरबोर्ड",

      // Admin Modals
      "admin.modals": {
        "add.title": "नया छात्र जोड़ें",
        "delete.title": "छात्र हटाएं",
        "modify.title": "छात्र विवरण संशोधित करें",
        "marks.title": "छात्र के अंक जोड़ें",
        "student.name": "छात्र का नाम",
        "student.dob": "जन्म तिथि",
        "student.class": "कक्षा",
        "student.gender": "लिंग",
        "guardian.name": "अभिभावक का नाम",
        "guardian.phone": "अभिभावक का फोन",
        "guardian.email": "अभिभावक का ईमेल",
        "confirm.delete": "क्या आप वाकई इस छात्र को हटाना चाहते हैं?",
        "select.student": "छात्र चुनें",
        "select.subject": "विषय चुनें",
        "enter.marks": "अंक दर्ज करें",
        "test.type": "परीक्षा प्रकार",
        "test.date": "परीक्षा तिथि",
        "student.class_teacher": "कक्षा अध्यापक",
        "student.guardian_name": "अभिभावक का नाम",
        "student.guardian_mob": "अभिभावक का फ़ोन नंबर",
        "student.guardian_mail": "अभिभावक का ईमेल",
        "student.gender_male": "पुरुष",
        "student.gender_female": "महिला",
        "enter.test_date": "परीक्षा तिथि",
        "select.test_type": "परीक्षा प्रकार चुनें",
      },

      // Calendar
      "calendar.title": "कैलेंडर",
      "calendar.events.for": "{{date}} के कार्यक्रम",
      "calendar.no.events": "इस तिथि के लिए कोई कार्यक्रम नहीं",

      // Forms and Modals
      "form.title": "शीर्षक",
      "form.description": "विवरण",
      "form.date": "तिथि",
      "form.time": "समय",
      "form.submit": "सबमिट करें",
      "form.cancel": "रद्द करें",
      "form.save": "सहेजें",
      "form.edit": "संपादित करें",
      "form.done": "पूर्ण",
      "form.creating": "बना रहा है...",
      "form.sending": "बना रहा है और सूचनाएं भेज रहा है...",

      // Login
      "login.title": "जारी रखने के लिए कृपया साइन इन करें",
      "login.as.parent": "अभिभावक के रूप में लॉगिन करें",
      "login.as.teacher": "शिक्षक के रूप में लॉगिन करें",
      "login.phone": "फोन नंबर",
      "login.dob": "छात्र की जन्म तिथि",
      "login.username": "उपयोगकर्ता नाम",
      "login.password": "पासवर्ड",
      "login.submit": "साइन इन करें",
      "login.loading": "साइन इन हो रहा है...",

      // Interactive Analytics Section
      "analytics.interactive.title": "इंटरैक्टिव प्रदर्शन विश्लेषण",
      "analytics.interactive.subtitle":
        "विषय-वार विस्तृत विश्लेषण के साथ शैक्षिक प्रगति को ट्रैक करें",
      "analytics.track.title": "समय के साथ प्रगति को ट्रैक करें",
      "analytics.track.description":
        "इंटरैक्टिव ग्राफ के साथ शैक्षिक प्रदर्शन के रुझानों की निगरानी करें। सुधार के क्षेत्रों की पहचान के लिए विषयों के बीच स्विच करें या समग्र प्रगति देखें।",
      "analytics.comparison": "विभिन्न विषयों में प्रदर्शन की तुलना करें",
      "analytics.identify":
        "ताकत के क्षेत्रों और सुधार के अवसरों की पहचान करें",
      "analytics.insights":
        "इंटरैक्टिव टूलटिप्स के साथ विस्तृत जानकारी प्राप्त करें",

      // Quick Stats
      "stats.title": "त्वरित आंकड़े",
      "stats.current.average": "वर्तमान औसत",
      "stats.improvement": "सुधार",
      "stats.best.subject": "सर्वश्रेष्ठ विषय",
      "stats.focus.area": "फोकस क्षेत्र",

      // Features Section
      "features.title": "मुख्य विशेषताएं",
      "features.reports.title": "व्यापक रिपोर्ट",
      "features.reports.desc": "विस्तृत शैक्षिक प्रदर्शन विश्लेषण",
      "features.notifications.title": "रीयल-टाइम सूचनाएं",
      "features.notifications.desc": "महत्वपूर्ण घोषणाओं से अपडेट रहें",
      "features.achievements.title": "उपलब्धि ट्रैकिंग",
      "features.achievements.desc": "छात्र की सफलता की निगरानी और उत्सव मनाएं",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("app_language") || "en",
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: "en",
});

export default i18n;
