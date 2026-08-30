import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import React from 'react'
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

export function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3,  }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
export interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

export const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} placement="top" />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 12,
    borderRadius: '30px 30px 30px 0px', // Rounded corners
    padding: '8px 12px',
    position: 'relative',
    border: '1px solid black',
    fontFamily: 'kenvue-sans-regular',
    lineHeight: 1.5,
    transformOrigin: 'center bottom', // Tooltip opens above the element
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.background.paper,
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: '-5px', // Position arrow at the bottom of the tooltip
      left: '50%',
      marginLeft: '-5px',
      width: 0,
      height: 0,
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: `5px solid ${theme.palette.background.paper}`,
    },
  },
}));
export const FomulationFilter = {
  1.1: "1.1.1 Solid (bars, powder, flakes) NO DRY SHAMPOO",
  1.2: "1.1.2 Mousse / Foam (formula with propellant)",
  1.3: "1.1.3 Monodose (liquid/gel/solid/etc)",
  1.4: "1.1.4 Liquid/Gel",
  1.5: "1.1.5 Foam (foamer mechanism)",
  1.6: "1.1.6 Dilutable (not ready to use)",
  1.7: "1.1.7 Concentrate (ready-to-use)",
  1.8: "1.1.8 Dry Shampoo",

  1.9: "1.2.1 Aerosol emulsion/Foam - Leave on",
  1.11: "1.2.2 Conditioner concentrated - Leave on (viscoelastic)",
  1.12: "1.2.3 Conditioner - Leave on (viscoelastic)",
  1.13: "1.2.4 Conditioner/Mask - Rinse off (viscoelactic)",
  1.14: "1.2.5 Conditioner/Mask concentrated - Rinse off (viscoelastic)",
  1.15: "1.2.6 Conditioner/Mask monodose - Leave on/Rinse off",
  1.16: "1.2.7 Conditioner/Mask - Rinse off (solid)",
  1.17: "1.2.8 Oil/Serum/lotion/hybrid - Leave on (viscoelastic - anhydrous or <5% water)",
  1.18: "1.2.9 Aerosol Emulsion/Foam - Rinse off",

  1.19: "1.4.1 Leave-on pumped product",
  1.21: "1.4.2 Leave-on aerosols product",
  1.22: "1.4.3 Leave-on products neither pump or spray, containing water",
  1.23: "1.4.4 Leave-on products neither pump or spray, no water",

  1.24: "2.1.1 Face rinse-off products, neither pump or spray, containing water",
  1.25: "2.1.2 Face rinse-off products, no water",
  1.26: "2.1.3 Face rinse-off products, pump or spray",
  1.27: "2.1.4 Solid face soap",

  1.28: "2.2.1 All spot treatment (which don't belong to L2 Boost)",
  1.29: "2.2.2 Waxes/Butters (thick textures)",
  1.31: "2.2.3 Serum/ Oils",
  1.32: "2.2.4 Mono-dose",
  1.33: "2.2.5 Essence / Cosmetic water / Sprays",
  1.34: "2.2.6 Cream/Lotion/Masks",

  1.35: "2.3.1 Sunscreen",

  1.36: "2.4.1 Cleansing boosters/treatment",
  1.37: "2.4.2 Moisturizing  boosters/treatment",

  1.38: "2.5.1 Eye treatement",

  1.39: "2.6.1 Lip care",

  1.41: "3.1.1 Liquid/Gel wash | Body",
  1.42: "3.1.2 Solid wash (ex: bars, powder, flakes) | Body",
  1.43: "3.1.3 Foam wash - formula with propellant | Body",
  1.44: "3.1.4 Foam wash - foamer mechanism | Body",
  1.45: "3.1.5 Shower crème / non-foaming cleanser | Body",
  1.46: "3.1.6 Oil wash | Body",
  1.47: "3.1.7 Exfoliators/Scrubs | Body",
  1.48: "3.1.8 Liquid/Gel wash | Hand",
  1.49: "3.1.9 Bar soap | Hand",
  1.51: "3.1.10 Foam wash - formula with propellant | Hand",
  1.52: "3.1.11 Foam wash - foamer mechanism | Hand",
  1.53: "3.1.12 Liquid/Gel wash | Intimate",
  1.54: "3.1.13 Foam wash - foamer mechanism | Intimate",
  1.55: "3.1.14 Bath soak",
  1.56: "3.1.15 Bath oil",
  1.57: "3.1.16 Bath salt / Powder",
  1.58: "3.1.17 Bath bomb",
  1.59: "3.1.18 Bath beads/Pearls",
  1.61: "3.1.19 Monodose | Body",
  1.62: "3.1.20 Concentrate wash (all galenic) | Body",
  1.63: "3.1.21 Dilutable wash (all galenic) | Body",
  1.64: "3.1.22 Monodose | Hand",
  1.65: "3.1.23 Concentrate wash (all galenic) | Hand",
  1.66: "3.1.24 Dilutable wash (all galenic) | Hand",
  1.67: "3.1.25 Monodose | Intimate",
  1.68: "3.1.26 Concentrate wash (all galenic) | Intimate",
  1.69: "3.1.27 Dilutable wash (all galenic) | Intimate",

  1.71: "3.2.1 Aerosol deodorant",
  1.72: "3.2.2 Roll on",

  1.73: "3.3.1 Body powder, adult",
  1.74: "3.3.2 Body moisturizing products, containing water",
  1.75: "3.3.3 Body moisturizing products, no water",

  1.76: "3.4.1 Foot care",
  1.77: "3.4.2 Hand sanitizer",
  1.78: "3.4.3 Hand care",

  1.79: "3.5.1 Sunscreen",
  1.81: "3.5.2 Sunscreen stick",

  1.82: "4.1.1 Eyes make-up",
  1.83: "4.2.1 Lashes & brows make-upp",
  1.84: "4.3.1 Face make-up",

  1.85: "4.4.1 Lips",

  1.86: "5.1.1 Toothpaste",

  1.87: "5.2.1 Mouthwash",

  1.88: "5.2.2 Spray",

  1.89: "7.1.1 Hair removal cosmetic products",

  109: "8.1.1 Baby shampoo",

  110: "8.1.2 Baby conditioner",

  111: "8.2.1 Baby powder",
  112: "8.2.2 Baby body moisturizer",
  113: "8.2.3 Baby skin cream, diaper/nappy area",

  1.96: "8.3.1 Baby perfume",

  1.97: "8.4.1 Baby sunscreen",
  1.98: "8.4.1 Baby sunscreen stick",

  1.99: "8.5.1 Baby soap bar",
  //   1.201: "8.5.2 Baby body cleansing products",
};

