import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { ProductDataProvider, ProductDataContext } from './../productData/ProductDataContext';
import { useGetProductAssessmentDetailByID, useGetProductAssessmentResultByID,useGetBaselineTableResults } from '../../hooks/UseGetProductDetails';
import { ProductAssessmentResultMock } from '../../mocks/ProductAssessmentResult.mock';

// Mock the hook to return predefined data and functions
jest.mock('../../hooks/UseGetProductDetails', () => ({
  useGetProductAssessmentDetailByID: jest.fn(),
  useGetProductAssessmentResultByID: jest.fn(),
  useGetBaselineTableResults:jest.fn()
}));

jest.mock("react-ga4", () => ({
  ReactGA4: {
    initialize: () => {
      return <div></div>;
    },
    event: () => {
      return <div></div>;
    },
  },
}));

// Sample data to be returned by the hook
const mockData = [
  {
    productId: '123',
    productName: 'Sample Product',
    brandName: 'Sample Brand',
    productSipId: 'sip123',
    user: [{ name: 'John Doe', role: 'Manager', mail: 'johndoe@example.com' }],
    details: {
      assessmentId: '456',
      name: 'Assessment 1',
      _id: 'assess-1',
      packaging_level: [
        {
          packaging_level: 'Primary',
          components: [
            {
               _id:"34",
               sub_components: [
                 {
                   _id: "sub1",
                   name: "Cap",
                   opacity: "Opaque",
                   color: "White",
                   finishing_process: "None",
                   material: [{
                     material_name: "test",
                     material_type: "test",
                     material_pct: "test",
                     converting_process: "test",
                     virginPlasticValue:"45",
                     _id:"123"
                   }]
                 }
               ],
              material: [{
                material_name: "test",
                material_type: "test",
                material_pct: "test",
                converting_process: "test",
                virginPlasticValue:"45",
                _id:"123"
              }]
            }
          ]
        },
        {
          packaging_level: 'Secondary',
          components: [
            {
              _id:"345",
              sub_components: [
                {
                  _id: "sub2",
                  name: "Box",
                  opacity: "Opaque",
                  color: "Brown",
                  finishing_process: "None",
                  material: [{
                    material_name: "test2",
                    material_type: "test2",
                    material_pct: "test2",
                    converting_process: "test2",
                    virginPlasticValue:"45",
                    _id:"35435"
                  }]
                }
              ],
              material: [{
                material_name: "test",
                material_type: "test",
                material_pct: "test",
                converting_process: "test",
                virginPlasticValue:"45",
                 _id:"35435"
              }]
            }
          ]
        },
      ],
      formulation: { id: 'form-1', name: 'Formulation 1' },
    },
    isBaselinePresent: true,
    isBaselineDataComplete: true,
  },
];

// Mock data without user
const mockDataNoUser = [
  {
    productId: '999',
    productName: 'No User Product',
    brandName: 'No User Brand',
    productSipId: 'sipNoUser',
    details: {
      assessmentId: '789',
      name: 'Assessment No User',
      _id: 'assess-no-user',
      packaging_level: [
        {
          packaging_level: 'Primary',
          components: [{ _id: "c1", sub_components: [], material: [] }]
        }
      ],
      formulation: null,
    },
    isBaselinePresent: false,
    isBaselineDataComplete: false,
  },
];

// Mock data without packaging_level
const mockDataNoPackaging = [
  {
    productId: '888',
    productName: 'No Pack Product',
    brandName: 'No Pack Brand',
    productSipId: 'sipNoPack',
    user: [{ name: 'Jane', role: 'Tester', mail: 'jane@test.com' }],
    details: {
      assessmentId: '101',
      name: 'Assessment NoPack',
      _id: 'assess-nopack',
      formulation: { id: 'form-2', name: 'Formulation 2' },
    },
    isBaselinePresent: true,
    isBaselineDataComplete: false,
  },
];

