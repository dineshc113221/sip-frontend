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
} from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import "../../assets/css/Style.scss";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import {
  ApiEndPoints,
  ApiEndPointsURL,
} from "../../constants/ApiEndPoints.constant";
import makeStyles from "@mui/styles/makeStyles";
import {
  RawMaterialsData,
  IformulaCodeDetailData,
  FormulationDataType,
} from "./../../structures/formulation";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
interface IImportForumulaProps {
  open: boolean;
  onClose: () => void;
  sendToParent: (data: FormulationDataType) => void;
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0)",
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

const useStyles = makeStyles({
  noOptions: {
    color: "red",
    fontFamily: "kenvue-sans-regular",
  },
  selectOptions: {
    "& .css-18jcskp-MuiButtonBase-root-MuiMenuItem-root.Mui-selected": {
      backgroundColor: "none",
    },
  },
});

const PopupImportFormula: React.FC<IImportForumulaProps> = ({
  open,
  onClose,
  sendToParent,
}: IImportForumulaProps) => {
  const styles = useStyles();

  const [formulaCodeData, setFormulaCodeData] = useState<
    {
      frml_cd_vers_concat: string;
    }[]
  >();
  const [inputValue, setInputValue] = useState("");

  const initialRawData: RawMaterialsData[] = [];
  const initialformulaCodeDetailData = {
    fgSpec: "",
    SKU_ERP_Code: "",
    fmlCode: "",
    description: "",
    labCode: "",
    netContent: "",
    netContentUnit: "",
    productionZone: "",
    salesZone: "",
    productSegment: "",
    productSubSegment: "",
    useDose: "",
    useScenario:"",
    rawMaterials: initialRawData,
    fieldsExist: {
      description: false,
      netContent: false,
      netContentUnit: false,
      productionZone: false,
      salesZone: false,
      productSegment: false,
      productSubSegment: false,
      useDose: false,
      useDoseUnit: false,
      rawMaterials: false,
      consumablesUsed: false,
      useScenario:false
    },
  };

  const [formulaCodeDetailData, setFormulaCodeDetailData] =
    useState<IformulaCodeDetailData>(initialformulaCodeDetailData);

  const [value, setValue] = useState<string>("");
  const [displayCorrectFormula, setDisplayCorrectFormula] = useState("none");

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const { token } = useGlobaldata();
  interface DataItem {
    frml_cd_vers_concat: string;
  }
  const getUniqueData = (data: DataItem[]): DataItem[] => {
    const seen = new Set<string>();

    return data.filter((item) => {
      const isDuplicate = seen.has(item.frml_cd_vers_concat);
      seen.add(item.frml_cd_vers_concat);
      return !isDuplicate;
    });
  };
  useEffect(() => {
    const searchFormulaCodelist = async (vinitialLetters: string) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${ApiEndPointsURL}${ApiEndPoints.formula_codes}${vinitialLetters}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        const uniqueData = getUniqueData(data);

        setFormulaCodeData(uniqueData);
      } catch (error) {
        console.error("Error fetching formula codes:", error);
      } finally {
        setLoading(false);
      }
    };
    if (inputValue.length > 2) {
      searchFormulaCodelist(inputValue);
    } else {
      const data = [{ frml_cd_vers_concat: "" }];
      setFormulaCodeData(data);
    }
  }, [inputValue, token]);

  const getFormulaCodeDetail = async (vformula_code: string) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(
        `${ApiEndPointsURL}${ApiEndPoints.formula_details}${vformula_code}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setFormulaCodeDetailData(data);
    } catch (error) {
      console.error("Error fetching formula codes:", error);
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
    setFormulaCodeDetailData(initialformulaCodeDetailData);
  };

  const handleImportFormulaDetail = (vformula_code: string) => {
    if (vformula_code !== "") {
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
          width: value ? "1187px" : "708px",
          height: value ? "413px" : "224px",
        },
      }}
    >
      <DialogTitle
        className="header"
        sx={{ fontFamily: "kenvue-sans" }}
        fontWeight="bold"
        style={{ fontSize: "33.18px", fontWeight: "700", color: "black" }}
      >
        Import formula
        <LightTooltip
          placement="right-start"
          PopperProps={{
            disablePortal: true,
            sx: {
              "& .MuiTooltip-tooltip": {
                padding: "0px",
              },
            },
          }}
          title={
            <p className="packaging-LightTooltip-p">
              Use the Formula Code search to import a formulation from Concerto.
              This functionality enables you to run a sustainability assessment
              of a formulation without manual input.
            </p>
          }
        >
          <InfoIcon className="packaging-InfoIcon1" />
        </LightTooltip>
      </DialogTitle>
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
                    fontFamily: "kenvue-sans", color: "black"
                  }}
                >
                  {" "}
                  Search FML Number
                </span>
              </Typography>
            </div>

            <div style={{ marginTop: "10px", display: "flex", height: "auto" }}>
              <div
                style={{
                  width: "644px",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid grey",
                  borderRadius: "8px 8px 8px 8px",
                  padding: "5px",
                }}
              >
                <div style={{ width: "97%" }}>
                  <Autocomplete
                    inputValue={inputValue}
                    onInputChange={(_event, newValue) =>
                      setInputValue(newValue)
                    }
                    value={value ?? ""}
                    onChange={(_event, newValue): void => {
                      setValue(newValue);
                      handleImportFormulaDetail(newValue);
                    }}
                    classes={{
                      noOptions: styles.noOptions,
                    }}
                    noOptionsText={
                      loading ? "" : "Formula code not found, please try again."
                    }
                    disableClearable
                    id="FML_code"
                    options={(formulaCodeData ?? []).map(
                      (option: { frml_cd_vers_concat: string }) =>
                        option.frml_cd_vers_concat
                    )}
                    renderOption={(props, option, { inputValue }) => {
                      const matches = match(option, inputValue, {
                        insideWords: true,
                      });
                      const parts = parse(option, matches);
                      return (
                        <li {...props}>
                          <div>
                            {parts.map(
                              (
                                part: { text: string; highlight: boolean },
                                index: number
                              ) => (
                                <span
                                  key={index + part.text}
                                  style={{
                                    fontWeight: part.highlight ? 700 : 400,
                                  }}
                                >
                                  {part.text}
                                </span>
                              )
                            )}
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
                        return options.filter((item) =>
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
                    sx={{
                      width: 300,
                    }}
                  />
                </div>
              </div>
            </div>
          </Grid>

          {value && (
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
          )}

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
                <Typography
                  variant="h6"
                  mb={1}
                  align="left"
                  sx={{ fontFamily: "kenvue-sans", fontSize: "23.03px" , color: "black"}}
                >
                    <span>Is this the correct formula?</span>
                </Typography>
                  <Typography variant="body2" mb={1} align="left" sx={{ fontFamily: "kenvue-sans", color: "black" }}>
                  <span>{formulaCodeDetailData.fmlCode}</span>
                </Typography>
                  <Typography variant="body2" mb={1} align="left" sx={{ fontFamily: "kenvue-sans-regular", color: "black" }}>
                    <span style={{ fontFamily: "kenvue-sans", color: "black" }}>Formula Description : </span>{" "}
                  {formulaCodeDetailData.description}
                </Typography>
                  <Typography variant="body2" mb={1} align="left" sx={{ fontFamily: "kenvue-sans-regular", color: "black" }}>
                    <span style={{ fontFamily: "kenvue-sans", color: "black" }}>Lab Notebook Code : </span> {formulaCodeDetailData.labCode}
                </Typography>
                <div style={{ display: "flex", gap: "80px" }}>
                  <Typography
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                        fontSize: "13.33px", color: "black"
                    }}
                  >
                      <span style={{ paddingLeft: "0px", fontFamily: "kenvue-sans-regular", fontWeight: 400, color: "black" }}>
                      Formula Status
                    </span>
                      <span style={{ paddingLeft: "0px", fontFamily: "kenvue-sans", fontWeight: 700, color: "black" }}>
                      {formulaCodeDetailData?.formula_status}
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                        fontSize: "13.33px", color: "black"
                    }}
                  >
                      <span style={{ paddingLeft: "0px", fontFamily: "kenvue-sans-regular", fontWeight: 400, color: "black" }}>
                      Brand
                    </span>
                      <span style={{ paddingLeft: "0px", fontFamily: "kenvue-sans", fontWeight: 700, color: "black" }}>
                      {formulaCodeDetailData.brandName}
                    </span>
                  </Typography>
                </div>
                <div
                  style={{
                    width: "30%",
                    float: "right",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                      marginTop: "24px", color: "black"
                  }}
                >
                  <button
                    onClick={() => {
                      sendToParent(
                        formulaCodeDetailData as FormulationDataType
                      );
                      handleClose();
                    }}
                    style={{
                      cursor: "pointer",
                      fontFamily: "kenvue-sans-regular",
                      fontSize: "1.1em",
                      top: "20px",
                      left: "20px",
                      padding: "16px 24px",
                      width: "115px",
                      height: "56px",
                      backgroundColor: "black",
                      color: "white",
                      borderRadius: "9999px",
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

export default PopupImportFormula;
