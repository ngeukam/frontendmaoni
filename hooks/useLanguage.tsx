import { createContext, useContext, useState, useEffect } from 'react';
import { getTranslations } from '../lib/types/helpers/backendHelpers';
import { ITranslations } from '../lib/types/translation';

interface LanguageContextProps {
  t: Partial<ITranslations>;
  isLoadingLanguage: boolean;
  error: any | null;
  detectedLanguage: string | null;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [t, setT] = useState<Partial<ITranslations>>({});
  const [isLoadingLanguage, setIsLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const defaultLanguage = 'en';

  const isLanguageSupported = (lang: string) => ['en', 'fr'].includes(lang);

  const fetchTranslations = async (languageCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getTranslations({}, languageCode);
      if (response?.translations) {
        setT(response.translations);
      } else {
        throw new Error("No translations found in the API response.");
      }
    } catch (err) {
      setError(err);
      console.error("Error fetching translations:", err);
      setT({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const detectLanguage = () => {
      const userLanguages = navigator.languages || [navigator.language];
      return userLanguages[0]?.split('-')[0] || defaultLanguage;
    };

    let languageCode = detectLanguage();
    if (!isLanguageSupported(languageCode)) {
      languageCode = defaultLanguage;
    }

    setDetectedLanguage(languageCode);
    fetchTranslations(languageCode);
  }, []);

  return (
    <LanguageContext.Provider value={{ t, isLoadingLanguage, error, detectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