export const Formulation = [
  {
    name: "1.1.1 Solid (bars, powder, flakes) NO DRY SHAMPOO",
    value: "1.1.1 Solid (bars, powder, flakes) NO DRY SHAMPOO",
  },
  {
    name: "1.1.2 Mousse / Foam (formula with propellant)",
    value: "1.1.2 Mousse / Foam (formula with propellant)",
  },
  {
    name: "1.1.3 Monodose (liquid/gel/solid/etc)",
    value: "1.1.3 Monodose (liquid/gel/solid/etc)",
  },

  {
    name: "1.1.4 Liquid/Gel",
    value: "1.1.4 Liquid/Gel",
  },
  {
    name: "1.1.5 Foam (foamer mechanism)",
    value: "1.1.5 Foam (foamer mechanism)",
  },
  {
    name: "1.1.6 Dilutable (not ready to use)",
    value: "1.1.6 Dilutable (not ready to use)",
  },
  {
    name: "1.1.7 Concentrate (ready-to-use)",
    value: "1.1.7 Concentrate (ready-to-use)",
  },
  {
    name: "1.1.8 Dry Shampoo",
    value: "1.1.8 Dry Shampoo",
  },

  {
    name: "1.2.1 Aerosol emulsion/Foam - Leave on",
    value: "1.2.1 Aerosol emulsion/Foam - Leave on",
  },
  {
    name: "1.2.2 Conditioner concentrated - Leave on (viscoelastic)",
    value: "1.2.2 Conditioner concentrated - Leave on (viscoelastic)",
  },
  {
    name: "1.2.3 Conditioner - Leave on (viscoelastic)",
    value: "1.2.3 Conditioner - Leave on (viscoelastic)",
  },
  {
    name: "1.2.4 Conditioner/Mask - Rinse off (viscoelactic)",
    value: "1.2.4 Conditioner/Mask - Rinse off (viscoelactic)",
  },
  {
    name: "1.2.5 Conditioner/Mask concentrated - Rinse off (viscoelastic)",
    value: "1.2.5 Conditioner/Mask concentrated - Rinse off (viscoelastic)",
  },
  {
    name: "1.2.6 Conditioner/Mask monodose - Leave on/Rinse off",
    value: "1.2.6 Conditioner/Mask monodose - Leave on/Rinse off",
  },
  {
    name: "1.2.7 Conditioner/Mask - Rinse off (solid)",
    value: "1.2.7 Conditioner/Mask - Rinse off (solid)",
  },
  {
    name: "1.2.8 Oil/Serum/lotion/hybrid - Leave on (viscoelastic - anhydrous or <5% water)",
    value:
      "1.2.8 Oil/Serum/lotion/hybrid - Leave on (viscoelastic - anhydrous or <5% water)",
  },
  {
    name: "1.2.9 Aerosol Emulsion/Foam - Rinse off",
    value: "1.2.9 Aerosol Emulsion/Foam - Rinse off",
  },
  {
    name: "1.4.1 Leave-on pumped product",
    value: "1.4.1 Leave-on pumped product",
  },
  {
    name: "1.4.2 Leave-on aerosols product",
    value: "1.4.2 Leave-on aerosols product",
  },
  {
    name: "1.4.3 Leave-on products neither pump or spray, containing water",
    value: "1.4.3 Leave-on products neither pump or spray, containing water",
  },
  {
    name: "1.4.4 Leave-on products neither pump or spray, no water",
    value: "1.4.4 Leave-on products neither pump or spray, no water",
  },

  {
    name: "2.1.1 Face rinse-off products, neither pump or spray, containing water",
    value:
      "2.1.1 Face rinse-off products, neither pump or spray, containing water",
  },
  {
    name: "2.1.2 Face rinse-off products, no water",
    value: "2.1.2 Face rinse-off products, no water",
  },
  {
    name: "2.1.3 Face rinse-off products, pump or spray",
    value: "2.1.3 Face rinse-off products, pump or spray",
  },
  { name: "2.1.4 Solid face soap", value: "2.1.4 Solid face soap" },

  {
    name: "2.2.1 All spot treatment (which don't belong to L2 Boost)",
    value: "2.2.1 All spot treatment (which don't belong to L2 Boost)",
  },
  {
    name: "2.2.2 Waxes/Butters (thick textures)",
    value: "2.2.2 Waxes/Butters (thick textures)",
  },
  { name: "2.2.3 Serum/ Oils", value: "2.2.3 Serum/ Oils" },
  { name: "2.2.4 Mono-dose", value: "2.2.4 Mono-dose" },
  {
    name: "2.2.5 Essence / Cosmetic water / Sprays",
    value: "2.2.5 Essence / Cosmetic water / Sprays",
  },
  { name: "2.2.6 Cream/Lotion/Masks", value: "2.2.6 Cream/Lotion/Masks" },

  { name: "2.3.1 Sunscreen", value: "2.3.1 Sunscreen" },

  {
    name: "2.4.1 Cleansing boosters/treatment",
    value: "2.4.1 Cleansing boosters/treatment",
  },
  {
    name: "2.4.2 Moisturizing  boosters/treatment",
    value: "2.4.2 Moisturizing  boosters/treatment",
  },

  { name: "2.5.1 Eye treatement", value: "2.5.1 Eye treatement" },
  { name: "2.6.1 Lip care", value: "2.6.1 Lip care" },

  {
    name: "3.1.1 Liquid/Gel wash | Body",
    value: "3.1.1 Liquid/Gel wash | Body",
  },
  {
    name: "3.1.2 Solid wash (ex: bars, powder, flakes) | Body",
    value: "3.1.2 Solid wash (ex: bars, powder, flakes) | Body",
  },
  {
    name: "3.1.3 Foam wash - formula with propellant | Body",
    value: "3.1.3 Foam wash - formula with propellant | Body",
  },
  {
    name: "3.1.4 Foam wash - foamer mechanism | Body",
    value: "3.1.4 Foam wash - foamer mechanism | Body",
  },
  {
    name: "3.1.5 Shower crème / non-foaming cleanser | Body",
    value: "3.1.5 Shower crème / non-foaming cleanser | Body",
  },
  { name: "3.1.6 Oil wash | Body", value: "3.1.6 Oil wash | Body" },
  {
    name: "3.1.7 Exfoliators/Scrubs | Body",
    value: "3.1.7 Exfoliators/Scrubs | Body",
  },
  {
    name: "3.1.8 Liquid/Gel wash | Hand",
    value: "3.1.8 Liquid/Gel wash | Hand",
  },
  { name: "3.1.9 Bar soap | Hand", value: "3.1.9 Bar soap | Hand" },
  {
    name: "3.1.10 Foam wash - formula with propellant | Hand",
    value: "3.1.10 Foam wash - formula with propellant | Hand",
  },
  {
    name: "3.1.11 Foam wash - foamer mechanism | Hand",
    value: "3.1.11 Foam wash - foamer mechanism | Hand",
  },
  {
    name: "3.1.12 Liquid/Gel wash | Intimate",
    value: "3.1.12 Liquid/Gel wash | Intimate",
  },
  {
    name: "3.1.13 Foam wash - foamer mechanism | Intimate",
    value: "3.1.13 Foam wash - foamer mechanism | Intimate",
  },
  { name: "3.1.14 Bath soak", value: "3.1.14 Bath soak" },
  { name: "3.1.15 Bath oil", value: "3.1.15 Bath oil" },
  { name: "3.1.16 Bath salt / Powder", value: "3.1.16 Bath salt / Powder" },
  { name: "3.1.17 Bath bomb", value: "3.1.17 Bath bomb" },
  { name: "3.1.18 Bath beads/Pearls", value: "3.1.18 Bath beads/Pearls" },
  { name: "3.1.19 Monodose | Body", value: "3.1.19 Monodose | Body" },
  {
    name: "3.1.20 Concentrate wash (all galenic) | Body",
    value: "3.1.20 Concentrate wash (all galenic) | Body",
  },
  {
    name: "3.1.21 Dilutable wash (all galenic) | Body",
    value: "3.1.21 Dilutable wash (all galenic) | Body",
  },
  { name: "3.1.22 Monodose | Hand", value: "3.1.22 Monodose | Hand" },
  {
    name: "3.1.23 Concentrate wash (all galenic) | Hand",
    value: "3.1.23 Concentrate wash (all galenic) | Hand",
  },
  {
    name: "3.1.24 Dilutable wash (all galenic) | Hand",
    value: "3.1.24 Dilutable wash (all galenic) | Hand",
  },
  { name: "3.1.25 Monodose | Intimate", value: "3.1.25 Monodose | Intimate" },
  {
    name: "3.1.26 Concentrate wash (all galenic) | Intimate",
    value: "3.1.26 Concentrate wash (all galenic) | Intimate",
  },
  {
    name: "3.1.27 Dilutable wash (all galenic) | Intimate",
    value: "3.1.27 Dilutable wash (all galenic) | Intimate",
  },

  { name: "3.2.1 Aerosol deodorant", value: "3.2.1 Aerosol deodorant" },
  { name: "3.2.2 Roll on", value: "3.2.2 Roll on" },

  { name: "3.3.1 Body powder, adult", value: "3.3.1 Body powder, adult" },
  {
    name: "3.3.2 Body moisturizing products, containing water",
    value: "3.3.2 Body moisturizing products, containing water",
  },
  {
    name: "3.3.3 Body moisturizing products, no water",
    value: "3.3.3 Body moisturizing products, no water",
  },

  { name: "3.4.1 Foot care", value: "3.4.1 Foot care" },
  { name: "3.4.2 Hand sanitizer", value: "3.4.2 Hand sanitizer" },
  { name: "3.4.3 Hand care", value: "3.4.3 Hand care" },

  { name: "3.5.1 Sunscreen", value: "3.5.1 Sunscreen" },
  { name: "3.5.2 Sunscreen stick", value: "3.5.2 Sunscreen stick" },

  { name: "4.1.1 Eyes make-up", value: "4.1.1 Eyes make-up" },

  {
    name: "4.2.1 Lashes & brows make-upp",
    value: "4.2.1 Lashes & brows make-upp",
  },
  { name: "4.3.1 Face make-up", value: "4.3.1 Face make-up" },

  { name: "4.4.1 Lips", value: "4.4.1 Lips" },
  { name: "5.1.1 Toothpaste", value: "5.1.1 Toothpaste" },
  { name: "5.2.1 Mouthwash", value: "5.2.1 Mouthwash" },
  { name: "5.2.2 Spray", value: "5.2.2 Spray" },
  {
    name: "7.1.1 Hair removal cosmetic products",
    value: "7.1.1 Hair removal cosmetic products",
  },
  { name: "8.1.1 Baby shampoo", value: "8.1.1 Baby shampoo" },

  { name: "8.1.2 Baby conditioner", value: "8.1.2 Baby conditioner" },

  { name: "8.2.1 Baby powder", value: "8.2.1 Baby powder" },
  { name: "8.2.2 Baby body moisturizer", value: "8.2.2 Baby body moisturizer" },
  {
    name: "8.2.3 Baby skin cream, diaper/nappy area",
    value: "8.2.3 Baby skin cream, diaper/nappy area",
  },
  { name: "8.3.1 Baby perfume", value: "8.3.1 Baby perfume" },
  { name: "8.4.1 Baby sunscreen", value: "8.4.1 Baby sunscreen" },
  { name: "8.4.1 Baby sunscreen stick", value: "8.4.1 Baby sunscreen stick" },

  { name: "8.5.1 Baby soap bar", value: "8.5.1 Baby soap bar" },
  {
    name: "8.5.2 Baby body cleansing products",
    value: "8.5.2 Baby body cleansing products",
  },
];

