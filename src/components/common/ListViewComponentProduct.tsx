import {
  Chip,
  MenuItem,
  IconButton,
  Menu,
  Divider,
  ListItem,
  ListItemText,
  List,
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
import "../../assets/css/listViewComponent.scss"
import axios from "axios";
import {
  ApiEndPoints,
  ApiEndPointsURL,
  ToastMessageNotificationTime,
} from "../../constants/ApiEndPoints.constant";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { deepPurple } from "@mui/material/colors";
import {
  formatDate,
  truncate,
  getToastContainer
,
  CheckCRUDAccess,
  getAvatarLetters,
} from "../../helper/GenericFunctions";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import { ExperimentalDataItem, RowUsers, PropsType } from "../breadcrumb/types";
import { Product } from "../../structures/allproduct";
import { DeletePopupBox } from "../modal";
import { TrackGoogleAnalyticsEvent } from "./TrackGoogleAnalyticsEvent";

export default function ListviewCard({
  props,
  pageRouter,
  sort_order,
  refetch,
}: Readonly<PropsType>) {
  const dialogKey = 0;

  const [productId, setProductId] = useState<string>();
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [deleteHideButton, setDeleteHideButton] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { loggedInUser } = useGlobaldata();
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
        id:"",
        name: "",
        role: "",
        mail: "",
      },
    ],
    productSipId: "",
    sku_erp_code: "",
    isCalculating: false,
    isEdited: false,
    createdBy: "",
    isFormulationDataCompleted: false,
    isPackagingDataCompleted: false,
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
  
  const handleOpenDialog = (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    initialValues: Product
  ) => {
    ev.stopPropagation();
    setInitialProductValues(initialValues);
    setDialogOpen(true);
    handleMenuClose();
  };
  const { token } = useGlobaldata();
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
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleCloseDialog = () => {
    // setDialogKey((prevKey=>prevKey+1))
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    // Handle form submission here, for example, send the product data to your backend
  };

  const handleCloseDeletePopup = () => {
    setDeletePopupOpen(false);
     setDeleteHideButton(false)
  };
  const handleCardClick = async (row: ExperimentalDataItem) => {
    // Determine the path dynamically based on `pageRouter`
    const pagePath =
      pageRouter === "myproduct"
        ? `/my-product-detail/${row._id}`
        : `/product-detail/${row._id}`;
  
    // Track the event with the correct path
    await TrackGoogleAnalyticsEvent("PAGE_VIEW", "Product Detail", {
      loginUserName,
      PAGE_VIEW: pagePath, // Use the dynamically determined path
    });
  
    // Navigate to the correct page
    navigate(pagePath, { state: { row } });
  };
  

  const [showAll, setShowAll] = React.useState<boolean[]>(
    props?.map(() => false)
  );
  const toggleShowAll = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    index: number
  ) => {
    event.stopPropagation();
    event.preventDefault();
    const updatedShowAll = [...showAll];
    updatedShowAll[index] = !updatedShowAll[index];
    setShowAll(updatedShowAll);
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

        if (response.status === 204 || response.statusText === "Deleted") {
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
        setDeletePopupOpen(false);
        setDeleteHideButton(false)
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
       <Menu
                      slotProps={{
                        paper: {
                          elevation: 0,
                          sx: {
                            boxShadow: 'none !important',
                            fontFamily: "kenvue-sans-regular",
                            fontWeight: 400,
                            fontSize: "16px",
                            letterSpacing: "0%",
                            border: '1px solid #BFBFBF',
                          }
                        }
                      }}
                      style={{
                        display: "block",
                        padding: "0px",
                      }}
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
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MenuItem
                        style={{
                          display: "block",
                          width: "100px",
                          padding: "4px 10px",
                        }}
                        onClick={(ev) =>
                          handleOpenDialog(ev, {
                            productName: slcRow.productName ?? "",
                            brandName: slcRow.brandName ?? "",
                            projectId: slcRow.projectId ?? "",
                            description: slcRow.description ?? "",
                            projectName: slcRow.projectName ?? "",
                            _id: slcRow._id,
                          })
                        }
                        className="menu_edit_delete_label"
                      >
                        Edit
                        <ModeEditOutlinedIcon
                          style={{ width: "15px", float: "right" }}
                        ></ModeEditOutlinedIcon>
                      </MenuItem>

                      <Divider />

                      <MenuItem
                        style={{
                          display: "block",
                          width: "100px",
                          padding: "4px 10px",
                        }}
                        onClick={(ev) => handleOpenDeletePopup(ev, slcRow._id)}
                        className="menu_edit_delete_label"
                      >
                        <span>Delete</span>
                        <img src={deleteIcon} alt="Delete" style={{ width: "15px", float: "right", marginTop: "4px" }}
                        />
                      </MenuItem>

                      {/* Add more menu items as needed */}
                    </Menu>
      {props?.map((row: ExperimentalDataItem, index: number) => (
        <div
          style={{
            position: "relative",
            zIndex: "1",
            alignContent: "center",
            //left: "20px",
            border: "solid 1px",
            borderRadius: "32px",
            marginTop: "10px",
            minHeight: "auto",
            maxHeight: "auto",
            padding: "16px",
            maxWidth:"1305px"
          }}
          key={row._id}
        >
          <div
            style={{
              cursor: "pointer",
              display: "block",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center" /*, marginTop: "10px"*/,
              }}
            >
              <Chip sx={{ backgroundColor: row.type === 'Final' ? "#00B097 !important" : "#D3BDF2 !important", }}
                style={{
                  
                  marginLeft: "15px",
                  marginTop: "0px",
                  height: "20px",
                  marginRight: "5px",
                  fontFamily: "kenvue-sans-regular",
                  fontSize: "14px",
                  width: "auto",
                }}
                label={row.type}
                variant="outlined"
              />
              <div
                style={{
                  fontFamily: "kenvue-sans-regular",
                  fontSize:"13.33px",
                  width: "-webkit-fill-available",
                  paddingLeft: "5px",
                }}
              >
                <span
                  style={{
                    fontFamily: sort_order === "Modified Date" ? "kenvue-sans" : "kenvue-sans-regular",
                  }}
                >
                  Date Modified: &nbsp; {formatDate(row.updatedAt)}
                </span>{" "}
                |{" "}
                <span
                  style={{
                    fontFamily: sort_order === "Created Date" ? "kenvue-sans" : "kenvue-sans-regular",
                  }}
                >
                  Date Created: &nbsp; {formatDate(row.createdAt)}{" "}
                </span>
              </div>

              {CheckCRUDAccess(row.users, "product") === 1 && (
                <>
                  {/** START CODE - 3 DOTS */}
                  <div style={{ marginLeft: "10px", width: "5%" }}>
                    <IconButton data-testid="more-horiz-icon"
                      onClick={(e) => handleMoreHorizClick(e, row)}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MoreHorizIcon style={{ color: "black" }} />
                    </IconButton>
                   
                  </div>
                  {/** END CODE - 3 DOTS */}
                </>
              )}
            </div>
          </div>

          <List
            onClick={() => handleCardClick(row)}
            component="nav"
            aria-label="products"
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
              paddingTop: "0px",
            }}
          >
            {/* 1st section */}
            <div style={{ flex: "1", width: "50%", alignItems: "center" }}>
              <ListItem>
                <ListItemText
                  primary={
                    <span
                      style={{
                        fontWeight: "700",
                        fontFamily: "kenvue-sans",
                        fontSize: "23.4px",
                      }}
                    >
                      {row.brandName}
                    </span>
                  }
                  secondary={
                    <span
                      style={{
                        color: "black",
                        fontFamily: "kenvue-sans-regular",
                        fontSize:'16px'
                      }}
                    >
                      {row.productName}
                    </span>
                  }
                />
              </ListItem>

              {showAll[index] ? (
                <ListItem>
                  <ListItemText
                    primary={
                      <span
                        style={{
                          fontWeight: "700",
                          fontFamily: "kenvue-sans",
                          whiteSpace: "pre-wrap",
                          fontSize: "19.02px",
                        }}
                      >
                        Description
                      </span>
                    }
                    secondary={
                      <span
                        style={{
                          fontFamily: "kenvue-sans-regular",
                          fontSize:'16px',
                          position: "relative",
                          color: "black",
                          top: "8px",
                        }}
                      >
                        {row.description === ""
                          ? "N/A"
                          : truncate(row.description, 140)}
                      </span>
                    }
                  />
                </ListItem>
              ) : (
                ""
              )}
              <button
                style={{
                  display: "flex",
                  margin: "00px 0px 0px 11px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  background:'none',
                  border:'none'
                }}
                onClick={(e) => toggleShowAll(e, index)}
              >
                {showAll[index] ? (
                  <>
                    <p style={{ fontFamily: "kenvue-sans-regular" }}>
                      See Less
                    </p>
                    <KeyboardArrowUpIcon
                      style={{
                        marginTop: "17px",
                        paddingLeft: "2px",
                        height: "max-content",
                        alignItems: "center",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <p style={{ fontFamily: "kenvue-sans-regular" }}>
                      See More
                    </p>
                    <KeyboardArrowDownIcon
                      style={{
                        marginTop: "17px",
                        paddingLeft: "2px",
                        height: "max-content",
                        alignItems: "center",
                      }}
                    />
                  </>
                )}
              </button>
            </div>

            <div
              style={{
                width: "1px",
                marginRight: "15px",
                marginBottom: "15px",
                marginTop: "15px",
                backgroundColor: "#ccc",
              }}
            ></div>
            {/* 2nd section */}
            <div
              style={{
                display: "flex",
                width: "30%",
                alignItems: "center",
              }}
            >
              <ListItem style={{ display: "block" }}>
                <ListItemText
                  primary={
                    <div style={{ display: "flex", alignItems: "center", maxHeight: "28px" }}>
                      <span
                        style={{
                          fontWeight: "700",
                          fontFamily: "kenvue-sans",
                          fontSize: "19.02px",
                          whiteSpace:"nowrap"
                        }}
                      >
                        SIP ID
                      </span>
                      <p
                        style={{
                          paddingLeft: "10px",
                          fontFamily: "kenvue-sans-regular",
                          fontSize: "16px",
                        }}
                      >
                        {row.productSipId}
                      </p>
                    </div>
                  }
                />
                <ListItemText
                  primary={
                    <div style={{ display: "flex", alignItems: "center", maxHeight: "28px" }}>
                      <span
                        style={{
                          fontWeight: "700",
                          fontFamily: "kenvue-sans",
                          fontSize: "19.02px",
                        }}
                      >
                        Project ID
                      </span>
                      <p
                        style={{
                          paddingLeft: "10px",
                          fontFamily: "kenvue-sans-regular",
                          fontSize: "16px",
                        }}
                      >
                        {row.projectId === "" ? "N/A" : truncate(row.projectId, 15)}
                      </p>
                    </div>
                  }
                />
              </ListItem>
            </div>
            <div
              style={{
                width: "1px",
                marginRight: "15px",
                marginTop: "15px",
                marginBottom: "15px",
                backgroundColor: "#ccc",
              }}
            ></div>

            {/* 3rd section */}
            <div
              style={{
                display: "flex",
                width: "20%",
                alignItems: "center",
              }}
            >
              <ListItem>
                <AvatarGroup data-testid="avatar-group"
                  max={4}
                  spacing={-2}
                  sx={{
                    "& .MuiAvatarGroup-avatar": { borderColor: "#BFBFBF" },
                  }}
                  className="custom-avatar-group-listview"
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
                  {row.users?.map(
                    (row_user: RowUsers) => (
                      <Avatar data-testid="user-avatar"
                        key={row_user?.id}
                        sx={{ bgcolor: deepPurple[500], zIndex: "-2" }}
                        title={row_user.name}
                        className="user-avatar"
                      >
                        {getAvatarLetters(row_user.name)}
                      </Avatar>
                    )
                  )}
                </AvatarGroup>
              </ListItem>
            </div>
          </List>
        </div>
      ))}

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
