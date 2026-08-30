import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { RawMaterialsData } from "../../../structures/formulation";
import { ProductDataContext } from "../../../contexts/productData/ProductDataContext";
import { ASSESSMENT_TYPE } from "../../../constants/String.constants";
import { useGetRawMaterialDataByKeyword } from "../../../hooks/UseGetProductDetails";
import { useDebounce } from "../../../hooks/UseDebounce";
import { CheckCRUDAccess } from "../../../helper/GenericFunctions";
import { ResultDataContext } from "../../../contexts/resultData/ResultDataContext";

interface IRawMaterialObject {
  rawMaterialId: string;
  tradeName: string;
  percentage: string;
}

interface FormulationAndCompositionTableProp {
  formulationRawMaterials: RawMaterialsData[];
  handelFormulationTableChanges: (
    formulationRawMaterials: RawMaterialsData[]
  ) => void;
  isClear: boolean;
}

const useFormulationTable = ({
  isClear,
  formulationRawMaterials,
  handelFormulationTableChanges,
}: FormulationAndCompositionTableProp) => {
  const { footPrintData } = useContext(ResultDataContext);
  const { usersData, assessmentsType, setValidateCheck, setValidateCheckFormulation } = useContext(ProductDataContext);
  const [rawMaterialPage, setRawMaterialPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchValue, 1000);
  const {
    mutate: fetchRawMaterialData,
    data,
    isLoading,
  } = useGetRawMaterialDataByKeyword(debouncedSearchTerm, rawMaterialPage);
  const [isSearchable, setIsSearchable] = useState<boolean>(false);
  const [rows, setRows] = useState<RawMaterialsData[]>(formulationRawMaterials);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [searchResults, setSearchResults] = useState<IRawMaterialObject[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof RawMaterialsData | null>(null);
  const [isHoveredtotal, setIsHoveredtotal] = useState(false);
  const [isMaxPercatage, setIsMaxPercatage] = useState<boolean>(false);
  const [isSearchResultsOpen, setIsSearchResultsOpen] =
    useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLInputElement>(null);
  const [errors, setErrors] = useState<Map<string, string | null>>(new Map());
  const userAccess = CheckCRUDAccess(usersData, "assessment");
  const [isFormulaCompositionEditable, setIsFormulaCompositionEditable] =
    useState<boolean>(false); // true means formula composition can be edited
  const [inFocusRows, setInFocusRows] = useState<number[]>([]);
  const [noResultFound, setNoResultFound] = useState<boolean>(false);
  useEffect(() => {
    // Check if the specific error message exists for any rawMaterialId
    const hasSpecificError = Array.from(errors.values()).some(
      (value) =>
        value ===
        "Mass % Composition should be in the range of 0-100% only. Please enter a valid range."
    );
    setValidateCheck(hasSpecificError); // Set to true if the specific error exists
    setValidateCheckFormulation(hasSpecificError);
  }, [errors]);
  useEffect(() => {
    const validateAllRows = () => {
      const newErrors = new Map();
      rows.forEach((row) => {
        const numValue = parseFloat(row.percentage || "0");
        if (numValue < 0 || numValue > 100 || !row.percentage || row.percentage.trim() === "") {
         
          newErrors.set(row.rawMaterialId?.toString(), 
            "Mass % Composition should be in the range of 0-100% only. Please enter a valid range."
          );
        }
      });
      setErrors(newErrors);
    };
  
    validateAllRows();
  }, [rows]);
  
  useEffect(() => {
    setNoResultFound(false);
  }, [debouncedSearchTerm]);
  useEffect(() => {
    setIsFormulaCompositionEditable(
      assessmentsType === ASSESSMENT_TYPE.EXPERIMENTAL_ASSESSMENT &&
        userAccess === 1
    );
  }, [userAccess, assessmentsType]);

  const handleMassChange = (indexPosition: number, newMass: string) => {
    // Validate the new mass value
    const numValue = parseFloat(newMass || "0");
    let errorMessage: string | null = null;
  
    if (numValue < 0 || numValue > 100 || !newMass || newMass.trim() === "") {
      errorMessage =
        "Mass % Composition should be in the range of 0-100% only. Please enter a valid range.";
    }
  
    // Update the rows with the new mass value
    const updatedRows = rows.map((row, index) =>
      index === indexPosition ? { ...row, percentage: newMass } : row
    );
  
    // Update the rows and errors state
    setRows(updatedRows);
    setErrors((prevErrors) =>
      new Map(prevErrors).set(rows[indexPosition].rawMaterialId?.toString(), errorMessage)
    );
  
    // Trigger any additional changes
    handelFormulationTableChanges(updatedRows);
  };
  

  useEffect(() => {
    if (isSearchable) {
      if (debouncedSearchTerm !== "" && debouncedSearchTerm.length > 2) {
        fetchRawMaterialData();
      } else {
        setSearchResults([]);
      }
    }
  }, [
    debouncedSearchTerm,
    setIsSearchable,
    fetchRawMaterialData,
    isSearchable,
  ]);

  useEffect(() => {
    // Only update results or noResultFound if the data returned corresponds to the latest debounced input
    if (debouncedSearchTerm.length > 2 && isSearchable) {
      if (data && data.length > 0) {
        setSearchResults(data);
        setNoResultFound(false);
      } else if (data && data.length === 0) {
        setSearchResults([]);
        setNoResultFound(true);
      }
    }
  }, [data, debouncedSearchTerm, isSearchable]);
  useEffect(() => {
    if (data?.length > 0) {
      setSearchResults(data);
      setNoResultFound(false);
    }
    if(data && data?.length == 0) {
      setNoResultFound(true);
    }

  }, [data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setIsSearchable(true);
    setIsSearchResultsOpen(true);
    setAnchorEl(e.currentTarget);
  };

  const handleDeleteRow = (position: number) => {
    const updatedRows = rows.filter((_, index) => index !== position);
    setRows(updatedRows);
    handelFormulationTableChanges(updatedRows);
  };
  const handleSearchSelect = (result: RawMaterialsData) => {
    const updatedRows = [...rows, result];
  
    // Validate the percentage value of the new row
    updatedRows.forEach((row) => {
      const percentageValue = row.percentage;
      const numValue = parseFloat(percentageValue || "0"); // Handle undefined or empty strings
      let errorMessage: string | null = null;
  
      if (numValue < 0 || numValue > 100 || !percentageValue) {
        errorMessage =
          "Mass % Composition should be in the range of 0-100% only. Please enter a valid range.";
      }
  
      setErrors((prevErrors) =>
        new Map(prevErrors).set(row.rawMaterialId?.toString(), errorMessage)
      );
    });
  
    // Update rows and trigger change handler
    setRows(updatedRows);
    handelFormulationTableChanges(updatedRows);
    setSearchValue("");
    setSearchResults([]);
  };

  const handleMouseEnterWeight = () => {
    setIsHoveredtotal(true);
  };

  const handleMouseLeaveWeight = () => {
    setIsHoveredtotal(false);
  };
const preciseSum = (values, positions = 6) => {
  const factor = 10 ** positions;

  return values.reduce((acc, curr) => {
    const a = Number(acc.toFixed(positions)) * factor;
    const b = Number(curr.toFixed(positions)) * factor;
    return (a + b) / factor;
  }, 0);
};


// Usage:
const getTotalWeight = useCallback(() => {
  const percentages = rows
    .map(r => Number(r?.material_PCT?? r?.percentage))
    .filter(v => !isNaN(v));
  return parseFloat((preciseSum(percentages, 6)).toFixed(2));
}, [rows]);

  const formatToTwoDecimalsWithoutRounding = (num: string | number): string => {
    const parsedNum = parseFloat(num.toString());
    if (isNaN(parsedNum)) return "0.00";
    return (Math.floor(parsedNum * 100) / 100).toFixed(2);
  };

  // Rounding to 6 decimals
  const formattedTotalWeight = useMemo(() => {
    if (isHoveredtotal) {
      if (parseFloat(getTotalWeight().toFixed(2)) === 100.0) {
        return getTotalWeight().toFixed(2);
      }
      return getTotalWeight().toFixed(2);
    }
    if (!isHoveredtotal) {
      if (getTotalWeight() === 100.0) {
        return parseFloat(
          formatToTwoDecimalsWithoutRounding(getTotalWeight())
        ).toFixed(2);
      } else {
        return getTotalWeight() > 100.0
          ? getTotalWeight().toString().slice(0, 6)
          : getTotalWeight().toString().slice(0, 5);
      }
    }
  }, [getTotalWeight, isHoveredtotal]);

  const getBottomPercentage = (key: string, row: RawMaterialsData) => {
    if (key === "envFootprint") {
      return row?.envFootprint;
    } else if (key === "carbonFootprint") {
      return row?.carbonFootprint;
    } else {
      return Number(row?.gaiaScore);
    }
  };

  const getTotalWeight_bottom = useCallback(
    (key: string) => {
      return rows.reduce((total_bottom, row) => {
        const percentage_bottom = getBottomPercentage(key, row);
        if (percentage_bottom === null || isNaN(percentage_bottom)) {
          return total_bottom;
        }
        return total_bottom + (percentage_bottom ?? 0);
      }, 0);
    },
    [rows]
  );

  const formattedTotalWeight_envFootprint =
    isHoveredtotal && getTotalWeight_bottom("envFootprint") < 100
      ? getTotalWeight_bottom("envFootprint").toFixed(6)
      : getTotalWeight_bottom("envFootprint").toFixed(2);

  const formattedTotalWeight_carbonFootprint =
    isHoveredtotal && getTotalWeight_bottom("carbonFootprint") < 100
      ? getTotalWeight_bottom("carbonFootprint").toFixed(6)
      : getTotalWeight_bottom("carbonFootprint").toFixed(2);

  const formattedTotalWeight_gaiaScore =
    isHoveredtotal && getTotalWeight_bottom("gaiaScore") < 100
      ? getTotalWeight_bottom("gaiaScore").toFixed(6)
      : getTotalWeight_bottom("gaiaScore").toFixed(2);

  /* END CODE - productEnvironmentalFootPrint  */

  const cancelChanges = useCallback(() => {
    setRows(formulationRawMaterials);
  }, [formulationRawMaterials]);

  const handleRequestSort = (property: keyof RawMaterialsData) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

 
  const handleBlur = (rawMaterialId: string, value: string, index: number) => {
    const numValue = parseFloat(value || "0");
    let errorMessage: string | null = null;
  
    if (numValue < 0 || numValue > 100 || value === undefined || value === "") {
      errorMessage =
        "Mass % Composition should be in the range of 0-100% only. Please enter a valid range.";
    }
  
    setErrors((prevErrors) =>
      new Map(prevErrors).set(rawMaterialId?.toString(), errorMessage)
    );
  
    // Update the specific row in the table
    const updatedRows = [...rows];
    updatedRows[index].percentage = value;
    setRows(updatedRows);
  };

  useEffect(() => {
    const allDataFilled = rows.every(
      (row) =>
        row.tradeName && row.rawMaterialId && parseFloat(row.percentage) !== 0
    );
    setIsSaveEnabled(allDataFilled && getTotalWeight() === 100);
  }, [rows, isClear, isSaveEnabled, getTotalWeight]);

  useEffect(() => {
    Number(getTotalWeight()) === 100
      ? setIsMaxPercatage(true)
      : setIsMaxPercatage(false);
  }, [getTotalWeight]);

  useEffect(() => {
    if (isClear) {
      cancelChanges();
    }
  }, [isClear, cancelChanges]);

  useEffect(() => {
    if (formulationRawMaterials) {
      let updatedFormulationRawMaterials = formulationRawMaterials;
      if (footPrintData) {
        updatedFormulationRawMaterials = formulationRawMaterials.map(
          (item1) => {
            const item2 = footPrintData?.find(
              (item) => item.rawMaterialId === item1.rawMaterialId
            );
            return {
              ...item1,
              ...item2,
            };
          }
        );
       
      }
      setRows(updatedFormulationRawMaterials);
      setSearchValue("");
    }
  }, [formulationRawMaterials, footPrintData]);
 
  
  return {
    rows,
    isSaveEnabled,
    searchValue,
    searchResults,
    noResultFound,
    debouncedSearchTerm,
    order,
    errors,
    orderBy,
    isHoveredtotal,
    totalEnvFootprint: getTotalWeight_bottom("envFootprint"),
    totalCarbonFootprint: getTotalWeight_bottom("carbonFootprint"),
    handleMassChange,
    handleDeleteRow,
    handleSearchChange,
    handleSearchSelect,
    handleMouseEnterWeight,
    handleMouseLeaveWeight,
    getTotalWeight,
    formattedTotalWeight,
    cancelChanges,
    handleRequestSort,
    isMaxPercatage,
    handleBlur,
    isFormulaCompositionEditable,
    setRawMaterialPage,
    rawMaterialPage,
    isLoading,
    formattedTotalWeight_envFootprint,
    formattedTotalWeight_carbonFootprint,
    formattedTotalWeight_gaiaScore,
    inFocusRows,
    setInFocusRows,
    anchorEl,
    isSearchResultsOpen,
  };
};

export default useFormulationTable;
