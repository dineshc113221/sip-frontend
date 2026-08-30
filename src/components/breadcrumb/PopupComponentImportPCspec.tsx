/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  Autocomplete,
  Grid,
  Divider,
  IconButton,
  CircularProgress,
  Chip
} from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import "../../assets/css/Style.scss";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {
  ApiEndPoints,
  ApiEndPointsURL,
} from "../../constants/ApiEndPoints.constant";
import makeStyles from "@mui/styles/makeStyles";
import {
  ImportComponentData,
  MaterialEntity,
  PackagingComponentData,
  SubComponent,
} from "../../structures/packaging";
import { PC_SPEC } from "../../constants/ExperimentalTooltip.constant";
import { useGlobaldata } from "../../contexts/masterData/DataContext";

 interface PartOption {
  text: string;
  highlight: boolean;
  id?: string;
  part?: string;
  value?: string;
}
interface ComponentData {
  CHILD_NM: string;
}
interface PopupImportPCspecType {
  open: boolean;
  onClose: () => void;
  sendToParentComponent: (data: PackagingComponentData) => void;
}
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  transform: "translate(-8px, -90px) !important",

  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    borderRadius: "32px 32px 32px 0px",
    padding: "4px",
    border: "1px solid black",
    width: "437px",
    height: "auto",
    fontFamily: "kenvue-sans",
  },
}));


const useStyles = makeStyles({
  noOptions: {
    color: "red",
    fontFamily: "kenvue-sans-regular",
  },
});