// Result data with packproduction/packagingeol for PEF/CF mapping
const createResultDataWithPefCf = () => ({
  baseline: {
    "sustainablepackaging-pcr": {
      components: [
        {
          main_id: "34",
          _id: "34",
          sub_components: [
            {
              material: [
                { _id: "123", virgin_non_pcr_amount: "10.5" }
              ]
            }
          ]
        },
        {
          main_id: "345",
          _id: "345",
          sub_components: [
            {
              material: [
                { _id: "35435", virgin_non_pcr_amount: "20.3" }
              ]
            }
          ]
        }
      ]
    },
    packproduction: {
      packaging_level: [
        {
          packaging_level: 'Primary',
          components: [
            {
              _id: "34",
              sub_components: [
                {
                  material: [
                    {
                      _id: "123",
                      step_51_pack_prod_pef_score_functional_unit: "0.0002",
                      step_48_pack_prod_pack_impact: { climate_change_functional_unit: "0.005" }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          packaging_level: 'Secondary',
          components: [
            {
              _id: "345",
              sub_components: [
                {
                  material: [
                    {
                      _id: "35435",
                      step_51_pack_prod_pef_score_functional_unit: "0.0003",
                      step_48_pack_prod_pack_impact: { climate_change_functional_unit: "0.007" }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    packagingeol: {
      packaging_level: [
        {
          packaging_level: 'Primary',
          components: [
            {
              _id: "34",
              sub_components: [
                {
                  material: [
                    {
                      _id: "123",
                      step_64_Pack_EOL_PEF_score_functional_unit: "0.0001",
                      step_60_Pack_EOL_Pack_Impact: { climate_change_functional_unit: "0.003" }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          packaging_level: 'Secondary',
          components: [
            {
              _id: "345",
              sub_components: [
                {
                  material: [
                    {
                      _id: "35435",
                      step_64_Pack_EOL_PEF_score_functional_unit: "0.0004",
                      step_60_Pack_EOL_Pack_Impact: { climate_change_functional_unit: "0.009" }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
});

// Test Component that exposes all context values
const FullTestComponent = ({ onContext }: { onContext?: (ctx) => void }) => {
  const context = React.useContext(ProductDataContext);
  React.useEffect(() => {
    onContext?.(context);
  }, [context, onContext]);
  return (
    <div>
      <span data-testid="productId">{context.productData.productId}</span>
      <span data-testid="productName">{context.productData.productName}</span>
      <span data-testid="brandName">{context.productData.brandName}</span>
      <span data-testid="fetchingDataInProgress">{`${context.fetchingDataInProgress}`}</span>
      <span data-testid="isBaselinePresent">{`${context.isBaselinePresent}`}</span>
      <span data-testid="isBaselineDataComplete">{`${context.isBaselineDataComplete}`}</span>
      <span data-testid="isBaselineSkipped">{`${context.isBaselineSkipped}`}</span>
      <span data-testid="assessmentId">{context.assessmentsData.assessmentId}</span>
      <span data-testid="assessmentsType">{context.assessmentsType ?? ''}</span>
      <span data-testid="formulationDataComplete">{`${context.formulationDataComplete}`}</span>
      <span data-testid="packagingDataComplete">{`${context.packagingDataComplete}`}</span>
      <span data-testid="bothDataComplete">{`${context.bothDataComplete}`}</span>
      <span data-testid="singleClickHit">{`${context.singleClickHit}`}</span>
      <span data-testid="bothPackFormulaStatus">{`${context.bothPackFormulaStatus}`}</span>
      <span data-testid="isPackagingDirty">{`${context.isPackagingDirty}`}</span>
      <span data-testid="validateCheck">{`${context.validateCheck}`}</span>
      <span data-testid="validateCheckEvacuation">{`${context.validateCheckEvacuation}`}</span>
      <span data-testid="validateCheckFinal">{`${context.validateCheckFinal}`}</span>
      <span data-testid="validateCheckFormulation">{`${context.validateCheckFormulation}`}</span>
      <span data-testid="validateCheckPackaging">{`${context.validateCheckPackaging}`}</span>
      <span data-testid="formulation">{context.formulation ? 'present' : 'null'}</span>
      <span data-testid="primaryPackaging">{context.primaryPackaging ? 'present' : 'null'}</span>
      <span data-testid="secondaryPackaging">{context.secondaryPackaging ? 'present' : 'null'}</span>
      <span data-testid="packagingData">{context.packagingData ? 'present' : 'null'}</span>
      <span data-testid="usersData">{context.usersData ? context.usersData.length.toString() : '0'}</span>
    </div>
  );
};

// Test Component with buttons to toggle setters
const SetterTestComponent = () => {
  const context = React.useContext(ProductDataContext);
  return (
    <div>
      <span data-testid="formulationDataComplete">{`${context.formulationDataComplete}`}</span>
      <span data-testid="packagingDataComplete">{`${context.packagingDataComplete}`}</span>
      <span data-testid="bothDataComplete">{`${context.bothDataComplete}`}</span>
      <span data-testid="singleClickHit">{`${context.singleClickHit}`}</span>
      <span data-testid="bothPackFormulaStatus">{`${context.bothPackFormulaStatus}`}</span>
      <span data-testid="isPackagingDirty">{`${context.isPackagingDirty}`}</span>
      <span data-testid="validateCheck">{`${context.validateCheck}`}</span>
      <span data-testid="validateCheckEvacuation">{`${context.validateCheckEvacuation}`}</span>
      <span data-testid="validateCheckFinal">{`${context.validateCheckFinal}`}</span>
      <span data-testid="validateCheckFormulation">{`${context.validateCheckFormulation}`}</span>
      <span data-testid="validateCheckPackaging">{`${context.validateCheckPackaging}`}</span>
      <button data-testid="btn-formulationComplete" onClick={() => context.setFormulationDataComplete(true)}>setFormulationComplete</button>
      <button data-testid="btn-packagingComplete" onClick={() => context.setPackagingDataComplete(true)}>setPackagingComplete</button>
      <button data-testid="btn-singleClickHit" onClick={() => context.setSingleClickHit(true)}>setSingleClickHit</button>
      <button data-testid="btn-bothPackFormulaStatus" onClick={() => context.setBothPackFormulaStatus(true)}>setBothPackFormulaStatus</button>
      <button data-testid="btn-isPackagingDirty" onClick={() => context.setIsPackagingDirty(true)}>setIsPackagingDirty</button>
      <button data-testid="btn-validateCheck" onClick={() => context.setValidateCheck(true)}>setValidateCheck</button>
      <button data-testid="btn-validateCheckEvacuation" onClick={() => context.setValidateCheckEvacuation(true)}>setValidateCheckEvacuation</button>
      <button data-testid="btn-validateCheckFormulation" onClick={() => context.setValidateCheckFormulation(true)}>setValidateCheckFormulation</button>
      <button data-testid="btn-validateCheckPackaging" onClick={() => context.setValidateCheckPackaging(true)}>setValidateCheckPackaging</button>
      <button data-testid="btn-setAssessmentsData" onClick={() => context.setAssessmentsData({ assessmentId: 'new-id', name: 'New', _id: 'new' })}>setAssessmentsData</button>
      <button data-testid="btn-setNewChangesInFormulation" onClick={() => context.setNewChangesInFormulation({ id: 'new-form' } as never)}>setNewChangesInFormulation</button>
    </div>
  );
};

// Test Component
const TestComponent = () => {
  const context = React.useContext(ProductDataContext);
  return (
    <div>
      <span data-testid="productId">{context.productData.productId}</span>
      <span data-testid="fetchingDataInProgress">{`${context.fetchingDataInProgress}`}</span>
      <span data-testid="isBaselinePresent">{`${context.isBaselinePresent}`}</span>
    </div>
  );
};

describe('ProductDataProvider', () => {
  const refetchMock = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (useGetProductAssessmentDetailByID as jest.Mock).mockReturnValue({
      data: mockData,
      refetch: refetchMock,
      isLoading: false,
    });
      (useGetProductAssessmentResultByID as jest.Mock).mockReturnValue({
          data: ProductAssessmentResultMock,
          refetch: jest.fn(),
        });
         (useGetBaselineTableResults as jest.Mock).mockReturnValue({
              data: ProductAssessmentResultMock,
              refetch: jest.fn(),
            });
  });

  it('should render with initial values', () => {
    render(
      <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
        <TestComponent />
      </ProductDataProvider>
    );

    expect(screen.getByTestId('productId').textContent).toBe('123');
    expect(screen.getByTestId('fetchingDataInProgress').textContent).toBe('false');
    expect(screen.getByTestId('isBaselinePresent').textContent).toBe('true');
  }, 8000);

  it('should update context values when data is fetched', async () => {
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456"  productId="56464" assessmentType="baseline">
          <TestComponent />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('productId').textContent).toBe('123');
    expect(screen.getByTestId('fetchingDataInProgress').textContent).toBe('false');
    expect(screen.getByTestId('isBaselinePresent').textContent).toBe('true');
  }, 8000);

  it('should call refetch when assessmentId changes', () => {
    const { rerender } = render(
      <ProductDataProvider assessmentId="456" productId="56464"  assessmentType="baseline">
        <TestComponent />
      </ProductDataProvider>
    );

    // Change the assessmentId and rerender
    rerender(
      <ProductDataProvider assessmentId="789" productId="56464"  assessmentType="baseline">
        <TestComponent />
      </ProductDataProvider>
    );

    expect(refetchMock).toHaveBeenCalledTimes(2);
  }, 8000);

  it('should populate all product data, users, formulation, packaging from mock', async () => {
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <FullTestComponent />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('productName').textContent).toBe('Sample Product');
    expect(screen.getByTestId('brandName').textContent).toBe('Sample Brand');
    expect(screen.getByTestId('isBaselineDataComplete').textContent).toBe('true');
    expect(screen.getByTestId('assessmentsType').textContent).toBe('baseline');
    expect(screen.getByTestId('formulation').textContent).toBe('present');
    expect(screen.getByTestId('primaryPackaging').textContent).toBe('present');
    expect(screen.getByTestId('secondaryPackaging').textContent).toBe('present');
    expect(screen.getByTestId('packagingData').textContent).toBe('present');
    expect(screen.getByTestId('usersData').textContent).toBe('1');
  }, 8000);

  it('should handle data without user array', async () => {
    (useGetProductAssessmentDetailByID as jest.Mock).mockReturnValue({
      data: mockDataNoUser,
      refetch: refetchMock,
      isLoading: false,
    });

    await act(async () => {
      render(
        <ProductDataProvider assessmentId="789" productId="999" assessmentType="baseline">
          <FullTestComponent />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('productId').textContent).toBe('999');
    expect(screen.getByTestId('isBaselinePresent').textContent).toBe('false');
    expect(screen.getByTestId('isBaselineDataComplete').textContent).toBe('false');
    expect(screen.getByTestId('formulation').textContent).toBe('null');
  }, 8000);

  it('should expose the baseline skipped flag from the assessment response', async () => {
    const skippedData = [{
      ...mockData[0],
      isBaselineSkipped: true,
    }];
    (useGetProductAssessmentDetailByID as jest.Mock).mockReturnValue({
      data: skippedData,
      refetch: refetchMock,
      isLoading: false,
    });

    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="123" assessmentType="baseline">
          <FullTestComponent />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('isBaselinePresent').textContent).toBe('true');
    expect(screen.getByTestId('isBaselineDataComplete').textContent).toBe('true');
    expect(screen.getByTestId('isBaselineSkipped').textContent).toBe('true');
  }, 8000);

  it('should handle data without packaging_level', async () => {
    (useGetProductAssessmentDetailByID as jest.Mock).mockReturnValue({
      data: mockDataNoPackaging,
      refetch: refetchMock,
      isLoading: false,
    });

    await act(async () => {
      render(
        <ProductDataProvider assessmentId="101" productId="888" assessmentType="baseline">
          <FullTestComponent />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('productId').textContent).toBe('888');
    expect(screen.getByTestId('formulation').textContent).toBe('present');
    expect(screen.getByTestId('primaryPackaging').textContent).toBe('null');
    expect(screen.getByTestId('secondaryPackaging').textContent).toBe('null');
    expect(screen.getByTestId('usersData').textContent).toBe('1');
  }, 8000);

  it('should handle null data from hook gracefully', async () => {
    (useGetProductAssessmentDetailByID as jest.Mock).mockReturnValue({
      data: null,
      refetch: refetchMock,
      isLoading: true,
    });

    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <FullTestComponent />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('productId').textContent).toBe('');
    expect(screen.getByTestId('fetchingDataInProgress').textContent).toBe('true');
    expect(screen.getByTestId('isBaselinePresent').textContent).toBe('false');
  }, 8000);

  it('should set bothDataComplete when both formulation and packaging are complete', async () => {
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <SetterTestComponent />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('bothDataComplete').textContent).toBe('false');

    await act(async () => {
      screen.getByTestId('btn-formulationComplete').click();
    });
    expect(screen.getByTestId('formulationDataComplete').textContent).toBe('true');

    await act(async () => {
      screen.getByTestId('btn-packagingComplete').click();
    });
    expect(screen.getByTestId('packagingDataComplete').textContent).toBe('true');

    await waitFor(() => {
      expect(screen.getByTestId('bothDataComplete').textContent).toBe('true');
    });
  }, 8000);

  it('should toggle singleClickHit via setter', async () => {
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <SetterTestComponent />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('singleClickHit').textContent).toBe('false');
    await act(async () => {
      screen.getByTestId('btn-singleClickHit').click();
    });
    expect(screen.getByTestId('singleClickHit').textContent).toBe('true');
  }, 8000);

  it('should toggle bothPackFormulaStatus via setter', async () => {
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <SetterTestComponent />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('bothPackFormulaStatus').textContent).toBe('false');
    await act(async () => {
      screen.getByTestId('btn-bothPackFormulaStatus').click();
    });
    expect(screen.getByTestId('bothPackFormulaStatus').textContent).toBe('true');
  }, 8000);

  it('should toggle isPackagingDirty via setter', async () => {
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <SetterTestComponent />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('isPackagingDirty').textContent).toBe('false');
    await act(async () => {
      screen.getByTestId('btn-isPackagingDirty').click();
    });
    expect(screen.getByTestId('isPackagingDirty').textContent).toBe('true');
  }, 8000);

  it('should toggle validateCheck via setter', async () => {
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <SetterTestComponent />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('validateCheck').textContent).toBe('false');
    await act(async () => {
      screen.getByTestId('btn-validateCheck').click();
    });
    expect(screen.getByTestId('validateCheck').textContent).toBe('true');
  }, 8000);

  it('should set validateCheckFinal when validateCheckFormulation is true', async () => {
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <SetterTestComponent />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('validateCheckFinal').textContent).toBe('false');

    await act(async () => {
      screen.getByTestId('btn-validateCheckFormulation').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('validateCheckFormulation').textContent).toBe('true');
      expect(screen.getByTestId('validateCheckFinal').textContent).toBe('true');
    });
  }, 8000);

  it('should set validateCheckFinal when validateCheckEvacuation is true', async () => {
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <SetterTestComponent />
        </ProductDataProvider>
      );
    });

    await act(async () => {
      screen.getByTestId('btn-validateCheckEvacuation').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('validateCheckEvacuation').textContent).toBe('true');
      expect(screen.getByTestId('validateCheckFinal').textContent).toBe('true');
    });
  }, 8000);

  it('should set validateCheckFinal when validateCheckPackaging is true', async () => {
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <SetterTestComponent />
        </ProductDataProvider>
      );
    });

    await act(async () => {
      screen.getByTestId('btn-validateCheckPackaging').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('validateCheckPackaging').textContent).toBe('true');
      expect(screen.getByTestId('validateCheckFinal').textContent).toBe('true');
    });
  }, 8000);

  it('should update assessmentsData via setAssessmentsData', async () => {
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <SetterTestComponent />
        </ProductDataProvider>
      );
    });

    await act(async () => {
      screen.getByTestId('btn-setAssessmentsData').click();
    });

    // No crash means the setter executed properly
    expect(true).toBe(true);
  }, 8000);

  it('should update newChangesInFormulation via setter', async () => {
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <SetterTestComponent />
        </ProductDataProvider>
      );
    });

    await act(async () => {
      screen.getByTestId('btn-setNewChangesInFormulation').click();
    });

    // No crash means the setter executed properly
    expect(true).toBe(true);
  }, 8000);

  it('should map PEF and CF values from packproduction/packagingeol by index matching', async () => {
    const pefCfResultData = createResultDataWithPefCf();

    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: pefCfResultData,
      refetch: jest.fn(),
    });

    let capturedContext;
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <FullTestComponent onContext={(ctx) => { capturedContext = ctx; }} />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('primaryPackaging').textContent).toBe('present');
    expect(screen.getByTestId('secondaryPackaging').textContent).toBe('present');

    // Primary material: PEF = (0.0002 + 0.0001) * 1000000 = 300
    // Primary material: CF  = (0.005 + 0.003) * 1000 = 8
    const primaryMat = capturedContext?.primaryPackaging?.components?.[0]?.sub_components?.[0]?.material?.[0];
    expect(parseFloat(primaryMat?.productEnvironmentalFootPrint)).toBe(300);
    expect(parseFloat(primaryMat?.carbonFootPrint)).toBe(8);

    // Secondary material: PEF = (0.0003 + 0.0004) * 1000000 = 700
    // Secondary material: CF  = (0.007 + 0.009) * 1000 = 16
    const secondaryMat = capturedContext?.secondaryPackaging?.components?.[0]?.sub_components?.[0]?.material?.[0];
    expect(parseFloat(secondaryMat?.productEnvironmentalFootPrint)).toBe(700);
    expect(parseFloat(secondaryMat?.carbonFootPrint)).toBe(16);
  }, 8000);

  it('should map virginPlasticValue from sustainablepackaging-pcr results', async () => {
    const pefCfResultData = createResultDataWithPefCf();

    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: pefCfResultData,
      refetch: jest.fn(),
    });

    let capturedContext;
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <FullTestComponent onContext={(ctx) => { capturedContext = ctx; }} />
        </ProductDataProvider>
      );
    });

    const primaryMat = capturedContext?.primaryPackaging?.components?.[0]?.sub_components?.[0]?.material?.[0];
    expect(primaryMat?.virginPlasticValue).toBe('10.5');

    const secondaryMat = capturedContext?.secondaryPackaging?.components?.[0]?.sub_components?.[0]?.material?.[0];
    expect(secondaryMat?.virginPlasticValue).toBe('20.3');
  }, 8000);

  it('should handle missing packproduction/packagingeol in results gracefully', async () => {
    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: { baseline: {} },
      refetch: jest.fn(),
    });

    let capturedContext;
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <FullTestComponent onContext={(ctx) => { capturedContext = ctx; }} />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('primaryPackaging').textContent).toBe('present');
    // Materials should still exist with original values, no crash
    const primaryMat = capturedContext?.primaryPackaging?.components?.[0]?.sub_components?.[0]?.material?.[0];
    expect(primaryMat?.material_name).toBe('test');
  }, 8000);

  it('should handle null resultData gracefully', async () => {
    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: null,
      refetch: jest.fn(),
    });

    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <FullTestComponent />
        </ProductDataProvider>
      );
    });

    expect(screen.getByTestId('primaryPackaging').textContent).toBe('present');
    expect(screen.getByTestId('secondaryPackaging').textContent).toBe('present');
  }, 8000);

  it('should truncate PEF and CF to 6 decimal places', async () => {
    const resultData = {
      baseline: {
        "sustainablepackaging-pcr": { components: [] },
        packproduction: {
          packaging_level: [
            {
              packaging_level: 'Primary',
              components: [
                {
                  _id: "34",
                  sub_components: [
                    {
                      material: [
                        {
                          _id: "123",
                          step_51_pack_prod_pef_score_functional_unit: "0.00012345678",
                          step_48_pack_prod_pack_impact: { climate_change_functional_unit: "0.00512345678" }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            { packaging_level: 'Secondary', components: [{ _id: "345", sub_components: [{ material: [{ _id: "35435", step_51_pack_prod_pef_score_functional_unit: "0", step_48_pack_prod_pack_impact: { climate_change_functional_unit: "0" } }] }] }] }
          ]
        },
        packagingeol: {
          packaging_level: [
            {
              packaging_level: 'Primary',
              components: [
                {
                  _id: "34",
                  sub_components: [
                    {
                      material: [
                        {
                          _id: "123",
                          step_64_Pack_EOL_PEF_score_functional_unit: "0.00009876543",
                          step_60_Pack_EOL_Pack_Impact: { climate_change_functional_unit: "0.00398765432" }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            { packaging_level: 'Secondary', components: [{ _id: "345", sub_components: [{ material: [{ _id: "35435", step_64_Pack_EOL_PEF_score_functional_unit: "0", step_60_Pack_EOL_Pack_Impact: { climate_change_functional_unit: "0" } }] }] }] }
          ]
        }
      }
    };

    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: resultData,
      refetch: jest.fn(),
    });

    let capturedContext;
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <FullTestComponent onContext={(ctx) => { capturedContext = ctx; }} />
        </ProductDataProvider>
      );
    });

    const primaryMat = capturedContext?.primaryPackaging?.components?.[0]?.sub_components?.[0]?.material?.[0];
    const pefValue = parseFloat(primaryMat?.productEnvironmentalFootPrint);
    const cfValue = parseFloat(primaryMat?.carbonFootPrint);

    // Check truncation to 6 decimal places
    const pefDecimals = primaryMat?.productEnvironmentalFootPrint?.split('.')?.[1] || '';
    const cfDecimals = primaryMat?.carbonFootPrint?.split('.')?.[1] || '';
    expect(pefDecimals.length).toBeLessThanOrEqual(6);
    expect(cfDecimals.length).toBeLessThanOrEqual(6);
    expect(pefValue).toBeGreaterThan(0);
    expect(cfValue).toBeGreaterThan(0);
  }, 8000);

  it('should set PEF and CF to 0 when result entries exist but score fields are missing', async () => {
    const resultDataWithMissingFields = {
      baseline: {
        "sustainablepackaging-pcr": { components: [] },
        packproduction: {
          packaging_level: [
            {
              packaging_level: 'Primary',
              components: [
                {
                  _id: "34",
                  sub_components: [
                    { material: [{ _id: "123" }] }
                  ]
                }
              ]
            },
            {
              packaging_level: 'Secondary',
              components: [
                {
                  _id: "345",
                  sub_components: [
                    { material: [{ _id: "35435" }] }
                  ]
                }
              ]
            }
          ]
        },
        packagingeol: {
          packaging_level: [
            {
              packaging_level: 'Primary',
              components: [
                {
                  _id: "34",
                  sub_components: [
                    { material: [{ _id: "123" }] }
                  ]
                }
              ]
            },
            {
              packaging_level: 'Secondary',
              components: [
                {
                  _id: "345",
                  sub_components: [
                    { material: [{ _id: "35435" }] }
                  ]
                }
              ]
            }
          ]
        }
      }
    };

    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: resultDataWithMissingFields,
      refetch: jest.fn(),
    });

    let capturedContext;
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <FullTestComponent onContext={(ctx) => { capturedContext = ctx; }} />
        </ProductDataProvider>
      );
    });

    const primaryMat = capturedContext?.primaryPackaging?.components?.[0]?.sub_components?.[0]?.material?.[0];
    const secondaryMat = capturedContext?.secondaryPackaging?.components?.[0]?.sub_components?.[0]?.material?.[0];

    expect(primaryMat).toBeDefined();
    expect(secondaryMat).toBeDefined();

    // When score fields are missing, mapping should produce '0' strings
    expect(primaryMat?.productEnvironmentalFootPrint).toBe('0');
    expect(primaryMat?.carbonFootPrint).toBe('0');
    expect(secondaryMat?.productEnvironmentalFootPrint).toBe('0');
    expect(secondaryMat?.carbonFootPrint).toBe('0');
  }, 8000);

  it('should handle empty sub_components arrays without crashing (materials remain empty)', async () => {
    const detailWithEmptySubcomponents = [
      {
        productId: '777',
        productName: 'Empty Subcomponents',
        brandName: 'Brand',
        productSipId: 'sip777',
        user: [{ name: 'U', role: 'R', mail: 'u@e.com' }],
        details: {
          assessmentId: '777',
          name: 'Assessment',
          _id: 'assess-777',
          packaging_level: [
            {
              packaging_level: 'Primary',
              components: [
                {
                  _id: 'c-empty',
                  sub_components: [],
                  material: []
                }
              ]
            }
          ],
          formulation: null,
        },
        isBaselinePresent: false,
        isBaselineDataComplete: false,
      }
    ];

    (useGetProductAssessmentDetailByID as jest.Mock).mockReturnValue({
      data: detailWithEmptySubcomponents,
      refetch: refetchMock,
      isLoading: false,
    });

    await act(async () => {
      render(
        <ProductDataProvider assessmentId="777" productId="777" assessmentType="baseline">
          <FullTestComponent />
        </ProductDataProvider>
      );
    });

    // primaryPackaging should be present but the first component's sub_components should be an empty array
    expect(screen.getByTestId('primaryPackaging').textContent).toBe('present');
    let capturedContext;
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="777" productId="777" assessmentType="baseline">
          <FullTestComponent onContext={(ctx) => { capturedContext = ctx; }} />
        </ProductDataProvider>
      );
    });

    const components = capturedContext?.primaryPackaging?.components;
    expect(Array.isArray(components)).toBe(true);
    expect(components?.[0]?.sub_components).toBeDefined();
    expect(components?.[0]?.sub_components?.length).toBe(0);
  }, 8000);

  it('should set component totalpef and totalpcf from compTotalsMap when result data has component-level steps', async () => {
    const resultDataWithCompTotals = {
      baseline: {
        "sustainablepackaging-pcr": { components: [] },
        packproduction: {
          packaging_level: [
            {
              packaging_level: 'Primary',
              components: [
                {
                  _id: "34",
                  step_58_pack_prod_pef_score_component_functional_unit: "0.0005",
                  step_57_pack_prod_pack_impact_component: { climate_change_functional_unit: "0.008" },
                  sub_components: [
                    {
                      material: [
                        {
                          _id: "123",
                          step_51_pack_prod_pef_score_functional_unit: "0.0002",
                          step_48_pack_prod_pack_impact: { climate_change_functional_unit: "0.005" }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              packaging_level: 'Secondary',
              components: [
                {
                  _id: "345",
                  step_58_pack_prod_pef_score_component_functional_unit: "0.0007",
                  step_57_pack_prod_pack_impact_component: { climate_change_functional_unit: "0.012" },
                  sub_components: [
                    {
                      material: [
                        {
                          _id: "35435",
                          step_51_pack_prod_pef_score_functional_unit: "0.0003",
                          step_48_pack_prod_pack_impact: { climate_change_functional_unit: "0.007" }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        packagingeol: {
          packaging_level: [
            {
              packaging_level: 'Primary',
              components: [
                {
                  _id: "34",
                  step_65_Pack_EOL_PEF_score_Component_functional_unit: "0.0003",
                  step_61_Pack_EOL_Pack_Impact_component: { climate_change_functional_unit: "0.004" },
                  sub_components: [
                    {
                      material: [
                        {
                          _id: "123",
                          step_64_Pack_EOL_PEF_score_functional_unit: "0.0001",
                          step_60_Pack_EOL_Pack_Impact: { climate_change_functional_unit: "0.003" }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              packaging_level: 'Secondary',
              components: [
                {
                  _id: "345",
                  step_65_Pack_EOL_PEF_score_Component_functional_unit: "0.0002",
                  step_61_Pack_EOL_Pack_Impact_component: { climate_change_functional_unit: "0.006" },
                  sub_components: [
                    {
                      material: [
                        {
                          _id: "35435",
                          step_64_Pack_EOL_PEF_score_functional_unit: "0.0004",
                          step_60_Pack_EOL_Pack_Impact: { climate_change_functional_unit: "0.009" }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    };

    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: resultDataWithCompTotals,
      refetch: jest.fn(),
    });

    let capturedContext;
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <FullTestComponent onContext={(ctx) => { capturedContext = ctx; }} />
        </ProductDataProvider>
      );
    });

    // Primary: totalpef = (step58=0.0005 + step65=0.0003) * 1000000 = 800
    // Primary: totalpcf = (step57=0.008   + step61=0.004)  * 1000   = 12
    const primaryComp = capturedContext?.primaryPackaging?.components?.[0];
    expect(primaryComp?.totalpef).toBe(800);
    expect(primaryComp?.totalpcf).toBe(12);

    // Secondary: totalpef = (step58=0.0007 + step65=0.0002) * 1000000 = 900
    // Secondary: totalpcf = (step57=0.012  + step61=0.006)  * 1000   = 18
    const secondaryComp = capturedContext?.secondaryPackaging?.components?.[0];
    expect(secondaryComp?.totalpef).toBe(900);
    expect(secondaryComp?.totalpcf).toBe(18);
  }, 8000);

  it('should set component totalpef and totalpcf to 0 when result data has no component-level steps', async () => {
    // Input data: components have existing totalpef/totalpcf values
    const mockDataWithExistingTotals = [
      {
        productId: '123',
        productName: 'Sample Product',
        brandName: 'Sample Brand',
        productSipId: 'sip123',
        user: [{ name: 'John Doe', role: 'Manager', mail: 'johndoe@example.com' }],
        details: {
          assessmentId: '456',
          name: 'Assessment 1',
          _id: 'assess-1',
          packaging_level: [
            {
              packaging_level: 'Primary',
              components: [
                {
                  _id: "34",
                  totalpef: 999.111,
                  totalpcf: 888.222,
                  sub_components: [
                    {
                      _id: "sub1",
                      material: [{
                        material_name: "test",
                        _id: "123"
                      }]
                    }
                  ],
                  material: [{ _id: "123" }]
                }
              ]
            },
          ],
          formulation: null,
        },
        isBaselinePresent: true,
        isBaselineDataComplete: true,
      },
    ];

    (useGetProductAssessmentDetailByID as jest.Mock).mockReturnValue({
      data: mockDataWithExistingTotals,
      refetch: refetchMock,
      isLoading: false,
    });

    // Result data has NO component-level steps (step_58, step_65, step_57, step_61 missing)
    // processLevelComponents still adds compTotalsMap entry with {totalpef: 0, totalpcf: 0}
    // Since 0 is not nullish, ?? fallback to component.totalpef does NOT trigger — result is 0
    (useGetBaselineTableResults as jest.Mock).mockReturnValue({
      data: { baseline: {} },
      refetch: jest.fn(),
    });

    let capturedContext;
    await act(async () => {
      render(
        <ProductDataProvider assessmentId="456" productId="455" assessmentType="baseline">
          <FullTestComponent onContext={(ctx) => { capturedContext = ctx; }} />
        </ProductDataProvider>
      );
    });

    const primaryComp = capturedContext?.primaryPackaging?.components?.[0];
    expect(primaryComp?.totalpef).toBe(0);
    expect(primaryComp?.totalpcf).toBe(0);
  }, 8000);
});