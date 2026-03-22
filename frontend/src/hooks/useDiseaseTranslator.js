import { useTranslation } from 'react-i18next';

/**
 * Hook to handle disease translation based on internal slug.
 * Always tries to look up translation in JSON files first.
 * If not found, falls back to the provided default value (usually from DB).
 */
export const useDiseaseTranslator = () => {
    const { t } = useTranslation();

    const translateDiseaseName = (name, slug) => {
        if (!slug) slug = name;
        const key = `diseases.${slug}.name`;
        const translated = t(key);
        // If translation exists (is not equal to the key), return it
        if (translated !== key) return translated;
        // Fallback to the original name (usually Vietnamese from DB)
        return name;
    };

    const translateDescription = (slug, defaultDesc) => {
        const key = `diseases.${slug}.desc`;
        const translated = t(key);
        if (translated !== key) return translated;
        return defaultDesc;
    };

    const translateSymptoms = (slug, symptoms = []) => {
        const key = `diseases.${slug}.symptoms`;
        const translatedSymptoms = t(key, { returnObjects: true });
        if (Array.isArray(translatedSymptoms) && translatedSymptoms.length > 0) {
            return translatedSymptoms;
        }
        return symptoms;
    };

    const translateTreatments = (slug, treatments = []) => {
        const key = `diseases.${slug}.treatments`;
        const translatedTreatments = t(key, { returnObjects: true });
        if (Array.isArray(translatedTreatments) && translatedTreatments.length > 0) {
            return treatments.map((item, index) => ({
                ...item,
                ...(translatedTreatments[index] || {})
            }));
        }
        return treatments;
    };

    return { translateDiseaseName, translateDescription, translateSymptoms, translateTreatments };
};
