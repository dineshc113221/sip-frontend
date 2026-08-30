import { render, act, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "@testing-library/jest-dom";
import { GlobalDataMock } from "../../../../mocks/GlobalData.mock.json";
import UserDetailsMock from "../../../../mocks/UserDetails.mock.json";
import { ProductDetailsMock } from "../../../../mocks/ProductDetails.mock";
import axios from "axios";
import { ResultDataMock } from "../../../../mocks/ResultData.mock";
import { ReactInfiniteProps } from "../../../../mocks/CoreLogin.mock";
import { useGlobaldata } from "../../../../contexts/masterData/DataContext";
import { useGetProductDetailByID, useGetUseDoseValue } from "../../../../hooks/UseGetProductDetails";
import { ResultDataContext } from "../../../../contexts/resultData/ResultDataContext";
import useFormulaAndConsumer from "../useFormulaAndConsumer";
import { ProductContextProp, ProductDataContext } from "../../../../contexts/productData/ProductDataContext";
import TextField from "@mui/material/TextField";
import { FormulationDataType, RawMaterialsData } from '../../../../structures/formulation';
import { toast } from "react-toastify";
import { ApiEndPoints } from "../../../../constants/ApiEndPoints.constant";


jest.mock('@consumer/core-login-ui-mf', () => ({
  getLoggedInUserDetails: () => jest.fn(() => ({ givenName: 'blaw', mail: 'badckak' })),
}));

jest.mock('react-ga4', () => ({
  ReactGA4: {
    initialize: () => {
      return <div></div>;
    },
    event: () => {
      return <div></div>;
    },
  },
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const queryClient = new QueryClient({});

jest.useFakeTimers();

const mockeduseGlobaldata = useGlobaldata as jest.Mock;
const mockedUseGetProductDetailsByID = useGetProductDetailByID as jest.Mock;
const mockedUseGetUseDoseValue = useGetUseDoseValue as jest.Mock;

jest.mock('../../../../contexts/masterData/DataContext');
jest.mock('../../../../hooks/UseGetProductDetails');

const mockedUseNavigate = jest.fn();
const mockedUseLocation = jest.fn();
const mockedUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: () => mockedUseLocation,
  params: () => mockedUseParams,
  useParams: () => mockedUseParams,
  Link: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
  },
  ToastContainer: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock('react-toastify/dist/ReactToastify.css', () => ({}));

jest.mock('react-infinite-scroll-component', () => {
  return ({ children, next, hasMore, loader, endMessage }: ReactInfiniteProps) => {
    return (
      <div>
        {children}
        {hasMore ? <button onClick={next}>Load More</button> : endMessage}
        {loader}
      </div>
    );
  };
});

jest.mock('@amcharts/amcharts5', () => ({
  Root: {
    new: () => {
      return {
        setThemes: jest.fn(),
        container: {
          children: {
            push: () => {
              return {
                children: {
                  unshift: () => {
                    return <div></div>;
                  },
                },
                yAxes: {
                  push: () => {
                    return {
                      get: () => {
                        return {
                          labels: {
                            template: {
                              setAll: () => {
                                return <div></div>;
                              },
                            },
                          },
                          setAll: () => {
                            return <div></div>;
                          },
                          grid: {
                            template: {
                              setAll: () => {
                                return <div></div>;
                              },
                            },
                          },
                        };
                      },
                      data: {
                        setAll: () => {
                          return <div></div>;
                        },
                      },
                    };
                  },
                  data: {
                    setAll: () => {
                      return <div></div>;
                    },
                  },
                },
                xAxes: {
                  push: () => {
                    return {
                      get: {
                        labels: {
                          template: {
                            setAll: () => {
                              return <div></div>;
                            },
                          },
                        },
                        setAll: () => {
                          return <div></div>;
                        },
                        grid: {
                          template: {
                            setAll: () => {
                              return <div></div>;
                            },
                          },
                        },
                      },
                      data: {
                        setAll: () => {
                          return <div></div>;
                        },
                      },
                    };
                  },
                },
                series: {
                  push: () => {
                    return {
                      set: () => {
                        return <div></div>;
                      },
                      ticks: {
                        template: {
                          set: () => {
                            return <div></div>;
                          },
                        },
                      },
                      labels: {
                        template: {
                          set: () => {
                            return <div></div>;
                          },
                        },
                      },
                      slices: {
                        template: {
                          set: () => {
                            return <div></div>;
                          },
                        },
                      },
                      data: {
                        setAll: () => {
                          return <div></div>;
                        },
                      },
                      columns: {
                        template: {
                          setAll: () => {
                            return <div></div>;
                          },
                          adapters: {
                            add: () => {
                              return <div></div>;
                            },
                          },
                        },
                      },
                      bullets: {
                        push: () => {
                          return <div></div>;
                        },
                      },
                      appear: () => {
                        return <div></div>;
                      },
                    };
                  },
                  data: {
                    setAll: () => {
                      return <div></div>;
                    },
                  },
                  appear: () => {
                    return <div></div>;
                  },
                },
                seriesContainer: {
                  children: {
                    push: () => {
                      return <div></div>;
                    },
                  },
                },
                appear: () => {
                  return <div></div>;
                },
                zoomOutButton: {
                  set: () => {
                    return <div></div>;
                  },
                },
              };
            },
          },
        },
        dispose: () => {
          return <div></div>;
        },
      };
    },
  },
  Label: {
    new: () => {
      return {
        ticks: {
          template: {
            setAll: () => {
              return <div></div>;
            },
          },
        },
        labels: {
          template: {
            setAll: () => {
              return <div></div>;
            },
          },
        },
        setAll: () => {
          return <div></div>;
        },
        grid: {
          template: {
            setAll: () => {
              return <div></div>;
            },
          },
        },
      };
    },
  },
  Picture: {
    new: () => {
      return <div></div>;
    },
  },
  Tooltip: {
    new: () => {
      return <div></div>;
    },
  },
  ColorSet: {
    new: () => {
      return <div></div>;
    },
  },
  percent: jest.fn(),
  color: jest.fn(),
}));
jest.mock('@amcharts/amcharts5/percent', () => ({
  PieChart: {
    new: () => {
      return <div></div>;
    },
  },
  PieSeries: {
    new: () => {
      return <div></div>;
    },
  },
}));
jest.mock('@amcharts/amcharts5/themes/Animated', () => ({
  new: () => {
    return <div></div>;
  },
}));

jest.mock('@amcharts/amcharts5/xy', () => ({
  XYChart: {
    new: () => {
      return <div></div>;
    },
  },
  AxisRendererX: {
    new: () => {
      return {
        ticks: {
          template: {
            setAll: () => {
              return <div></div>;
            },
          },
        },
        setAll: () => {
          return <div></div>;
        },
        grid: {
          template: {
            setAll: () => {
              return <div></div>;
            },
          },
        },
        labels: {
          template: {
            setAll: () => {
              return <div></div>;
            },
          },
        },
      };
    },
  },
  CategoryAxis: {
    new: () => {
      return <div></div>;
    },
  },
  ValueAxis: {
    new: () => {
      return <div></div>;
    },
  },
  AxisRendererY: {
    new: () => {
      return <div></div>;
    },
  },
  ColumnSeries: {
    new: () => {
      return <div></div>;
    },
  },
}));

const Test = () => {
  const {
    mode,
    handleClickSaveButton,
    handleContinueDialogButton,
    handleContinueEditWarningDialogButton,
    handleCloseEditWarningDialog,
    handleChange,
    handleOpenImportFormulaPopup,
    handleClick1,
    handleClick2,
    handleCloseImportFormulaDialog,
    handelEditClick,
    handelFormulationTableChanges,
    callChildData,
  } = useFormulaAndConsumer();
  return (
    <div>
      <button onClick={(event) => handleClickSaveButton(event)}>{mode}</button>
      <button onClick={handleContinueDialogButton}>{'test'}</button>
      <button onClick={handleContinueEditWarningDialogButton}>{'Continue Edit'}</button>
      <button onClick={handleCloseEditWarningDialog}>{'Close Editing'}</button>
      <button onClick={handleOpenImportFormulaPopup}>{mode}</button>
      <button onClick={handleClick1}>{'test'}</button>
      <button onClick={handleClick2}>{'Continue Edit'}</button>
      <button onClick={handleCloseImportFormulaDialog}>{'Close Editing'}</button>
      <TextField
        className='disabledfield'
        variant='standard'
        value={'test'}
        InputProps={{
          readOnly: true,
        }}
        name='fmlCode'
        label='fmlCode'
        onChange={handleChange}
      />
      <TextField
        value={'test'}
        name='productSegment'
        label='Product Segment'
        onChange={handleChange}
      />
      <TextField
        value={'test'}
        name='productSubSegment'
        label='Product Sub- Segment'
        onChange={handleChange}
      />
      <button onClick={handelEditClick}>{'Handle Edit'}</button>
      <button onClick={() => handelFormulationTableChanges([] as RawMaterialsData[])}>
        {'Handle Formulation Table Changes'}
        <button
          onClick={() =>
            callChildData({ fieldsExist: { description: true } } as FormulationDataType)
          }
        >
          {'callChildData'}
        </button>
        <button onClick={() => callChildData({} as FormulationDataType)}>{'callChildData'}</button>
      </button>
    </div>
  );
};

describe('useFormulaAndConsumer', () => {
  const resultDataValue = ResultDataMock;
  const productDataValue = {
    productData: {
      productId: ProductDetailsMock[0].projectId,
      productName: ProductDetailsMock[0].productName,
      brandName: ProductDetailsMock[0].brandName,
    },
    usersData: ProductDetailsMock[0].users,
    refetch: jest.fn(),
    assessmentsData: {
      assessmentId: '',
      name: '',
      _id: '',
    },
    setAssessmentsData: jest.fn(), // Add this mock function
    formulation: ProductDetailsMock[0].assessments.experimental[0].formulation,
    primaryPackaging: ProductDetailsMock[0].assessments.experimental[0].packaging_level[0],
    secondaryPackaging: ProductDetailsMock[0].assessments.experimental[0].packaging_level[1],
    assessmentsType: 'experimental',
    packagingData: null,
    fetchingDataInProgress: false,
    isBaselinePresent: false,
    isBaselineDataComplete: false,
    setNewChangesInFormulation: jest.fn(),
    setFormulationDataComplete: () => { },
    formulationDataComplete: false,
    setPackagingDataComplete: () => { },
    packagingDataComplete: false,
    bothDataComplete: false,
    singleClickHit: false,
    setSingleClickHit: () => { },
    bothPackFormulaStatus: false,
    setBothPackFormulaStatus: () => { },
    isPackagingDirty: false,
    setIsPackagingDirty: () => { },
    setValidateCheck:()=>{},
    validateCheck:false,
    setValidateCheckEvacuation:jest.fn(),
    validateCheckEvacuation:false,
    
    setValidateCheckFinal:jest.fn(),
    validateCheckFinal: false,
    setValidateCheckFormulation: jest.fn(),
    validateCheckFormulation: false,
    setValidateCheckPackaging: jest.fn(),
    validateCheckPackaging:false,

  } as unknown as ProductContextProp;

  const refetchMock = jest.fn();
  mockedAxios.delete.mockResolvedValue({
    status: 204,
  });
  mockedAxios.put.mockResolvedValue({
    status: 204,
  });

  mockedAxios.delete.mockResolvedValue({
    status: 200,
  });

  mockedAxios.post.mockResolvedValue(UserDetailsMock);

  const mockPathname = jest.fn();
  Object.defineProperty(window, 'location', {
    value: {
      get pathname() {
        return mockPathname();
      },
      replace: jest.fn(),
    },
  });
  let originalFetch: jest.Mock;
  mockPathname.mockReturnValue('/my-product-detail/669109b168c2e4986c95d550');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockedUseGetProductDetailsByID.mockImplementation(() => ({
      isLoading: true,
      data: ProductDetailsMock,
      refetch: refetchMock,
    }));
    mockedUseGetUseDoseValue.mockImplementation(() => ({
      isLoading: true,
      useDoseData: ProductDetailsMock,
      refetchUseDose: refetchMock,
    }));
    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock,
      formulationMasterData: GlobalDataMock[0].formulation,
      formulationData: GlobalDataMock[0].formulation,
    }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(ProductDetailsMock),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.useFakeTimers();
    global.fetch = originalFetch;
  });

  it('should render the component', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ProductDataContext.Provider value={productDataValue}>
            <ResultDataContext.Provider value={resultDataValue}>
              <Test />
            </ResultDataContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

    // Get specific textbox by name instead of generic query
    const fmlCodeInput = screen.getByRole('textbox', { name: /fmlCode/i });
    fireEvent.change(fmlCodeInput, { target: { value: 'testing' } });

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
    fireEvent.click(buttons[3]);
  }, 8000);

  it('should render the component', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ProductDataContext.Provider value={productDataValue}>
            <ResultDataContext.Provider value={resultDataValue}>
              <Test />
            </ResultDataContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    const button = screen.getAllByRole('button');
    fireEvent.click(button[4]);
    fireEvent.click(button[5]);
    fireEvent.click(button[6]);
    fireEvent.click(button[7]);
    fireEvent.click(button[8]);
    fireEvent.click(button[9]);
    fireEvent.click(button[10]);
    fireEvent.click(button[11]);
  }, 8000);
  it('should handle successful API call in handleSaveUpdate', async () => {
    // Setup valid formulation data
    const validFormulation = {
      fmlCode: "TEST-123",
      description: "Test Formulation",
      netContent: "100",
      netContentUnit: "g",
      productionZone: "EU",
      salesZone: "US",
      productSegment: "Test Segment",
      productSubSegment: "Test Sub-Segment",
      useDose: "10",
      useDoseUnit: "g",
      consumablesUsed: "1",
      rawMaterials: [],
      useScenario: "Test Scenario",
      fieldsExist: {
        description: true,
        netContent: true,
        netContentUnit: true,
        productionZone: true,
        salesZone: true,
        productSegment: true,
        productSubSegment: true,
        useDose: true,
        useDoseUnit: true,
        rawMaterials: true,
        consumablesUsed: true,
        useScenario: true,
      },
      isCalculated: false,
    };

    // Mock API response with matching assessment ID
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        assessments: {
          experimental: [{
            _id: 'SIP_BTS_0000737_003_EXP',
            formulation: validFormulation,
            isCalculated: true
          }]
        }
      }
    });

    // Create test context with valid data
    const testProductDataValue = {
      ...productDataValue,
      assessmentsData: {
        ...productDataValue.assessmentsData,
        _id: 'SIP_BTS_0000737_003_EXP'
      },
      formulation: validFormulation
    };

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ProductDataContext.Provider value={testProductDataValue}>
            <ResultDataContext.Provider value={resultDataValue}>
              <Test />
            </ResultDataContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
    });

    // Trigger save action
    const saveButton = screen.getAllByRole('button')[0];
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getAllByRole('button')[0]).toBeInTheDocument();
    });
    // Wait for async operations

  });
  it('should validate total raw materials percentage', async () => {
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient} >
          <ProductDataContext.Provider value={{
            ...productDataValue,
            formulation: {
              ...productDataValue.formulation,
              rawMaterials: [{
                percentage: '50',
                tradeName: "",
                rawMaterialId: ""
              }, {
                percentage: '50',
                tradeName: "",
                rawMaterialId: ""
              }]
            }
          }}>
            <ResultDataContext.Provider value={resultDataValue} >
              <Test />
            </ResultDataContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
    });

    const saveButton = screen.getAllByRole('button')[0];
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          formulation: expect.objectContaining({
            rawMaterialsPercentage: 100
          })
        }),
        expect.any(Object)
      );
    });
  });
  it('should handle API call failure', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ProductDataContext.Provider value={productDataValue}>
            <ResultDataContext.Provider value={resultDataValue}>
              <Test />
            </ResultDataContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
    });

    const saveButton = screen.getAllByRole('button')[0];
    fireEvent.click(saveButton);

    await waitFor(() => {
      // Remove the extra quotes from the expected message
      expect(toast.warning).toHaveBeenCalledWith('API Error');
    });
  });

  it('should handle raw materials table changes', async () => {
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient} >
          <ProductDataContext.Provider value={productDataValue} >
            <ResultDataContext.Provider value={resultDataValue} >
              <Test />
            </ResultDataContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
    });

    const tableButton = screen.getByText('Handle Formulation Table Changes');
    fireEvent.click(tableButton);

    await waitFor(() => {
      expect(screen.getByText('Handle Formulation Table Changes')).toBeInTheDocument();
    });
  });
  it('should trigger auto-save after 5 seconds with edited members', async () => {
    mockedAxios.post.mockResolvedValue({ status: 200, data: {} });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient} >
          <ProductDataContext.Provider value={productDataValue} >
            <ResultDataContext.Provider value={resultDataValue} >
              <Test />
            </ResultDataContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
    });

    // Simulate editing a field
    const segmentInput = screen.getByLabelText(/Product Segment/i);
    fireEvent.change(segmentInput, { target: { value: 'Test Segment' } });

    // Advance timers by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });
  it('should handle successful auto-save response', async () => {
    // 1. Setup mock response with matching assessment ID
    const token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IjFRYTJJLWJyWlpPNGZ0cFhRMHp1ZnpWOXgtdENaZjNWOVN6NVZBTnBVZGMiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83YmE2NGFjMi04YTJiLTQxN2UtOWI4Zi1mY2Y4MjM4ZjJhNTYvIiwiaWF0IjoxNzQ1MzI0MDc3LCJuYmYiOjE3NDUzMjQwNzcsImV4cCI6MTc0NTMyODA0MywiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsicDEiXSwiYWlvIjoiQVhRQWkvOFpBQUFBQ1hpMktJMW9EaHVBSnJTL2ovOWE5VmVjelhRUk91dkp2L1FhQXlDOWovczZoKzYwOEx1TDV1WUNibWlKVENWQmtWMDQwTURmOUxnb1VyMkVNNTRyQmhuWVYxc0hmRWVxU2FyOEZKc2gwclNIU0p0TWR5MmhYcHNBRHoreUptK0MrdTFoak9KcVU5ekp0SjdRRThOOHBRPT0iLCJhbXIiOlsibWZhIl0sImFwcF9kaXNwbGF5bmFtZSI6IlNVU1RBSU5BQkxFIElOTk9WQVRJT04gUFJPRklMRVIgLSBERVYiLCJhcHBpZCI6IjU4YWEwMGM2LWQ0MzQtNGE1MC05YmNhLWVlZTJkYTg4MDQxMyIsImFwcGlkYWNyIjoiMCIsImRldmljZWlkIjoiYjFlZGVjNmYtNDg0ZS00NzQxLWEyYjAtY2M0NmUxYTc5YzhmIiwiZmFtaWx5X25hbWUiOiJKYWRoYXYiLCJnaXZlbl9uYW1lIjoiUHJpeWFua2FZIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTY3LjEwMy42Mi4yMDciLCJuYW1lIjoiSmFkaGF2LCBQcml5YW5rYVkgW05vbi1LZW52dWVdIiwib2lkIjoiMzEwNzA3ZWMtZWRlNS00MGQ2LWJiOGQtNGRkNmViODgxZmZlIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTEzNTAwOTYxMTQtNDAyNDIwOTEzNy0xMjcyNDAzODYzLTMwMzUwMiIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwM0IxNTBGOTA0IiwicmgiOiIxLkFYWUF3a3FtZXl1S2ZrR2JqX3o0STQ4cVZnTUFBQUFBQUFBQXdBQUFBQUFBQUFDMEFENTJBQS4iLCJzY3AiOiJlbWFpbCBvcGVuaWQgcHJvZmlsZSBVc2VyLlJlYWQiLCJzaWQiOiIwMDNlMjI1OS1mNWZmLThlYjktNmNiYy1kZGM5NzNhNmU3ZDciLCJzaWduaW5fc3RhdGUiOlsiZHZjX21uZ2QiLCJkdmNfY21wIl0sInN1YiI6IlJXX0Jwd1VRV3pPamtfaXdhRjYtYmxqemRWN2dEVGZUc2tsMk5VeW5reVUiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiTkEiLCJ0aWQiOiI3YmE2NGFjMi04YTJiLTQxN2UtOWI4Zi1mY2Y4MjM4ZjJhNTYiLCJ1bmlxdWVfbmFtZSI6IlBKYWRoYTA0QGtlbnZ1ZS5jb20iLCJ1cG4iOiJQSmFkaGEwNEBrZW52dWUuY29tIiwidXRpIjoiZ0NYQ1ljVVlna3U5aVhfanNzRWNBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19mdGQiOiJIVTdGZUM3U3NiaDZHZFFtcmVoWkJ3TlZEQ0tBdmpmbDVhRUFFQVhwUTVnQmRYTnViM0owYUMxa2MyMXoiLCJ4bXNfaWRyZWwiOiIxIDI4IiwieG1zX3N0Ijp7InN1YiI6Ink2dEczY19PNGdMbUdFbE5VVU41TnlVWHk3M2lrR0t4RmtXelJYZjMyWXcifSwieG1zX3RjZHQiOjE2NDk5NjYzNzV9.hoVUPwyzgXO8GRmiYJFGdNJfXm_fptLqAlXKX5QArVys3zSTP08mFYw3iSvIcQIcgV-GrIlKnpSyi-_8LVxCmVQvW_DCOCtuNH4n32fN0nSUfCRowNKaKVjlSofb2CklN6uszPawAMd2tPRiWJzB1q8n8ju0wMci-Zf3f7iuOmANlwwe4iAMUP4l2pcsXluxOjvH1F3B4UIRWpxjFT7yL1Hnr6uq5QSOOGCMLJu42ITVZpaDkXc8fYAEfak5d-z1A1dzEoErkkHA4kxf9OxkScCrQSW1WLhhvAS58DBTAvSQo_2rFRczV5HcKQNTQYbvVxlQ6EdFBQNkuwwG8YXtoQ";

    const mockAssessmentId = 'test-assessment-id';

    // Mock formulation master data with required segment structure
    const mockFormulationMasterData = {
      segment: [
        {
          productSegment: "Test Segment",
          productSubSegment: ["Sub 1", "Sub 2"]
        }
      ],
      netContent: ["100g", "200g"],
      productionZone: ["Zone 1", "Zone 2"],
      salesZone: ["Sales Zone 1", "Sales Zone 2"],
      useDose: ["10g", "20g"],
      rawMaterials: [] // Add mock raw materials if needed
    };

    const mockResponse = {
      data: {
        assessments: {
          experimental: [{
            _id: mockAssessmentId,
            formulation: {
              fmlCode: 'TEST-123',
              rawMaterials: [],
              isCalculated: true
            }
          }]
        }
      }
    };

    // 2. Mock global data with token and formulationMasterData
    mockeduseGlobaldata.mockImplementation(() => ({
      token: token,
      formulationData: mockFormulationMasterData,
      // Add other required global data properties
      globaldata: GlobalDataMock,
      isLoading: false,
      loaded: true
    }));

    // 3. Mock axios and context
    mockedAxios.post.mockResolvedValue({ status: 200, ...mockResponse });
    const testProductDataValue = {
      ...productDataValue,
      productData: {
        ...productDataValue.productData,
        productId: "valid-product-id"
      },
      assessmentsData: {
        ...productDataValue.assessmentsData,
        _id: mockAssessmentId
      },
      setAssessmentsData: jest.fn()
    };

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ProductDataContext.Provider value={testProductDataValue}>
            <ResultDataContext.Provider value={resultDataValue}>
              <Test />
            </ResultDataContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
    });

    // 4. Simulate actual form changes
    const segmentInput = screen.getByLabelText(/Product Segment/i);
    await act(async () => {
      fireEvent.change(segmentInput, { target: { value: 'Test Segment' } });
    });

    // 5. Advance timers and wait for API call
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // 6. Verify the API call with correct structure
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining(ApiEndPoints.add_update_formulation),
        expect.objectContaining({
          formulation: expect.objectContaining({
            productSegment: 'Test Segment',
            rawMaterialsPercentage: expect.any(Number)
          })
        }),
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      );
    });

    // 7. Verify state updates
    await waitFor(() => {
      expect(testProductDataValue.setAssessmentsData).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: mockAssessmentId,
          formulation: expect.objectContaining({
            fmlCode: 'TEST-123'
          })
        })
      );
    });
  });

  it('should handle array response structure in auto-save', async () => {
    // 1. Setup mock data with matching IDs
    const mockAssessmentId = 'test-assessment-id';
    const mockProductId = 'valid-product-id';

    // 2. Mock formulation master data
    const mockFormulationMasterData = {
      segment: [{
        productSegment: "Test Segment",
        productSubSegment: ["Sub 1", "Sub 2"]
      }],
      netContent: ["100g"],
      productionZone: ["Zone 1"],
      salesZone: ["Sales Zone 1"],
      useDose: ["10g"],
      rawMaterials: []
    };

    // 3. Mock API response with array structure
    const mockResponse = {
      data: {
        assessments: {
          experimental: [{
            _id: mockAssessmentId,
            formulation: {
              fmlCode: 'TEST-123',
              rawMaterials: [],
              isCalculated: true
            }
          }]
        }
      }
    };

    // 4. Mock global data context
    mockeduseGlobaldata.mockImplementation(() => ({
      token: "mock-token",
      formulationData: mockFormulationMasterData,
      globaldata: GlobalDataMock,
      isLoading: false,
      loaded: true
    }));

    // 5. Mock product context
    const testProductDataValue = {
      ...productDataValue,
      productData: {
        ...productDataValue.productData,
        productId: mockProductId
      },
      assessmentsData: {
        ...productDataValue.assessmentsData,
        _id: mockAssessmentId
      },
      setAssessmentsData: jest.fn()
    };

    // 6. Mock API call
    mockedAxios.post.mockResolvedValue({ status: 200, ...mockResponse });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ProductDataContext.Provider value={testProductDataValue}>
            <ResultDataContext.Provider value={resultDataValue}>
              <Test />
            </ResultDataContext.Provider>
          </ProductDataContext.Provider>
        </QueryClientProvider>
      );
    });

    // 7. Simulate form edit
    const segmentInput = screen.getByLabelText(/Product Segment/i);
    await act(async () => {
      fireEvent.change(segmentInput, { target: { value: 'Test Segment' } });
    });

    // 8. Advance timers and wait for async operations
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    // 9. Verify API call
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });

    // 10. Verify state update
    await waitFor(() => {
      expect(testProductDataValue.setAssessmentsData).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: mockAssessmentId,
          formulation: expect.objectContaining({
            fmlCode: 'TEST-123'
          })
        })
      );
    });
  });
});
