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
  ListItemText,
  ListItemAvatar,
  Avatar,
  MenuItem,
  FormControl,
} from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios"; // Import axios for making HTTP requests
import "../../assets/css/Style.scss";
import deleteIcon from "../../assets/images/deleteIcon.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  ApiEndPoints,
  ApiEndPointsURL,
  ToastMessageNotificationTime,
} from "../../constants/ApiEndPoints.constant";
import { MemberListResponse } from "../../constants/Formula.constant";
import makeStyles from "@mui/styles/makeStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import {
  AddTeamMember,
  MemberList,
  RoleValue,
  UserRoleDetails,
  PartOption,
} from "../../structures/packaging";
import { RowUsers } from "../breadcrumb/types";
import { memberuserSortFunction } from "../dashboard/helper";

const ownerAndMember = ["Owner", "Member"];
const useStyles = makeStyles({
  noOptions: {
    color: "red",

    fontFamily: "kenvue-sans-regular !important",
  },
  selectOptions: {
    "& .css-18jcskp-MuiButtonBase-root-MuiMenuItem-root.Mui-selected": {
      backgroundColor: "none",
      fontFamily: "kenvue-sans-regular",
    },
  },
});

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const PopupComponentAddMember = ({
  open,
  onClose,
  productId,
  initialValues,
  productSipId,
  refetch,
}: {
  productId: string;
  open: boolean;
  onClose: () => void;
  initialValues: AddTeamMember;
  productSipId: string;
  refetch?: () => void;
}) => {
  let emailValue = "";
  const styles = useStyles();
  const secondary = false;
  const [memberValue, setMemberValue] = React.useState("Member");
  const [addMemberUserList, setAddMemberUserList] = useState<RowUsers[]>([]);

  const handleClose = () => {
    refetch();
    onClose();
    setGetValue([]);
  };
  const { token } = useGlobaldata();
  const [userFetch, setUserFetch] = useState<MemberList[]>(MemberListResponse);
  const [getValue, setGetValue] = useState<string[]>([]); // Assuming you're storing selected strings
  const [inputValue, setInputValue] = useState<string>(""); // State to track input value
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleChangeUpdateValue = async (
    roleValue: RoleValue,
    emailValue: string
  ) => {
    const data = {
      mail: emailValue,
      role: roleValue.target.value,
    };
    try {
      const response = await axios.put(
        `${ApiEndPointsURL}${ApiEndPoints.edit_member}${productId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 204) {
        toast.success("User details updated successfully");
        getAddMemberUserlist();
      } else {
        toast.warning(
          "Error occured while updating the member status, please try again!"
        );
      }
    } catch (ex) {
      const errorMessage = ex?.response?.data?.message ?? "Error occured while updating the member status, please try again!";
      toast.warning(errorMessage);
    }
  };

  const handleChangeInsideDropdown = (event: SelectChangeEvent) => {
    setMemberValue(event.target.value);
  };

  const options = userFetch?.map((option: UserRoleDetails) => {
    return option.displayName;
  });

  const objectValue = getValue.map((data: string) => {
    const mailValue = userFetch?.filter((res: UserRoleDetails) =>
      res.displayName.includes(data)
    );
    const newvalue = mailValue?.map((res: UserRoleDetails) => res.mail);
    newvalue?.map((res: string) => {
      emailValue = res;
      return res;
    });

    return { name: data, role: memberValue, mail: emailValue };
  });

  const handleSaveAddTeamMember = async () => {
    setIsLoading(true)
    try {
      const newTeamMember: AddTeamMember = {
        productId: productSipId,
        users: objectValue,
      };

      // Call the API to save the new product
      await axios
        .post(`${ApiEndPointsURL}${ApiEndPoints.add_member}`, newTeamMember, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res?.status === 200) {
            toast.success("User details added successfully");
            getAddMemberUserlist();
            setGetValue([]);
          }
        });
    } catch (error) {
      if (error.response.data.message) {
        toast.warning(
          "User's already exist in the product, please check already added users and try again"
        );
      }
    }
    finally {
      setIsLoading(false)
    }
  };

  const deleteUser = async (deleteUserMail: string): Promise<void> => {

    setIsDeleting(true); // Set loading state to true
    
    try {
  
     const response = await axios.delete(
  
      `${ApiEndPointsURL}${ApiEndPoints.delete_member}${productId}`,
  
      {
  
       data: { mail: deleteUserMail },
  
       headers: { Authorization: `Bearer ${token}` },
  
      }
  
     );
  
  
  
     if (response.status === 204) {
  
      toast.success("User deleted successfully");
  
      setTimeout(() => {
  
       getAddMemberUserlist();
  
      }, ToastMessageNotificationTime);
  
     }
  
    } catch (error) {
  
     if (error.response?.status === 500) {
  
      toast.warning("At least one owner must remain");
  
     }
  
    } finally {
  
     setIsDeleting(false); // Reset loading state
  
    }
  
   };
  const getAddMemberUserlist = async () => {
    await fetch(
      `${ApiEndPointsURL}${ApiEndPoints.product_details}/${productId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) =>
      res.json().then((data) => { 
        setAddMemberUserList(data?.[0].users);
      })
    );
  };

  useEffect(() => {
    if (open) {
      getAddMemberUserlist();
      axios
        .post(
          `https://approvals.kenvue.com/api/common/groups/members`,
          {
            roles: ["SIP_USERS"],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "application/json",
              "x-consumer-userId": "",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const sortedUserList= memberuserSortFunction(res?.data?.results);
          setUserFetch(sortedUserList);
        })
        .catch(() => {});
    }
  }, [open]);

  return (
    <Dialog
      className="header"
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: { borderRadius: "32px", width: "708px" , minHeight:"320px" , overflow:"visible" },
      }}
    >
      <DialogTitle
        className="header"
        sx={{ fontFamily: "kenvue-sans" }}
        fontWeight="bold"
        style={{ fontSize: "33.18px", fontWeight: "700" }}
      >
        Manage team
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
      </DialogTitle>

      <span
        style={{
          marginLeft: "25px",
          fontFamily: "kenvue-sans-regular",
          fontWeight: "500",
          fontSize: "16px",
        }}
      >
        Manage members and set their access level in your product workspace.
      </span>
      <DialogTitle
        className="header"
        sx={{ fontFamily: "kenvue-sans" }}
        fontWeight="bold"
        style={{ fontSize: "23.04px", fontWeight: "700" }}
      >
        Add team members
      </DialogTitle>

      <DialogContent sx={{ fontFamily: "kenvue-sans", height: "100%" }}>
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
              }}
            >
              Search Name
            </span>
          </Typography>
        </div>
        <div style={{ marginTop: "10px", display: "flex", height: "100%" }}>
          <div
            style={{
              width: "644px",
              display: "flex",
              alignItems: "center",
              border: "1px solid grey",
              borderRadius: "8px 8px 8px 8px",
              fontFamily: "kenvue-sans-regular",
              padding: "0px",
              height: "100%",
            }}
          >
            {" "}
            <SearchIcon style={{ marginLeft: "5px" }} />
            <div style={{ width: "97%", fontFamily: "kenvue-sans-regular", }}>
              <Autocomplete
                disablePortal={true}
                onChange={(_, newValue: string[]): void => {
                  setGetValue(newValue);
                }}
                onInputChange={(_, newInputValue) => {

                  setInputValue(newInputValue); // Track input value changes
             
                 }}
                classes={{
                  noOptions: styles.noOptions,
                }}
                noOptionsText="No matching results found, please try again "
                value={getValue}
                multiple
                id="tags-filled"
                getOptionLabel={(option) => option}
                options={options}
                filterSelectedOptions
                slotProps={{
                  paper: {
                    sx: {
                      fontFamily: 'kenvue-sans-regular'
                    }
                  }
                }}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option, matches);

                  return (
                    <li {...props}>
                      <div>
                        {parts.map((part: PartOption, index: number) => (
                          <span
                            key={index + 1}
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
                      style={{ display: "flex" }}
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
                    }}

                    onChange={() => {}}
                  />
                )}
                sx={{
                  paddingLeft: "8px",
                  "& .MuiAutocomplete-noOptionsText": {
                    backgroundColor: "pink",
                    color: "red",
                    fontFamily: "kenvue-sans-regular",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: "none",
                      display: "none",
                      maxHeight: "auto",
                    },
                  "& .css-16d15bc-MuiInputBase-root-MuiInput-root::before": {
                    border: "none",
                  },
                  "& .MuiButtonBase-root": {
                    display: "none",
                  },
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                float: "right",
                width: "0%",
                height: "16px",
                borderRight: "1px solid grey",
              }}
            ></div>
            <div
              style={{
                float: "right",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 120,
                  border: "none",
                  "& fieldset": {
                    border: "none",
                  },
                }}
              >
                <Select
                  sx={{
                    "& .css-18jcskp-MuiButtonBase-root-MuiMenuItem-root.Mui-selected":
                      {
                        backgroundColor: "none",
                      },
                      "& .MuiSelect-select": {
                        paddingY:"0px"
                      },
                  }}
                  value={memberValue}
                  onChange={handleChangeInsideDropdown}
                  displayEmpty
                  style={{
                    width: "96%",
                    fontFamily: "kenvue-sans",
                    fontWeight: "700",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  IconComponent={ExpandMoreIcon}
                >
                  <MenuItem value="Member">Member</MenuItem>

                  <MenuItem value="Owner">Owner</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <div
            style={{
              width: "21%",
              float: "right",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {initialValues.userCRUDAccess === 1 && (
              <button
                onClick={handleSaveAddTeamMember}
                style={{
                  fontFamily: "kenvue-sans-regular",
                  fontSize: "1.1em",
                  top: "20px",
                  left: "20px",
                  padding: "10px",
                  width: "82px",
                  backgroundColor: (inputValue.trim().length === 0 && getValue.length===0)||isLoading ? "gray" : "black",
                  color: "white",
                  borderRadius: "9999px",
                  border: "1px",
                  height: "50px",
                  cursor: (inputValue.trim().length === 0 && getValue.length===0)||isLoading? "not-allowed" : "pointer"
                }}
                disabled={(inputValue.trim().length === 0 && getValue.length===0)||isLoading}
              >
                Add
              </button>
            )}
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            marginLeft: "-17px",
          }}
        >
          <Grid item xs={12} md={12}>
            <Demo>
              <List>
                {addMemberUserList.map((data: RowUsers, index: number) => (
                  <ListItem
                    key={index + 1}
                    secondaryAction={
                      <>
                        <IconButton edge="end" style={{borderRadius: 0}}>
                          <div style={{ display: "flex" }}>
                            <FormControl
                              sx={{
                                m: 1,
                                minWidth: 120,

                                border: "none",
                                "& fieldset": {
                                  border: "none",
                                  opacity: "0px",
                                  color: "none",
                                  ":hover": "none",
                                },
                              }}
                            >
                              <Select
                                sx={{
                                  "& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                                    {
                                      marginRight: "15px",
                                      padding: "0px 0px !important", // Adjust input padding
                                    },
                                  "& .css-qiwgdb": {
                                    marginRight: "15px",
                                    padding: "0px 0px !important", // Adjust input padding
                                  },
                                }}
                                onChange={(e) => {
                                  handleChangeUpdateValue(e, data.mail);
                                }}
                                displayEmpty
                                defaultValue={data.role}
                                value={data.role}
                                style={{
                                  width: "96%",
                                  fontFamily: "kenvue-sans",
                                  fontWeight: "700",
                                  
                                }}
                                IconComponent={ExpandMoreIcon}
                                disabled={initialValues.userCRUDAccess !== 1}
                              >
                                {ownerAndMember.map((value) => (
                                  <MenuItem key={value} value={value}>
                                    {value}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" style={{borderRadius: 0,paddingLeft:"11px"}}>
                          <div style={{ display: "flex", cursor: "pointer" }}>
                            {" "}
                            {initialValues.userCRUDAccess === 1 && (
                              <button
                                onClick={() => deleteUser(data.mail)}
                                aria-label="Delete user"
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  cursor: isDeleting ? "not-allowed" : "pointer", // Change cursor based on loading state

                                }}
                                disabled={isDeleting} // Disable button while loading


                              >
                                <img alt="Delete" src={deleteIcon} style={{height:"27px",width:"27px"}} />
                              </button>
                            )}
                          </div>
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src="sip-ui-mf/src/assets/images/ellipse.svg"></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography className="manage_team_member_typography1">
                          {data.name}
                        </Typography>
                      }
                      secondary={secondary ? "Secondary text" : null}
                    />
                  </ListItem>
                ))}
              </List>
            </Demo>
          </Grid>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupComponentAddMember;
