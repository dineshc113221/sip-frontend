import {
    cleanComponent,
    IGNORED_FIELDS,
    removeIgnoredFields,
    deepEqualSubset,
    haveFormulationChanges,
} from '../FormulationPackHelper';

describe('FormulationPackHelper', () => {
    // Mock data
    const mockComponent = {
        _id: '123',
        componentId: 'comp1',
        materialId: 'mat1',
        isCalculated: true,
        isDataComplete: false,
        fieldsExist: true,
        name: 'Component1',
        material: [
            {
                _id: 'mat1',
                materialId: 'm1',
                pcr_content: 50,
                virginPlasticValue: 30,
                otherField: 'test'
            }
        ]
    };

    const mockFormulation = {
        _id: 'form123',
        assessmentId: 'assess1',
        rawMaterialsPercentage: 75,
        formulation: {
            ingredients: [{ name: 'Ing1', percentage: 25 }],
            isCalculated: true
        }
    };

    // Test cases
    describe('cleanComponent', () => {
        it('should clean component data correctly', () => {
            const cleaned = cleanComponent(mockComponent);

            expect(cleaned).toEqual({
                _id: '123',
                componentId: 'comp1',
                materialId: 'mat1',
                fieldsExist: true,
                isCalculated: true,
                isDataComplete: false,
                name: 'Component1',
                material: [{
                    otherField: 'test',
                    virginPlasticValue: '30'
                }]
            });

        });

        it('should handle null input', () => {
            expect(cleanComponent(null)).toBeNull();
        });

        it('should handle components without materials', () => {
            const componentWithoutMaterials = { ...mockComponent, material: undefined };
            const cleaned = cleanComponent(componentWithoutMaterials);
            expect(cleaned.material).toBeUndefined();
        });
    });

    describe('IGNORED_FIELDS', () => {
        it('should contain all specified fields', () => {
            const expectedFields = [
                'assessmentId', '_id', 'rawMaterialsPercentage',
                'isCalculating', 'productId', 'isEdited',
                'isCalculated', 'type', 'fieldsExist'
            ];

            expectedFields.forEach(field => {
                expect(IGNORED_FIELDS.has(field)).toBe(true);
            });
        });
    });

    describe('removeIgnoredFields', () => {
        it('should remove ignored fields from object', () => {
            const result = removeIgnoredFields(mockFormulation);
            expect(result).toEqual({
                formulation: {
                    ingredients: [{ name: 'Ing1', percentage: 25 }]
                }
            });
        });

        it('should handle arrays', () => {
            const arr = [mockFormulation, mockFormulation];
            const result = removeIgnoredFields(arr);
            expect(result).toEqual([
                { formulation: { ingredients: [{ name: 'Ing1', percentage: 25 }] } },
                { formulation: { ingredients: [{ name: 'Ing1', percentage: 25 }] } }
            ]);
        });

        it('should return primitives unchanged', () => {
            expect(removeIgnoredFields(42)).toBe(42);
            expect(removeIgnoredFields('test')).toBe('test');
        });
    });

    describe('deepEqualSubset', () => {
        it('should return true for equal objects', () => {
            const obj1 = { a: 1, b: { c: 2 } };
            const obj2 = { a: 1, b: { c: 2 } };
            expect(deepEqualSubset(obj1, obj2)).toBe(true);
        });

        it('should return false for different objects', () => {
            const obj1 = { a: 1, b: { c: 2 } };
            const obj2 = { a: 1, b: { c: 3 } };
            expect(deepEqualSubset(obj1, obj2)).toBe(false);
        });

        it('should handle arrays correctly', () => {
            expect(deepEqualSubset([1, 2], [1, 2])).toBe(true);
            expect(deepEqualSubset([1, 2], [1, 3])).toBe(false);
        });
    });

    describe('haveFormulationChanges', () => {
        it('should detect no changes', () => {
            const form1 = { ...mockFormulation };
            const form2 = { ...mockFormulation };
            expect(haveFormulationChanges(form1, form2)).toBe(false);
        });

        it('should detect changes in formulation', () => {
            const form1 = { ...mockFormulation };
            const form2 = {
                ...mockFormulation,
                formulation: { ingredients: [{ name: 'Changed', percentage: 30 }] }
            };
            expect(haveFormulationChanges(form1, form2)).toBe(true);
        });

        it('should handle null/undefined inputs', () => {
            expect(haveFormulationChanges(null, mockFormulation)).toBe(true);
            expect(haveFormulationChanges(mockFormulation, undefined)).toBe(true);
            expect(haveFormulationChanges(null, null)).toBe(true);
        });
    });
});