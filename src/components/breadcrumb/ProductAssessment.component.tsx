/* eslint-disable no-prototype-builtins */
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  IconButton,
  Button,
  Stack,
  Avatar,
  AvatarGroup,
  CardContent,
  Chip,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Alert,
  AlertTitle,
  Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import deleteIcon from "../../assets/images/delete-pacaking.svg"
import { deepPurple } from "@mui/material/colors";
import Collapse from "@mui/material/Collapse";
import editicon from "../../assets/images/edit.svg";
import complete from "../../assets/images/complete.svg";
import incomplete from "../../assets/images/incomplete.svg";
import plusicon from "../../assets/images/add-icon.svg";
import addIcon from "../../assets/images/Add.svg";
import step_assessment from "../../assets/images/step_assessment.svg";
import arrowicon from "../../assets/images/arrow.svg";
import btnLinkIcon from "../../assets/images/btnlink.svg";
import changeIcon from "../../assets/images/change.svg"
import notAllwedIcon from "../../assets/images/not_allowed.svg"
import axios from "axios";

import "../../assets/css/SIP.css";
import "../../assets/css/Style.scss";
import "react-toastify/dist/ReactToastify.css";
import {
  ApiEndPoints,
  ApiEndPointsURL,
  ToastMessageNotificationTime,
} from "../../constants/ApiEndPoints.constant";
import PopupComponentAddMember from "../common/PopupComponentAddMember";
import ExperimentalAsseTabsComponent from "./ExperimentalAssement.component";
import { WARNING_MSG_DELETE_EXP_ASSESSMENT, WITHOUT_BASELINE_ASSESSMENT, CONFIRMATION_BASELINE_ASSESSMENT } from "../../constants/ExperimentalTooltip.constant";
import DeletePopupBox from "../modal/PopupComponentDelete";
import WithoutBaselinePopupBox from "../modal/PopupComponentWithoutBaseline";
import ConfirmationWithoutBaselinePopupBox from "../modal/PopupComponentConfirmWithoutBaseline"
import PopupAssessmentAdd from "../common/PopupComponentAddAssessment";
import LightTooltipComponent from "../common/LightTooltipComponent";
import { CommonBreadcrumb } from "./CommonBreadcrumb.component";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import { BootstrapTooltip } from "../../constants/Formula.constant";
import {
  ProductAssessmentProps,
  RowUsers,
  RowData,
} from "../../structures/products";
import {
  EditSkipAssessment,
  SkipAssessment
} from "../../structures/packaging";
import useTruncateValue, {
  callDeleteAssessmentDetails,
  CheckCRUDAccess,
  formatDate,
  getAvatarLetters,
  GetToastContainer,
  truncate,
} from "../../helper/GenericFunctions";
import Header from "../common/Header";
import '../../assets/css/product-detail-page.scss'
import { Product } from "../../structures/allproduct";
import Popup from "../common/PopupComponentAddEditProduct";
import { TrackGoogleAnalyticsEvent } from "../common/TrackGoogleAnalyticsEvent";


interface AddTeamMember {
  productId?: string;
  userCRUDAccess?: number;
  users?: Array<RowUsers>;
}

interface CardAssessment {
  assessmentId: string;
  type: string;
}

interface AssessmentDelete {
  productID: string;
  productSipId: string;
  assessmentId: string;
  type: string;
}

const iconAriaControl = (isOpen) => (isOpen ? 'long-menu' : undefined);
const iconAriaExpanded = (isOpen): boolean | undefined => (isOpen ? true : undefined);
const getIconSrc = (completed) => (completed ? complete : incomplete);
const getButtonColor = (item) => (item ? 'black' : 'grey');
const getIconFilter = (item) => (item ? '' : 'blur(2px)');

export const buildSkipAssessmentPayload = (
  productDetailData,
  loginUserName,
  justification
): SkipAssessment => ({
  productId: productDetailData._id,
  productSipId: productDetailData.productSipId,
  fg_spec: "",
  formula_number: "",
  lab_notebook_code: "",
  pc_spec: "",
  sku_erp_code: "",
  zone: "",
  net_content: "",
  createdBy: loginUserName || "",
  modifiedBy: "",
  type: "baseline",
  name: "",
  isBaselineSkipped: true,
  justification,
});

export const buildEditAssessmentPayload = (
  productDetailData,
  baselineAssessmentId,
  isBaselineSkipped,
  justification
): EditSkipAssessment => ({
  productSipId: productDetailData.productSipId,
  assessmentId: baselineAssessmentId,
  fg_spec: "",
  formula_number: "",
  lab_notebook_code: "",
  pc_spec: "",
  sku_erp_code: "",
  zone: "",
  net_content: "",
  type: "baseline",
  name: "",
  isBaselineSkipped,
  justification,
});

export const isJustificationChange = (assessmentType: string) =>
  assessmentType === "changeJustification";

