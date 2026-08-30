import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios"; // Import axios for making HTTP requests
import "../../assets/css/Style.scss";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import { useNavigate } from "react-router-dom";
import {
  ApiEndPoints,
  ApiEndPointsURL,
  ToastMessageNotificationTime,
} from "../../constants/ApiEndPoints.constant";

import { EditProduct, AddProduct, Brand } from "../breadcrumb/types";
import { Product } from "../../structures/formulation";
import { brandSortFunction } from "../dashboard/helper";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles(() => ({
  helperText: {
    padding: "0px",
    margin: "0px",
  },
}));

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    borderRadius: "32px 32px 32px 0px",
    padding: "20px",
    border: "1px solid black",
    width: "400px",
    height: "130px",
    fontFamily: "kenvue-sans",
    transform: "translate3d(290px, -8.3333px, 0px)",
  },
}));


let initialProductsBrandMasterData: Brand[] | null = null;

const SaveDialog = ({
  open,
  onClose,
  initialValues,
  refetch,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit?: (product: Product) => void;
  initialValues?: Product;
  refetch?: () => void;
}) => {
  const navigate = useNavigate();
  const { globaldata,loggedInUser,token } = useGlobaldata();

  const classes = useStyles();
  
  initialProductsBrandMasterData = globaldata?.[0]?.brand ? brandSortFunction(globaldata[0].brand) : [];

  const [newProductName, setNewProductName] = React.useState<string>("");
  const [newBrandName, setNewBrandName] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newProjectId, setNewProjectId] = useState<string>("");
  const [editRecordId, setEditRecordId] = useState<string>("");
  const [editCondition, setEditCondition] = useState<string>("");
  const [buttonHide, setButtonHide] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNewProductName(
      initialValues?.productName ? initialValues?.productName : ""
    );
    setNewBrandName(initialValues?.brandName ? initialValues?.brandName : "");
    setNewDescription(
      initialValues?.description ? initialValues?.description : ""
    );
    setNewProjectId(initialValues?.projectId ? initialValues?.projectId : "");
    setEditRecordId(initialValues?._id ? initialValues?._id : "");

    setEditCondition(
      initialValues?.productName ? initialValues?.productName : ""
    );
  }, [initialValues]);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [productNameError, setProductNameError] = useState<boolean>(false);
  const [brandNameError, setBrandNameError] = useState<boolean>(false);
  const [inputDescriptionValue, setInputDescriptionValue] =
    useState<string>("");
  const [inputProjectIdValue, setInputProjectIdValue] =
    useState<string>("");

  const [inputProductValue, setInputProductValue] = useState<string>("");
  const maxDescriptionCharacters = 500;
  const maxProductCharacters = 50;
  const maxProjectIdCharacters = 50;
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleClose = () => {
    onClose();
    setNewProductName("");
    setNewBrandName("");
    setNewDescription("");
    setNewProjectId("");
    setEditRecordId("");
    setProductNameError(false);
    setBrandNameError(false);
    setErrorMessage("");
  };
  const getShortBrandCode = (brandName: string) => {

    return initialProductsBrandMasterData?.filter(
   
     (brand) => brand.longBrandName.toLowerCase().includes(brandName.toLowerCase())
   
    )?.[0].shortBrandCode;
   
   };

   const getLoginUserData = () => {
   
     const loginUserName = loggedInUser?.displayName;
     const loginUserEmail = loggedInUser?.mail;

    return { loginUserName, loginUserEmail };
   
   };

   const editProduct = async (shortBrandCode: string) => {
   
    const editProductPostData: EditProduct = {
   
     productName: newProductName,
   
     brandName: newBrandName,
   
     description: newDescription,
   
     projectId: newProjectId,
   
     projectName: "",
   
     shortBrandCode: shortBrandCode,
   
    };
   
    const response = await axios.put(
   
     `${ApiEndPointsURL}${ApiEndPoints.product_edit}/${editRecordId}`,
   
     editProductPostData,
   
     { headers: { Authorization: `Bearer ${token}` } }
   
    );
   
   
   
    if (response.status === 204) {
   
     setButtonHide(1);
   
     toast.success("Product details updated successfully");
   
     setTimeout(() => {
   
      setButtonHide(0);
   
      refetch();
   
      handleClose();
   
     }, ToastMessageNotificationTime);
   
    } else {
   
     toast.warning("Error occurred while submitting the product details, please try again!");
   
    }
   
   };

   const addProduct = async (shortBrandCode: string, loginUserName: string, loginUserEmail: string) => {
   
    const newProductPostData: AddProduct = {
   
     productName: newProductName,
   
     brandName: newBrandName,
   
     description: newDescription,
   
     projectId: newProjectId,
   
     projectName: "",
   
     users: [
   
    {
       name: loginUserName,
       role: "Owner",
       mail: loginUserEmail,
   
      },
   
     ],
   
     shortBrandCode: shortBrandCode,
   
    };
    const response = await axios.post(
   
     `${ApiEndPointsURL}${ApiEndPoints.product_add}`,
   
     newProductPostData,
   
     { headers: { Authorization: `Bearer ${token}` } }
   
    );
   
    if (response.status === 201) {
   
     setButtonHide(1);
     toast.success("Product details submitted successfully");
     setTimeout(() => {
      setButtonHide(0);
      navigate(`/product-detail/${response.data._id}`);
   
     }, ToastMessageNotificationTime);
   
    } else {
   
     toast.warning("Error occurred while submitting the product details, please try again!");
   
    }
   
   };
   
   const handleSave = async () => {
   
    if (newProductName && newBrandName) {
     setLoading(true);
     try {
   
      const shortBrandCode = getShortBrandCode(newBrandName);
   
      if (editCondition) {
       await editProduct(shortBrandCode);
   
      } else {
   
       const { loginUserName, loginUserEmail } = getLoginUserData();
       await addProduct(shortBrandCode, loginUserName, loginUserEmail);
      }
     } catch (error) {
      console.error("Error saving product:", error);
      toast.warning("Error occurred while submitting the product details, please try again!");
     } finally {
      setLoading(false);
     }
    } else {
     setErrorMessage("Please enter product name and brand");
    }
   
   };

  const handleProductNameChange = (value: string) => {
    setNewProductName(value);
    setProductNameError(false);
    setErrorMessage("");
    if (value.length <= maxProductCharacters) {
      setInputProductValue(value);
    }
  };
  const handleDescriptionChange = (value: string) => {
    setNewDescription(value);
    setErrorMessage("");
    if (value.length <= maxDescriptionCharacters) {
      setInputDescriptionValue(value);
    }
  };
  const handleProjectIdChange = (value: string) => {
    const sanitizedValue = value.replace(/[^a-zA-Z0-9-_]/g, '');
    setNewProjectId(sanitizedValue);
    if (sanitizedValue.length <= maxProjectIdCharacters) {
      setInputProjectIdValue(sanitizedValue)
    } 
    setErrorMessage("");
  };

  const handleBrandSearch = (value: string, searchType: string) => {
    setNewBrandName(value);
    setBrandNameError(false);
    setErrorMessage("");

    if (searchType === "brand") {
      const filtered_brand = initialProductsBrandMasterData?.filter((brand) =>
        brand.longBrandName.toLowerCase().includes(value.toLowerCase())
      );

      if (filtered_brand?.length === 0) {
        setErrorMessage("No brand found for the entered brand name");
      }
    } 
  };
  const handleProductNameBlur = () => {
    if (!newProductName) {
      setProductNameError(true);
    }
  };

  const handleBrandNameBlur = () => {
    if (!newBrandName) {
      setBrandNameError(true);
    }
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };
  const handleTooltipToggle = () => {
    setTooltipOpen(!tooltipOpen);
  };
  const charactersLeft =
    newDescription.length > 0
      ? maxDescriptionCharacters - newDescription.length
      : maxDescriptionCharacters - inputDescriptionValue.length;
  const productCharactersLeft =
    newProductName.length > 0
      ? maxProductCharacters - newProductName.length
      : maxProductCharacters - inputProductValue.length;
  const projectIdCharactersLeft =
    newProjectId.length > 0
      ? maxProjectIdCharacters - newProjectId.length
      : maxProjectIdCharacters - inputProjectIdValue.length;
  const isButtonDisabled = initialValues?.productName
    ? initialValues?.productName === newProductName &&
      initialValues?.brandName === newBrandName &&
    initialValues?.description === newDescription && initialValues?.projectId === newProjectId
    : !(newBrandName.length > 0 && newProductName.length > 0);

  const isButtonDisabledORLoading = isButtonDisabled || loading;
  return (
    <Dialog
      className="header"
      open={open}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: { borderRadius: "32px", width: "708px" },
      }}
    >
      <DialogTitle
        className="header"
        sx={{ fontFamily: "kenvue-sans" }}
        fontWeight="bold"
        style={{ fontSize: "33.18px", fontWeight: "700" }}
      >
        {initialValues?.productName ? "Edit product" : "Add product"}
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
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            gap: "8px",
            flexDirection: "column",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                fontWeight="700"
                fontSize={"13.33px"}
                sx={{
                  fontFamily: "kenvue-sans",
                  fontWeight: "700",
                  margin: "0px",
                }}
                variant="subtitle1"
              >
                Product Name
              </Typography>
              <Typography
                fontWeight="400"
                fontSize={"13.33px"}
                sx={{ fontFamily: "kenvue-sans-regular" }}
                variant="subtitle1"
                color={"red"}
              >
                *
              </Typography>
            </div>
            <TextField
              
              sx={{
                borderRadius: "15px",
                margin: "0px",
                padding: "1px",
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#00b097",
                  
                  },
                },
                "& .MuiInputBase-input": {
                  fontFamily: "kenvue-sans-regular !important",
                  fontSize:'16px !important'
                }
              }}
              autoFocus
              required
              margin="dense"
              fullWidth
              inputProps={{ maxLength: 50 }}
              variant="outlined"
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              size="small"
              value={newProductName}
              onChange={(e) => handleProductNameChange(e.target.value)}
              onBlur={handleProductNameBlur}
              error={productNameError}
              helperText={productNameError && "Product name is required"}
            />
          </div>

          {/* Add your character check validation message here */}
          {newProductName.length > maxProductCharacters ? (
            <p
              style={{
                color: "red",
                fontFamily: "kenvue-sans-regular",
                fontSize: "13.33px",
                fontWeight: "400",
                margin: "0px",
              }}
            >
              Text length should not exceed {maxProductCharacters} characters
            </p>
          ) : (
            <p
              style={{
                fontFamily: "kenvue-sans-regular",
                fontSize: "13.33px",
                margin: "0px",
                lineHeight: "1",
              }}
            >
              Characters left: {productCharactersLeft}
            </p>
          )}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="subtitle1"
              fontWeight="700"
              fontSize={"13.33px"}
              sx={{ fontFamily: "kenvue-sans-regular" }}
            >
              <span
                style={{
                  fontFamily: "kenvue-sans",
                  fontWeight: "700",
                  fontSize: "13.33px",
                }}
              >
                Brand{" "}
              </span>
            </Typography>
            <Typography
              fontWeight="400"
              fontSize={"13.33px"}
              sx={{ fontFamily: "kenvue-sans-regular" }}
              variant="subtitle1"
              color={"red"}
            >
              *
            </Typography>
          </div>
          <Select
            className="select-brand"
            sx={{
              width: "100%",
              fontFamily: "kenvue-sans-regular !important",
              fontSize:'14px !important',
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#00b097",
                },
              },
            }}
            required
            variant="outlined"
            margin="dense"
            onBlur={handleBrandNameBlur}
            error={brandNameError}
            // helperText={brandNameError ? "Brand not found, please try again." : ""}
            size="small"
            value={newBrandName}
            onChange={(e) => handleBrandSearch(e.target.value || "", "brand")}
            disabled={!!initialValues?.productName}
          >
            {initialProductsBrandMasterData?.map((brand) => (
              <MenuItem
                sx={{ fontFamily: "kenvue-sans-regular" }}
                key={brand.longBrandName}
                value={brand.longBrandName}
              >
                {brand.longBrandName}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="subtitle1"
              fontWeight="700"
              fontSize={"13.33px"}
              sx={{ fontFamily: "kenvue-sans" }}
            >
              Project ID
            </Typography>
            <LightTooltip
              placement="top-start"
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={tooltipOpen}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title={
              
                  <p
                    style={{
                      fontFamily: "kenvue-sans-regular",
                      fontWeight: "400px",
                      fontSize: "12px",
                      lineHeight: "20px",
                    }}
                  >
                    Adding the Project ID, also known as the Planisware ID, will
                    enable you to easily search for and group products that are
                    under the same project.
                  </p>
                
              }
            >
              <InfoIcon
                style={{
                  cursor: "pointer",
                  marginLeft: "5px",
                  width: "15px",
                  height: "15px",
                }}
                onClick={handleTooltipToggle}
              />
            </LightTooltip>
          </div>
          <Autocomplete
            className="header"
            sx={{
               "& .MuiInputBase-input": {
                  fontFamily: "kenvue-sans-regular !important",
                  fontSize:'16px !important'
                }
            }}
            freeSolo
            size="small"
            options={[]}
            inputValue={newProjectId}
            onInputChange={(_, value) => handleProjectIdChange(value)}
            renderInput={(params) => (
              <TextField
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#00b097",
                    },
                  },
                   "& .MuiInputBase-input": {
                  fontFamily: "kenvue-sans-regular !important",
                  fontSize:'16px !important'
                }
                }}
                style={{
                  borderRadius: "15px",
                  margin: "0px",
                }}
                margin="dense"
                variant="outlined"
                {...params}
                inputProps={{
                  ...params.inputProps,
                  maxLength: 50,
                }}
                fullWidth
               
              />
            )}
          />
          {/* Add your character check validation message here */}
          {newProjectId.length > maxProjectIdCharacters ? (
            <p
              style={{
                color: "red",
                fontFamily: "kenvue-sans-regular",
                fontSize: "13.33px",
                fontWeight: "400",
                margin: "0px",
              }}
            >
              Text length should not exceed {maxProjectIdCharacters} characters
            </p>
          ) : (
            <p
              style={{
                fontFamily: "kenvue-sans-regular",
                fontSize: "13.33px",
                marginTop: "10px",
                lineHeight: "1",
                
              }}
            >
                Characters left: {projectIdCharactersLeft}
            </p>
          )}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Typography
            variant="subtitle1"
            fontWeight="700"
            fontSize={"13.33px"}
            sx={{ fontFamily: "kenvue-sans" }}
          >
            Product Description
          </Typography>
          <TextField
            sx={{
              borderRadius: "15px",
              marginBottom: "8px",
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#00b097",
                },
              },
               "& .MuiInputBase-input": {
                  fontFamily: "kenvue-sans-regular !important",
                  fontSize:'16px !important'
                }
            }}
            fullWidth
            variant="outlined"
            size="medium"
            multiline
            inputProps={{ maxLength: 500 }}
            value={newDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
          />
          {/* Display remaining characters */}

          {/* Add your character check validation message here */}
          {newDescription.length > maxDescriptionCharacters ? (
            <p style={{ color: "red", fontFamily: "kenvue-sans-regular" }}>
              Text length should not exceed {maxDescriptionCharacters}{" "}
              characters
            </p>
          ) : (
            <p
              style={{
                fontFamily: "kenvue-sans-regular",
                fontSize: "13.33px",
                margin: "0px",
                color: "#000000",
              }}
            >
              Characters left: {charactersLeft}
            </p>
          )}
        </div>
        {errorMessage && (
          <Typography
            color="error"
            variant="subtitle1"
            sx={{
              fontFamily: "kenvue-sans-regular",
              borderRadius: "15px",
              fontSize: "1.1em",
            }}
            style={{
              marginTop: "8px",
            }}
          >
            {errorMessage}
          </Typography>
        )}
        <button
          onClick={handleSave}
          disabled={isButtonDisabledORLoading}
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            fontWeight: "400",
            fontFamily: "kenvue-sans-regular",
            padding: "10px",
            width: "151",
            backgroundColor: isButtonDisabledORLoading ? "gray" : "black",
            color: "white",
            borderRadius: "9999px",
            border: "1px",
            paddingLeft: "16px",
            paddingRight: "16px",
            display: buttonHide ? "none" : "block",
            cursor: isButtonDisabledORLoading ? "not-allowed" : "pointer",
            marginTop: "24px",
            height: "56px",
          }}
        >
          {initialValues?.productName ? "Save" : "Add Product"}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDialog;
