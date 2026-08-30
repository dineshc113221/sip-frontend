import {
    descendingComparator,
    getComparator,
    stableSort
} from '../PackagingFormuationFuncations';

type TestData = {
    name: string;
    material_pct?: string;
    percentage?: string;
    carbonFootprint?: string;
    envFootprint?: string;
    gaiaScore?: string;
    value?: number;
};

const data: TestData[] = [
    { name: 'A', material_pct: '20', percentage: '50', carbonFootprint: '1.2', envFootprint: '0.8', gaiaScore: '75', value: 10 },
    { name: 'B', material_pct: '30', percentage: '40', carbonFootprint: '1.1', envFootprint: '1.0', gaiaScore: '80', value: 20 },
    { name: 'C', material_pct: '10', percentage: '60', carbonFootprint: '0.9', envFootprint: '0.7', gaiaScore: '85', value: 15 },
];

describe('PackagingFormuationFuncations utility functions', () => {
    describe('descendingComparator', () => {
        it('should sort numerically for numeric string fields like "material_pct"', () => {
            const result = descendingComparator(data[0], data[1], 'material_pct');
            expect(result).toBeGreaterThan(0); // 30 > 20
        });

        it('should sort normally for other fields (e.g. string)', () => {
            const result = descendingComparator({ name: 'A' }, { name: 'B' }, 'name');
            expect(result).toBe(1); // B > A => A comes after B
        });

        it('should return 0 if values are equal', () => {
            const result = descendingComparator({ name: 'A' }, { name: 'A' }, 'name');
            expect(result).toBe(0);
        });
    });

    describe('getComparator', () => {
        it('should return a descending comparator', () => {
            const comparator = getComparator<TestData>('desc', 'value');
            expect(comparator({
                value: 30,
                name: ''
            }, {
                value: 20,
                name: ''
            })).toBeLessThan(0);
        });

        it('should return an ascending comparator', () => {
            const comparator = getComparator<TestData>('asc', 'value');
            expect(comparator({
                value: 30,
                name: ''
            }, {
                value: 20,
                name: ''
            })).toBeGreaterThan(0);
        });
    });

    describe('stableSort', () => {
        it('should sort the array correctly by a numeric string field', () => {
            const comparator = getComparator<TestData>('desc', 'material_pct');
            const sorted = stableSort(data, comparator);
            expect(sorted.map(d => d.name)).toEqual(['B', 'A', 'C']); // 30 > 20 > 10
        });

        it('should preserve original order for equal elements', () => {
            const test = [
                { name: 'X', value: 10 },
                { name: 'Y', value: 10 },
            ];
            const comparator = getComparator<typeof test[0]>('asc', 'value');
            const sorted = stableSort(test, comparator);
            expect(sorted.map(d => d.name)).toEqual(['X', 'Y']); // Stable sort
        });
    });
});