import { useState } from 'react';
import { toast } from 'react-toastify';
import { useGlobaldata } from '../contexts/masterData/DataContext';
import { CardExperimental, ExperimentalDelete, RowDataInfo } from '../components/breadcrumb/types';
import { callDeleteAssessmentDetails, capitalizeFirstLetter, setUnsetAssessmentAsLPP } from '../helper/GenericFunctions';
import { ToastMessageNotificationTime } from '../constants/ApiEndPoints.constant';
import { EditProductAssessment } from '../components/common/GridViewComponentExperimental';

interface UseExperimentalAssessmentProps {
  refetch: () => void;
}

export function useExperimentalAssessment({ refetch }: UseExperimentalAssessmentProps) {
  const { token } = useGlobaldata();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [deleteHideButton, setDeleteHideButton] = useState(false);
  const [slcRowExp, setSlcRowExp] = useState<CardExperimental>({ assessmentId: "" });
  const [initialValuesDeleteExp, setInitialValuesDeleteExp] = useState<ExperimentalDelete>({
    productID: "",
    productSipId: "",
    assessmentId: "",
    type: "",
  });

  const open1 = Boolean(anchorEl);

  const handleMoreHorizClick = (event: React.MouseEvent<HTMLButtonElement>, rowData: RowDataInfo) => {
    setSlcRowExp(rowData);
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleOpenDeletePopup = (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    initialValues: ExperimentalDelete
  ) => {
    ev.stopPropagation();
    setInitialValuesDeleteExp(initialValues);
    setDeletePopupOpen(true);
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLPP = async (productData, assessmentsData) => {
    try {
      const editProductAssessmentPostData: EditProductAssessment = {
        productSipId: productData.productSipId,
        assessmentId: assessmentsData?._id,
        fg_spec: assessmentsData?.fg_spec,
        formula_number: assessmentsData?.formula_number,
        lab_notebook_code: assessmentsData?.lab_notebook_code,
        pc_spec: assessmentsData?.pc_spec,
        sku_erp_code: assessmentsData?.sku_erp_code,
        zone: assessmentsData?.zone,
        net_content: assessmentsData?.net_content,
        type: capitalizeFirstLetter("experimental"),
        name: assessmentsData?.name,
        isLPP: !assessmentsData?.isLPP
      }
      if (token) {
        const response = await setUnsetAssessmentAsLPP(editProductAssessmentPostData, productData.productID, token);
        if (response.status === 204) {
          toast.success(`Assessment ${assessmentsData?.name} is ${ assessmentsData?.isLPP ? "unmarked" : "marked"} as LPP successfully`);
          refetch();
          handleMenuClose();
        } else {          
          toast.warning("Error occured while marking the assessment as LPP, please try again!");
          handleMenuClose();
        }
      }
    } catch (error) {
      console.log(error);
    }

  }

  const handleDelete = async () => {
    setDeleteHideButton(true)
    if (token) {
      const response = await callDeleteAssessmentDetails(initialValuesDeleteExp, token);
      if (response === 204) {
        toast.success("Experimental assessment details deleted successfully");
        setTimeout(() => {
          setTimeout(() => {
            setDeleteHideButton(false)
          }, 500);
          refetch();
          setDeletePopupOpen(false);

        }, ToastMessageNotificationTime);
      } else {
        toast.warning("Error occurred while deleting the experimental assessment details, please try again!");
        setDeletePopupOpen(false);
        setDeleteHideButton(false)
      }
    }
  };

  const handleCloseDeletePopup = () => {
    setDeletePopupOpen(false);
    setDeleteHideButton(false)
  };

  return {
    anchorEl,
    open1,
    deletePopupOpen,
    slcRowExp,
    initialValuesDeleteExp,
    handleMoreHorizClick,
    handleOpenDeletePopup,
    handleMenuClose,
    handleDelete,
    handleLPP,
    handleCloseDeletePopup,
    deleteHideButton
  };
}
