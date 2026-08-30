import React, { useEffect, useRef, useState } from "react";
import { Select, MenuItem, TextField, InputAdornment, ListSubheader } from "@mui/material";
import { SelectFieldProps } from "../breadcrumb/types";
import { truncate } from "../../helper/GenericFunctions";
import SearchIcon from "@mui/icons-material/Search";

const SelectField: React.FC<SelectFieldProps> = ({
  value,
  onChange,
  options,
  truncateby,
  disabled = false,
  breakBySpaceOrHyphen = false, // default false
  showSearchBar = false
}) => {
  const hasError = !value || !options.includes(value);
  const isValidValue = value && options.includes(value);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const displayValue = isValidValue ? value : "";
  const breakFirst = (str: string) => {
    // Find the first "-" or space
    const index = str.indexOf("-") !== -1 ? str.indexOf("-") : str.indexOf(" ");
    if (index === -1) return str;

    // Include the "-" in the first part
    const first = str.substring(0, index + 1);
    // Remove any leading spaces from the second part
    const second = str.substring(index + 1).trimStart();

    return (
      <div
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {first}
        <br />
        {second}
      </div>
    );
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (inputRef)
          inputRef?.current?.focus();
      }, 100);
    }
  }, [open]);

  const resetState = () => {
    setSearchText("");
  }

  const handleOpen = () => {
    setOpen(true)
    setSearchText("");

  }
  const filteredOptions = options.filter(
    option =>
      option?.toString().trim().toLowerCase().includes(searchText.toLowerCase())
  );

  const noResult = searchText && filteredOptions.length === 0;

  return (

    <Select
      className="disabledfield"
      sx={{
        width: "100%",
        overflow: "visible",

        "& fieldset": {
          border: hasError ? "2px solid red" : "none",
        },
        textAlign: "left",
        "& .MuiSelect-icon": {
          right: "-5px",
        },
        "& .MuiSelect-select": {
          minHeight: "1.4375em",
          display: "block",
          overflow: "visible",
          whiteSpace: "pre-wrap",       // allow wrapping
          wordBreak: "break-word",      // break long words at space or hyphen
          overflowWrap: "break-word",
          padding: "15px 6px",
          paddingRight: "1px !important",
          letterSpacing: "0%",
        },
      }}
      displayEmpty
      value={displayValue}
      onOpen={handleOpen}
      onClose={() => setOpen(false)}
      open={open}
      onChange={(e) => { onChange(e); resetState(); }}
      disabled={disabled}
      MenuProps={{
        autoFocus: false,
        disableAutoFocusItem: true,
      }}
      renderValue={(selected) => {
        if (!selected || !options.includes(selected)) return "";
        return (
          <div style={{ whiteSpace: "pre-wrap" }}>
            {breakBySpaceOrHyphen
              ? breakFirst(selected)
              : truncate(selected, truncateby)}
          </div>
        );
      }}
    >


      {
        showSearchBar && <ListSubheader
          disableSticky
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          sx={{
            padding: "0px",
            "& .MuiListSubheader-root": {
              padding: "0px"
            }
          }}
        >

          <TextField
            inputRef={inputRef}
            fullWidth
            size="small"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClick={(e) => e.stopPropagation()} // Prevent Select from handling keys
            onKeyDown={(e) => e.stopPropagation()} // Prevent Select from handling keys
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            helperText={noResult ? "No matching results found" : " "}
            onFocus={() => {
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}

            sx={{
              "& fieldset": {
                border: noResult ? "2px solid red" : "2px solid black",
                borderColor: noResult ? "red" : "black",

              },

              "& .MuiOutlinedInput-root": {
                width: "95%",
                position: "relative",
                left: "0.5rem",
                "&.Mui-focused fieldset": {
                  borderColor: noResult ? "red" : "black", // replace blue
                },
              },
              "&:hover fieldset": {
                borderColor: noResult ? "red" : "black",
                border: noResult ? "2px solid red" : "2px solid black",
              },

              "&.Mui-focused fieldset": {
                borderColor: noResult ? "red" : "black",
                border: noResult ? "2px solid red" : "2px solid black",
              },
            }}
          />
        </ListSubheader>
      }

      {filteredOptions.map((option, index) => (
        <MenuItem
          style={{
            fontFamily: "kenvue-sans-regular",
            fontWeight: "400",
            fontSize: "13.33px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
          key={`${option}-${index}`}
          value={option}
        >
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectField;
