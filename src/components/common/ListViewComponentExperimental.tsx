import {
  Grid,
  Chip,
  ListItem,
  List,
  ListItemText,
  Menu,
  MenuItem,
  CardContent,
} from "@mui/material";
import * as React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { WARNING_MSG_DELETE_EXP_ASSESSMENT } from "../../constants/ExperimentalTooltip.constant";
import DeletePopupBox from "../modal/PopupComponentDelete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import complete from "../../assets/images/complete.svg";
import incomplete from "../../assets/images/incomplete.svg";
import deleteIcon from "../../assets/images/delete-pacaking.svg"
import "react-toastify/dist/ReactToastify.css";
import {
  GridViewComponentExperimentalProps,
  ExperimentalDataItem,
} from "../breadcrumb/types";
import { BootstrapTooltip } from "../../constants/Formula.constant";
import useTruncateValue, {
  truncate,
  formatDate,
  getExperimentalCardTheme,
} from "../../helper/GenericFunctions";
import { useExperimentalAssessment } from "../../hooks/useExperimentalAssessment";
import "../../assets/css/product-detail-page.scss";
import { TrackGoogleAnalyticsEvent } from "./TrackGoogleAnalyticsEvent";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import lppIcon from "../../assets/images/lpp.svg";
import lppTag from "../../assets/images/lpp_tag.svg";

