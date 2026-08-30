import React, { useState, useEffect, useCallback, useMemo, ChangeEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Paper,
  TextField,
  IconButton,
  Box,
  Grid,
  TableRow,
  Button,
  Typography,
  TableFooter,
} from "@mui/material";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  HighlightOff as HighlightOffIcon,
} from "@mui/icons-material";
import plusicon from "../../assets/images/add-icon.svg";
import grayPlusIcon from "../../assets/images/grayPlusIcon.svg";
import "../../assets/css/packagingtable.css";
import "../../assets/css/SIP.css";
import deleteIcon from "../../assets/images/delete-pacaking.svg";
import InfoIcon from "@mui/icons-material/Info";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import {
  MaterialEntity,
  PackagingTableProps,
  SubComponent,
} from "../../structures/packaging";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import SelectField from "../formulaAndConsumer/SelectField";
import { useConsumerPackagingContext } from "./ConsumerPackagingContext";
import SortableTableHeader from "./SortableTableHeader";
import { BootstrapTooltip } from "../../constants/Formula.constant";
import ProgressBarWithLabel from "../formulaAndConsumer/ProgressBarWithLabel";
import { PCFTooltipText, PEFTooltipText } from "../results/strings";
import DeleteSubcomponentPopup from "../modal/PopupDeleteSubcomponent";
import { DELETE_SUBCOMPONENT } from "../../constants/ExperimentalTooltip.constant";
import { v4 as uuidv4 } from "uuid";
import MaterialSearchCell from "./MaterialSearchCell";
export const StyledIconButton = styled(IconButton)({
  "& img": {
    width: "15px",
    height: "18px",
    marginRight: "4px",
    filter: "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg)", // Black color
    transition: "filter 0.3s ease", // Smooth transition effect
  },
  "&:hover img": {
    filter:
      "invert(19%) sepia(91%) saturate(7490%) hue-rotate(357deg) brightness(93%) contrast(101%)", // Red color
  },
});
export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} placement="top" />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 12,
    border: "1px solid black", // Border color
    borderRadius: "10px 10px 10px 0px", // Border radius
    padding: "8px 12px", // Padding
    fontFamily: "kenvue-sans-regular",
    lineHeight: 1.5,
    transformOrigin: "center bottom", // Tooltip opens above the element
  },
}));
const TruncatedTooltipWrapper = ({
  value,
  truncateby,
  children,
}: {
  value: string;
  truncateby: number;
  children: React.ReactNode;
}) => {
  const isTruncated = value?.length > truncateby;
  return isTruncated ? (
    <CustomTooltip title={value}>
      <Box sx={{ width: "100%" }}>{children}</Box>
    </CustomTooltip>
  ) : (
    <>{children}</>
  );
};

