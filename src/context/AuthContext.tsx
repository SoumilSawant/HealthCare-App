import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations, LanguageType } from '../theme/translations';

export interface User {
  userId: string;
  mobileNumber: string;
  fullName: string;
  email?: string;
  age?: number;
  gender?: string;
  livingStatus?: 'family' | 'alone';
  therapyExperience?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: keyof typeof translations['en']) => string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  language: 'en',
  setLanguage: () => {},
  t: (key) => translations['en'][key] || String(key),
  loading: false,
  setLoading: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguageState] = useState<LanguageType>('en');
  const [loading, setLoading] = useState(false);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
  };

  const t = (key: keyof typeof translations['en']): string => {
    const translationSet = translations[language] || translations['en'];
    return translationSet[key] || translations['en'][key] || String(key);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updateUser,
        language,
        setLanguage,
        t,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

