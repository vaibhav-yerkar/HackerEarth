import React from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store";

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
      className="bg-white text-blue-400 px-2 py-1 rounded"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
    </select>
  );
};

export default LanguageToggle;
