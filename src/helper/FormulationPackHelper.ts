export const cleanComponent = (component) => {
    if (!component) return null;
    const {
        ...rest
    } = component;
    const cleaned = { ...rest };
    // Clean material array
    if (Array.isArray(cleaned.material)) {
        cleaned.material = cleaned.material.map((mat) => {
            const {
                _id: materialId,
                materialId: matId,
                pcr_content: pcContent,
                virginPlasticValue,
                ...restMat
            } = mat;
            console.log(matId, materialId, pcContent)
            // Normalize virginPlasticValue (convert to string for comparison)
            const normalizedMat = { ...restMat };
            if (virginPlasticValue !== undefined) {
                normalizedMat.virginPlasticValue = String(virginPlasticValue);
            }

            return normalizedMat;
        });
    }

    return cleaned;
};


export const IGNORED_FIELDS = new Set([
    'assessmentId',
    '_id',
    'rawMaterialsPercentage',
    'isCalculating',
    'productId',
    'isEdited',
    'isCalculated',
    'type',
    'fieldsExist',
]);

export function removeIgnoredFields<T>(obj: T): T {
    if (typeof obj !== 'object' || obj === null) return obj;

    if (Array.isArray(obj)) {
        return obj.map(item => removeIgnoredFields(item)) as unknown as T;
    }

    const result: Record<string, unknown> = {};
    for (const key in obj) {
        if (IGNORED_FIELDS.has(key)) continue;
        result[key] = removeIgnoredFields((obj as Record<string, unknown>)[key]);
    }
    return result as T;
}

export function deepEqualSubset(a, b): boolean {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object' || a === null || b === null) return a === b;

    if (Array.isArray(a)) {
        if (!Array.isArray(b) || a.length !== b.length) return false;
        return a.every((item, index) => deepEqualSubset(item, b[index]));
    }

    return Object.keys(a).every(key => {
        if (!(key in b)) return false;
        return deepEqualSubset(a[key], b[key]);
    });
}

export const haveFormulationChanges = (
        formFormulation,
        assessmentFormulation,
    ): boolean => {
        // Handle null/undefined cases
        if (!formFormulation || !assessmentFormulation) return true;

        const cleanedForm = removeIgnoredFields(formFormulation);

        const cleanedAssessment = removeIgnoredFields(assessmentFormulation);
        return !deepEqualSubset(cleanedForm, cleanedAssessment);
};
    