const ProductAssessment: React.FC<ProductAssessmentProps> = (props) => {
  const navigate = useNavigate();
  const productDetailData = props.productDetail[0];
  const ProductAssessmentExperimentalData =
    props?.productDetail[0]?.assessments?.experimental;
  const ProductAssessmentBaselineData =
    props?.productDetail[0]?.assessments?.baseline;
  const ProductAssessmentFinalData =
    props?.productDetail[0]?.assessments?.final;
  const isBaselineSkipped = ProductAssessmentBaselineData?.isBaselineSkipped;
  const fg_spec = ProductAssessmentBaselineData?.fg_spec;
  const justification = ProductAssessmentBaselineData?.justification;
  const baselineAssessmentId = ProductAssessmentBaselineData?._id;
  const userCRUDAccess = CheckCRUDAccess(
    productDetailData.users,
    "team_member"
  );
  const userCRUDAccess_assessment = CheckCRUDAccess(
    productDetailData.users,
    "assessment"
  );
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogProductID, setDialogProductID] = useState("");
  const [dialogProductSipID, setDialogProductSipID] = useState("");
  const [justificationValueFromComponent, setJustificationValueFromComponent] = useState(justification ?? "");
  const [isChangeJustficationFlag, setIsChangeJustficationFlag] = useState<boolean>(false);

  const { token } = useGlobaldata();

  const [step1Open, setStep1Open] = useState(true);
  const [step3Open, setStep3Open] = useState(true);
  const truncateValue = useTruncateValue();

  const [initialAddmemberValue, setInitialAddmemberValue] =
    useState<AddTeamMember>({
      productId: "",
      userCRUDAccess: 0,
      users: [],
    });
  const assessmentId = productDetailData._id;
  const productSipIds = productDetailData?.productSipId;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const dialogKeyAssessmentAdd = 1;
  const dialogKeyDelete = 2;
  const dialogKey = 0;
  const dialogKeyProductEdit = 4;
  const dialogWithoutAssessment = 5;
  const dialogConfirmationBaselinePopupBox = 6
  const [addAssessmentDialogOpen, setAddAssessmentDialogOpen] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpenProductEdit, setDialogOpenProductEdit] = useState<boolean>(false);
  const showFinalAssessmentBanner = props?.productDetail[0]?.assessments?.hasOwnProperty("baseline") &&
    props?.productDetail[0]?.assessments?.hasOwnProperty("experimental") &&
    props?.productDetail[0]?.assessments?.experimental.length > 0 &&
    !props?.productDetail[0]?.assessments?.hasOwnProperty("final")

  const getCardHeight = (item) => {
    const shouldAutoHeight =
      item &&
      ProductAssessmentBaselineData?.hasOwnProperty("_id") &&
      fg_spec !== "" &&
      !isBaselineSkipped;

    return shouldAutoHeight ? "auto" : "180px";
  };

  const [initialProductValues, setInitialProductValues] = useState<Product>({
    projectId: "",
    brandName: "",
    productName: "",
    description: "",
    projectName: "",
    _id: "",
  });

  const handleCloseAddAssessment = () => {
    setAddAssessmentDialogOpen(false);
  };

  const handleOpenAddPopup = (
    var_title: string,
    var_productId: string,
    var_productSipId: string,
  ) => {
    setDialogTitle(var_title);
    setDialogProductID(var_productId);
    setDialogProductSipID(var_productSipId);
    setAddAssessmentDialogOpen(true);
  };

  const handleOpenDialog = (initialAddmemberValue: AddTeamMember) => {
    setInitialAddmemberValue(initialAddmemberValue);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const { loggedInUser } = useGlobaldata();
  const loginUserName = React.useMemo(() => {
    return (
      loggedInUser?.displayName
    );
  }, [loggedInUser?.displayName]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [withoutBaselinePopupOpen, setWithoutBaselinePopupOpen] = useState(false);
  const [confirmWithoutBaselinePopupOpen, setConfirmWithoutBaselinePopupOpen] = useState(false);

  const [slcRowAss, setSlcRowAss] = useState<CardAssessment>({
    assessmentId: "",
    type: "",
  });


  React.useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);
  const [initialValuesDeleteAss, setInitialValuesDeleteAss] =
    useState<AssessmentDelete>({
      productID: "",
      productSipId: "",
      assessmentId: "",
      type: "",
    });

  const handleMoreHorizClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowData: RowData
  ) => {
    setSlcRowAss(rowData);
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleOpenDeletePopup = (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    initialValuesDeleteAss: AssessmentDelete
  ) => {
    // Handle open delete popup action here
    ev.stopPropagation();
    setInitialValuesDeleteAss(initialValuesDeleteAss);
    setDeletePopupOpen(true);
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteAss = async () => {
    if (token) {
      const response = await callDeleteAssessmentDetails(
        initialValuesDeleteAss,
        token
      );

      if (response === 204) {
        toast.success("Assessment details deleted successfully");
        setTimeout(() => {
          props.refetch();
          setDeletePopupOpen(false);
        }, ToastMessageNotificationTime);
      } else {
        toast.warning(
          "Error occured while deleting the assessment details, please try again!"
        );
        setDeletePopupOpen(false);
      }
      setDeletePopupOpen(false);
    }
  };

  const handleCloseDeletePopup = () => {
    // Handle close delete popup action here
    setDeletePopupOpen(false);
  };

  const handleSkipAssessmentError = () => {
    props.refetch();
    toast.warning(
      "Error occurred while submitting the Component details, please try again!"
    );
    handleCloseWithoutAssessmentPopup();
  };

  const handleSkipAssessment = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const payload = buildSkipAssessmentPayload(
        productDetailData,
        loginUserName,
        justificationValueFromComponent
      );

      const response = await axios.post(
        `${ApiEndPointsURL}${ApiEndPoints.assessment_add}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.assessmentId) {
        props.refetch();
         handleCloseWithoutAssessmentPopup();


        return;
      }

      handleSkipAssessmentError();
    } catch {
      handleSkipAssessmentError();
    } finally {
      setLoading(false);
    }
  };

  const openBaselineAssessmentPopup = () => {
    setTimeout(() => {
      handleOpenAddPopup(
        "Baseline",
        productDetailData._id,
        productDetailData.productSipId
      );
    }, 0);
  };

  const closeAssessmentPopup = (
    assessmentType: string
  ) => {
    if (isJustificationChange(assessmentType)) {
      handleCloseWithoutAssessmentPopup();
      return;
    }

    handleCloseConfirmWithoutAssessmentPopup();
  };

  const handleEditAssessmentSuccess = (
    assessmentType: string
  ) => {
    props.refetch();

    setJustificationValueFromComponent("");

    if (isJustificationChange(assessmentType)) {
      handleCloseWithoutAssessmentPopup();
      return;
    }

    handleCloseConfirmWithoutAssessmentPopup();
    openBaselineAssessmentPopup();
  };

  const handleEditAssessment = async (
    assessmentType: string
  ) => {
    if (loading) return;

    setLoading(true);

    try {
      const justificationUpdate =
        isJustificationChange(assessmentType);

      const payload = buildEditAssessmentPayload(
        productDetailData,
        baselineAssessmentId,
        justificationUpdate,
        justificationUpdate
          ? justificationValueFromComponent
          : ""
      );

      const response = await axios.put(
        `${ApiEndPointsURL}${ApiEndPoints.assessment_edit}/${assessmentId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data._id) {
        handleEditAssessmentSuccess(
          assessmentType
        );
        return;
      }

      toast.warning(
        "Error occurred while submitting the Component details, please try again!"
      );

      closeAssessmentPopup(assessmentType);

    } catch {
      toast.warning(
        "Error occurred while submitting the Component details, please try again!"
      );

      closeAssessmentPopup(assessmentType);

    } finally {
      setLoading(false);
    }
  };

  const handleCloseWithoutAssessmentPopup = () => {
    setWithoutBaselinePopupOpen(false);
  };

  const handleCloseConfirmWithoutAssessmentPopup = () => {
    setConfirmWithoutBaselinePopupOpen(false);
  };

  const handleOpenConfirmWithoutAssessmentPopup = () => {
    setConfirmWithoutBaselinePopupOpen(true);
  };
  const handleOpenWithoutAssessmentPopup = () => {
    setWithoutBaselinePopupOpen(true);
  };

  const handleChangeJustificationPopup = () => {
    setWithoutBaselinePopupOpen(true);
    setIsChangeJustficationFlag(true);
  }



  const handleOpenDialogEditProduct = (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    initialValues: Product
  ) => {
    ev.stopPropagation();
    setInitialProductValues(initialValues);
    setDialogOpenProductEdit(true);
  };

  const handleSubmit = () => {
    // Handle form submission here, for example, send the product data to your backend
  };

  const hasBaselineAssessment =
    ProductAssessmentBaselineData?.hasOwnProperty("_id") && fg_spec !== "" && !isBaselineSkipped;

  const handleJustificationMessage = (justificationMessage) => {
    setJustificationValueFromComponent(justificationMessage);
  }
  const handleCloseDialogProductEdit = () => {
    setDialogOpenProductEdit(false);
  };

  const handleBaselineClick = () => {
    window.open("https://kenvue-my.sharepoint.com/shared?listurl=https%3A%2F%2Fkenvue%2Dmy%2Esharepoint%2Ecom%2Fpersonal%2Fcaiell01%5Fkenvue%5Fcom%2FDocuments&id=%2Fpersonal%2Fcaiell01%5Fkenvue%5Fcom%2FDocuments%2FDocuments%2F1%20%2D%20Embed%20sustainability%20into%20HCI%2FOptimizing%20Baseline%20Selection%20for%20SIP%2FSustainable%20Innovation%20Profiler%20%2D%20Baseline%20Selection%20Guide%20%2D%20V2%2E0%20%2D%20July%202026%2Epdf&parent=%2Fpersonal%2Fcaiell01%5Fkenvue%5Fcom%2FDocuments%2FDocuments%2F1%20%2D%20Embed%20sustainability%20into%20HCI%2FOptimizing%20Baseline%20Selection%20for%20SIP&shareLink=1&ga=1", "_blank", "noopener,noreferrer");
  };

  const handleCardClick = async (
    productDetailData,
    ProductAssessmentBaselineData
  ) => {
    // Prevent navigation if there's a text selection
    if (window.getSelection().toString()) {
      return;
    }

    // Construct the navigation path
    const pagePath = `/product-assessment/${ProductAssessmentBaselineData.assessmentId}`;

    // Track the analytics event
    await TrackGoogleAnalyticsEvent("PAGE_VIEW", "Product Assessment", {
      loginUserName,
      PAGE_VIEW: pagePath,
    });



    // Navigate to the page
    navigate(pagePath, {
      state: {
        productID: productDetailData._id,
        productName: productDetailData.productName,
        productSipId: productDetailData.productSipId,
        experimentalName: ProductAssessmentBaselineData.name,
        experimentalID: ProductAssessmentBaselineData._id,
      },
    });
    window.scrollTo(0, 0);
  };

const hasFinalAssessment =
  ProductAssessmentFinalData?.hasOwnProperty("_id");

const renderStep1Banner = () => {
  const hasBaseline =
    props?.productDetail?.[0]?.assessments?.hasOwnProperty(
      "baseline"
    );

  if (hasBaseline) {
    return null;
  }

  return (
    <Stack sx={{ width: "100%", paddingTop: "15px" }} spacing={2}>
        <Collapse
                in={step1Open}
                style={{ borderLeft: "4px solid #EDB600" }}
              >
                <Alert
                  icon={false}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setStep1Open(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  severity="warning"
                >
                  <AlertTitle>
                    <div
                      style={{ display: "flex", width: "100%", height: "30px" }}
                    >
                      <div style={{ width: "10%" }}>
                        <img
                          alt="step_assessment"
                          src={step_assessment}
                          style={{ padding: "10px" }}
                        />
                      </div>
                      <div style={{ width: "80%" }}>
                        <span
                          style={{
                            fontFamily: "kenvue-sans",
                            fontSize: "19.2px",
                            fontWeight: "700",
                            color: "#000000",
                          }}
                        >
                          Step 1: Add your baseline assessment (Define)
                        </span>
                      </div>
                    </div>
                  </AlertTitle>
                  <span
                    style={{
                      fontFamily: "kenvue-sans-regular",
                      fontWeight: "400",
                      fontSize: "13.33px",
                      color: "#000000",
                      paddingLeft: "70px",
                    }}
                  >
                    This is the commercially available product that you will be making a comparison to.
                  </span>
                </Alert>
              </Collapse>
    </Stack>
  );
};

const renderStep4Banner = () => {
  if (!showFinalAssessmentBanner) {
    return null;
  }

  return (
    <Stack sx={{ width: "100%", paddingTop: "15px" }} spacing={2}>
      <Collapse
              in={step3Open}
              style={{ borderLeft: "4px solid #EDB600" }}
            >
              <Alert
                icon={false}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setStep3Open(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                severity="warning"
              >
                <AlertTitle style={{ width: "800px" }}>
                  <div
                    style={{ display: "flex", width: "100%", height: "30px" }}
                  >
                    <div style={{ width: "9%" }}>
                      <img
                        alt=""
                        src={step_assessment}
                        style={{ padding: "10px" }}
                      />
                    </div>
                    <div style={{ width: "80%" }}>
                      <span
                        style={{
                          fontFamily: "kenvue-sans",
                          fontSize: "19.2px",
                          fontWeight: "700",
                          color: "#000000",
                        }}
                      >
                        Step 4: Add your Final Product (Develop)
                      </span>
                    </div>
                  </div>
                </AlertTitle>
                <span
                  style={{
                    fontFamily: "kenvue-sans-regular",
                    fontSize: "13.33px",
                    color: "#000000",
                    paddingLeft: "70px",
                  }}
                >
                  Generate final sustainability scores on the verified product.
                </span>
              </Alert>
            </Collapse>
    </Stack>
  );
};

const renderBaselineSection = () => {
  if (hasBaselineAssessment) {
    return (
         <div className="Baseline-data"
              key={ProductAssessmentBaselineData?._id}
            >
              <Grid className="BaselineCard-style"
                container
                spacing={1}
                style={{
                  marginTop: 0, // Reset margin-top
                  width: '100%', // Reset width
                  marginLeft: 0, // Reset margin-left
                  gridTemplateColumns: "repeat"
                }}
              >
                <Grid item xs={12} style={{ paddingLeft: "0px", paddingTop: "0px" }}>
                  <div className="Baseline-data-style">
                    <CardContent
                      className={"MuiCardContent-root"}
                      sx={{ cursor: "pointer", padding: "20px  !important" }}
                      onClick={() =>
                        handleCardClick(productDetailData, ProductAssessmentBaselineData)
                      }
                    >
                      <Grid container spacing={2} style={{ gap: "24px", padding: "20px 0px 0px 20px" }}>
                        <div className="Baseline-1">
                          <div className="Baseline-2">
                            <Chip
                              className="Baseline-3"
                              sx={{ backgroundColor: "#D2D2D2 !important" }}
                              label="Baseline"
                              variant="outlined"
                            />
                            {ProductAssessmentBaselineData?.zone && (
                              <Chip
                                className="Baseline-4"
                                sx={{ backgroundColor: "#F8F8F8 !important" }}
                                label={ProductAssessmentBaselineData?.zone}
                                variant="outlined"
                              />
                            )}
                            {ProductAssessmentBaselineData?.net_content.split(" ")[0] && (
                              <Chip
                                className="Baseline-4"
                                sx={{ backgroundColor: "#F8F8F8 !important" }}
                                label={
                                  ProductAssessmentBaselineData?.net_content
                                }
                                variant="outlined"
                              />
                            )}
                          </div>

                          {userCRUDAccess_assessment === 1 && (
                            <div className="Baseline-5">
                              <IconButton
                                style={{ padding: "0px" }}
                                aria-label="more"
                                id="long-button"
                                aria-controls={iconAriaControl(open1)}
                                aria-expanded={iconAriaExpanded(open1)}
                                aria-haspopup="true"
                                onClick={(e) =>
                                  handleMoreHorizClick(e, {
                                    assessmentId:
                                      ProductAssessmentBaselineData?._id,
                                    type: "Baseline",
                                  })
                                }
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <MoreHorizIcon
                                  className="Baseline-6"
                                />
                              </IconButton>
                              <Menu
                                className="Baseline-7"
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "right",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "right",
                                }}
                                elevation={1}
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl) && slcRowAss.type == "Baseline"}
                                onClose={handleMenuClose}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                }}
                                sx={{
                                  '& .MuiPaper-root': {
                                    width: "115px"
                                  }
                                }}
                              >
                                <MenuItem
                                  onClick={(ev) =>
                                    handleOpenDeletePopup(ev, {
                                      productID: productDetailData?._id,
                                      productSipId:
                                        productDetailData?.productSipId,
                                      assessmentId: slcRowAss.assessmentId,
                                      type: slcRowAss.type,
                                    })
                                  }
                                  className="menu_edit_delete_label1"
                                >
                                  <span className="menu_edit_delete_label">Delete</span>
                                  <img className="Baseline-8" src={deleteIcon} alt="Delete" />

                                </MenuItem>
                              </Menu>
                            </div>
                          )}
                        </div>
                        <div className="Baseline-9">
                          <span className="Baseline-10">
                            {truncate(ProductAssessmentBaselineData?.name, truncateValue)}
                          </span>
                        </div>

                        <div>
                          <div className="Baseline-11">
                            <span className="Baseline-12"
                            >
                              SIP ID :
                            </span>
                            <span className="Baseline-13">
                              {ProductAssessmentBaselineData?.assessmentId}
                            </span>
                          </div>
                          <div className="Baseline-14">
                            <span className="Baseline-12">
                              FG Spec :
                            </span>
                            <span className="Baseline-13">
                              {ProductAssessmentBaselineData?.fg_spec}
                            </span>
                          </div>
                          <div className="Baseline-14">
                            <span className="Baseline-12"
                            >
                              Formula Number :
                            </span>
                            <span className="Baseline-13">
                              {ProductAssessmentBaselineData?.formula_number}
                            </span>
                          </div>

                          <div className="Baseline-14" >
                            <span className="Baseline-12"
                            >
                              Lab Notebook Code :
                            </span>
                            <span className="Baseline-13">
                              {ProductAssessmentBaselineData?.lab_notebook_code}
                            </span>
                          </div>

                          <div className="Baseline-14">
                            <span className="Baseline-12">
                              PC Spec :
                            </span>
                            <BootstrapTooltip
                              className="BootstrapTooltip"
                              title={
                                <p className="BootstrapTooltip-p">
                                  {ProductAssessmentBaselineData?.pc_spec}
                                </p>
                              }
                              placement="top"
                              arrow
                            >
                              <span className="Baseline-13"                            >
                                {truncate(
                                  ProductAssessmentBaselineData?.pc_spec,
                                  50
                                )}
                              </span>
                            </BootstrapTooltip>
                          </div>
                        </div>

                        <div className="Baseline-15">
                          <div className="Baseline-16">
                            <span className="Baseline-17">
                              Formula
                            </span>
                            <img
                              alt=""
                              src={getIconSrc(ProductAssessmentBaselineData?.isFormulationDataCompleted)}
                              style={{
                                marginLeft: "10px",
                              }}
                            />
                          </div>

                          <div className="Baseline-18">
                            <span
                              className="Baseline-17"
                            >
                              Packaging
                            </span>
                            <img
                              alt=""
                              src={getIconSrc(ProductAssessmentBaselineData?.isPackagingDataCompleted)}
                              style={{
                                marginLeft: "10px",
                              }}
                            />
                          </div>
                        </div>

                        <div className="Baseline-19">
                          <span className="Baseline-20">
                            Date Modified:{" "}
                            {formatDate(
                              ProductAssessmentBaselineData?.updatedAt.substring(
                                0,
                                10
                              )
                            )}
                          </span>{" "}
                          |
                          <span className="Baseline-20">
                            &nbsp;Date Created:{" "}
                            {formatDate(
                              ProductAssessmentBaselineData?.createdAt.substring(
                                0,
                                10
                              )
                            )}
                          </span>
                        </div>
                      </Grid>
                    </CardContent>
                  </div>
                </Grid>


              </Grid>

            </div>
     
    );
  }

  return (
     <div style={{ width: "50%" }}>
              <Box
                sx={{
                  border: "2px solid black",
                  borderRadius: "32px 32px 32px 32px",
                  overflow: "hidden",
                  height: getCardHeight(ProductAssessmentFinalData?.hasOwnProperty("_id")),
                  borderStyle: "dashed",

                }}
              >
                <Grid container sx={{ height: "100%" }}>
                  {/* Center Section */}
                  <Grid
                    item xs={12}
                    sx={isBaselineSkipped ? { display: "block" } : {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: 90,

                    }}
                  >

                    {!isBaselineSkipped ? <Button
                      onClick={() =>
                        handleOpenAddPopup(
                          "Baseline",
                          productDetailData?._id,
                          productDetailData?.productSipId
                        )
                      }
                      style={{
                        textDecoration: "none",
                        fontFamily: "kenvue-sans-regular",
                        fontWeight: "kenvue-sans-bold",
                        textTransform: "none",
                        color: getButtonColor(userCRUDAccess_assessment),
                        cursor: "pointer",
                        position: "relative",
                        top: "30px"
                      }}
                      endIcon={
                        <img
                          alt=""
                          src={plusicon}
                          style={{
                            filter: getIconFilter(userCRUDAccess_assessment),
                          }}
                        />
                      }
                      disabled={!userCRUDAccess_assessment}
                    >
                      Add baseline assessment
                    </Button> :
                      <>
                        <div className="status-container">
                          <div className="status-pill">
                            <img alt="Not Allowed" src={notAllwedIcon} />

                            <span>Baseline assessment skipped</span>
                          </div>
                        </div>

                        <section className="justification-container">
                          <h3 className="justification-title">Justification:</h3>
                          <p className="justification-text">
                            {justification}
                          </p>

                  <button className="justification-link" type="button" onClick={handleChangeJustificationPopup} disabled={!userCRUDAccess_assessment}>
                    <button
                      type="button"
                      style={{
                        border: 0,
                        background: "transparent",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontFamily: "Kenvue-sans-regular"
                      }}
                    >
                      <span>Change Justification?</span>
                     <img alt="Change Justification" src= {changeIcon} />
                    </button>
                  </button>
                </section>
              </>}

                  </Grid>

                  {/* Bottom Section */}
                  <Grid
                    item xs={12}
                    sx={{
                      padding: "0px"
                    }}
                  >


                    <div className="baseline-assessment-footer" style={{ top: isBaselineSkipped ? "3px" : "20px" }} >
                      <button type="button" onClick={isBaselineSkipped ? handleOpenConfirmWithoutAssessmentPopup : handleOpenWithoutAssessmentPopup} disabled={!userCRUDAccess_assessment}
                        style={{
                          border: "none",
                          borderStyle: "none",
                          borderColor: "transparent",
                          background: "transparent",
                          cursor: userCRUDAccess_assessment ? "pointer" : "not-allowed"
                        }}>
                        <span className="footerText" style={{ bottom: "3px", cursor: userCRUDAccess_assessment ? "pointer" : "not-allowed" }}  >
                          {isBaselineSkipped ? "Ready to add your baseline assessment? Click here" : "To continue without a baseline assessment Click here"}
                          <span className="arrow">
                            <img
                              alt="arrowicon"
                              src={arrowicon}
                              className="Product-detail-arrow-icon"
                              style={{
                                cursor: userCRUDAccess_assessment ? "pointer" : "not-allowed",
                                height: "12.31px",
                                width: "12px",
                              }}
                            />
                          </span>
                        </span>
                      </button>

                    </div>
                  </Grid>
                </Grid>
              </Box>

            </div>
  );
};

