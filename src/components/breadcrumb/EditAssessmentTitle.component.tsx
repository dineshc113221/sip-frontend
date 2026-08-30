import React, { useState,useContext, useEffect } from "react";
import editicon from "../../assets/images/edit.svg";
import { toast } from "react-toastify";
import axios from "axios"; 
import { ApiEndPoints,ApiEndPointsURL } from "../../constants/ApiEndPoints.constant";
import {Stack, IconButton,TextField  } from "@mui/material";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ProductDataContext } from "../../contexts/productData/ProductDataContext";
import { capitalizeFirstLetter, CheckCRUDAccess } from "../../helper/GenericFunctions";
import { useGlobaldata } from "../../contexts/masterData/DataContext";
import "../../assets/css/ProductAssessment.scss";

interface EditProductAssessment {
    productSipId: string;
    assessmentId: string;
    fg_spec?: string;
    formula_number?: string;
    lab_notebook_code?: string;
    pc_spec?: string;
    sku_erp_code?: string;
    zone?: string;
    net_content?: string;
    type?: string;
    name?: string;
}

const EditAssessmentTitle:React.FC = () => {
    const { productData, assessmentsData, refetch,assessmentsType,usersData } = useContext(ProductDataContext);
    
    useEffect(()=>{
        if( assessmentsData.name !== "" ){
            setNewProductAssessmentName(assessmentsData?.name);
        }
    },[assessmentsData,productData,assessmentsType])

    const [productAssessmentFieldED , setProductAssessmentFieldED] = useState(0);
    const [productAssessmentNameError, setProductAssessmentNameError] = useState<boolean>(false);
    const [newProductAssessmentName, setNewProductAssessmentName] = useState<string>();
    const {token}=useGlobaldata()

    const handleProductAssessmentNameBlur = async (prevProductAssessmentName:string , currProductAssessmentName?:string) => {
        if (!newProductAssessmentName) {
            setProductAssessmentNameError(true);
        } 
        else if( prevProductAssessmentName === currProductAssessmentName ) {
            setProductAssessmentFieldED(0);
        }else if( prevProductAssessmentName !== currProductAssessmentName ) {
              
            setNewProductAssessmentName(currProductAssessmentName);
                const editProductAssessmentPostData : EditProductAssessment = {
                    productSipId: productData.productSipId,
                    assessmentId: assessmentsData?._id,
                    fg_spec: assessmentsData?.fg_spec,
                    formula_number: assessmentsData?.formula_number,
                    lab_notebook_code: assessmentsData?.lab_notebook_code,
                    pc_spec: assessmentsData?.pc_spec,
                    sku_erp_code: assessmentsData?.sku_erp_code,
                    zone: assessmentsData?.zone,
                    net_content: assessmentsData?.net_content,
                    type: capitalizeFirstLetter(assessmentsType ?? ""),
                    name: currProductAssessmentName,
            }
            
            try {
                const response = await axios.put(
                `${ApiEndPointsURL}${ApiEndPoints.assessment_edit}/${productData.productId}`,
                editProductAssessmentPostData,{headers:{'Authorization':`Bearer ${token}`}}
                );
                
                if ( response.status === 200) {
                    setProductAssessmentFieldED(0);
                    toast.success("Product Assessment name updated successfully");
                    refetch();
                }else{
                    toast.warning("Error occured while submitting the product Assessment name, please try again!");
                }
            }
            catch (ex) {
                const errorMessage = ex?.response?.data?.message ?? "Error occured while submitting the product Assessment name, please try again!";
            toast.warning(errorMessage);
            }

        //END CODE - EDIT RECORD
        
        }
    };

    const handleProductAssessmentNameChange = (value: string) => {
        setNewProductAssessmentName(value);
        setProductAssessmentNameError(false);
    };

    return ( 
        <div className="edit-assessment-title1" >
            <div
                className="new-product-name1"
                style={{
                    display: productAssessmentFieldED === 1 ? "none" : "inline-block", // Ensures proper text flow
                    width: "100%",
                }}
            >
                <span style={{
                    fontFamily: "kenvue-sans",
                    fontSize: "39.81px",
                    wordBreak: "break-word",
                    display: "inline", // Ensures text flows inline
                    whiteSpace: "normal", // Allows text to wrap
                    maxWidth: "100%",
                    marginRight: "8px" // Adds space between text and icon
                }}>
                    {newProductAssessmentName}
                </span>
                {(CheckCRUDAccess(usersData, "assessment") === 1) && (
                    <button
                        onClick={() => setProductAssessmentFieldED(1)}
                        aria-label="Edit product assessment"
                        style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            display: "inline-flex", // Ensures icon stays in line
                            alignItems: "center",
                            verticalAlign: "middle", // Aligns icon with text
                           }}
                    >
                        <img
                            src={editicon}
                            alt="Edit"
                            style={{ height: "18px", marginTop:"-15px", marginLeft:"10px" }}
                        />
                    </button>
                )}
            </div>

            <div style={{ display: productAssessmentFieldED === 1 ? "contents" : "none", alignItems: "center" }}>
                <TextField
                    sx={{ padding: "1px" }}
                    autoFocus
                    required
                    margin="dense"
                    inputProps={{ maxLength: 100, style: { fontSize: 35, fontFamily: "kenvue-sans" } }}
                    variant="standard"
                    value={newProductAssessmentName}
                    onChange={(e) => handleProductAssessmentNameChange(e.target.value)}
                    error={productAssessmentNameError}
                    helperText={productAssessmentNameError ? "Product assessment name is required" : ""}
                />
            </div>

            <div style={{ width: "10%", display: productAssessmentFieldED === 1 ? "inline-flex" : "none" }}>
                <Stack direction="row" spacing={-1} style={{ display: "flex", marginTop: "20px", marginLeft: "5px" }}>
                    <IconButton
                        sx={{ color: "#00b097" }}
                        aria-label="Save"
                        onClick={() => handleProductAssessmentNameBlur(assessmentsData.name, newProductAssessmentName)}
                    >
                        <CheckBoxIcon />
                    </IconButton>
                    <IconButton
                        sx={{ color: "#00b097" }}
                        aria-label="Cancel"
                        onClick={() => {
                            setProductAssessmentFieldED(0);
                            setNewProductAssessmentName(assessmentsData.name);
                        }}
                    >
                        <DisabledByDefaultIcon />
                    </IconButton>
                </Stack>
            </div>
        </div>
    );
    
}

export default EditAssessmentTitle ; 