export const MemberListResponse = [
  {
    "displayName": "Kadam, Poonam [Non-Kenvue]",
    "givenName": "Poonam",
    "jobTitle": "",
    "mail": "PKadam04@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "Kadam",
    "userPrincipalName": ""
  },
  {
    "displayName": "Choudhary, Dinesh [Non-Kenvue]",
    "givenName": "Dinesh",
    "jobTitle": "",
    "mail": "DChoud02@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "Choudhary",
    "userPrincipalName": ""
  },
  {
    "displayName": "Amuluri, Bhagya [Non-Kenvue]",
    "givenName": "Bhagya",
    "jobTitle": "",
    "mail": "BAmulu01@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "Amuluri",
    "userPrincipalName": ""
  },
  {
    "displayName": "Babar, Rupali [Non-Kenvue]",
    "givenName": "Rupali",
    "jobTitle": "",
    "mail": "RBabar01@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "Babar",
    "userPrincipalName": ""
  },
  {
    "displayName": "Sahu, Saransh [Non-Kenvue]",
    "givenName": "Saransh",
    "jobTitle": "",
    "mail": "SSahu04@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "Sahu",
    "userPrincipalName": ""
  },
  {
    "displayName": "Agharkar, Ankita Suhas [Non-Kenvue]",
    "givenName": "Ankita Suhas",
    "jobTitle": "",
    "mail": "AAghar01@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "Agharkar",
    "userPrincipalName": ""
  },
  {
    "displayName": "Siddhe, Bharat Krishna [Non-Kenvue]",
    "givenName": "Bharat Krishna",
    "jobTitle": "",
    "mail": "BSiddh02@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "Siddhe",
    "userPrincipalName": ""
  },
  {
    "displayName": "Chandra Raju, Kavyashree [Non-Kenvue]",
    "givenName": "Kavyashree",
    "jobTitle": "",
    "mail": "KChand02@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "Chandra Raju",
    "userPrincipalName": ""
  },
  {
    "displayName": "Sharma, Anamika [Non-Kenvue]",
    "givenName": "Anamika",
    "jobTitle": "",
    "mail": "AShar018@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "Sharma",
    "userPrincipalName": ""
  },
  {
    "displayName": "Mandal, Uttam [Non-Kenvue]",
    "givenName": "Uttam",
    "jobTitle": "",
    "mail": "UMandal1@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "Mandal",
    "userPrincipalName": ""
  },
  {
    "displayName": "Patil, Alankar [Non-Kenvue]",
    "givenName": "Alankar",
    "jobTitle": "",
    "mail": "apatil35@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "Patil",
    "userPrincipalName": ""
  },
  {
    "displayName": "Inkollu, Gowrinath [Non-Kenvue]",
    "givenName": "Gowrinath",
    "jobTitle": "",
    "mail": "GInkollu@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "Inkollu",
    "userPrincipalName": ""
  },
  {
    "displayName": "Kumar, Prashant [Non-Kenvue]",
    "givenName": "Prashant",
    "jobTitle": "",
    "mail": "PKuma307@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "Kumar",
    "userPrincipalName": ""
  },
  {
    "displayName": "YALAMANCHI, PRATIK",
    "givenName": "PRATIK",
    "jobTitle": "",
    "mail": "PYalama1@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "YALAMANCHI",
    "userPrincipalName": ""
  },
  {
    "displayName": "Smith, Catherine",
    "givenName": "Catherine",
    "jobTitle": "",
    "mail": "csmit213@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "Smith",
    "userPrincipalName": ""
  },
  {
    "displayName": "SOLARAJU, SHYAM",
    "givenName": "SHYAM",
    "jobTitle": "",
    "mail": "ssolaraj@kenvue.com",
    "mobilePhone": "",
    "officeLocation": "",
    "preferredLanguage": "",
    "surname": "SOLARAJU",
    "userPrincipalName": ""
  }
];  