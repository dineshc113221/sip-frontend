/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "react-query";
import Theme from "./theme/Theme";
import "./assets/css/index.scss";
import Dashboard from "./pages/Dashboard.component";
import { Box } from "@mui/material";
import AllProductDashboard from "./pages/AllDashboard.component";
import ProductDetail from "./components/breadcrumb/ProductDetail.component";
import DataProvider from "./contexts/masterData/DataProvider";
import { getLoggedInUserDetails } from "@consumer/core-login-ui-mf";
import { ProductAssessmentDetailsPage } from "./pages/ProductAssessmentDetailsPage.component";
import { ViewAllResultsPage } from "./pages/ViewAllResultsPage.component";
import { SidebarStateProvider } from "./contexts/sidebarData/SidebarStateContext";
import { RootProps, UserData } from "./components/breadcrumb/types";
import SideBarAction from "./components/dashboard/SidebarAction.component";
import { AutoSaveStateProvider } from "./contexts/autoSaveContext/AutoSaveContext";
import LoadingScreen from "./components/common/LoadingScreen";
import { LoadingProvider } from "./contexts/loadingPage/LoadingContext";
import AuditReportPage from "./pages/AuditReport.page";
import { ToastMessage } from "./components/dashboard/SignOutToast.component";
import LogsReport from "./pages/LogsReport";
import TimeoutPopupComponent from "./components/dashboard/TimeoutPopup.component";
import { LABELS, TIMEOUT_LIST } from "./constants/String.constants";
import ChangeLogs from "./pages/ChangeLogs";
import AdminEdits from "./pages/AdminEdits";
import { isSIPAdmin } from "./helper/GenericFunctions";
import VersionAckowdlege from "./helper/VersionAckowledge";
import VersionAssessmentReport from "./pages/VersionAssessmentReport";

