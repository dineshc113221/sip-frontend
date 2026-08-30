import * as React from "react";
import { Divider } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import "../../assets/css/Style.scss";
import ListViewComponentExperimental from "../common/ListViewComponentExperimental";
import InfiniteScroll from "react-infinite-scroll-component";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import step_assessment from "../../assets/images/step_assessment.svg";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import LightTooltipComponent from "../common/LightTooltipComponent";
import {
  ExperimentalDataItem,
  ExperimentalAsseTabsComponentProps,
} from "./types";
import { GridViewComponentExperimental } from "../common/GridViewComponentExperimental";

const ExperimentalAsseTabsComponent: React.FC<
  ExperimentalAsseTabsComponentProps
> = (props) => {
  const [step2Open, setStep2Open] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [value, setValue] = useState("Modified Date");
  const [gridViewOpen, setGridViewOpen] = useState<boolean>(true);
  const [listViewOpen, setListViewOpen] = useState<boolean>(false);
  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState(0);

  const [containsLPP, setContainsLPP] = useState<boolean>(false);
  useEffect(() => {
    setItems(props?.ExperimentalData?.slice(0, visibleItems));
  }, [visibleItems, props?.ExperimentalData?.length, props]);
  useEffect(() => {
    // Set visibleItems to the length of items when items are updated
    if (props?.ExperimentalData) {
      setVisibleItems(props.ExperimentalData.length);
      const getLPP: boolean = !!props.ExperimentalData.find(e => e.isLPP);
      setContainsLPP(getLPP)
    }
  }, [props?.ExperimentalData]);

  const loadMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 4);

    props?.ExperimentalData?.length > 0 ? setHasMore(true) : setHasMore(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    let copyArrayvalue: ExperimentalDataItem[] = [];
    setValue(event.target.value);
    const sortDirection = event.target.value;

    copyArrayvalue = (props?.ExperimentalData ?? [])
      .sort((a, b) => {
        switch (sortDirection) {
          case "Modified Date": {
            const convertDateA = a.updatedAt
              ? new Date(a.updatedAt)
              : new Date(0);
            const convertDateB = b.updatedAt
              ? new Date(b.updatedAt)
              : new Date(0);
            return (
              new Date(convertDateA).getTime() -
              new Date(convertDateB).getTime()
            );
          }

          case "A-Z":
            return b.name.localeCompare(a.name, "en", { numeric: true });

          case "Created Date": {
            const createdDateA = a.createdAt
              ? new Date(a.createdAt)
              : new Date(0);
            const createdDateB = b.createdAt
              ? new Date(b.createdAt)
              : new Date(0);
            return (
              new Date(createdDateA).getTime() -
              new Date(createdDateB).getTime()
            );
          }

          default:
            return 0;
        }
      })
      .reverse();

    setItems(copyArrayvalue);
  };

  const GridViewOpenClick = () => {
    if (gridViewOpen) {
      setGridViewOpen(false);
    }
    setGridViewOpen((prevState) => !prevState);
    setListViewOpen(false);
  };

  const ListViewOpenClick = () => {
    if (listViewOpen) {
      setListViewOpen(false);
    }
    setListViewOpen((prevState) => !prevState);
    setGridViewOpen(false);
  };

  const commonFontStyle = {
    fontFamily: "kenvue-sans-regular",
    fontSize: "16px",
    backgroundColor: "transparent",
  };

  const getBannerTags = (header, subHeader) => {
    return <Stack sx={{ width: "100%", paddingTop: "15px" }} spacing={2}>
      <Collapse
        in={step2Open}
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
                setStep2Open(false);
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
                  alt="assessment"
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
                  {header}
                </span>
              </div>
            </div>
          </AlertTitle>
          <span
            style={{
              fontFamily: "kenvue-sans-regular",
              fontSize: "13.33px",
              fontWeight: "400",
              color: "#000000",
              paddingLeft: "70px",
            }}
          >
            {subHeader}
          </span>
        </Alert>
      </Collapse>
    </Stack>
  }

  return (
    <>
      <div className="Experimental-starts">
        <div className="Experimental-1">
          <span className="Experimental-2">
            {"Experimental Assessments"}
          </span>

          <LightTooltipComponent

            tooltipkey="3"
            title="Step 2:"
            subTitle="Add your Experimental Assessments (Design)"
            contents="Use this space to assess your product prototypes."
          />

        </div>
        <div className="Experimental-3">
          {/* GridView Open and Close */}
          <div className="Experimental-4">
            <span
              style={{
                display: "flex",
                ...commonFontStyle,
              }}
            >
              Product Sort:
            </span>
            <div className="Experimental-5">
              <FormControl
                sx={{
                  // m: 1,

                  border: "none",
                  "& fieldset": {
                    border: "none",
                  },
                }}
              >
                <Select
                  style={{ height: "28px", border: "none", ...commonFontStyle }}
                  value={value}
                  IconComponent={ExpandMoreIcon}
                  onChange={handleChange}
                >
                  <MenuItem style={commonFontStyle} value={"Modified Date"}>
                    Modified Date
                  </MenuItem>

                  <MenuItem style={commonFontStyle} value="A-Z">
                    A-Z
                  </MenuItem>

                  <MenuItem style={commonFontStyle} value={"Created Date"}>
                    Created Date
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {gridViewOpen ? (
              <button
                onClick={GridViewOpenClick}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  display: "flex",
                  textDecorationColor: "#6CC24A",
                  border: "none",
                  borderBottom: "2px solid #00B097",
                  borderWidth: "7%",
                  marginRight: "auto",
                  float: "right",
                  ...commonFontStyle,
                }}
              >
                {" "}
                <AppsIcon style={{ marginLeft: "0px" }} />{" "}
                <span style={{ marginLeft: "3px" }}>
                  <span style={{ fontFamily: "kenvue-sans", fontWeight: "700" }}>Grid View</span>
                </span>
              </button>
            ) : (
              <button
                onClick={GridViewOpenClick}
                style={{
                  // marginLeft: "60px",
                  cursor: "pointer",
                  alignItems: "center",
                  display: "flex",
                  marginRight: "auto",
                  float: "right",
                  border: "none",
                  borderBottom: "none",
                  ...commonFontStyle,
                }}
              >
                {" "}
                <AppsIcon style={{ marginLeft: "0px" }} />{" "}
                <span style={{ marginLeft: "3px" }}> Grid View</span>
              </button>
            )}
          </div>

          {/* ,ListView Open and Close */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {listViewOpen ? (
              <button
                onClick={ListViewOpenClick}
                style={{
                  // marginRight: "36px",
                  float: "right",
                  cursor: "pointer",
                  marginLeft: "0px",
                  alignItems: "center",
                  display: "flex",
                  textDecorationColor: "#6CC24A",
                  border: "none",
                  borderBottom: "2px solid #00B097",
                  borderWidth: "71%",
                  ...commonFontStyle,
                }}
              >
                <FormatListBulletedIcon />{" "}
                <span style={{ marginLeft: "5px" }}>
                  <span style={{ fontFamily: "kenvue-sans", fontWeight: "700" }}>List View</span>
                </span>
              </button>
            ) : (
              <button
                onClick={ListViewOpenClick}
                style={{
                  float: "right",
                  cursor: "pointer",
                  alignItems: "center",
                  display: "flex",
                  border: "none",
                  borderBottom: "none",
                  ...commonFontStyle,
                }}
              >
                <FormatListBulletedIcon />
                <span style={{ marginLeft: "2px" }}> List View</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <br />
      <Divider />
      <br />

      {
        props?.ExperimentalData?.length > 0 && !containsLPP && getBannerTags("Step 3: Identify your Locked Product Prototype (Design)", "This is the single experimental assessment you designate as the locked product prototype (LPP) to measure others against.")
      }

      {items?.length > 0 ? (
        <>
          <span
            style={{
              fontFamily: "kenvue-sans-regular",
              fontWeight: "400",
              fontSize: "13.33px",
              marginLeft: "8px",
              marginBottom: "10px",
            }}
          >
            {items?.length > 0 && items ? `${items?.length} Assessments` : " "}
          </span>

          <InfiniteScroll
            dataLength={items.length}
            next={loadMore}
            hasMore={hasMore}
            loader={""}
            style={{ overflow: "hidden" }}
          >
            {gridViewOpen ? (
              <div style={{ marginTop: "24px" }}>
                <GridViewComponentExperimental
                  props={items}
                  varProductData={props.varproductData}
                  refetch={props.refetch}
                  varUserCRUDAccess={props.varUserCRUDAccess}
                  sort_order={value}
                  containsLPP={containsLPP}
                />
              </div>
            ) : (
              <div style={{
                paddingRight: "24px", gap: "24px", display: "grid", marginTop: "24px",
              }}>
                <ListViewComponentExperimental
                  props={items}
                  varProductData={props.varproductData}
                  refetch={props.refetch}
                  varUserCRUDAccess={props.varUserCRUDAccess}
                  sort_order={value}
                  containsLPP={containsLPP}
                />
              </div>
            )}
          </InfiniteScroll>
          {/* Load more section */}
        </>
      ) : (
        <>
          {/**START CODE - STEP2 MESSAGE */}
          {getBannerTags("Step 2: Add your experimental assessments (Design)", "Use this space to assess your product prototypes.")}
        </>
      )}
      <br />
    </>
  );
};

export default ExperimentalAsseTabsComponent;
