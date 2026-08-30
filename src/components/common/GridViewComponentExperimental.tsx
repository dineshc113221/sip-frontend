import {
  Grid,
  CardContent,
  Chip,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import * as React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import complete from "../../assets/images/complete.svg";
import incomplete from "../../assets/images/incomplete.svg";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { WARNING_MSG_DELETE_EXP_ASSESSMENT } from "../../constants/ExperimentalTooltip.constant";
import deleteIcon from "../../assets/images/delete-pacaking.svg"
import lppIcon from "../../assets/images/lpp.svg";
import lppTag from "../../assets/images/lpp_tag.svg";
import useTruncateValue, { formatDate, getTheme, truncate } from "../../helper/GenericFunctions";
import DeletePopupBox from "../modal/PopupComponentDelete";
import "react-toastify/dist/ReactToastify.css";
import {
  GridViewComponentExperimentalProps,
  ExperimentalDataItem,
} from "../breadcrumb/types";
import { BootstrapTooltip } from "../../constants/Formula.constant";
import { useExperimentalAssessment } from "../../hooks/useExperimentalAssessment";
import "../../assets/css/product-detail-page.scss";
import { TrackGoogleAnalyticsEvent } from "./TrackGoogleAnalyticsEvent";
import { useGlobaldata } from "../../contexts/masterData/DataContext";

export interface EditProductAssessment {
    productSipId: string;
    assessmentId: string;
    fg_spec?: string;
    formula_number?: string;
    lab_notebook_code?: string;
    pc_spec?: string;
    sku_erp_code?: string;
    zone?: string;
    net_content?: string;
    type?: string;
    name?: string;
    isLPP?: boolean;
}

export const GridViewComponentExperimental: React.FC<
  GridViewComponentExperimentalProps
> = ({ props, varProductData, varUserCRUDAccess, sort_order, refetch, containsLPP }) => {
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
  const truncateValue = useTruncateValue();
  const muiBaseTheme = { spacing: { unit: 8 } }; // Example theme
  getTheme(muiBaseTheme); // Use getTheme within the component
  const { loggedInUser } = useGlobaldata();
  const loginUserName = React.useMemo(() => {
    return (
      loggedInUser?.displayName
    );
  }, [loggedInUser?.displayName]);


  const handleCardClick = async (rowValue, varproductData) => {
    // Prevent navigation if there's a text selection
    if (window.getSelection().toString()) {
      return;
    }
  
    // Determine the path dynamically
    const pagePath = `/product-assessment/${rowValue.assessmentId}`;
  
    // Track the event with the correct path
    await TrackGoogleAnalyticsEvent("PAGE_VIEW", "Product Assessment", {
      loginUserName,
      PAGE_VIEW: pagePath,
    });
  
    // Navigate to the appropriate page
    navigate(pagePath, {
      state: {
        ...varproductData,
        experimentalName: rowValue.name,
        experimentalID: rowValue._id,
      },
    });
  };

  return (
    <>
      {experimentalData?.length > 0 ? (
        <Grid
          container
          spacing={0} // Remove extra spacing from the Material-UI Grid
          className="responsive-grid-container"
          alignItems="stretch"
        >
          {experimentalData?.map((rowValue: ExperimentalDataItem, rowValueIndex: number) => (
            <div

              key={`${rowValue._id} + ${rowValueIndex}`}
              className="responsive-card"
            >
              <CardContent
                className={"MuiCardContent-root"}
                style={{ cursor: "pointer", padding: "20px", height: "100%" }}
                onClick={() => handleCardClick(rowValue, varproductData)}
              >
                <Grid container spacing={2} style={{ gap: "24px", padding: "20px 0px 0px 20px" }}>
                  <div className="Baseline-1">
                    <div className="Baseline-2" style={{width: "90%", flexFlow: "wrap", flexWrap: "wrap"}}>
                      <Chip
                        className="Baseline-3"
                        label="Experimental"
                        variant="outlined"
                      />
                      {
                      rowValue?.isLPP && <Chip
                          className="Baseline-4"
                          sx={{ backgroundColor: "#FFB81A !important" }}
                          label={"LPP"}
                          variant="outlined"
                        />
                      }
                      {rowValue.zone && (
                        <Chip
                          className="Baseline-4"
                          sx={{ backgroundColor: "#F8F8F8 !important" }}
                          label={truncate(rowValue.zone, 20)}
                          variant="outlined"
                        />
                      )}
                      {rowValue?.net_content.split(" ")[0] && (
                        <Chip
                          className="Baseline-4"
                          sx={{ backgroundColor: "#F8F8F8 !important" }}
                          label={rowValue.net_content}
                          variant="outlined"
                        />
                      )}
                    </div>
                    {rowValue?.isLPP && <img className="Baseline-8" src={lppTag} alt="lpp" style={{ width: "32px", height: "32px" }} />}
                    {varUserCRUDAccess === 1 && (
                      <div className="Baseline-5" style={{margin: "4px 6px 0px 10px"}}
                      >
                        <IconButton data-testid="more-horiz-icon"
                          style={{ padding: "0px" }}
                          aria-label="more"
                          id="long-button"
                          aria-controls={
                            open1 ? "long-menu" : undefined
                          }
                          aria-expanded={open1 ? "true" : undefined}
                          aria-haspopup="true"
                          onClick={(e) =>
                            handleMoreHorizClick(e, {
                              assessmentId: rowValue._id,
                            })
                          }
                          onMouseDown={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <MoreHorizIcon style={{ color: "black" }} />
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
                          open={Boolean(anchorEl) && slcRowExp?.assessmentId === rowValue._id}
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
                                gridTemplateColumns: "6fr 1fr"
                            }}
                            onClick={() => handleLPP(varProductData, rowValue)}
                            disabled={containsLPP && !rowValue?.isLPP}
                            className="menu_item_label_list"
                          >
                            <span className="menu_edit_delete_label">{rowValue?.isLPP ? "Unmark as LPP" : "Mark as LPP"}</span>
                            <img className="menu_list_img" src={lppIcon} alt="lpp" />
                          </MenuItem>
                          <MenuItem
                            style={{
                              gridTemplateColumns: "6fr 1fr"
                            }}
                            onClick={(ev) =>
                              handleOpenDeletePopup(ev, {
                                productID: varproductData.productID,
                                productSipId:
                                  varproductData.productSipId,
                                assessmentId: slcRowExp.assessmentId,
                                type: "Experimental",
                              })
                            }
                            className="menu_item_label_list"
                          >
                            <span className="menu_edit_delete_label">Delete</span>
                            <img className="menu_list_img" src={deleteIcon} alt="Component_delete" style={{ margin: "4px 6px 0px 0px" }} />
                          </MenuItem>
                        </Menu>
                      </div>
                    )}
                  </div>

                <div style={{paddingTop: "12px", width: "100%"}}>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <ListItemText
                      primary={
                        <span
                          className="header"
                          style={{
                            fontSize: "19.2px",
                            fontWeight: "400",
                            fontFamily: "kenvue-sans-regular",
                          }}
                        >
                          {truncate(rowValue.name, truncateValue)}
                        </span>
                      }
                    />
                  </div>

                <div style={{paddingTop: "12px"}}>
                  <div>
                    <div className="Baseline-11">
                      <span className="Baseline-12"
                      >
                        SIP ID :
                      </span>
                      <span className="Baseline-13">
                        {rowValue.assessmentId}
                      </span>
                    </div>
                    <div className="Baseline-14">
                      <span className="Baseline-12">
                        FG Spec :
                      </span>
                      <span className="Baseline-13">
                        {rowValue.fg_spec}
                      </span>
                    </div>
                    <div className="Baseline-14">
                      <span className="Baseline-12">
                        Formula Number :
                      </span>
                      <span className="Baseline-13">
                        {rowValue.formula_number}
                      </span>
                    </div>
                    <div className="Baseline-14" >
                      <span className="Baseline-12">
                        Lab Notebook Code :
                      </span>
                      <span className="Baseline-13">
                        {rowValue.lab_notebook_code}
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
                            {rowValue.pc_spec}
                          </p>
                        }
                        placement="top"
                        arrow
                      >
                        <span className="Baseline-13" data-testid="truncated-pc-spec"
                        >
                          {truncate(rowValue.pc_spec, 30)}
                        </span>
                      </BootstrapTooltip>
                    </div>
                  </div>
                 
                  <div className="Baseline-15" style={{paddingTop: "12px"}}>
                    <div className="Baseline-16">
                      <span className="Baseline-17">
                        Formula
                      </span>
                      <img
                        alt="formula status"
                        src={
                          rowValue.isFormulationDataCompleted
                            ? complete
                            : incomplete
                        }
                        style={{
                          marginLeft: "10px",
                        }}
                      />
                    </div>
                    <div className="Baseline-18">
                      <span
                        className="Baseline-17">
                        Packaging
                      </span>
                      <img
                        alt="packaging status"
                        src={
                          rowValue.isPackagingDataCompleted
                            ? complete
                            : incomplete
                        }
                        style={{
                          marginLeft: "10px",
                        }}
                      />
                    </div>
                  </div>

                  <div className="Baseline-19" style={{paddingTop: "12px"}}>
                    {sort_order === "Created Date" ? (
                      <>
                        <span className="Baseline-20">
                          Date Created: &nbsp;
                        </span>
                        <span className="Baseline-20">
                          &nbsp;{formatDate(rowValue.createdAt)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="Baseline-20">
                          Date Modified: &nbsp;
                        </span>
                        <span className="Baseline-20">
                          &nbsp;{formatDate(rowValue.updatedAt)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                </div>
                </Grid>
              </CardContent>
            </div>
          ))}
        </Grid>
      ) : (
        <div className="no-data-placeholder">
          <span>Nothing to see here yet!</span>
        </div>
      )}
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
};
