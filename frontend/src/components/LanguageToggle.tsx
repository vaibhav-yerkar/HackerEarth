import React from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/index";

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  };

  return (
    <select
      value={currentLanguage}
      onChange={handleLanguageChange}
      className="bg-white text-indigo-400 px-2 py-1 rounded"
    >
      <option value="en">English</option>
      <option value="hi">Hindi</option>
    </select>
  );
};

export default LanguageToggle;
