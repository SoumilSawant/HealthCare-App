import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations, LanguageType } from '../theme/translations';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  language: 'en',
  setLanguage: () => {},
  t: (key) => translations['en'][key] || String(key),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguageState] = useState<LanguageType>('en');

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);
  
  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
  };

  const t = (key: keyof typeof translations['en']): string => {
    const translationSet = translations[language] || translations['en'];
    return translationSet[key] || translations['en'][key] || String(key);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, language, setLanguage, t }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

