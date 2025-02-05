import { categoryTranslations } from "../../locales/categorytranslation";

export const translateCategoryToEnglish = (category: string): string => {
    const entry = Object.entries(categoryTranslations).find(([en, fr]) => fr.toLowerCase() === category.toLowerCase());
    return entry ? entry[0] : category; // Retourne l'anglais si trouvé, sinon garde la valeur d'origine
};