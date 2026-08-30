import { FormControl, MenuItem } from "@mui/material";
import * as React from "react";
import AppsIcon from "@mui/icons-material/Apps";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState, useEffect } from "react";
import "../../assets/css/Style.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfiniteScroll from "react-infinite-scroll-component";
import GridviewCard from "../common/GridViewComponentProduct";
import ListviewCard from "../common/ListViewComponentProduct";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import { ExperimentalDataItem } from "../breadcrumb/types";
import { AllProductDetails } from "../../structures/allproduct";
import { productSortFunction } from "./helper";
import "../../assets/css/index.scss";
import { TrackGoogleAnalyticsEvent } from "../common/TrackGoogleAnalyticsEvent";

const AllProductTabsComponent: React.FC<AllProductDetails> = (data) => {
  const { loggedInUser } = useGlobaldata();
  const loginUserEmail = loggedInUser?.mail;

  const [loginUserName, setLoginUserName] = React.useState(
    loggedInUser?.displayName
  );

  const [value, setValue] = useState("Modified Date");
  const [gridViewOpen, setGridViewOpen] = React.useState<boolean>(true);
  const [listViewOpen, setListViewOpen] = useState<boolean>(false);
  const [items, setItems] = useState<ExperimentalDataItem[]>([]);
  const [visibleItems, setVisibleItems] = useState(0);

  const [hasMore, setHasMore] = useState(true);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  useEffect(() => {
    // Set initial visible items based on the data length
    if (data?.product) {
      setVisibleItems(data.product.length);
    }
  }, [data?.product]);
  useEffect(() => {
    const trackEvent = async () => {
      await TrackGoogleAnalyticsEvent("PAGE_VIEW", "All Products", {
        loginUserName,
        PAGE_VIEW: "/allproduct",
      });
    };

    trackEvent();
    setLoginUserName(loggedInUser?.displayName);
    if (filterValue === null) {
      setItems(data?.product?.slice(0, visibleItems));
    } else {
      let copyArrayvalue: ExperimentalDataItem[] = [];
      copyArrayvalue = productSortFunction(data?.product, filterValue);
      setItems(copyArrayvalue);
    }
  }, [
    visibleItems,
    data?.product?.length,
    data,
    filterValue,
    loggedInUser?.displayName,
    loginUserName,
  ]);
  const loadMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 4);

    items.length > 0 ? setHasMore(true) : setHasMore(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
    const sortDirection = event.target.value;
    setFilterValue(sortDirection);
    let copyArrayvalue: ExperimentalDataItem[] = [];
    // Clone and sort to avoid mutating the original array
    copyArrayvalue = productSortFunction(
      [...(data?.product ?? [])],
      sortDirection
    );
    setItems(copyArrayvalue);
  };

  useEffect(() => {
    if (value === "Modified Date") {
      const copyArrayvalue: ExperimentalDataItem[] = [...data.product]
        .sort((a, b) => {
          const convertDate = a?.updatedAt ?? ""; //.replace(/(st|nd|rd|th)/, "");
          const convertDateB = b?.updatedAt ?? ""; //.replace(/(st|nd|rd|th)/, "");
          return (
            new Date(convertDate).getTime() - new Date(convertDateB).getTime()
          );
        })
        .reverse();
      setItems(copyArrayvalue.slice(0, visibleItems));
    }
  }, [data.product, value, visibleItems]);

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
  return (
    <>
      <div className="product-tab-sort-row">
        <div style={{ display: "flex" }}>
          <h2 style={{ fontSize: "33.18px", fontFamily: "kenvue-sans" }}>
            {"All Products"}
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "10px",
          }}
        >
          {/* GridView Open and Close */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="all_my_product_sort_grid_list_label1" style={{}}>
              Product Sort:
            </div>
            <div style={{}}>
              <FormControl
                sx={{
                  m: 0,
                  border: "none",
                  "& fieldset": {
                    border: "none",
                  },
                }}
              >
                <Select
                  style={{
                    height: "28px",
                    border: "none",
                    fontFamily: "kenvue-sans-regular",
                    color: "#000000",
                  }}
                  value={value}
                  IconComponent={ExpandMoreIcon}
                  onChange={handleChange}
                  // className="all_my_product_sort_grid_list_label1"
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
          <div style={{}}>
            {gridViewOpen ? (
              <button
                onClick={GridViewOpenClick}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  display: "flex",
                  border: "none",
                  textDecorationColor: "#6CC24A",
                  borderBottom: "2px solid #00B097",
                  borderWidth: "7%",
                  marginRight: "auto",
                  float: "right",
                  background: "none",

                  padding: 0,
                }}
              >
                <AppsIcon style={{ marginLeft: "0px" }} />
                <span
                  style={{}}
                  className="all_my_product_sort_grid_list_label1"
                >
                  <span
                    style={{ fontFamily: "kenvue-sans", fontWeight: "700" }}
                  >
                    {" "}
                    Grid View
                  </span>
                </span>
              </button>
            ) : (
              <button
                onClick={GridViewOpenClick}
                style={{
                  marginLeft: "5px",
                  cursor: "pointer",
                  alignItems: "center",
                  display: "flex",
                  marginRight: "auto",
                  float: "right",
                  borderBottomStyle: "none",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                <AppsIcon style={{ marginLeft: "0px" }} />{" "}
                <span
                  style={{}}
                  className="all_my_product_sort_grid_list_label1"
                >
                  {" "}
                  Grid View
                </span>
              </button>
            )}
          </div>

          {/* ,ListView Open and Close */}
          <div style={{}}>
            {listViewOpen ? (
              <button
                onClick={ListViewOpenClick}
                className="list-view"
                style={{
                  float: "right",
                  cursor: "pointer",
                  marginLeft: "0px",
                  alignItems: "center",
                  display: "flex",
                  background: "none",
                  border: "none",
                  padding: 0,
                  textDecorationColor: "#6CC24A",
                  borderBottom: "2px solid #00B097",
                  borderWidth: "71%",
                }}
              >
                <FormatListBulletedIcon />
                <span
                  style={{}}
                  className="all_my_product_sort_grid_list_label1"
                >
                  {" "}
                  <span
                    style={{ fontFamily: "kenvue-sans", fontWeight: "700" }}
                  >
                    List View
                  </span>
                </span>
              </button>
            ) : (
              <button
                onClick={ListViewOpenClick}
                className="list-view"
                style={{
                  float: "right",
                  cursor: "pointer",
                  alignItems: "center",
                  textDecoration: "none",
                  borderBottomStyle: "none",
                  display: "flex",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                <FormatListBulletedIcon />
                <span
                  style={{}}
                  className="all_my_product_sort_grid_list_label1"
                >
                  {" "}
                  List View
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      <div style={{ width: "75px", display: "contents" }}>
        <span
          style={{
            fontFamily: "kenvue-sans-regular",
            fontWeight: "400",
            fontSize: "13.33px",
          }}
        >
          {data.product.length} Products
        </span>
      </div>

      {data.product.length <= 0 && (
        <div className="product_no_result_label">Nothing to see here yet!</div>
      )}
      <InfiniteScroll
        dataLength={items?.length}
        next={loadMore}
        hasMore={hasMore}
        loader={""}
      >
        {gridViewOpen ? (
          <div style={{ top: "20px", marginTop: "10px" }}>
            <GridviewCard
              props={items}
              refetch={data.refetch}
              pageRouter="myproduct"
              sort_order={value}
              loggedInUserEmail={loginUserEmail}
            />
          </div>
        ) : (
          <div style={{ top: "20px", marginTop: "10px", paddingRight: "24px" }}>
            <ListviewCard
              props={items}
              refetch={data.refetch}
              pageRouter="myproduct"
              sort_order={value}
              loggedInUserEmail={loginUserEmail}
            />
          </div>
        )}
      </InfiniteScroll>
    </>
  );
};

export default AllProductTabsComponent;
