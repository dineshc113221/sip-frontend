import {
  Grid,
  CardContent,
  Chip,
  MenuItem,
  IconButton,
  Menu,
  Divider,
  Box,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import deleteIcon from "../../assets/images/delete-pacaking.svg"
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import Popup from "../common/PopupComponentAddEditProduct";
import { WARNING_MSG_DELETE_PRODUCT } from "../../constants/ExperimentalTooltip.constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  ApiEndPoints,
  ApiEndPointsURL,
  ToastMessageNotificationTime,
} from "../../constants/ApiEndPoints.constant";
import {
  CheckCRUDAccess,
  formatDate,
  getAvatarLetters,
  getToastContainer,
  truncate,
} from "../../helper/GenericFunctions";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import "../../assets/css/ProductGridViewComponent.scss"
import {
  ExperimentalDataItem,
  PropsType,
  RowUsers,
} from "../breadcrumb/types";
import { Product } from "../../structures/allproduct";
import { DeletePopupBox } from "../modal";
import { TrackGoogleAnalyticsEvent } from "./TrackGoogleAnalyticsEvent";

export default function GridviewCard({
  props,
  refetch,
  sort_order,
}: Readonly<PropsType>) {
  const [dialogKey] = useState(0);
  const [productId, setProductId] = useState<string>();
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { token,loggedInUser } = useGlobaldata();

  const loginUserName = React.useMemo(() => {
    return (
      loggedInUser?.displayName
    );
  }, [loggedInUser?.displayName]);

  const [slcRow, setSlcRow] = useState<ExperimentalDataItem>({

    projectId: "",
    name: "",
    zone: "",
    net_content: "",
    assessmentId: "",
    fg_spec: "",
    formula_number: "",
    lab_notebook_code: "",
    pc_spec: "",
    brandName: "",
    productName: "",
    description: "",
    projectName: "",
    type: "",
    _id: "",
    users: [
      {
        id: "",
        name: "",
        role: "",
        mail: "",
      },
    ],
    isPackagingDataCompleted: false,
    isFormulationDataCompleted: false,
    isCalculatedButtonClicked: false,
    isFormulationCalculated: false,
    isFormulationEOLCalculated: false,
    isGreenChemistryCalculated: false,
    isGreenChemistryRollupCalculated: false,
    isLCACalculated: false,
    isPackagingCalculated: false,
    isSpiceCalculated: false,
    isSustainabilityPackagingCalculated: false,
    isSustainabilityPackagingRollupCalculated: false,
  });
  const [deleteHideButton, setDeleteHideButton] = useState(false);
  const [initialProductValues, setInitialProductValues] = useState<Product>({
    projectId: "",
    brandName: "",
    productName: "",
    description: "",
    projectName: "",
    _id: "",
  });
  const handleMoreHorizClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowData: ExperimentalDataItem
  ) => {
    setSlcRow(rowData); // store only for selected item
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget); // anchor position
  };
  
  const handleCardClick = async (row: ExperimentalDataItem) => {

    await TrackGoogleAnalyticsEvent("PAGE_VIEW", "Product Detail", {
      loginUserName,
      PAGE_VIEW: `/product-detail/${row._id}`,
    });

    // Navigate to product detail page
    navigate(`/product-detail/${row._id}`, { state: { row } });
    window.scrollTo(0, 0);
  };

  const handleOpenDialog = (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    initialValues: Product
  ) => {
    ev.stopPropagation();
    setInitialProductValues(initialValues);
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleOpenDeletePopup = (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string
  ) => {
    // Handle open delete popup action here
    ev.stopPropagation();
    setProductId(id);
    setDeletePopupOpen(true);
    handleMenuClose();
  };
  const handleMenuClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (
      event &&
      'stopPropagation' in event &&
      (reason === 'backdropClick' || reason === 'escapeKeyDown')
    ) {
      event.stopPropagation();
    }
    setAnchorEl(null);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    // Handle form submission here, for example, send the product data to your backend
  };

  const handleCloseDeletePopup = () => {
    setDeletePopupOpen(false);
    setDeleteHideButton(false)
  };

  const handleDelete = async () => {
    setDeleteHideButton(true)
    //START CODE - DELETE RECORD
    if (productId) {
      try {
        const response = await axios.delete(
          `${ApiEndPointsURL}${ApiEndPoints.product_delete}${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 204) {
          toast.success("Product details deleted successfully");
          setTimeout(() => {
            refetch();
            setDeletePopupOpen(false);
            setTimeout(() => {
              setDeleteHideButton(false)
            }, 500);
          }, ToastMessageNotificationTime);
        } else {
          toast.warning(
            "Error occured while deleting the product details, please try again!"
          );
          setDeletePopupOpen(false);
          setDeleteHideButton(false)
        }
      } catch (ex) {
        toast.warning(
          "Error occured while deleting the product details, please try again!"
        );
      }
    } else {
      toast.warning(
        "Error occured while deleting the product details, please try again!"
      );
      setDeletePopupOpen(false);
      setDeleteHideButton(false)
    }
    //END CODE - DELETE RECORD
  };
  
  return (
    <>
      <Grid className="product-grid-container">
      <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
  slotProps={{
    paper: {
      elevation: 0,
      sx: {
        boxShadow: 'none !important',
        width: "100px",
        fontFamily: "kenvue-sans-regular",
        fontWeight: 400,
        fontSize: "16px",
        letterSpacing: "0%",
        border: '1px solid #BFBFBF',
      }
    }
  }}
>
  <MenuItem
    onClick={(ev) => handleOpenDialog(ev, {
      productName: slcRow.productName ?? "",
      brandName: slcRow.brandName ?? "",
      projectId: slcRow.projectId ?? "",
      description: slcRow.description ?? "",
      projectName: slcRow.projectName ?? "",
      _id: slcRow._id,
    })}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '5px 10px',
    }}
  >
    <span className="menu_edit_delete_label">Edit</span>
    <ModeEditOutlinedIcon style={{ width: '19px', height: '19px' }} />
  </MenuItem>

  <Divider />

  <MenuItem
    onClick={(ev) => handleOpenDeletePopup(ev, slcRow._id)}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '5px 10px',
    }}
  >
    <span className="menu_edit_delete_label">Delete</span>
    <img
      src={deleteIcon}
      alt="Delete"
      style={{ width: '19px', height: '19px', paddingBottom: "0px" , paddingLeft: "5px"}}
    />
  </MenuItem>
</Menu>

        {props?.map((row: ExperimentalDataItem, row_index: number) => (
          // <Grid item xs={12} sm={6} md={4} lg={4} key={rowIndex}>
          <div className="card-container" data-testid="product-card" key={row_index + 1}>

            <CardContent
              className="card-content"
              onClick={() => handleCardClick(row)}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "self-start" }}>
                <Box sx={{ display: "flex", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Chip label={row.type} sx={{ backgroundColor: row.type === 'Final' ? "#00B097 !important" : "#D3BDF2 !important" }} className="custom-chip" />
                  <div className="date-label">
                    <span className="gridsorting">
                      {sort_order === "Created Date" ? "Date Created:" : "Date Modified:"} &nbsp;
                      {sort_order === "Created Date" ? formatDate(row.createdAt) : formatDate(row.updatedAt)}
                    </span>

                  </div>

                  {CheckCRUDAccess(row.users, "product") === 1 && (
                    <IconButton data-testid="more-horiz-icon"
                   onClick={(e) => handleMoreHorizClick(e, row)}
                 >
                   <MoreHorizIcon />
                 </IconButton>
                 
                  )}

                </Box>
            

                <Box sx={{ display: "flex", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <div className="section">
                    <div className="brand-name" data-testid="truncated-text">{truncate(row.brandName, 22)}</div>
                    <div className="id-value" data-testid="truncated-text">{truncate(row.productName, 50)}</div>
                  </div>
                </Box>
                <Box sx={{ display: "flex", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap:"24px" }}>
                  <div className="section">
                    <div className="id-label">SIP ID</div>
                    <div className="id-value">{row.productSipId}</div>
                  </div>
                  <div className="section">
                    <div className="id-label">Project ID</div>
                    <div className="id-value">{truncate(row.projectId, 12) || "N/A"}</div>
                  </div>
                </Box>
                <Box sx={{ display: "flex", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <AvatarGroup data-testid="avatar-group" max={4} className="custom-avatar-group">
                    {row.users.map((user: RowUsers, index: number) => (
                      <Avatar data-testid="user-avatar" key={index + 1} title={user.name} className="user-avatar">
                        {getAvatarLetters(user?.name)}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </Box>
                <Box sx={{ display: "flex", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <div className="section">
                    <div className="description-title">Description</div>
                    <div className="description-text">{truncate(row.description, 100) || "N/A"}</div>
                  </div>
                </Box>
              </Box>

            </CardContent>
          </div>
          // </Grid>

        ))}
      </Grid>
      <Popup
        key={dialogKey}
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        initialValues={initialProductValues}
        refetch={refetch}
      />
      <DeletePopupBox
        open={deletePopupOpen}
        onClose={handleCloseDeletePopup}
        onDelete={handleDelete}
        dialogTitle="Warning"
        dialogContent={WARNING_MSG_DELETE_PRODUCT}
        deleteHideButton={deleteHideButton}
      />
      {getToastContainer()}
    </>
  );
}
