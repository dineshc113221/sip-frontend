import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { Autocomplete, Divider } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import {
  ApiEndPoints,
  ApiEndPointsURL,
  ToastMessageNotificationTime,
} from "../../constants/ApiEndPoints.constant";
import {
  IproductCodeDetailData,
  AddAssessment,
  PartOption,
  GetProductCodeDetail,
  FetchResponse,
  FetchFindResponse,
} from "../../structures/packaging";
import { useNavigate } from "react-router-dom";
import "../../assets/css/ProductAssessment.scss";

const useStyles = makeStyles({
  noOptions: {
    color: "black",
    fontFamily: "kenvue-sans-regular",
  },
  selectOptions: {
    "& .css-18jcskp-MuiButtonBase-root-MuiMenuItem-root.Mui-selected": {
      backgroundColor: "none",
    },
  },
});

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    borderRadius: "32px 32px 32px 0px",
    padding: "24px",
    border: "1px solid black",
    width: "437px",
    height: "198px",
    fontFamily: "kenvue-sans",
    transform: "translate3d(290px, -8.3333px, 0px)",
  },
}));

interface PopupAssessmentAddType {
  open: boolean;
  onClose: () => void;
  title: string;
  productID: string;
  ProductSipID: string;
  refetch?: () => void;
}
const PopupAssessmentAdd: React.FC<PopupAssessmentAddType> = ({
  open,
  onClose,
  title,
  productID,
  ProductSipID,
  refetch,
}) => {
  const classess = useStyles();
  const [value, setValue] = useState(null);
  const [displayCorrectProduct, setDisplayCorrectProduct] = useState("none");
  const [renderDivider, setRenderDivider] = useState<boolean>(false);
  const [productCodeData, setProductCodeData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { token,loggedInUser } = useGlobaldata();
  const navigate = useNavigate();

  const [productCodeDetailData, setProductCodeDetailData] =
    React.useState<IproductCodeDetailData>({
      FG_SPEC: "",
      SKU_ERP_CODE: "",
      PC_NM: "",
      NAME: "",
      FRML_CODE: "",
      SALES_ZONE: "",
      FRML_LAB_CODE: "",
      BRAND_CODE: "",
      PRODUCT_SEGMENT: "",
      PRODUCT_SUB_SEGMENT: "",
    });

  const [newAssessmentName, setNewAssessmentName] = React.useState<string>("");

  const [assessmentNameError, setAssessmentNameError] =
    useState<boolean>(false);
  const [inputAssessmentValue, setInputAssessmentValue] = useState<string>("");
  const maxAssessmentCharacters = 100;
  const assessmentCharactersLeft =
    maxAssessmentCharacters - inputAssessmentValue.length;
  const isButtonDisabled = newAssessmentName.length === 0;
  const [openFindProductPopup, setOpenFindProductPopup] = useState(false);
  const [buttonHide, setButtonHide] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateAssessmentPostData = (var_request_type: string, loginUserName: string) => {
    return var_request_type === 'skip'
      ? {
          productId: productID,
          productSipId: ProductSipID,
          fg_spec: '',
          formula_number: '',
          lab_notebook_code: '',
          pc_spec: '',
          sku_erp_code: '',
          zone: '',
          net_content: '',
          createdBy: loginUserName || '',
          modifiedBy: '',
          type: title,
          name: newAssessmentName,
        }
      : {
          productId: productID,
          productSipId: ProductSipID,
          fg_spec: productCodeDetailData?.FG_SPEC ? productCodeDetailData?.FG_SPEC : '',
          formula_number: productCodeDetailData?.FRML_CODE ? productCodeDetailData?.FRML_CODE : '',
          lab_notebook_code: productCodeDetailData?.FRML_LAB_CODE
            ? productCodeDetailData?.FRML_LAB_CODE
            : '',
          pc_spec: productCodeDetailData.PC_NM ? productCodeDetailData.PC_NM : '',
          sku_erp_code: productCodeDetailData.PC_NM ? productCodeDetailData.PC_NM : '',
          zone: productCodeDetailData?.SALES_ZONE ?? '',
          net_content: '',
          createdBy: loginUserName || '',
          modifiedBy: '',
          type: title,
          name: newAssessmentName,
        };
  };

  const handleConfirmSkip = async (var_request_type: string) => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true); // Set loading state to true
    setButtonHide(true);
    const loginUserName = loggedInUser?.displayName;
    //START CODE - ADD RECORD
    const newAssessmentPostData: AddAssessment = calculateAssessmentPostData(var_request_type,loginUserName);
      
    try {
      const response = await axios.post(
        `${ApiEndPointsURL}${ApiEndPoints.assessment_add}`,
        newAssessmentPostData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200 && response.data.assessmentId) {
        toast.success("Assessment details submitted successfully");
        setTimeout(() => {
        
          navigate(
            `/product-assessment/${response.data.assessmentId}`,
            {
              state: {
                ...{ experimentalName: response.data.name, experimentalID: response.data._id },
              },
            }
          );
          refetch();
          handleClose();
        }, ToastMessageNotificationTime);
      } else {
        toast.warning("Error occurred while submitting the Component details, please try again!",);
        handleClose()
        refetch()
      }
    } catch (ex) {
      toast.warning("Error occurred while submitting the Component details, please try again!");
        handleClose();
    }
    finally {
      setLoading(false); // Reset loading state after request completion
    }
    //END CODE - ADD RECORD
  };

  const handleAssessmentNameChange = (value: string) => {
    setNewAssessmentName(value);
    setAssessmentNameError(false);

    if (value.length <= maxAssessmentCharacters) {
      setInputAssessmentValue(value);
    }
  };

  const handleAssessmentNameBlur = () => {
    if (!newAssessmentName) {
      setAssessmentNameError(true);
    }
  };

  const handleClose = () => {
    onClose();
    setInputAssessmentValue("");
    setNewAssessmentName("");
    setOpenFindProductPopup(false);
    setValue(null);
    setButtonHide(false)
    setDisplayCorrectProduct("none");
    setRenderDivider(false);
    setProductCodeDetailData({
      FG_SPEC: "",
      SKU_ERP_CODE: "",
      PC_NM: "",
      NAME: "",
      FRML_CODE: "",
      SALES_ZONE: "",
      FRML_LAB_CODE: "",
      BRAND_CODE: "",
      PRODUCT_SEGMENT: "",
      PRODUCT_SUB_SEGMENT: "",
    });
  };

  const handleNextPopupButton = () => {
    onClose();
    setOpenFindProductPopup(true);
  };

  // START CODE - API CALL FOR FIND PRODUCT LIST

  const findProductCodelist = async (
    vinitialLetters: string
  ): Promise<void> => {
    // Fetch the product data
    const response: FetchFindResponse = await fetch(
      `${ApiEndPointsURL}${ApiEndPoints.find_product}${vinitialLetters}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.ok) {
      const data: string[] = await response.json(); // The response is an array of strings

      // Filter data to remove duplicates
      const var_data_product: string[] = data.filter(
        (ele: string, ind: number) =>
          ind ===
          data.findIndex((elem: string) => elem === ele) // Compare strings directly
      );
      // Set the filtered data
      setProductCodeData(var_data_product);
    } else {
      console.error("Failed to fetch product code list");
    }
  };

  React.useEffect(() => {
    if (inputValue.length > 2) {
      findProductCodelist(inputValue);
    } else {
      const data = [];
      setProductCodeData(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  // END CODE - API CALL FOR FIND PRODUCT LIST

  const getProductCodeDetail = async (vproduct_code: string): Promise<void> => {
    const response: FetchResponse = await fetch(
      `${ApiEndPointsURL}${ApiEndPoints.find_product_details}${vproduct_code}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.ok) {
      const data: GetProductCodeDetail = await response.json();
      setProductCodeDetailData(data);
    } else {
      console.error("Failed to fetch product details");
    }
  };

  const handleImportProductDetail = (vproduct_code: string) => {
    if (vproduct_code != "") {
      getProductCodeDetail(vproduct_code);
      setDisplayCorrectProduct("block");
      setRenderDivider(true);
    } else {
      setDisplayCorrectProduct("none");
      setRenderDivider(false);
    }
  };

  return (
    <>
      <Dialog
        className="header"
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: { borderRadius: "32px", width: "708px" },
        }}
      >
        <DialogTitle
          style={{
            fontSize: "33.18px",
            fontFamily: "kenvue-sans",
            fontWeight: "700",
          }}
        >
          Add {title} Assessment
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              cursor: "pointer",
              position: "absolute",
              right: 8,
              top: 8,
              float: "right",
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ fontFamily: "kenvue-sans", height: "100%" }}>
          <div style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                fontWeight="700"
                fontSize={"13.33px"}
                sx={{ fontFamily: "kenvue-sans", fontWeight: "700" }}
                variant="subtitle1"
              >
                Assessment Name
              </Typography>
              <Typography
                fontWeight="bold"
                fontSize={"13.33px"}
                sx={{ fontFamily: "kenvue-sans", fontWeight: "700" }}
                variant="subtitle1"
                color={"red"}
              >
                *
              </Typography>
            </div>

            <TextField
              sx={{
                fontFamily: "kenvue-sans",
                borderRadius: "15px",
                padding: "1px",
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#00b097",
                  },
                },
              }}
              autoFocus
              required
              inputProps={{
                style: {
                  fontFamily: "kenvue-sans-regular",
                  fontSize: "16px",
                  fontWeight: "400",
                },
                maxLength: 100,
              }}
              margin="dense"
              fullWidth
              variant="outlined"
              size="small"
              value={newAssessmentName}
              onChange={(e) => handleAssessmentNameChange(e.target.value)}
              onBlur={handleAssessmentNameBlur}
              error={assessmentNameError}
              helperText=""
            />

            {/* Add your character check validation message here */}
            {newAssessmentName.length > maxAssessmentCharacters ? (
              <p
                style={{
                  color: "red",
                  fontFamily: "kenvue-sans-regular",
                  fontSize: "13.33px",
                  fontWeight: "400",
                }}
              >
                Text length should not exceed {maxAssessmentCharacters}{" characters"}
              </p>
            ) : (
              <p
                style={{
                  fontFamily: "kenvue-sans-regular",
                  fontSize: "13.33px",
                }}
              >
                Characters left: {assessmentCharactersLeft}
              </p>
            )}
          </div>

          <button
            onClick={handleNextPopupButton}
            disabled={isButtonDisabled}
            style={{
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: "400",
              top: "20px",
              left: "20px",
              fontFamily: "kenvue-sans-regular",
              padding: "10px",
              marginTop: "5px",
              width: "87px",
              backgroundColor: isButtonDisabled ? "gray" : "black",
              color: "white",
              borderRadius: "20px",
              border: "1px",
              cursor: "pointer",
            }}
          >
            Next
          </button>
        </DialogContent>
      </Dialog>

      <Dialog
        className="header"
        open={openFindProductPopup}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          style: {
            borderRadius: "32px",
            maxWidth: displayCorrectProduct === "none" ? "708px" : "1187px",
            height: displayCorrectProduct === "none" ? "400px" : "551px",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            paddingTop: "48px",
            paddingBottom: "60px",
            paddingRight: "30px",
          }}
        >
          <div style={{ width: "50%", paddingLeft: "48px" }}>
            <DialogTitle
              sx={{ fontFamily: "kenvue-sans" }}
              fontWeight="bold"
              style={{ fontSize: "33.18px", fontWeight: "700", padding: "0px" }}
            >
              Find product
              <LightTooltip
                placement="top-start"
                PopperProps={{
                  disablePortal: true,
                }}
               
                title={
                  <p
                    style={{
                      fontFamily: "kenvue-sans-regular",
                      fontWeight: "400px",
                      fontSize: "12px",
                      lineHeight: "20px",
                    }}
                  >
                    Use the Find Product search to import product details
                    (formulation and packaging) from TRU. You can search via
                    SKU/ERP code or FG Spec. This functionality enables you to
                    use an existing product as a starting point for your
                    Experimental Assessment.
                  </p>
                }
              >
                <InfoIcon
                  style={{
                    cursor: "pointer",
                    marginLeft: "10px",
                    width: "18px",
                    height: "18px",
                    marginTop: "10px",
                  }}
                  
                />
              </LightTooltip>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  float: "right",
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ fontFamily: "kenvue-sans", padding: "0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography
                  fontWeight="700"
                  fontSize={"13.33px"}
                  sx={{ fontFamily: "kenvue-sans" }}
                  variant="subtitle1"
                >
                  <span
                    style={{
                      fontWeight: "700",
                      fontSize: "13.33px",
                      fontFamily: "kenvue-sans",
                    }}
                  >
                    {" Search Product Code"}
                  </span>
                </Typography>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                }}
              >
                <div style={{ width: "auto", fontFamily: "kenvue-sans-regular", fontSize: "16px" }}>
                  <Autocomplete 
                    inputValue={inputValue}
                    onInputChange={(_event, newValue) => {
                      setInputValue(newValue);
                    }}
                    clearOnBlur={false}
                    onChange={(_, newValue: string): void => {
                      setValue(newValue);
                      handleImportProductDetail(newValue);
                    }}
                    classes={{
                      noOptions: classess.noOptions,
                    }}
                    noOptionsText={
                      <div style={{ display: "flex" }}>
                        <CancelOutlinedIcon
                          fontSize="small"
                          style={{ marginRight: "4px", marginTop: "5px" }}
                        />
                        Product code not found, please try again.
                      </div>
                    }
                    value={value}
                    options={productCodeData?.filter((option): option is string => typeof option === 'string') || []}
                    slotProps={{
                      paper: {
                        sx: {
                          fontFamily: 'kenvue-sans-regular',
                          fontSize: '13.33px',
                        }
                      }
                    }}
                    disableClearable
                    id="FG_NM_CODE"
                    renderOption={(props, option, { inputValue }) => {
                      // Ensure option is a string to prevent errors
                      const optionString = String(option);
                      const matches = match(optionString, inputValue, { insideWords: true });
                      const parts = parse(optionString, matches);

                      return (
                        <li {...props}>
                          <div>
                            {parts.map((part: PartOption) => (
                              <span
                                key={part.id}
                                style={{ fontWeight: part.highlight ? 700 : 400 }}
                              >
                                {part.text}
                              </span>
                            ))}
                          </div>
                        </li>
                      );
                    }}
                    filterOptions={(options, state) => {
                      if (state.inputValue.length > 2) {
                        return options.filter((item: string) =>
                          String(item)
                            .toLowerCase()
                            .includes(state.inputValue.toLowerCase())
                        );
                      }
                      return options;
                    }}
                    renderInput={(params) => (
                      <TextField
                        helperText="Search by SKU/ERP Code or FG spec"
                        sx={{
                          "& .MuiFormHelperText-root": {
                            fontFamily: "kenvue-sans-regular",
                            marginLeft: "0px",
                            fontWeight: "400",
                            fontSize: "13.33px",
                            color: "black",
                          },
                          "& .MuiOutlinedInput-root .MuiAutocomplete-input": {
                            fontFamily: "kenvue-sans-regular",
                            marginLeft: "0px",
                            fontWeight: "400",
                            fontSize: "13.33px",
                            color: "black",
                          },
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "#00b097",
                            },
                          },
                        }}
                        {...params}
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          disableUnderline: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon></SearchIcon>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    sx={{
                      "& .css-16d15bc-MuiInputBase-root-MuiInput-root::before":
                        {
                          border: "none",
                        },
                      "& .MuiButtonBase-root": {
                        display: "none",
                      },
                    }}
                  />
                </div>
              </div>
              {title === "Experimental" && (
                <button
                  onClick={() => handleConfirmSkip("skip")}
                  style={{
                    float: "left",
                    fontSize: "16px",
                    lineHeight: "24px",
                    fontWeight: "400",
                    top: "20px",
                    left: "20px",
                    fontFamily: "kenvue-sans-regular",
                    padding: "10px",
                    marginTop: "45px",
                    width: "87px",
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "20px",
                    border: "1px",
                    cursor: loading || buttonHide ?"not-allowed":"pointer",
                    opacity: buttonHide ? 0.5 : 1
                  }}
                  className="disabled"
                  disabled={loading || buttonHide} // Disable button if loading
                >
                  Skip
                </button>
              )}
            </DialogContent>
          </div>

          {renderDivider && (
            <div
              style={{
                width: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "auto",
                paddingLeft: "100px",
                paddingRight: "100px",
              }}
            >
              <Divider
                orientation="vertical"
                style={{ height: "90%", width: "1px" }}
              />
            </div>
          )}

          {/** START CODE - DISPLAY PRODUCT DETAILS */}

          <div
            style={{
              width: "47%",
              display: `${displayCorrectProduct}`,
            }}
          >
            <span
              style={{
                fontFamily: "kenvue-sans",
                fontWeight: "700",
                fontSize: "23.04px",
              }}
            >
              Is this correct product?
            </span>
            <br />
            <br />
            <span
              style={{
                marginTop: "10px",
                fontFamily: "kenvue-sans",
                fontWeight: "700",
                fontSize: "19.2px",
              }}
            >
              {productCodeDetailData.NAME}&nbsp;
            </span>

            <br />
            <div
              style={{
                display: "flex",
                width: "80%",
                marginTop: "15px",

                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  fontFamily: "kenvue-sans",
                }}
                className="header"
              >
                FG Spec :
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                  fontFamily: "kenvue-sans-regular",
                  paddingLeft: "5px",
                }}
              >
                {productCodeDetailData.FG_SPEC}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                width: "80%",
                marginTop: "3px",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  fontFamily: "kenvue-sans",
                }}
                className="header"
              >
                SKU/ERP Code :
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                  fontFamily: "kenvue-sans-regular",
                  paddingLeft: "5px",
                }}
              >
                {productCodeDetailData.SKU_ERP_CODE}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                width: "80%",
                marginTop: "3px",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  fontFamily: "kenvue-sans",
                }}
                className="header"
              >
                Formula Number :
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                  fontFamily: "kenvue-sans-regular",
                  paddingLeft: "5px",
                }}
              >
                {productCodeDetailData.FRML_CODE}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                marginTop: "3px",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  fontFamily: "kenvue-sans",
                }}
                className="header"
              >
                Lab Notebook code :
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                  fontFamily: "kenvue-sans-regular",
                  paddingLeft: "5px",
                }}
              >
                {productCodeDetailData.FRML_LAB_CODE}
              </span>
            </div>

            <div
              style={{
                width: "auto%",
                marginTop: "3px",
                alignItems: "center",
              }}
            >
              <span
                className="header assessment-add--confirm-text" style={{
                  fontSize: "16px"
                }}
              >
                PC Specs :
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                  fontFamily: "kenvue-sans-regular",
                  paddingLeft: "5px",
                }}
              >
                {productCodeDetailData.PC_NM}
              </span>
            </div>

            <div
              style={{
                width: "auto",
                marginTop: "16px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{
                  display:"flex",
                  fontSize: "13.33px",
                  fontWeight: "700",
                  fontFamily: "kenvue-sans",
                  
                }}>
                  Brand
                </span>
                <br />
                <span className="header assessment-add--confirm-subtext">
                  {productCodeDetailData.BRAND_CODE}
                </span>
              </div>
              <div style={{ marginLeft: "70px" }}>
                <span className="assessment-add--confirm-text">
                  Sales Zone
                </span>
                <br />
                <span className="assessment-add--confirm-subtext">
                  {productCodeDetailData.SALES_ZONE}
                </span>
              </div>
            </div>

            <div
              style={{
                width: "auto",
                marginTop: "16px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div>
                <span className="assessment-add--confirm-text">
                  Product Segment
                </span>
                <br />
                <span className="assessment-add--confirm-subtext">
                  {productCodeDetailData.PRODUCT_SEGMENT}
                </span>
              </div>
              <div style={{ marginLeft: "20px" }}>
                <span className="assessment-add--confirm-text">
                  Product Sub Segment
                </span>
                <br />
                <span className="assessment-add--confirm-subtext">
                  {productCodeDetailData.PRODUCT_SUB_SEGMENT}
                </span>
              </div>
            </div>
            <div style={{ padding: "35px" }}>
              <button
                onClick={() => handleConfirmSkip("confirm")}
                className="assessment-add-confirm-btn"
                style={{
                  opacity: buttonHide ? 0.5 : 1,
                  cursor: loading || buttonHide ?"not-allowed":"pointer",
                  padding: "16px 24px",
                }}
                  
                disabled={loading || buttonHide} // Disable button if loading
                >
                
                {"Confirm"}
              </button>
            </div>
          </div>

          {/** END CODE - DISPLAY PRODUCT DETAILS */}
        </div>
      </Dialog>
    </>
  );
};

export default PopupAssessmentAdd;