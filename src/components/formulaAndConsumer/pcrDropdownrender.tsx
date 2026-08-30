import React from "react";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';



const names = [''
  // 'Oliver Hansen',
  // 'Van Henry',
  // 'April Tucker',
  // 'Ralph Hubbard',
  // 'Omar Alexander',
  // 'Carlos Abbott',
  // 'Miriam Wagner',
  // 'Bradley Wilkerson',
  // 'Virginia Andrews',
  // 'Kelly Snyder',
];

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default () => {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  return (
    <FormControl  sx={{

      boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 },
     
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
        {
          border: "none",
          display: "none",
        },
      "& .css-16d15bc-MuiInputBase-root-MuiInput-root::before": {
        border: "none",
      },
      "& .MuiButtonBase-root": {
        display: "none",
      },
    }} >
    <Select
    variant="standard"
    
      displayEmpty
      value={personName}
      onChange={handleChange}
      input={<OutlinedInput />}
      renderValue={(selected) => {
        if (selected.length === 0) {
          return <span>Select</span>;
        }

        return selected.join(', ');
      }}
      
      inputProps={{ 'aria-label': 'Without label' }}
    >
      <MenuItem disabled value="">
        <em>Select</em>
      </MenuItem>
      {names.map((name) => (
        <MenuItem
          key={name}
          value={name}
          style={getStyles(name, personName, theme)}
        >
          {name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
  )
}