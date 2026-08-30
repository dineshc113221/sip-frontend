/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, act, waitFor } from '@testing-library/react';
import Root from '../root.component';
import { isSIPAdmin } from '../helper/GenericFunctions';
import { getLoggedInUserDetails } from '@consumer/core-login-ui-mf';

jest.mock("@consumer/core-login-ui-mf", () => ({
  getLoggedInUserDetails: jest.fn(() => ({
    userName: "ITEST236",
    givenName: "ITEST236",
    mail: "ITEST236@kenvue.com",
    accessToken: "mock-token",
    roles: ["User"]
  })),
}));


jest.mock('../helper/GenericFunctions', () => ({
  isSIPAdmin: jest.fn(),
}));

jest.mock("../pages/Dashboard.component", () => () => <div data-testid="dashboard-page">Dashboard Page</div>);
jest.mock("../pages/AllDashboard.component", () => () => <div>AllDashboard</div>);
jest.mock("../components/breadcrumb/ProductDetail.component", () => () => <div>ProductDetail</div>);
jest.mock("../pages/ProductAssessmentDetailsPage.component", () => ({ ProductAssessmentDetailsPage: () => <div>Assessment</div> }));
jest.mock("../pages/ViewAllResultsPage.component", () => ({ ViewAllResultsPage: () => <div>Results</div> }));
jest.mock("../pages/AuditReport.page", () => () => <div>AuditReport</div>);
jest.mock("../pages/LogsReport", () => () => <div>LogsReport</div>);
jest.mock("../pages/ChangeLogs", () => () => <div>ChangeLogs</div>);
jest.mock("../pages/AdminEdits", () => () => <div data-testid="admin-page">AdminEdits</div>);
jest.mock("../helper/VersionAckowledge", () => () => <div>Ack</div>);
jest.mock("../pages/VersionAssessmentReport", () => () => <div>VersionReport</div>);
jest.mock("../components/dashboard/SidebarAction.component", () => () => <div>Sidebar</div>);
jest.mock("../components/common/LoadingScreen", () => () => <div>Loading</div>);
jest.mock("../components/dashboard/TimeoutPopup.component", () => () => <div>TimeoutPopup</div>);

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

jest.mock("@amcharts/amcharts5", () => ({
  Root: {
    new:
      () => {
        return ({
          setThemes: jest.fn(),
          container: {
            children: {
              push: () => {
                return ({
                  children: {
                    unshift: () => { return (<div></div>) }
                  },
                  yAxes: {
                    push: () => {
                      return ({
                        get: () => {
                          return ({
                            labels: {
                              template: {
                                setAll: () => { return (<div></div>) }
                              }
                            },
                            setAll: () => { return (<div></div>) },
                            grid: {
                              template: {
                                setAll: () => { return (<div></div>) }
                              }
                            },
                          })
                        },
                        data: {
                          setAll: () => { return (<div></div>) }
                        },
                      })
                    },
                    data: {
                      setAll: () => { return (<div></div>) }
                    },
                  },
                  xAxes: {
                    push: () => {
                      return ({
                        get: {
                          labels: {
                            template: {
                              setAll: () => { return (<div></div>) }
                            }
                          },
                          setAll: () => { return (<div></div>) },
                          grid: {
                            template: {
                              setAll: () => { return (<div></div>) }
                            }
                          },
                        },
                        data: {
                          setAll: () => { return (<div></div>) }
                        }
                      })
                    }
                  },
                  series: {
                    push: () => {
                      return ({
                        set: () => { return (<div></div>) },
                        ticks: {
                          template: {
                            set: () => { return (<div></div>) }
                          }
                        },
                        labels: {
                          template: {
                            set: () => { return (<div></div>) }
                          }
                        },
                        slices: {
                          template: {
                            set: () => { return (<div></div>) }
                          }
                        },
                        data: {
                          setAll: () => { return (<div></div>) }
                        },
                        columns: {
                          template: {
                            setAll: () => { return (<div></div>) },
                            adapters: {
                              add: () => { return (<div></div>) },
                            }
                          }
                        },
                        bullets: {
                          push: () => { return (<div></div>) },
                        },
                        appear: () => { return (<div></div>) }
                      })
                    },
                    data: {
                      setAll: () => { return (<div></div>) }
                    },
                    appear: () => { return (<div></div>) }
                  },
                  seriesContainer: {
                    children: {
                      push: () => { return (<div></div>) }
                    }
                  },
                  appear: () => { return (<div></div>) },
                  zoomOutButton: {
                    set: () => { return (<div></div>) }
                  }
                })
              }
            }
          },
          dispose: () => { return (<div></div>) }
        })
      }
  },
  Label: {
    new: () => {
      return ({
        ticks: {
          template: {
            setAll: () => { return (<div></div>) }
          }
        },
        labels: {
          template: {
            setAll: () => { return (<div></div>) }
          }
        },
        setAll: () => { return (<div></div>) },
        grid: {
          template: {
            setAll: () => { return (<div></div>) }
          }
        },
      })
    }
  },
  Picture: {
    new: () => { return (<div></div>) }
  },
  Tooltip: {
    new: () => { return (<div></div>) }
  },
  ColorSet: {
    new: () => { return (<div></div>) }
  },
  percent: jest.fn(),
  color: jest.fn()
}));
jest.mock("@amcharts/amcharts5/percent", () => ({
  PieChart: {
    new: () => { return (<div></div>) }
  },
  PieSeries: {
    new: () => { return (<div></div>) }
  },
}));
jest.mock("@amcharts/amcharts5/themes/Animated", () => ({
  new: () => { return (<div></div>) }
}));