const Root = (props: RootProps) => {
const [loggedInUser, setLoggedInUser] = useState<UserData | null>(() => {
    try {
      const cached = localStorage.getItem("userData");
      if (!cached) return null;
      const parsed = JSON.parse(cached) as UserData;
      if (!parsed?.accessToken) return null;
      const accessToken =
        typeof parsed.accessToken === "string" && parsed.accessToken.startsWith("\"")
          ? parsed.accessToken
          : `"${parsed.accessToken}"`;
      return { ...parsed, accessToken };
    } catch {
      return null;
    }
  });

  const token = useMemo(() => {
    return loggedInUser?.accessToken;
  }, [loggedInUser?.accessToken]);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState(""); // Content for the toast message

  /** START CODE - AUTO LOGOUT  */
  const [isPopupOpened, setIsPopupOpened] = useState(false);
  let timeout = null;

  const restartAutoReset = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      if (!isPopupOpened) {
        setIsPopupOpened(true);
      }
    }, TIMEOUT_LIST.inActivityTime);
  };

  const handleCloseTimeout = () => {
    setIsPopupOpened(false);
    restartAutoReset();
  };

  const onMouseMove = () => {
    restartAutoReset();
  };

  useEffect(() => {
    restartAutoReset();
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [isPopupOpened]); 

  const handleSignOutClick = () => {
    setToastContent("Are you sure you want to sign out?"); // Set the message for toast
    setShowToast(true); // Trigger showing the toast message
  };

  const handleConfirm = () => {
    sessionStorage.clear();
    localStorage.clear();
    props?.sipUiMfScreen?.publish("core-header-ui-mf:signout");
    setShowToast(false); // Hide the toast after confirming
  };

  const handleCancel = () => {
    setShowToast(false); // Hide the toast on cancel
  };

  useEffect(() => {
    props?.sipUiMfScreen?.subscribe(
      "consumer-core-login-ui-mf:userdetails",
      (_: string, userData: UserData) => {
        localStorage.setItem('userData', JSON.stringify(userData));
        if (userData && Object.keys(userData).length > 0) {
          setLoggedInUser({
            ...userData,
            accessToken: `"${userData?.accessToken}"`,
          });
        }
      }
    );
  }, [props, token, setLoggedInUser]);
  

  useEffect(() => {
    if (loggedInUser?.accessToken) return;

    // Retry briefly while the login micro-frontend finishes bootstrapping.
    let attempts = 0;
    const maxAttempts = 10; // ~5s total
    const intervalMs = 500;

    const id = setInterval(() => {
      attempts += 1;
      const loggedInUserDetails = getLoggedInUserDetails();
      if (loggedInUserDetails?.userName && loggedInUserDetails?.accessToken) {
        setLoggedInUser({
          ...loggedInUserDetails,
          accessToken: `"${loggedInUserDetails?.accessToken}"`,
        });
        clearInterval(id);
      } else if (attempts >= maxAttempts) {
        clearInterval(id);
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [loggedInUser?.accessToken]);
  

  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

  // Define a fetcher function that includes the token in the request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultQueryFn = async ({ queryKey }: any) => {
    const response = await fetch(queryKey[0], {
      headers: {
        Authorization: `Bearer ${token}`, // Use token here
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  // Create a QueryClient and set the default query function
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: defaultQueryFn, // Set the default query function
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: twentyFourHoursInMs,
      },
    },
  });

  const [adminAccessControl, setAdminAccessControl] = useState<boolean>(false);
  //To hide sidebar if non-admin user is trying to access admin page 
  useEffect(()=>{
    const locationPath = window && window.location.pathname;
    const hideSidebar: boolean = locationPath.startsWith("/admin");
    const isAdmin: boolean = isSIPAdmin(loggedInUser?.roles);
    setAdminAccessControl(hideSidebar && !isAdmin)
  }, [loggedInUser])

  const [hideSidebarFlag, setHideSidebarFlag] = useState<boolean>(false);

  useEffect(()=>{
  const locationPath = window && window.location.pathname;
  const hideSidebar: boolean = /^\/productId\/[^/]+\/assessment\/[^/]+\/[^/]+\/[^/]+\/report$/.test(locationPath) || /^\/readdocs\/[^/]/.test(locationPath);
  setHideSidebarFlag(hideSidebar)
  }, [])

  const [hideVersionAck, sethideVersionAck] = useState<boolean>(false);
  const [routePath, setRoutePath] = useState<string>("")  

  useEffect(()=>{
    const locationPath = window && window.location.pathname;
    const pathRegex: boolean = /^\/readdocs\/([^/]+)\/?$/.test(locationPath);    
    sethideVersionAck(pathRegex || routePath == "/changelog")
  }, [routePath])

  return (
    <React.StrictMode>
      {/* user role enable below line*/}
      {loggedInUser?.accessToken && !adminAccessControl ? ( 
      // {loggedInUser?.accessToken ? (
        <LoadingProvider>
          <DataProvider loggedInUser={{
    givenName: loggedInUser?.givenName,
    displayName: loggedInUser?.displayName,
    mail: loggedInUser?.mail,
    accessToken: loggedInUser?.accessToken,
    roles: loggedInUser?.roles
  }}>
            <AutoSaveStateProvider>
              <SidebarStateProvider>
                <ThemeProvider theme={Theme}>
                  <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                     {!hideVersionAck && <VersionAckowdlege/>}
                     <Routes>
                        <Route
                            path="/productId/:productId/assessment/:assessmentType/:assessmentId/:versionNumber/report"
                            element={<VersionAssessmentReport/>}
                          />
                      </Routes>
                      <Box className="main-root">
                        {/* Sidebar Action */}
                        {!hideSidebarFlag && token && (
                          <SideBarAction
                            onSignOutClick={handleSignOutClick}
                            mfProps={props?.sipUiMfScreen}
                            getRoutePathName={setRoutePath}
                          />
                        )}
                        {/* Main Content */}
                        <Box component="main" className="dashboard-main">
                          <LoadingScreen />
                          <Routes>
                          <Route path="/dashboard" element={<Dashboard/>} />
                            <Route
                              path="/allproduct"
                              element={<AllProductDashboard/>}
                            />
                            <Route
                              path="/product-detail/:id/auditReport"
                              element={<AuditReportPage isAssessment={false} />}
                            />
                            <Route
                              path="/product-detail/:id"
                              element={<ProductDetail />}
                            />
                            <Route
                              path="/my-product-detail/:id"
                              element={<ProductDetail />}
                            />
                            <Route
                              path="/my-product-detail/:id/auditReport"
                              element={<AuditReportPage isAssessment={false} />}
                            />
                            <Route
                              path="/product-assessment/:assessmentId"
                              element={<ProductAssessmentDetailsPage />}
                            />
                            <Route
                              path="/product-assessment/:id/auditReport"
                              element={<AuditReportPage isAssessment={true} />}
                            />
							<Route
                              path="/product-assessment/:id/logs"
                              element={<LogsReport />} />
                            <Route
                              path="/view-all-results/:assessmentId"
                              element={<ViewAllResultsPage />}
                            />
                            <Route path="/changelog" element={<ChangeLogs/>}/>
                            <Route path="/readdocs/:filename" element={<ChangeLogs />}/>
                            <Route path="/admin" element={<AdminEdits/>}/>
                          </Routes>
                        </Box>

                        {/* Toast Message */}
                        {showToast && (
                          <ToastMessage
                            content={toastContent}
                            onConfirm={handleConfirm}
                            onCancel={handleCancel}
                          />
                        )}

                        {isPopupOpened && (
                          <TimeoutPopupComponent
                            isPopupOpened={isPopupOpened}
                            handleCloseTimeout={handleCloseTimeout}
                            mfProps={props?.sipUiMfScreen}
                            labels={LABELS}
                          />
                        )}
                      </Box>
                    </BrowserRouter>
                  </QueryClientProvider>
                </ThemeProvider>
              </SidebarStateProvider>
            </AutoSaveStateProvider>
          </DataProvider>
        </LoadingProvider>
      ) : (
        ""
      )}
    </React.StrictMode>
  );
};

export default Root;