const renderFinalSection = () => {
  if (hasFinalAssessment) {
    return (
     <div className="Baseline-data"
              key={ProductAssessmentFinalData?._id}
            >
              {" "}
              <Grid className="BaselineCard-style"
                container
                spacing={1}
                style={{
                  marginTop: 0, // Reset margin-top
                  width: '100%', // Reset width
                  marginLeft: 0, // Reset margin-left
                  gridTemplateColumns: "repeat"
                }}
              >
                <Grid item xs={12} style={{ paddingLeft: "0px", paddingTop: "0px" }}>
                  <div className="Baseline-data-style"
                  >
                    <CardContent
                      className={"MuiCardContent-root"}
                      sx={{ cursor: "pointer", padding: "20px !important" }}
                      onClick={() => {
                        if (window.getSelection().toString()) {
                          return;
                        }
                        navigate(
                          `/product-assessment/${ProductAssessmentFinalData.assessmentId}`,
                          {
                            state: {
                              ...{
                                productID: productDetailData._id,
                                productName: productDetailData.productName,
                                productSipId: productDetailData.productSipId,
                              },
                              ...{
                                experimentalName:
                                  ProductAssessmentFinalData.name,
                                experimentalID: ProductAssessmentFinalData._id,
                              },
                            },
                          }
                        );
                      }}
                    >
                      <Grid container spacing={2} style={{ gap: "24px", padding: "20px 0px 0px 20px" }} >
                        <div className="Baseline-1">
                          <div className="Baseline-2">
                            <Chip className="Baseline-3"
                              sx={{ backgroundColor: "#00B097 !important" }}
                              label="Final"
                              variant="outlined"
                            />
                            {ProductAssessmentFinalData.zone && (
                              <Chip
                                className="Baseline-4"
                                sx={{ backgroundColor: "#F8F8F8 !important" }}
                                label={ProductAssessmentFinalData.zone}
                                variant="outlined"
                              />
                            )}
                            {ProductAssessmentFinalData?.net_content.split(" ")[0] && (
                              <Chip
                                className="Baseline-4"
                                sx={{ backgroundColor: "#F8F8F8 !important" }}
                                label={ProductAssessmentFinalData.net_content}
                                variant="outlined"
                              />
                            )}
                          </div>

                          {userCRUDAccess_assessment === 1 && (
                            <div className="Baseline-5"  >
                              <IconButton
                                style={{ padding: "0px" }}
                                aria-label="more"
                                id="long-button"
                                aria-controls={iconAriaControl(open1)}
                                aria-expanded={iconAriaExpanded(open1)}
                                aria-haspopup="true"
                                onClick={(e) =>
                                  handleMoreHorizClick(e, {
                                    assessmentId:
                                      ProductAssessmentFinalData?._id,
                                    type: "Final",
                                  })
                                }
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <MoreHorizIcon className="Baseline-6"
                                />
                              </IconButton>
                              <Menu className="Baseline-7"
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "right",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "right",
                                }}
                                elevation={1}
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl) && slcRowAss.type == "Final"}
                                onClose={handleMenuClose}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                }}
                                sx={{
                                  '& .MuiPaper-root': {
                                    width: "115px"
                                  }
                                }}
                              >
                                <MenuItem
                                  onClick={(ev) =>
                                    handleOpenDeletePopup(ev, {
                                      productID: productDetailData?._id,
                                      productSipId:
                                        productDetailData?.productSipId,
                                      assessmentId: slcRowAss.assessmentId,
                                      type: slcRowAss.type,
                                    })
                                  }
                                  className="menu_edit_delete_label1"
                                >
                                  <span className="menu_edit_delete_label">Delete</span>
                                  <img className="Baseline-8" src={deleteIcon} alt="Delete" />

                                </MenuItem>
                              </Menu>
                            </div>
                          )}
                        </div>

                        <div className="Baseline-9"
                        >
                          <span
                            className="Baseline-10"
                          >
                            {truncate(ProductAssessmentFinalData?.name, truncateValue)}
                          </span>
                        </div>

                        <div>
                          <div className="Baseline-11"
                          >
                            <span
                              className="Baseline-12"
                            >
                              SIP ID :
                            </span>
                            <span className="Baseline-13"
                            >
                              {ProductAssessmentFinalData?.assessmentId}
                            </span>
                          </div>
                          <div className="Baseline-14"
                          >
                            <span className="Baseline-12"

                            >
                              FG Spec :
                            </span>
                            <span className="Baseline-13"

                            >
                              {ProductAssessmentFinalData?.fg_spec}
                            </span>
                          </div>
                          <div className="Baseline-14"
                          >
                            <span className="Baseline-12"

                            >
                              Formula Number :
                            </span>
                            <span className="Baseline-13"
                            >
                              {ProductAssessmentFinalData?.formula_number}
                            </span>
                          </div>

                          <div className="Baseline-14"
                          >
                            <span className="Baseline-12"
                            >
                              Lab Notebook Code :
                            </span>
                            <span className="Baseline-13"
                            >
                              {ProductAssessmentFinalData?.lab_notebook_code}
                            </span>
                          </div>

                          <div className="Baseline-14"
                          >
                            <span className="Baseline-12" >
                              PC Spec :
                            </span>
                            <BootstrapTooltip
                              className="BootstrapTooltip"
                              title={
                                <p className="BootstrapTooltip-p">
                                  {ProductAssessmentFinalData?.pc_spec}
                                </p>
                              }
                              placement="top"
                              arrow
                            >
                              <span className="Baseline-13">
                                {truncate(
                                  ProductAssessmentFinalData?.pc_spec,
                                  50
                                )}
                              </span>
                            </BootstrapTooltip>
                          </div>
                        </div>

                        <div className="Baseline-15" >
                          <div className="Baseline-16" >
                            <span className="Baseline-17" >
                              Formula
                            </span>{" "}
                            <img
                              alt=""
                              src={getIconSrc(ProductAssessmentFinalData?.isFormulationDataCompleted)}
                              style={{
                                marginLeft: "10px",
                              }}
                            />
                          </div>

                          <div className="Baseline-18" >
                            <span className="Baseline-17" >
                              Packaging
                            </span>{" "}
                            <img
                              alt=""
                              src={getIconSrc(ProductAssessmentFinalData?.isPackagingDataCompleted)}
                              style={{
                                marginLeft: "10px",
                              }}
                            />
                          </div>
                        </div>

                        <div className="Baseline-19">
                          <span className="Baseline-20" >
                            Date Modified:{" "}
                            {formatDate(
                              ProductAssessmentFinalData.updatedAt.substring(0, 10)
                            )}
                          </span>{" "}
                          |
                          <span className="Baseline-20" >
                            &nbsp;Date Created:{" "}
                            {formatDate(
                              ProductAssessmentFinalData.createdAt.substring(0, 10)
                            )}
                          </span>
                        </div>
                      </Grid>
                    </CardContent>
                  </div>
                </Grid>
              </Grid>
            </div>
    );
  }

  return (
   <div
              style={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid black",
                borderStyle: "dashed",
                height: getCardHeight(ProductAssessmentBaselineData?._id),
                borderRadius: "32px 32px 32px 32px",
              }}
            >
              <span>
                <Button
                  onClick={() =>
                    handleOpenAddPopup(
                      "Final",
                      productDetailData?._id,
                      productDetailData?.productSipId
                    )
                  }
                  style={{
                    fontFamily: "kenvue-sans-regular",
                    fontWeight: "kenvue-sans-bold",
                    textTransform: "none",
                    color: getButtonColor(userCRUDAccess_assessment),
                    cursor: "pointer",
                  }}
                  endIcon={
                    <img
                      alt=""
                      src={plusicon}
                      style={{
                        filter: getIconFilter(userCRUDAccess_assessment),
                      }}
                    />
                  }
                  disabled={!userCRUDAccess_assessment}
                >
                  Add final assessment
                </Button>
              </span>
            </div>
  );
};


  return (
    <>
      <div className="product-detail-main">
        <Header />
        <CommonBreadcrumb
          productID={productDetailData._id}
          experimentalID=""
          productName={productDetailData.productName}
          experimentalName=""
          path={window.location.pathname}
        />

        <div className="Product-detail-name-description">
          <div
            className="Product-detail-name-icon"
            style={{
              display: "block", // Ensures proper text flow
              width: "100%", // Allows full width usage
            }}
          >
            <span
              style={{
                fontFamily: "kenvue-sans",
                fontSize: "39.81px",
                display: "inline", // Ensures the text behaves like normal inline text
                wordBreak: "break-word", // Allows text to wrap naturally
              }}
            >
              {productDetailData.productName}
            </span>
            {userCRUDAccess === 1 && (
              <button
                type="button"
                onClick={(e) =>
                  handleOpenDialogEditProduct(e, {
                    projectId: productDetailData?.projectId,
                    brandName: productDetailData?.brandName,
                    productName: productDetailData?.productName,
                    description: productDetailData?.description,
                    projectName: productDetailData?.projectName,
                    _id: productDetailData?._id,
                  })
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-block", // Ensures it follows the text correctly
                  verticalAlign: "middle", // Aligns the icon with text
                  marginLeft: "13px", // Small spacing between text and icon
                  marginTop: "-20px",
                }}
              >
                <img
                  alt="editicon"
                  src={editicon}
                  className="Product-detail-Image1"
                  style={{
                    cursor: "pointer",
                    height: "25px",
                    width: "25px",
                  }}
                />
              </button>
            )}
          </div>


          <div style={{ display: "flex" }}>
            <Stack direction="row" spacing={1}>
              <AvatarGroup
                max={4}
                spacing={-2}
                sx={{ "& .MuiAvatarGroup-avatar": { borderColor: "#BFBFBF" } }}
                componentsProps={{
                  additionalAvatar: {
                    sx: {
                      backgroundColor: "#F8F8F8",
                      fontWeight: "bold",
                      color: "#000000",
                    },
                  },
                }}
              >
                {productDetailData.users.map((row_user: { name?: string }) => (
                  <Avatar
                    key={row_user.name}
                    sx={{
                      bgcolor: deepPurple[500],
                      height: "40.34px",
                      width: "40.34px",
                    }}
                    title={row_user.name}
                  >
                    {getAvatarLetters(row_user.name)}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Stack>
            <button
              type="button"
              className="product-detail-manage-team"
              style={{ background: "none", border: "none" }}
              onClick={() => {
                handleOpenDialog({
                  userCRUDAccess: userCRUDAccess,
                });
              }}
            >
              {"Manage team   >"}
            </button>
          </div>
          <div className="div-product">
            <div className="div-product-detail">
              <span className="product-detail-label1 header">Brand</span>
              <span className="product-detail-label2 header">{productDetailData.brandName}</span>

            </div>
            <div className="div-product-detail">
              <span className="product-detail-label1 header">SIP ID</span>
              <span className="product-detail-label2 header">{productDetailData.productSipId}</span>


            </div>
            <div className="div-product-detail1">
              <span className="product-detail-label1 header">Project ID</span>
              <span className="product-detail-label2 header">{productDetailData.projectId === ""
                ? "N/A"
                : productDetailData.projectId}</span>


            </div>
            <div className="div-product-detail">
              <span className="product-detail-label1 header">Project Name</span>
              <span className="product-detail-label2 header">{productDetailData.projectName}</span>


            </div>
          </div>

          <div className="div-product">
            <div className="div-product-detail">
              <span className="product-detail-label1 header"> Product Description</span>
              <span className="product-detail-label2 header">{productDetailData.description === ""
                ? "N/A"
                : productDetailData.description}{" "}</span>
            </div>
          </div>
          {/* END CODE - DIV ROW1 */}


        </div>

        <br />
        <Divider  />

        {/**START CODE - STEP1 MESSAGE */}

         {renderStep1Banner()}
        {/**END CODE - STEP1 MESSAGE */}

        {/**START CODE - STEP3 MESSAGE */}

      {renderStep4Banner()}
        {/**END CODE - STEP3 MESSAGE */}

        {/* Baseline and Final Assessment Start */}

        <div className="Baseline-Final-Section">
          <div className="Baseline-starts">
            <span className="Baseline-span-tag">
              Baseline Assessment
            </span>

            <LightTooltipComponent
              tooltipkey="1"
              title="Step 1:"
              subTitle="Add your baseline assessment (Define)"
              contents="This is the product that the innovation is either directly replacing or cannibalizing the most."
            />
          </div>

          <div className="Final-starts">
            <span className="Baseline-span-tag">
              Final Assessment
            </span>

            <LightTooltipComponent
              tooltipkey="2"
              title="Step 4:"
              subTitle="Add your Final Assessment (Develop)"
              contents="Generate final sustainability scores on the verified product."
            />
          </div>
        </div>

        {/* Final Assessment and Baseline Assessment Div Data */}

        {/**START CODE - BASELINE ASSESSMENT - VIEW | ADD */}
<div className="Baseline-assessment">
  {renderBaselineSection()}
  {renderFinalSection()}
</div>
       


        <button type="button" className="guideline-container" onClick={handleBaselineClick}>
          Open our Baseline Selection Guideline document here
          <div className="external-icon">
            <img
              alt="buttonLinkIcon"
              src={btnLinkIcon}
              className="button-link-icon"
              style={{
                cursor: "pointer",
              }}
            />
          </div>

        </button>

        <br />
        <Divider  sx={{marginTop:"20px"}}/>
        <br />

        <div className="Baseline-24">
          <Button
            style={{
              fontSize: "16px",
              height: "54px",
              fontWeight: "400",
              paddingLeft: "24px",
              paddingRight: "24px",
              paddingTop: "13px",
              paddingBottom: "13px",
              width: "auto",
              backgroundColor: userCRUDAccess_assessment ? "#000000" : "gray",
              color: "white",
              borderRadius: "24px",
              border: "1px",
              float: "right",
              textTransform: "none",
              fontFamily: "kenvue-sans-regular",
              cursor: "pointer",
            }}
            endIcon={
              <img
                alt=""
                style={{ height: "24px", width: "24px" }}
                src={addIcon}
              />
            }
            onClick={() =>
              handleOpenAddPopup(
                "Experimental",
                productDetailData?._id,
                productDetailData?.productSipId
              )
            }
            disabled={!userCRUDAccess_assessment}
          >
            {"Add Experimental Assessment"}
          </Button>
        </div>



      </div>
      <ExperimentalAsseTabsComponent
        ExperimentalData={ProductAssessmentExperimentalData}
        varproductData={{
          productID: productDetailData._id,
          productName: productDetailData.productName,
          productSipId: productDetailData.productSipId,
        }}
        refetch={props.refetch}
        varUserCRUDAccess={userCRUDAccess_assessment}
      />
      <PopupAssessmentAdd
        key={dialogKeyAssessmentAdd}
        open={addAssessmentDialogOpen}
        onClose={handleCloseAddAssessment}
        title={dialogTitle}
        productID={dialogProductID}
        ProductSipID={dialogProductSipID}
        refetch={props.refetch}
      />

      <PopupComponentAddMember
        initialValues={initialAddmemberValue}
        key={dialogKey}
        open={dialogOpen}
        onClose={handleCloseDialog}
        productId={assessmentId}
        productSipId={productSipIds}
        refetch={props.refetch}
      />

      <DeletePopupBox
        key={dialogKeyDelete}
        open={deletePopupOpen}
        onClose={handleCloseDeletePopup}
        onDelete={handleDeleteAss}
        dialogTitle="Warning"
        dialogContent={WARNING_MSG_DELETE_EXP_ASSESSMENT}
      />

      <WithoutBaselinePopupBox
        key={dialogWithoutAssessment}
        open={withoutBaselinePopupOpen}
        onClose={handleCloseWithoutAssessmentPopup}
        onJustificationEvent={handleJustificationMessage}
        onSkipAssessment={handleSkipAssessment}
        loading={loading}
        dialogTitle={
          <>
            Do you want to proceed without <br />
            a baseline assessment?
          </>
        }

        dialogContent={WITHOUT_BASELINE_ASSESSMENT}
        userCRUDAccess_assessment={userCRUDAccess_assessment}
        isChangeJustficationFlag={isChangeJustficationFlag}
        onChangeJustification={() => handleEditAssessment("changeJustification")}

      />

      <ConfirmationWithoutBaselinePopupBox
        key={dialogConfirmationBaselinePopupBox}
        open={confirmWithoutBaselinePopupOpen}
        onClose={handleCloseConfirmWithoutAssessmentPopup}
        onAddBaseline={() => handleEditAssessment("editBaseline")}
        dialogTitle={
          <>
            Are you sure?
          </>

        }
        dialogContent={CONFIRMATION_BASELINE_ASSESSMENT}
        userCRUDAccess_assessment={userCRUDAccess_assessment}
      />

      <Popup
        key={dialogKeyProductEdit}
        open={dialogOpenProductEdit}
        onClose={handleCloseDialogProductEdit}
        onSubmit={handleSubmit}
        initialValues={initialProductValues}
        refetch={props.refetch}
      />

      <GetToastContainer />
    </>
  );
};

export default ProductAssessment;