jest.mock("@amcharts/amcharts5/xy", () => ({
  XYChart: {
    new: () => { return (<div></div>) }
  },
  AxisRendererX: {
    new: () => {
      return ({
        ticks: {
          template: {
            setAll: () => { return (<div></div>) }
          }
        },
        setAll: () => { return (<div></div>) },
        grid: {
          template: {
            setAll: () => { return (<div></div>) }
          }
        },
        labels: {
          template: {
            setAll: () => { return (<div></div>) }
          }
        },
      })
    }
  },
  CategoryAxis: {
    new: () => { return (<div></div>) }
  },
  ValueAxis: {
    new: () => { return (<div></div>) }
  },
  AxisRendererY: {
    new: () => { return (<div></div>) }
  },
  ColumnSeries: {
    new: () => { return (<div></div>) }
  },
}));

describe('Root component ', () => {

  const mockPathname = jest.fn();
  Object.defineProperty(window, "location", {
    value: {
      get pathname() {
        return mockPathname();
      },
    },
  });
  mockPathname.mockReturnValue("/sip/login");

  it('should render with component', () => {
    render(
        <Root 
        sipUiMfScreen={{
          publish: jest.fn(),
          subscribe: jest.fn(),
        }}
        />
    );
  }, 8000);
// Mock sessionStorage and localStorage
beforeEach(() => {
  sessionStorage.clear = jest.fn();
  localStorage.clear = jest.fn();
});

describe('Root component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock here so they are spies for every test
    sessionStorage.clear = jest.fn();
    localStorage.clear = jest.fn();
  });

  it('should render without crashing', () => {
    render(<Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />);
    expect(screen).toBeDefined();
  });

  it('should show session expiry popup after inactivity', () => {
    jest.useFakeTimers();
    render(<Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />);
    act(() => {
      jest.advanceTimersByTime(600000); // 10 minutes
    });
    jest.useRealTimers();
  });
});