const PopupImportPCspec:React.FC<PopupImportPCspecType> = ({
  open,
  onClose,
  sendToParentComponent,
}) => {
  const styles = useStyles();
  const [formulaCodeData, setFormulaCodeData] = useState<ComponentData[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [formulaCodeDetailData, setFormulaCodeDetailData] =
    useState<ImportComponentData>({
      pc_nm: "",
      description: "",
      opacifier: "",
      component_type: "",
      weight: "",
      stage: "",
      state: "",
      isEdited:false,
      template: "",
      SalesCountry: "",
      ProductionCountry: "",
      SalesCountryCode: "",
      ProductionCountryCode: "",
      sub_components: [],
      isCalculated:false,
    });
  
  const [value, setValue] = useState<string>("");
 
  const [displayCorrectFormula, setDisplayCorrectFormula] =
    useState<string>("none");
    const {token}=useGlobaldata();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  // Fetch data from API for FML_CODE
  const searchFormulaCodelist = async (vinitialLetters: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${ApiEndPointsURL}${ApiEndPoints.find_component}${vinitialLetters}`,{headers:{'Authorization':`Bearer ${token}`}}
      );
      const data: ComponentData[] = await response.json();
      const uniqueData = data.filter(
        (ele, ind) =>
          ind === data.findIndex((elem) => elem.CHILD_NM === ele.CHILD_NM)
      );

      setFormulaCodeData(uniqueData);
    } catch (error) {
      console.error("Error fetching pc_nm codes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inputValue.length > 2) {
      searchFormulaCodelist(inputValue);
    } else {
      setFormulaCodeData([{ CHILD_NM: "" }]);
    }
  }, [inputValue]);

  const getFormulaCodeDetail = async (vformula_code: string) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(
        `${ApiEndPointsURL}${ApiEndPoints.find_component_details}${vformula_code}`,{headers:{'Authorization':`Bearer ${token}`}}
      );
      const data = await response.json();
      const updateData = {
        ...data,
        recyclability_status:"",
        isEdited: false, 
        isDataComplete: false,
        sub_components: data?.sub_components?.map(
        (sub: SubComponent, subIndex: number) => ({
          ...sub,
          _id: subIndex + 1, // Assign ID to subcomponent
          material: sub?.material?.map((mat: MaterialEntity, matIndex: number) => ({
            ...mat,
            _id: matIndex + 1, // Assign ID to material
            productEnvironmentalFootPrint: mat.productEnvironmentalFootPrint ?? "0",
            carbonFootPrint: mat.carbonFootPrint ?? "0",
            virginPlasticValue: mat.virginPlasticValue ?? "0"
          }))
        })
      )
      }
   
      setFormulaCodeDetailData(updateData);
    } catch (error) {
      console.error("Error fetching PC_SPEC codes:", error);
    } finally {
      setTimeout(() => {
        setLoadingDetails(false);
      }, 1000);
    }
  };

  const handleClose = () => {
    onClose();
    setValue("");
    setDisplayCorrectFormula("none");

    // Reset formulaCodeDetailData to default values
    setFormulaCodeDetailData({
      pc_nm: "",
      description: "",
      component_type: "",
      recyclability_status: "",
      weight: "",
      opacifier: "",
      stage: "",
      state: "",
      template: "",
      isEdited: false,
      sub_components: [],
      isCalculated:false
    });
  };

  const handleImportFormulaDetail = (vformula_code: string) => {
    if (vformula_code) {
      getFormulaCodeDetail(vformula_code);
      setDisplayCorrectFormula("block");
    } else {
      setDisplayCorrectFormula("none");
    }
  };

  return (
    <Dialog
      className="header"
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          borderRadius: "32px",
          width: formulaCodeDetailData.pc_nm ? "1187px" : "708px",
        },
      }}
    >
      <DialogTitle
        className="header"
        sx={{ fontFamily: "kenvue-sans" }}
        style={{ fontSize: "33.18px", fontWeight: "700",color:'#000000' }}
      >
        Import PC Spec
        <IconButton
          aria-label="close"
          onClick={() => {
            handleClose();
          }}
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

      <DialogContent sx={{ fontFamily: "kenvue-sans", height: "100%" }}>
        <Grid item container direction="row">
          <Grid item xs={5}>
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
                    color:'#2b2b2b'
                  }}
                >
                  {" "}
                  Search PC Spec
                </span>
              </Typography>

              <LightTooltip
                placement="right-start"
                PopperProps={{
                  disablePortal: true,
                  sx: {
                    "& .MuiTooltip-tooltip": {
                      marginTop: "93px",
                      marginLeft: "184px !important",
                    },
                  },
                }}

                title={<p className="packaging-LightTooltip-p">{PC_SPEC}</p>}
              >
                <InfoIcon
                  sx={{ marginTop: "-2px" }}
                  className="packaging-InfoIcon1"
                  // onClick={handleTooltipToggle}
                />
              </LightTooltip>
            </div>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                height: "auto",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  width: "358px",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid grey",
                  borderRadius: "8px 8px 8px 8px",
                  padding: "5px",
                }}
              >
                <div style={{ width: "100%" }}>
                  <Autocomplete
                    inputValue={inputValue}
                    onInputChange={(_e, newValue) => setInputValue(newValue)}
                    value={value}
                    onChange={(_e, newValue): void => {
                      setValue(newValue);
                      handleImportFormulaDetail(newValue);
                    }}
                    classes={{
                      noOptions: styles.noOptions,
                    }}
                    noOptionsText={
                      loading ? "" : "PC spec not found, please try again."
                    }
                    disableClearable
                    id="PC_spec"
                    options={formulaCodeData?.map(
                      (option: ComponentData) => option.CHILD_NM
                    )}
                    renderOption={(props, option, { inputValue }) => {
                      const matches = match(option, inputValue, {
                        insideWords: true,
                      });
                      const parts = parse(option, matches);

                      return (
                        <li {...props}>
                          <div>
                            {parts.map((part:PartOption) => (
                              <span
                                key={part.id}
                                style={{
                                  fontWeight: part.highlight ? 700 : 400,
                                }}
                              >
                                {part.text}
                              </span>
                            ))}
                          </div>
                        </li>
                      );
                    }}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
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
                        {...params}
                        variant="standard"
                        InputProps={{
                          ...params.InputProps,
                          disableUnderline: true,
                          endAdornment: (
                            <>
                              {loading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  
                  />
                </div>
              </div>
            </div>
          </Grid>

          <Grid
            item
            xs={2}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Divider
              orientation="vertical"
              style={{ height: "100%", width: "1px" }}
            />
          </Grid>

          <Grid
            item
            xs={5}
            sx={{ display: { xs: "none", lg: displayCorrectFormula } }}
          >
            {loadingDetails ? (
              <div style={{ textAlign: "center" }}>
                <CircularProgress color="inherit" size={40} />
              </div>
            ) : (
              <>
                <Typography variant="h6" mb={1} align="left" style={{fontFamily: "kenvue-sans",fontSize:"23.04px",color:"#000000"}}>
                  <b>Is this the correct PC spec?</b>
                </Typography>
                  <Typography variant="body2" mb={1} align="left" style={{ fontFamily: "kenvue-sans",fontSize:"19.2px",color:"#000000" }}>
                  <b>{formulaCodeDetailData.pc_nm}</b>
                </Typography>
                  <Typography variant="body2" mb={1} align="left" style={{ fontFamily: "kenvue-sans-regular",fontSize:"16px",color:"#000000" }} >
                    <span style={{ fontFamily: "kenvue-sans" }}>Component Description: </span>{" "}
                  {formulaCodeDetailData.description}
                </Typography>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "91px 77px 137px",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="caption" style={{ textAlign: "left"  }}>
                    <span style={{fontFamily: "kenvue-sans-regular",fontSize:"13.33px",color:"#000000"}}>Stage</span>
                  </Typography>
                  <Typography variant="caption" style={{ textAlign: "left" }}>
                    <span style={{fontFamily: "kenvue-sans-regular",fontSize:"13.33px",color:"#000000"}}>State</span>
                  </Typography>
                  <Typography variant="caption" style={{ textAlign: "left" }}>
                    <span style={{fontFamily: "kenvue-sans-regular",fontSize:"13.33px",color:"#000000"}}>Template Type</span>
                  </Typography>

                  <Typography variant="body2" style={{ textAlign: "left" }}>
                    <span style={{ fontFamily: "kenvue-sans",fontSize:"13.33px",color:"#000000" }}>{formulaCodeDetailData.stage}</span>
                  </Typography>
                  <Typography variant="body2" style={{ textAlign: "left" }}>
                    <span style={{ fontFamily: "kenvue-sans",fontSize:"13.33px",color:"#000000" }}>{formulaCodeDetailData.state}</span>
                  </Typography>
                  <Typography variant="body2" style={{ textAlign: "left" }}>
                    <span style={{ fontFamily: "kenvue-sans",fontSize:"13.33px",color:"#000000" }}>{formulaCodeDetailData.template}</span>
                  </Typography>
                </div>
                <div
                  style={{
                    width: "30%",
                    float: "right",
                    display: "flex",
                    marginTop: "24px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      sendToParentComponent(formulaCodeDetailData);
                      handleClose();
                    }}
                      style={{
                        width: '115px',
                        height:'56px',
                      cursor: "pointer",
                      fontFamily: "kenvue-sans-regular",
                      fontSize: "16px",
                      top: "20px",
                      left: "20px",
                      padding: "10px",
                      backgroundColor: "black",
                      color: "white",
                      borderRadius: "32px",
                      border: "1px",
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PopupImportPCspec;