// PackagingTable component
const PackagingTable: React.FC<PackagingTableProps> = ({
  updateSaveButtonState,
  subComponent,
  errors,
  setErrors,
  componentId,
  packagingtype,
  isAdd,
  isImportData,
  componentDataSend,
}) => {
  const { packagingData } = useGlobaldata();
  // Track last changed subcomponent
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [deletePopupOpen, setDeletePopupOpen] = useState<boolean>(false);
  const [subComponentToDelete, setSubComponentToDelete] = useState<
    number | null | string
  >(null);
  // Remove isAddButtonDisabled state; derive disabled state directly
  const [isHoveredtotal, setIsHoveredtotal] = useState(false);
  const [isHoveredPEF, setIsHoveredPEF] = useState(false);
  const [isHoveredPCF, setIsHoveredPCF] = useState(false);

  const createEmptySubComponent = (): SubComponent => ({
    _id: uuidv4(),
    name: "",
    opacity: "",
    color: "",
    finishing_process: "",
    material: [],
  });

  const [subComponents, setSubComponents] = useState<SubComponent[]>(
    subComponent && subComponent?.length > 0
      ? subComponent
      : [createEmptySubComponent()]
  );
  // Track if subComponents update is from props or user action
  const isPropSyncRef = React.useRef(false);
  // Only update subComponents from props when subComponent prop changes
  useEffect(() => {
    isPropSyncRef.current = true;
    if (subComponent && subComponent.length > 0) {
      setSubComponents(subComponent);
    } else {
      setSubComponents([createEmptySubComponent()]);
    }
  }, [subComponent]);

  const [subComponentSearch, setSubComponentSearch] = useState<
    Record<
      number,
      {
        value: string;
        results: MaterialEntity[];
        anchorEl: HTMLInputElement | null;
        isOpen: boolean;
        noResult: boolean;
      }
    >
  >({
    1: {
      value: "",
      results: [],
      anchorEl: null,
      isOpen: false,
      noResult: false,
    },
  });
  const { primaryData, secondaryData, handelChangeTableData } =
    useConsumerPackagingContext();
  // Add new sub-component
  const addSubComponent = () => {
    const newId = uuidv4();
    setSubComponents((prev) => [
      ...prev,
      {
        _id: newId,
        name: "",
        opacity: "",
        color: "",
        finishing_process: "",
        material: [],
      },
    ]);
    setSubComponentSearch((prev) => ({
      ...prev,
      [newId]: {
        value: "",
        results: [],
        anchorEl: null,
        isOpen: false,
        noResult: false,
      },
    }));
  };
  // Derive Add button disabled state directly in render
  // The Add Sub-component button is disabled if the last subcomponent is incomplete.
  // This ensures that after adding, the button is disabled until the new row is filled out.

  const lastSubComponent = subComponents[subComponents.length - 1];
  const isAddButtonDisabled =
    !lastSubComponent ||
    [
      lastSubComponent.name,
      lastSubComponent.opacity,
      lastSubComponent.color,
      lastSubComponent.finishing_process,
    ].some((val) => !val || val.trim() === "") ||
    lastSubComponent.material.length === 0;
  const getRowBackgroundColor = (index: number) => {
    return index % 2 === 0 ? "#FFFFFF" : "#F8F8F8";
  };
  // Handle sub-component field changes
  const handleSubComponentChange = (
    id: number | string,
    field: keyof SubComponent,
    value: string
  ) => {
    setSubComponents((prev) =>
      prev.map((sc) => (sc._id === id ? { ...sc, [field]: value } : sc))
    );
  };
 
const deleteSubComponent = (id: number | string) => {
  const removeFromSearchState = (
    prevSearch: SubComponentSearchState = {}
  ): SubComponentSearchState => {
    const newState = { ...prevSearch };
    delete newState[id];
    return newState;
  };

  const rebuildSearchState = (
    empty: SubComponent,
    prevSearch: SubComponentSearchState = {}
  ): SubComponentSearchState => {
    const newState: SubComponentSearchState = {};

    Object.keys(prevSearch).forEach((key) => {
      if (String(key) !== String(id)) {
        newState[key] = prevSearch[key];
      }
    });

    newState[String(empty._id)] = {
      value: "",
      results: [],
      anchorEl: null,
      isOpen: false,
      noResult: false,
    };

    return newState;
  };

  setSubComponents((prev: SubComponent[]) => {
    const updated = prev.filter((sc) => String(sc._id) !== String(id));

    if (updated.length === 0) {
      const empty = createEmptySubComponent();
      setSubComponentSearch((prevSearch) =>
        rebuildSearchState(empty, prevSearch)
      );
      return [empty];
    }

    setSubComponentSearch(removeFromSearchState);
    return updated;
  });
};
  const confirmDeleteSubComponent = (id: number | string) => {
    setSubComponentToDelete(id);
    setDeletePopupOpen(true);
  };
  const handleDeleteConfirmed = () => {
    if (subComponentToDelete !== null) {
      deleteSubComponent(subComponentToDelete);
      setDeletePopupOpen(false);
      setSubComponentToDelete(null);
    }
  };
  const handleCancelDelete = () => {
    setDeletePopupOpen(false);
    setSubComponentToDelete(null);
  };
  // Updated function signature
  const handleSearchChange = (
    subComponentId: number | string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> // Accept both input types
  ) => {
    const value = e.target.value;
    // Type assertion to HTMLInputElement
    const inputElement = e.target as HTMLInputElement;

    setSubComponentSearch((prev) => {
      const current = prev[subComponentId] || {
        value: "",
        results: [],
        anchorEl: null,
        isOpen: false,
        noResult: false,
      };

      if (value === "") {
        return {
          ...prev,
          [subComponentId]: { ...current, value, results: [], isOpen: false },
        };
      }

      const results = dataSet.filter((item) =>
        item.material_name.toLowerCase().includes(value.toLowerCase())
      );

      return {
        ...prev,
        [subComponentId]: {
          ...current,
          value,
          results,
          isOpen: true,
          anchorEl: inputElement, // Use the asserted input element
          noResult: results.length === 0,
        },
      };
    });
  };
 interface SubComponentSearch {
  value: string;
  results: MaterialEntity[];
  anchorEl: HTMLInputElement | null;
  isOpen: boolean;
  noResult: boolean;
}

type SubComponentSearchState = Record<number, SubComponentSearch>;


// Main click handler
const handleRowClick = (
  subComponentId: number | string,
  result: MaterialEntity
) => {
  setSubComponents((prev: SubComponent[]) =>
    updateSubComponents(prev, subComponentId, result)
  );

  setSubComponentSearch((prev: SubComponentSearchState) =>
    updateSearchState(prev, subComponentId)
  );
};

// Extracted helper for subcomponents update
const updateSubComponents = (
  subComponents: SubComponent[],
  subComponentId: number | string,
  result: MaterialEntity
): SubComponent[] => {
  return subComponents.map((sc) =>
    sc._id === subComponentId ? addMaterial(sc, result) : sc
  );
};

// Add new material to subcomponent
const addMaterial = (
  subComponent: SubComponent,
  result: MaterialEntity
): SubComponent => {
  const newMaterial: MaterialEntity = {
    ...result,
    _id: subComponent.material.length + 1, // assigning new id
  };

  return {
    ...subComponent,
    material: [...subComponent.material, newMaterial],
  };
};

// Extracted helper for search state reset
const updateSearchState = (
  searchState: SubComponentSearchState,
  subComponentId: number | string
): SubComponentSearchState => {
  return {
    ...searchState,
    [subComponentId]: {
      ...searchState[subComponentId],
      value: "",
      results: [],
      isOpen: false,
    },
  };
};

  const dataSet: MaterialEntity[] = packagingData.materials
    ? packagingData.materials.map((material, index) => {
        return {
          _id: index + 1, // Setting _id as index + 1, you can adjust the offset if needed
          material_name: material?.name?.tru_name,
          material_type: "",
          converting_process: "",
          material_pct: "",
          productEnvironmentalFootPrint: "",
          carbonFootPrint: "",
          virginPlasticValue: "",
        };
      })
    : [];
  const handleMouseEnterWeight = useCallback(() => setIsHoveredtotal(true), []);
  const handleMouseLeaveWeight = useCallback(
    () => setIsHoveredtotal(false),
    []
  );
  // Handle material deletion
  const handleDeleteMaterial = (subComponentId: number, materialId: number) => {
    const updateSubComponent = (sc: SubComponent) => {
      if (sc._id !== subComponentId) return sc;
      return {
        ...sc,
        material: sc.material.filter((m) => m._id !== materialId),
      };
    };

    setSubComponents((prev) => prev.map(updateSubComponent));
  };

  const normalizeDecimal = (value: string): string => {
    // Allow leading zero like 0.1 or 0.01
    if (value.startsWith("0") && value !== "0" && !value.startsWith("0.")) {
      // If it's something like 01 or 02 → strip first zero
      return value.replace(/^0+/, "");
    }
    return value;
  };

  // Handle material mass change
  const handleMaterialMassChange = (
    subComponentId: number,
    materialId: number,
    newMass: string
  ) => {
    const normalizedMass =
      newMass === "" || newMass === "." ? newMass : normalizeDecimal(newMass);

    const updateMaterialMass = (material: MaterialEntity) =>
      material._id === materialId
        ? { ...material, material_pct: normalizedMass }
        : material;

    const updateSubComponent = (sc: SubComponent) => {
      if (sc._id !== subComponentId) return sc;
      return {
        ...sc,
        material: sc.material.map(updateMaterialMass),
      };
    };

    setSubComponents((prev) => prev.map(updateSubComponent));
  };

  // Handle material dropdown change
  const handleMaterialDropdownChange = (
    subComponentId: number,
    materialId: number,
    field: keyof MaterialEntity,
    value: string
  ) => {
    const updateMaterialField = (material: MaterialEntity) =>
      material._id === materialId ? { ...material, [field]: value } : material;

    const updateSubComponent = (sc: SubComponent) => {
      if (sc._id !== subComponentId) return sc;
      return {
        ...sc,
        material: sc.material.map(updateMaterialField),
      };
    };

    setSubComponents((prev) => prev.map(updateSubComponent));
  };

  // Helper function to get type options
  const getTypeOptions = (materials, materialName) => {
    const material = materials?.find((item) => item.name.tru_name === materialName);
    return material?.type || [];
  };
  useEffect(() => {
    const validateAllRows = () => {
      const newErrors = new Map();
      // Update the errors state
      setErrors(newErrors);
    };

    validateAllRows();
  }, [setErrors, subComponents]);
  const [totalMaterialWeight, setTotalMaterialWeight] = useState(0);
  const sumTwoValues = (
    first: number,
    second: number,
    positions: number
  ): number => {
    const factor = 10 ** positions;
    return (
      (parseFloat(first.toFixed(positions)) * factor +
        parseFloat(second.toFixed(positions)) * factor) /
      factor
    );
  };

  const calculateTotalMaterialWeight = useCallback(() => {
    let total = 0;
    subComponents.forEach((subComp) => {
      subComp.material.forEach((material) => {
        const weight = parseFloat(material.material_pct) || 0;
        total = sumTwoValues(total, weight, 6); // Use full precision addition
      });
    });
    return total; // Return full precision
  }, [subComponents]);

  const getError = (errors, id) => errors.get(id || 0);

  useEffect(() => {
    if (packagingtype === "Primary" && primaryData) {
      if (
        primaryData[componentId]?.pc_nm !== "" &&
        JSON.stringify(subComponents) !==
          JSON.stringify(primaryData[componentId]?.sub_components)
      ) {
        setSubComponents(primaryData[componentId]?.sub_components || []);
      }
    }
    if (packagingtype === "Secondary" && secondaryData) {
      if (
        secondaryData[componentId]?.pc_nm !== "" &&
        JSON.stringify(subComponents) !==
          JSON.stringify(secondaryData[componentId]?.sub_components)
      ) {
        setSubComponents(secondaryData[componentId]?.sub_components || []);
      }
    }
  }, [componentId, packagingtype, primaryData, secondaryData]);
  // Only call handelChangeTableData when subComponents change due to user actions, not from prop sync
  const prevSubComponentRef = React.useRef<SubComponent[] | null>(null);
  useEffect(() => {
    // Only call if subComponents changed and not just from prop sync
    if (
      prevSubComponentRef.current &&
      JSON.stringify(prevSubComponentRef.current) !==
        JSON.stringify(subComponents)
    ) {
      if (!isPropSyncRef.current) {
        handelChangeTableData(
          subComponents,
          componentId || 0,
          packagingtype,
          isAdd,
          isImportData
        );
      }
    }
    prevSubComponentRef.current = subComponents;
    isPropSyncRef.current = false;
  }, [subComponents]);

  useEffect(() => {
    setTotalMaterialWeight(calculateTotalMaterialWeight());
  }, [subComponents, calculateTotalMaterialWeight]);

  const totalPEF = useMemo(() => {
    let total = 0;
    subComponents.forEach((sc) => {
      sc.material.forEach((mat) => {
        total += Number(mat.productEnvironmentalFootPrint || 0);
      });
    });
    return total;
  }, [subComponents]);

  const totalCarbonFootprint = useMemo(() => {
    let total = 0;
    subComponents.forEach((sc) => {
      sc.material.forEach((mat) => {
        total += Number(mat.carbonFootPrint || 0);
      });
    });
    return total;
  }, [subComponents]);
  
    const componentTotals = useMemo(() => {
    const source = packagingtype === "Primary" ? primaryData : secondaryData;
    const comp = source?.[componentId] ?? componentDataSend;
    const compTotalPEF = Number(comp?.totalpef  || 0);
    const compTotalPCF = Number(comp?.totalpcf  || 0);
    return { compTotalPEF, compTotalPCF };
  }, [primaryData, secondaryData, componentId, componentDataSend, totalPEF, totalCarbonFootprint, packagingtype]);
  const toFixed6 = (val: number): number => Number(Number(val).toFixed(6));

const totalWeight = toFixed6(totalMaterialWeight);
const expectedWeight = toFixed6(parseFloat(componentDataSend?.weight || "0"));

const isWeightMatched = Math.abs(totalWeight - expectedWeight) <= 1;

const truncateToDecimalPlaces = (
  value: number | string | null | undefined,
  places: number
): string => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    isNaN(Number(value)) ||
    typeof places !== "number" ||
    places < 0
  ) {
    return "0";
  }

  const num = Number(value);
  const str = num.toString();
  const [intPart, decimalPart = ""] = str.split(".");

  if (places === 0) return intPart;

  const truncatedDecimal = decimalPart.slice(0, places).padEnd(places, "0");
  return `${intPart}.${truncatedDecimal}`;
};


  const getFormattedWeight = (): string => {
    const totalWeight = parseFloat(totalMaterialWeight.toString());

    if (isNaN(totalWeight)) return "0.00"; // handle edge case

    if (isHoveredtotal) {
      return totalWeight.toFixed(6); // show full precision on hover
    } else {
      return truncateToDecimalPlaces(totalWeight, 2);
    }
  };

  // Memoize callback to avoid unnecessary updates
  const handleRowsChange = useCallback(() => {
    if (updateSaveButtonState) {
      const hasErrors = Array.from(errors.values()).some(
        (error) => error !== null
      );
      updateSaveButtonState(isWeightMatched && !hasErrors);
    }
  }, [errors, updateSaveButtonState, isWeightMatched]);

  useEffect(() => {
    handleRowsChange();
  }, [subComponents, errors, handleRowsChange]);
  // Helper function to render material cells
  const renderMaterialCells = (subComponent, material) => {
    const error = getError(errors, material._id);
    const typeOption = getTypeOptions(
      packagingData.materials,
      material.material_name
    );
    let displayValue: number | string;

    const isFocused = focusedField === `${subComponent._id}-${material._id}`;
    const isEmpty = material.material_pct === ""||material.material_pct===null;
    if (isFocused) {
      displayValue = material.material_pct; // Show full precision when focused
    } else if (isEmpty) {
      displayValue = ""; // Show empty if no value
    } else {
      displayValue = truncateToDecimalPlaces(material.material_pct, 2);
    }
    // compute percentage-based fill values for progress bars
    const pefRaw = Number(material.productEnvironmentalFootPrint || 0);
    const pefPercent = totalPEF > 0 ? (pefRaw / totalPEF) * 100 : 0;
    const cfpRaw = Number(material.carbonFootPrint || 0);
    const cfpPercent = totalCarbonFootprint > 0 ? (cfpRaw / totalCarbonFootprint) * 100 : 0;

    return (
      <>
        <TableCell className="table-cell-material">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={"Delete Material"}>
              <StyledIconButton
                aria-label="Delete Material"
                onClick={() =>
                  handleDeleteMaterial(subComponent._id, material._id)
                }
                sx={{ paddingLeft: "0px" }}
              >
                <img src={deleteIcon} alt="Delete Material" />
              </StyledIconButton>
            </Tooltip>
            <TruncatedTooltipWrapper
              value={material.material_name}
              truncateby={12}
            >
              <SelectField
                value={material.material_name}
                onChange={(e) =>
                  handleMaterialDropdownChange(
                    subComponent._id,
                    material._id,
                    "material_name",
                    e.target.value
                  )
                }
                options={
                  packagingData?.materials?.map((item) => item.name?.tru_name) || []
                }
                truncateby={12}
                breakBySpaceOrHyphen={true}
              />
            </TruncatedTooltipWrapper>
          </Box>
        </TableCell>
        <TableCell className="table-cell-layer">
          <SelectField
            value={material.layer || ""}
            onChange={(e) =>
              handleMaterialDropdownChange(
                subComponent._id,
                material._id,
                "layer",
                e.target.value
              )
            }
            options={packagingData?.layer || []}
          />
        </TableCell>
        <TableCell className="table-cell-type">
           <TruncatedTooltipWrapper
              value={material.material_type}
              truncateby={17}>
          <SelectField
            value={material.material_type}
            onChange={(e) =>
              handleMaterialDropdownChange(
                subComponent._id,
                material._id,
                "material_type",
                e.target.value
              )
            }
            options={packagingData["pcr/pir/virgin"] || []}
            breakBySpaceOrHyphen={true}
            truncateby={17}
          />
          </TruncatedTooltipWrapper>
        </TableCell>
        <TableCell className="table-cell-process">
          <TruncatedTooltipWrapper
            value={material.converting_process}
            truncateby={14}
          >
            <SelectField
              value={material.converting_process}
              onChange={(e) =>
                handleMaterialDropdownChange(
                  subComponent._id,
                  material._id,
                  "converting_process",
                  e.target.value
                )
              }
              options={typeOption.map((item) => item?.tru_name)
}
              truncateby={14}
               breakBySpaceOrHyphen={true}
            />
          </TruncatedTooltipWrapper>
        </TableCell>
        <TableCell className="table-cell-weight">
          <form noValidate>
          <CustomTooltip
              title={
                error ||
                ((material.material_pct === ""||material.material_pct===null) ? "" : material.material_pct)
              }
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [20, -20],
                    },
                  },
                ],
              }}
            >
              <TextField
                autoComplete="off"
                value={displayValue}
                data-testid="material-search-input"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const rawValue = e.target.value;

                  // Allow empty string (for backspace) or valid decimal numbers
                  if (rawValue === "" || /^\d+(?:\.\d*)?$/.test(rawValue)) {
                    handleMaterialMassChange(subComponent._id, material._id, rawValue);
                  }
                }}
                onFocus={() =>
                  setFocusedField(`${subComponent._id}-${material._id}`)
                }
                onBlur={() => setFocusedField(null)}
                onWheel={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                inputProps={{
                  inputMode: "decimal", // numeric keypad on mobile
                  pattern: "[0-9]*\\.?[0-9]*",
                  style: {
                    textAlign: "center",
                    fontFamily: "kenvue-sans-regular",
                    fontSize: "13.33px",
                  },
                }}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    justifyContent: "center",
                    "& fieldset": {
                      border:
                        material.material_pct === ""|| material.material_pct===null ? "2px solid red" : "none",
                    },
                    "&:hover fieldset": {
                      border:
                        (material.material_pct === ""|| material.material_pct===null) ? "2px solid red" : "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                    position: "relative",
                    "&::after": {
                      content: (material.material_pct !== "" && material.material_pct!==null) ? '""' : "none",
                      position: "absolute",
                      bottom: 12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "39px",
                      height: "1px",
                      backgroundColor: "black",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "14.43px 5px",
                    textAlign: "center",
                    fontSize: "13.33px",
                    fontFamily: "kenvue-sans-regular",
                  },
                  "& .MuiOutlinedInput-input": {
                    fontSize: "13.33px !important",
                  },
                }}
                variant="outlined"
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault(); // Prevent arrow key change
                  }
                }}
              />
            </CustomTooltip>
          </form>
        </TableCell>
        <TableCell
          className="dividerSplit"
          sx={{
            borderBottom: "none !important", // override default MUI border
          }}
        />
        <TableCell
          className="table-cell-pef"
          style={{ border: "1px solid #E4E7EC" }}
        >
          <ProgressBarWithLabel
            value={pefPercent}
            color="#3F7AB4"
            label={material.productEnvironmentalFootPrint ? Number(material.productEnvironmentalFootPrint).toFixed(6) : ""}
            width='160px'
          />
        </TableCell>
        <TableCell
          className="table-cell-cef"
          style={{ border: "1px solid #E4E7EC" }}
        >
          <ProgressBarWithLabel
            value={cfpPercent}
            color="#3F7AB4"
            label={material.carbonFootPrint ? Number(material.carbonFootPrint).toFixed(6) : ""}
            width='150px'
          />
        </TableCell>
        <TableCell
          className="table-cell-virgin"
          style={{ border: "1px solid #E4E7EC" }}
        >
          <Box display="flex" alignItems="center">
            <CustomTooltip
              title={
                (material.virginPlasticValue === "" || material.virginPlasticValue === "0" ? "0" : truncateToDecimalPlaces(material.virginPlasticValue,6 ))
              }
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [25, -10],
                    },
                  },
                ],
              }}
            >
            <Typography variant="body2" className="progress-value">
              {(material.virginPlasticValue === "" || material.virginPlasticValue === "0") ? "0" : `${truncateToDecimalPlaces((material.virginPlasticValue || 0),2)}`}
            </Typography>
            </CustomTooltip>
          </Box>
        </TableCell>
      </>
    );
  };
  return (
    <div className="table-wrapper-packing">
      <Grid container>
        <Grid item xs={12}>
          <Box>
            <TableContainer component={Paper} className="table-container">
              <Table
                stickyHeader
                sx={{
                  borderCollapse: "collapse",
                  tableLayout: "fixed", // 👈 Forces fixed layout
                  width: "100%",
                }}
              >
                <TableHead
                  sx={{
                    "& th": {
                      backgroundColor: "#F8F8F8",
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      height: "80px !important",
                      padding: "10px !important",
                      color: "#000000 !important",
                      lineHeight: "150% !important",
                      letterSpacing: "0% !important",
                    },
                    "& th.dividerSplit": {
                      padding: "7px !important",
                    },
                    "& td": {
                      padding: "6px !important",
                    },
                  }}
                >
                  <TableRow>
                    <SortableTableHeader
                      className="table-cell-SubCompoName"
                      id="Sub-component-Name"
                      label="Sub component Name"
                    />
                    <SortableTableHeader
                      className="table-cell-Opacity"
                      id="Opacity"
                      label="Opacity"
                    />
                    <SortableTableHeader
                      className="table-cell-Color"
                      id="Color"
                      label="Color"
                    />
                    <SortableTableHeader
                      className="table-cell-Finishing-Process"
                      id="Finishing-Process"
                      label="Finishing Process"
                    />
                    <SortableTableHeader
                      className="table-cell0"
                      id="material_name"
                      label={
                        <>
                          Material
                          <br />
                          Name
                        </>
                      }
                    />
                    <SortableTableHeader
                      className="table-cell-Layer"
                      id="Layer"
                      label="Layer"
                    />
                    <SortableTableHeader
                      className="table-cell1"
                      id="material_type"
                      label={
                        <>
                          Material
                          <br />
                          Type
                        </>
                      }
                    />
                    <SortableTableHeader
                      className="table-cell2"
                      id="converting_process"
                      label="Manufacturing Process"
                    />
                    <SortableTableHeader
                      className="table-cell3"
                      id="material_pct"
                      label={
                        <>
                          Material Weight
                          <br />
                          (in g)
                        </>
                      }
                      width="105px"
                    />
                    <TableCell className="dividerSplit" />
                    <SortableTableHeader
                      className="table-cell4"
                      id="productEnvironmentalFootPrint"
                      label="Product Environmental Footprint"
                      infoIcon={
                        <BootstrapTooltip
                          className="BootstrapTooltip"
                          title={
                            <p className="BootstrapTooltip-p">
                              {PEFTooltipText}
                            </p>
                          }
                        >
                          <InfoIcon className="packaging-InfoIcon" />
                        </BootstrapTooltip>
                      }
                      subLabel="(Points per Functional unit)"
                    />
                    <SortableTableHeader
                      className="table-cell5"
                      id="carbonFootPrint"
                      label="Product Carbon Footprint"
                      infoIcon={
                        <BootstrapTooltip
                          className="BootstrapTooltip"
                          title={
                            <p className="BootstrapTooltip-p">
                              {PCFTooltipText}
                            </p>
                          }
                        >
                          <InfoIcon className="packaging-InfoIcon" />
                        </BootstrapTooltip>
                      }
                      subLabel="(g CO2 eq. per functional unit)"
                    />
                    <SortableTableHeader
                      className="table-cell6"
                      id="virginPlasticValue"
                      label="g of Virgin Plastic"
                    />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {(() => {
                    let globalRowIndex = 0;
                    const allRows: JSX.Element[] = [];

                    subComponents.forEach((subComponent) => {
                      const materialCount = subComponent.material.length;
                      const searchState = subComponentSearch[
                        subComponent._id
                      ] || {
                        value: "",
                        results: [],
                        anchorEl: null,
                        isOpen: false,
                        noResult: false,
                      };

                      // Sub-component row
                      allRows.push(
                        <TableRow
                          key={`sub-${subComponent._id}`}
                          data-testid="sub-component-row"
                          style={{
                            backgroundColor:
                              getRowBackgroundColor(globalRowIndex),
                          }}
                          sx={{
                            "& td": {
                              color: "#000000",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              lineHeight: "18px",
                              letterSpacing: "0%",
                            },
                          }}
                        >
                          <TableCell
                            className="table-cell-subcomp"
                            style={{ border: "1px solid #E4E7EC" }}
                          >
                            <Box display="flex" alignItems="center">
                              <Tooltip title="Delete Sub-component">
                                <StyledIconButton
                                  onClick={() =>
                                    confirmDeleteSubComponent(subComponent._id)
                                  }
                                  sx={{ paddingLeft: "0px" }}
                                >
                                  <img
                                    src={deleteIcon}
                                    alt="Delete Sub-component"
                                  />
                                </StyledIconButton>
                              </Tooltip>
                              <TruncatedTooltipWrapper
                                value={subComponent.name}
                                truncateby={11}
                              >
                                <SelectField
                                  value={subComponent.name}
                                  onChange={(e) =>
                                    handleSubComponentChange(
                                      subComponent._id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  options={packagingData?.subComponents || []}
                                  truncateby={11}
                                   breakBySpaceOrHyphen={true}
                                   showSearchBar={true}
                                />
                              </TruncatedTooltipWrapper>
                            </Box>
                          </TableCell>
                          <TableCell
                            className="table-cell-opacity"
                            style={{
                              border: "1px solid #E4E7EC",
                              textAlign: "center",
                            }}
                          >
                            <TruncatedTooltipWrapper
                              value={subComponent.opacity}
                              truncateby={8}
                            >
                              <SelectField
                                value={subComponent.opacity}
                                onChange={(e) =>
                                  handleSubComponentChange(
                                    subComponent._id,
                                    "opacity",
                                    e.target.value
                                  )
                                }
                                options={packagingData?.opacity || []}
                                truncateby={8}
                              />
                            </TruncatedTooltipWrapper>
                          </TableCell>
                          <TableCell
                            className="table-cell-color"
                            style={{ border: "1px solid #E4E7EC" }}
                          >
                            <TruncatedTooltipWrapper
                              value={subComponent.color}
                              truncateby={6}
                            >
                              <SelectField
                                value={subComponent.color}
                                onChange={(e) =>
                                  handleSubComponentChange(
                                    subComponent._id,
                                    "color",
                                    e.target.value
                                  )
                                }
                                options={packagingData?.color || []}
                                truncateby={6}
                              />
                            </TruncatedTooltipWrapper>
                          </TableCell>
                          <TableCell
                            className="table-cell-finish"
                            style={{ border: "1px solid #E4E7EC" }}
                          >
                            <TruncatedTooltipWrapper
                              value={subComponent.finishing_process}
                              truncateby={12}
                            >
                              <SelectField
                                value={subComponent.finishing_process}
                                onChange={(e) =>
                                  handleSubComponentChange(
                                    subComponent._id,
                                    "finishing_process",
                                    e.target.value
                                  )
                                }
                                options={packagingData?.finishing_process?.map((item) => item?.tru_name) || []}
                                truncateby={12}
                                 breakBySpaceOrHyphen={true}
                              />
                            </TruncatedTooltipWrapper>
                          </TableCell>

                          {/* MATERIAL COLUMNS - SHOW FIRST MATERIAL OR SEARCH BAR */}
                          {materialCount === 0 ? (
                            // SHOW SEARCH BAR IF NO MATERIALS
                            <>
                             <MaterialSearchCell
  subComponentId={subComponent._id}
  searchState={searchState}
  handleSearchChange={handleSearchChange}
  handleRowClick={handleRowClick}
/>

                              <TableCell
                                className="dividerSplit"
                                sx={{
                                  borderBottom: "none !important", // override default MUI border

                                  "& .MuiTableCell-root": {
                                    border: "none !important",
                                    borderBottom: "none",
                                  },
                                }}
                              />
                              <TableCell colSpan={3}> </TableCell>
                            </>
                          ) : (
                            // SHOW FIRST MATERIAL IN THE SAME ROW
                            renderMaterialCells(
                              subComponent,
                              subComponent.material[0]
                            )
                          )}
                        </TableRow>
                      );
                      globalRowIndex++;

                      // Additional material rows
                      subComponent.material.slice(1).forEach((material) => {
                        allRows.push(
                          <TableRow
                            key={`mat-${subComponent._id}-${material._id}`}
                            style={{
                              backgroundColor:
                                getRowBackgroundColor(globalRowIndex),
                            }}
                          >
                            <TableCell style={{ border: "1px solid #E4E7EC" }}>
                              {" "}
                            </TableCell>
                            <TableCell style={{ border: "1px solid #E4E7EC" }}>
                              {" "}
                            </TableCell>
                            <TableCell style={{ border: "1px solid #E4E7EC" }}>
                              {" "}
                            </TableCell>
                            <TableCell style={{ border: "1px solid #E4E7EC" }}>
                              {" "}
                            </TableCell>

                            {/* MATERIAL DETAILS */}
                            {renderMaterialCells(subComponent, material)}
                          </TableRow>
                        );
                        globalRowIndex++;
                      });

                      // Search bar row
                      if (materialCount > 0) {
                        allRows.push(
                          <TableRow
                            key={`search-${subComponent._id}`}
                            data-testid="sub-component-row"
                            style={{
                              backgroundColor:
                                getRowBackgroundColor(globalRowIndex),
                            }}
                          >
                            <TableCell style={{ border: "1px solid #E4E7EC" }}>
                              {" "}
                            </TableCell>
                            <TableCell style={{ border: "1px solid #E4E7EC" }}>
                              {" "}
                            </TableCell>
                            <TableCell style={{ border: "1px solid #E4E7EC" }}>
                              {" "}
                            </TableCell>
                            <TableCell style={{ border: "1px solid #E4E7EC" }}>
                              {" "}
                            </TableCell>

                            {/* MATERIAL SEARCH */}
                         <MaterialSearchCell
  subComponentId={subComponent._id}
  searchState={searchState}
  handleSearchChange={handleSearchChange}
  handleRowClick={handleRowClick}
  textFieldClassName="disabledfieldd"
/>

                            <TableCell
                              className="dividerSplit"
                              sx={{
                                borderBottom: "none !important", // override default MUI border
                              }}
                            />
                            <TableCell
                              colSpan={3}
                              style={{ border: "1px solid #E4E7EC" }}
                            >
                              {" "}
                            </TableCell>
                          </TableRow>
                        );
                        globalRowIndex++;
                      }
                    });

                    return allRows;
                  })()}
                </TableBody>
                {/* NEW TABLE FOOTER */}
                <TableFooter>
                  <TableRow
                    sx={{
                      "& td ": {
                        border: "none !important",
                      },
                    }}
                  >
                    {/* Add Sub-component button spanning first 8 columns */}
                    <TableCell colSpan={7} style={{ border: "none" }}>
                      <Button
                        className="Add-Sub-component-button"
                        onClick={addSubComponent}
                        disabled={isAddButtonDisabled}
                        sx={{
                          "&.Mui-disabled": {
                            cursor: "not-allowed",
                            pointerEvents: "auto",
                            color: "#BFBFBF !important",
                            svg: {
                              fill: "#BFBFBF !important",
                            },
                          },
                          "&:hover": {
                            backgroundColor: "inherit", // or match the default background
                            boxShadow: "none",
                          },
                        }}
                        endIcon={
                          <img
                            alt="adding sub component"
                            src={isAddButtonDisabled ? grayPlusIcon : plusicon}
                          />
                        }
                      >
                        Add sub-component
                      </Button>
                    </TableCell>

                    {/* Total weight display in weight column */}
                    <TableCell
                      colSpan={2}
                      style={{ textAlign: "right", border: "none" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            marginRight: "5px",
                            fontFamily: "kenvue-sans-regular",
                            fontSize: "14px",
                            fontWeight: "400",
                            lineHeight: "21px",
                            textAlign: "left",
                            color: "#2B2B2B",
                          }}
                        >
                          Total
                        </Typography>
                        <Typography
                          onMouseEnter={handleMouseEnterWeight}
                          onMouseLeave={handleMouseLeaveWeight}
                          sx={{
                            fontFamily: "kenvue-sans",
                            fontSize: "14px",
                            fontWeight: "700",
                            lineHeight: "21px",
                            textAlign: "left",
                            border: "none",
                            whiteSpace: "nowrap",
                            color: "#000000",
                          }}
                        >
                          {getFormattedWeight()} g
                        </Typography>

                        {(isWeightMatched && expectedWeight>0)
                      ? (
                          <CheckCircleOutlineIcon
                            sx={{
                              color: "green",
                              fontSize: 20,
                              marginLeft: "4px",
                            }}
                          />
                        ) : (
                          <HighlightOffIcon
                            sx={{
                              color: "red",
                              fontSize: 20,
                              marginLeft: "4px",
                            }}
                          />
                        )}
                      </Box>
                    </TableCell>

                  <TableCell></TableCell>
                    {/* PEF Total */}
                    <TableCell style={{ border: "none", textAlign: "justify",paddingLeft:"175px" }}>
                      <Typography
                        onMouseEnter={() => setIsHoveredPEF(true)}
                        onMouseLeave={() => setIsHoveredPEF(false)}
                        sx={{
                          fontFamily: "kenvue-sans",
                          fontSize: "14px",
                          fontWeight: "700",
                          lineHeight: "21px",
                          color: "#000000",
                        }}
                      >
                        {truncateToDecimalPlaces(componentTotals.compTotalPEF, isHoveredPEF ? 6 : 2)}
                      </Typography>
                    </TableCell>
                    {/* Carbon Footprint Total */}
                    <TableCell style={{ border: "none", textAlign: "justify",paddingLeft:"165px" }}>
                      <Typography
                        onMouseEnter={() => setIsHoveredPCF(true)}
                        onMouseLeave={() => setIsHoveredPCF(false)}
                        sx={{
                          fontFamily: "kenvue-sans",
                          fontSize: "14px",
                          fontWeight: "700",
                          lineHeight: "21px",
                          color: "#000000",
                        }}
                      >
                        {truncateToDecimalPlaces(componentTotals.compTotalPCF, isHoveredPCF ? 6 : 2)}
                      </Typography>
                    </TableCell>
                    {/* Virgin Plastic - empty */}
                    <TableCell style={{ border: "none" }} />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
      <DeleteSubcomponentPopup
        open={deletePopupOpen}
        onClose={handleCancelDelete}
        onDelete={handleDeleteConfirmed}
        dialogTitle="Delete Sub-component?"
        dialogContent={DELETE_SUBCOMPONENT}
        buttonOneText="Cancel"
        buttonTwoText="Proceed"
      />
    </div>
  );
};

export default PackagingTable;