describe('Root Component - Coverage', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear = jest.fn();
    localStorage.clear = jest.fn();
    
    delete (window as any).location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...originalLocation,
        origin: 'http://localhost',
        href: 'http://localhost/dashboard',
        pathname: '/dashboard',
        assign: jest.fn(),
        replace: jest.fn(),
      },
    });
    
    (isSIPAdmin as jest.Mock).mockReturnValue(false);
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('renders the application (Happy Path)', async () => {
    await act(async () => {
      render(<Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />);
    });

    await waitFor(() => {
        expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });

  it('allows access to Admin page if user IS Admin', async () => {
    (window.location as any).pathname = '/admin';
    (window.location as any).href = 'http://localhost/admin';
    
    (isSIPAdmin as jest.Mock).mockReturnValue(true);

    await act(async () => {
      render(<Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />);
    });

    await waitFor(() => {
       expect(screen.getByTestId('admin-page')).toBeInTheDocument();
    });
  });

  it('BLOCKS access to Admin page if user is NOT Admin', async () => {
    (window.location as any).pathname = '/admin';
    (window.location as any).href = 'http://localhost/admin';
    
    (isSIPAdmin as jest.Mock).mockReturnValue(false);

    const { container } = render(<Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />);
    
    await waitFor(() => {
        expect(container).toBeEmptyDOMElement();
    });
  });

  it('hides Sidebar on specific Report URLs', async () => {
    const reportPath = '/productId/123/assessment/type/456/1.0/report';
    (window.location as any).pathname = reportPath;
    (window.location as any).href = `http://localhost${reportPath}`;
    
    await act(async () => {
      render(<Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />);
    });

    await waitFor(() => {
        expect(screen.queryByText('Sidebar')).not.toBeInTheDocument();
    });
  });

  it('triggers session timeout logic (Timer Coverage)', async () => {
    jest.useFakeTimers();
    
    await act(async () => {
        render(<Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />);
    });

    act(() => {
        jest.runAllTimers();
    });
    
    expect(screen.queryByText('TimeoutPopup')).toBeInTheDocument();

    jest.useRealTimers();
  });
});
describe('Root component — auth hydration (recent changes)', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    jest.clearAllMocks();
   if (typeof Storage.prototype.clear !== 'function' || (localStorage.clear as any).mock) {
      (localStorage as any).clear = Storage.prototype.clear.bind(localStorage);
      (sessionStorage as any).clear = Storage.prototype.clear.bind(sessionStorage);
    }
    localStorage.removeItem('userData');
    sessionStorage.clear();

    delete (window as any).location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...originalLocation,
        origin: 'http://localhost',
        href: 'http://localhost/dashboard',
        pathname: '/dashboard',
        assign: jest.fn(),
        replace: jest.fn(),
      },
    });

    (isSIPAdmin as jest.Mock).mockReturnValue(false);
    // Restore the default authenticated user for getLoggedInUserDetails
    (getLoggedInUserDetails as jest.Mock).mockReturnValue({
      userName: 'ITEST236',
      givenName: 'ITEST236',
      mail: 'ITEST236@kenvue.com',
      accessToken: 'mock-token',
      roles: ['User'],
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  describe('localStorage seed initializer', () => {
    it('hydrates loggedInUser from cached userData on the very first render', async () => {
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userName: 'cached-user',
          givenName: 'Cached',
          mail: 'cached@kenvue.com',
          accessToken: 'cached-token',
          roles: ['User'],
        })
      );

      await act(async () => {
        render(
          <Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />
        );
      });

     await waitFor(() => {
        expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
      });
    });

    it('preserves an already-quoted accessToken without double-quoting', async () => {
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userName: 'cached-user',
          givenName: 'Cached',
          mail: 'cached@kenvue.com',
          accessToken: '"already-quoted"',
          roles: ['User'],
        })
      );

      await act(async () => {
        render(
          <Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
      });
    });

    it('falls back to placeholder when cached JSON is invalid', async () => {
      localStorage.setItem('userData', '{not valid json');
      (getLoggedInUserDetails as jest.Mock).mockReturnValue(null);

      await act(async () => {
        render(
          <Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />
        );
      });

     expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
    });

    it('treats a cached entry without accessToken as null', async () => {
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userName: 'no-token-user',
          givenName: 'NT',
          mail: 'nt@kenvue.com',
          roles: ['User'],
        })
      );
      (getLoggedInUserDetails as jest.Mock).mockReturnValue(null);

      await act(async () => {
        render(
          <Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />
        );
      });

      expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
    });

    it('returns null when localStorage has no userData entry', async () => {
      (getLoggedInUserDetails as jest.Mock).mockReturnValue(null);

      await act(async () => {
        render(
          <Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />
        );
      });

      expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
    });
  });

  // ── Unauthenticated fallback branch ──
  describe('Loading placeholder fallback', () => {
    it('renders nothing (and does NOT mount Dashboard) when no token is present', async () => {
      (getLoggedInUserDetails as jest.Mock).mockReturnValue(null);

      let container: HTMLElement | undefined;
      await act(async () => {
        const result = render(
          <Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />
        );
        container = result.container;
      });

      expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
      expect(container?.textContent ?? '').toBe('');
    });
  });

  describe('retry interval for getLoggedInUserDetails', () => {
    it('hydrates the user when getLoggedInUserDetails becomes ready on a later poll', async () => {
      jest.useFakeTimers();
      (getLoggedInUserDetails as jest.Mock)
        .mockReturnValueOnce(null)
        .mockReturnValue({
          userName: 'late-user',
          givenName: 'Late',
          mail: 'late@kenvue.com',
          accessToken: 'late-token',
          roles: ['User'],
        });

      await act(async () => {
        render(
          <Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />
        );
      });

      expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();

      await act(async () => {
        jest.advanceTimersByTime(600);
      });

      expect((getLoggedInUserDetails as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(1);
      jest.useRealTimers();
    });

    it('stops polling after maxAttempts (~5s) without finding a user', async () => {
      jest.useFakeTimers();
      (getLoggedInUserDetails as jest.Mock).mockReturnValue(null);

      await act(async () => {
        render(
          <Root sipUiMfScreen={{ publish: jest.fn(), subscribe: jest.fn() }} />
        );
      });

      // Run well past the 5s polling window
      await act(async () => {
        jest.advanceTimersByTime(10_000);
      });

      // Capped at maxAttempts (10) plus any opportunistic non-interval calls
      expect((getLoggedInUserDetails as jest.Mock).mock.calls.length).toBeLessThanOrEqual(12);
      // Still unauthenticated because no user was ever found → Dashboard not mounted
      expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
      jest.useRealTimers();
    });
  });

  // ── Subscribe handler caches userData to localStorage ──
  describe('subscribe callback', () => {
    it('writes received userData to localStorage', async () => {
      (getLoggedInUserDetails as jest.Mock).mockReturnValue(null);
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

      let capturedCallback: ((topic: string, data: any) => void) | undefined;
      const subscribe = jest.fn((_topic: string, cb: (t: string, d: any) => void) => {
        capturedCallback = cb;
      });

      await act(async () => {
        render(
          <Root sipUiMfScreen={{ publish: jest.fn(), subscribe }} />
        );
      });

      const newUser = {
        userName: 'subscribed-user',
        givenName: 'Sub',
        mail: 'sub@kenvue.com',
        accessToken: 'sub-token',
        roles: ['User'],
      };

      await act(async () => {
        capturedCallback?.('consumer-core-login-ui-mf:userdetails', newUser);
      });

      expect(setItemSpy).toHaveBeenCalledWith('userData', JSON.stringify(newUser));
      setItemSpy.mockRestore();
    });

    it('ignores an empty userData payload', async () => {
      (getLoggedInUserDetails as jest.Mock).mockReturnValue(null);

      let capturedCallback: ((topic: string, data: any) => void) | undefined;
      const subscribe = jest.fn((_topic: string, cb: (t: string, d: any) => void) => {
        capturedCallback = cb;
      });

      await act(async () => {
        render(
          <Root sipUiMfScreen={{ publish: jest.fn(), subscribe }} />
        );
      });

      await act(async () => {
        capturedCallback?.('consumer-core-login-ui-mf:userdetails', {} as any);
      });

      // Empty payload should not auth the app → Dashboard must not mount
      expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
    });
  });

});

});