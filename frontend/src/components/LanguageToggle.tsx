import React from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/index";

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useAppStore();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem("app_language", lang);
  };

  return (
    <select
      value={localStorage.getItem("app_language") || language}
      onChange={(e) => handleLanguageChange(e.target.value)}
      className="bg-white border rounded-md px-2 py-1 text-sm text-black"
    >
      <option value="en">English</option>
      <option value="hi">हिंदी</option>
    </select>
  );
};

export default LanguageToggle;