export default function ListViewComponentExperimental({
  props,
  varProductData,
  sort_order,
  refetch,
  containsLPP
}: Readonly<GridViewComponentExperimentalProps>) {
  const navigate = useNavigate();
  const experimentalData = props;
  const varproductData = varProductData;
  const {
    anchorEl,
    open1,
    deletePopupOpen,
    slcRowExp,
    handleMoreHorizClick,
    handleOpenDeletePopup,
    handleMenuClose,
    handleDelete,
    handleLPP,
    handleCloseDeletePopup,
    deleteHideButton
  } = useExperimentalAssessment({ refetch });
  const { loggedInUser } = useGlobaldata();
  const loginUserName = React.useMemo(() => {
    return (
      loggedInUser?.displayName
    );
  }, [loggedInUser?.displayName]);
  const [showAll, setShowAll] = React.useState<boolean[]>(
    experimentalData.map(() => false)
  );
  const truncateValue = useTruncateValue();
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
  const handleCardClick = async (row, varproductData) => {
    // Prevent navigation if there's a text selection
    if (window.getSelection().toString()) {
      return;
    }

    // Determine the path dynamically
    const pagePath = `/product-assessment/${row.assessmentId}`;

    // Track the event with the correct path
    await TrackGoogleAnalyticsEvent("PAGE_VIEW", "Product Assessment", {
      loginUserName,
      PAGE_VIEW: pagePath,
    });

    // Navigate to the appropriate page
    navigate(pagePath, {
      state: {
        ...varproductData,
        experimentalName: row.name,
        experimentalID: row._id,
      },
    });
  };

  return (
    <>
      {experimentalData.map((row: ExperimentalDataItem, index: number) => (
        <CardContent className="List-view-starts"
          style={{ padding: "20px 24px 5px 24px" }}
          key={index + 1}
          onClick={() => handleCardClick(row, varproductData)}
        >
          <div className="list-1">
            <div className="list-2">
              <Chip
                className="list-3"
                label={"Experimental"}
                variant="outlined"
              />
              {
                row?.isLPP && <Chip
                  className="Baseline-4"
                  sx={{ backgroundColor: "#FFB81A !important", marginLeft: "8px" }}
                  label={"LPP"}
                  variant="outlined"
                />
              }
              <Grid item xs={6} sm={6}>
                <Grid container>
                  <Grid
                    className="list-4"
                  >
                    <span
                      className="header"
                      style={{
                        fontFamily:
                          sort_order === "Modified Date" ? "kenvue-sans" : "kenvue-sans-regular",
                        fontSize: "13.33px"
                      }}
                    >
                      Date Modified:
                    </span> &nbsp;
                    <span
                      className="header"
                      style={{
                        fontFamily:
                          sort_order === "Modified Date" ? "kenvue-sans" : "kenvue-sans-regular",
                        fontSize: "13.33px"
                      }}
                    >
                      {formatDate(row.updatedAt)}
                    </span>
                    <span
                      className="header"
                      style={{
                        fontFamily: sort_order === "Created Date" ? "kenvue-sans" : "kenvue-sans-regular",
                        fontSize: "13.33px"
                      }}
                    >
                      &nbsp;|&nbsp;Date Created:
                    </span>&nbsp;
                    <span
                      className="header"
                      style={{
                        fontFamily: sort_order === "Created Date" ? "kenvue-sans" : "kenvue-sans-regular",
                        fontSize: "13.33px"
                      }}
                    >
                      {formatDate(row.createdAt)}
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </div>
            <div className="lpp-icon-list">
              {row?.isLPP && <img className="Baseline-8" src={lppTag} alt="lpp" style={{ width: "32px", height: "32px", margin: 0 }} />}
            </div>
          </div>

          <List
            component="nav"
            aria-label="products"
            className="list-5"
          >
            <div className="list-6">
              <ListItem style={{ paddingLeft: "0px" }}>
                <ListItemText
                  primary={
                    <span className="list-7">
                      {truncate(row.name, truncateValue)}
                    </span>
                  }
                />
              </ListItem>
              {showAll[index] ? (
                <>
                  <div className="list-8">
                    <span className="list-9">
                      SIP ID :
                    </span>
                    <span className="list-10">
                      {row.assessmentId}
                    </span>
                  </div>
                  <div className="list-8">
                    <span className="list-9">
                      FG Spec :
                    </span>
                    <span className="list-10">
                      {row.fg_spec}
                    </span>
                  </div>
                  <div className="list-8">
                    <span className="list-9">
                      Formula Number :
                    </span>
                    <span className="list-10">
                      {row.formula_number}
                    </span>
                  </div>
                  <div className="list-8">
                    <span className="list-9">
                      Lab Notebook Code :
                    </span>
                    <span className="list-10">
                      {row.lab_notebook_code}
                    </span>
                  </div>
                  <div className="list-8">
                    <span className="list-9">
                      PC Spec :
                    </span>
                    <BootstrapTooltip
                      className="BootstrapTooltip"
                      title={
                        <p className="BootstrapTooltip-p">{row.pc_spec}</p>
                      }
                      placement="top"
                      arrow
                    >
                      <span data-testid="truncated-pc-spec" className="list-10">
                        {truncate(row.pc_spec, 30)}
                      </span>
                    </BootstrapTooltip>
                  </div>
                </>
              ) : (
                ""
              )}
              <button data-testid="see-more-toggle" className="list-81"
                style={{ background: "transparent", borderColor: "transparent" }}
                onClick={(e) => toggleShowAll(e, index)}
              >
                {showAll[index] ? (
                  <>
                    <p className="list-10" style={{ fontSize: "16px" }}>
                      See Less
                    </p>
                    <KeyboardArrowUpIcon
                      className="list-12"
                    />
                  </>
                ) : (
                  <>
                    <p className="list-10" style={{ fontSize: "16px" }}>
                      See More
                    </p>
                    <KeyboardArrowDownIcon
                      className="list-12"
                    />
                  </>
                )}
              </button>
            </div>

            <div className="list-13"
            ></div>

            <div className="list-14">
              <div className="list-15">
                {row.zone && (
                  <Chip className="list-16"
                    sx={{ backgroundColor: "#F8F8F8 !important" }}
                    label={row.zone}
                    variant="outlined"
                  />
                )}
                {row.net_content?.split(" ")[0] && (
                  <Chip className="list-16"
                    sx={{ backgroundColor: "#F8F8F8 !important" }}
                    label={row.net_content}
                    variant="outlined"
                  />
                )}
              </div>
            </div>
            <div className="list-17"></div>

            <div className="list-18">
              <ListItem className="list-19">
                <ListItemText
                  primary={
                    <div className="list-2">
                      <span
                        className="list-22">
                        Formula
                      </span>
                      <p
                        className="header"
                        style={{ height: "1px", paddingLeft: "40px", paddingBottom: "20px" }}
                      >
                        <img
                          alt="formula status"
                          src={
                            row.isFormulationDataCompleted
                              ? complete
                              : incomplete
                          }
                        />
                      </p>
                    </div>
                  }
                />
                <ListItemText
                  primary={
                    <div className="list-2">
                      <span
                        className="list-22">
                        Packaging
                      </span>
                      <p className="header" style={{ paddingLeft: "27px" }}>
                        <img
                          alt="packaging status"
                          src={
                            row.isPackagingDataCompleted ? complete : incomplete
                          }
                        />
                      </p>
                    </div>
                  }
                />
              </ListItem>
            </div>
            <div className="list-23">
              <IconButton
                data-testid="more-button"
                aria-label="more"
                id="long-button"
                aria-controls={open1 ? "long-menu" : undefined}
                aria-expanded={open1 ? "true" : undefined}
                aria-haspopup="true"
                onClick={(e) =>
                  handleMoreHorizClick(e, { assessmentId: row._id })
                }
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
              >
                <MoreHorizIcon style={{ color: "black" }} />
              </IconButton>
              <Menu
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
                open={Boolean(anchorEl) && slcRowExp?.assessmentId === row._id}
                onClose={handleMenuClose}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                sx={{
                    '& .MuiPaper-root': {
                       borderRadius: '0px',
                       boxShadow: "none",
                       border: "1px solid #BFBFBF",
                       width: "206px"
                     },
                     '& .MuiList-root': {
                       padding: "0px"
                     },
                }}
              >
                <MenuItem
                  style={{
                    borderBottom: "1px solid #BFBFBF",
                    gridTemplateColumns: "3fr 1fr"
                  }}
                  onClick={() => handleLPP(varProductData, row)}
                  disabled={containsLPP && !row?.isLPP}
                  className="menu_item_label_list"
                >
                  <span className="menu_edit_delete_label">{row?.isLPP ? "Unmark as LPP" : "Mark as LPP"}</span>
                  <img className="Baseline-8" src={lppIcon} alt="lpp" />
                </MenuItem>
                <MenuItem
                  style={{
                    gridTemplateColumns: "4fr 1fr"
                  }}
                  onClick={(ev) =>
                    handleOpenDeletePopup(ev, {
                      productID: varproductData.productID,
                      productSipId: varproductData.productSipId,
                      assessmentId: slcRowExp.assessmentId,
                      type: "Experimental",
                    })
                  }
                  className="menu_item_label_list"
                >
                  <span className="menu_edit_delete_label">Delete</span>
                  <img className="Baseline-8" src={deleteIcon} alt="Delete" />

                </MenuItem>
              </Menu>
            </div>
          </List>
        </CardContent>
      ))}
      <DeletePopupBox
        open={deletePopupOpen}
        onClose={handleCloseDeletePopup}
        onDelete={handleDelete}
        dialogTitle="Warning"
        dialogContent={WARNING_MSG_DELETE_EXP_ASSESSMENT}
        deleteHideButton={deleteHideButton}
      />
    </>
  );
}
ListViewComponentExperimental.getTheme = (muiBaseTheme: {
  spacing: { unit: number };
}) => getExperimentalCardTheme(muiBaseTheme);
