import React, { useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import "../../../../assets/css/table.scss";
import "../../../../assets/css/SIP.css";
import { ResultDataContext } from '../../../../contexts/resultData/ResultDataContext';
import { PackagingComponentData } from '../../../../structures/packaging';
import { ProductDataContext } from "../../../../contexts/productData/ProductDataContext";

interface IDetailedTableDisruptors {
  baseline: boolean;
}

const DetailedTableDisruptors: React.FC<IDetailedTableDisruptors> = ({ baseline }) => {
  const { sustainablePackagingData } = useContext(ResultDataContext);
  const { isBaselineSkipped } = useContext(ProductDataContext);

  // Ensure baselineProduct and myproduct are arrays
  const baselineProduct = Array.isArray(sustainablePackagingData?.disruptors?.baselineProduct)
    ? sustainablePackagingData?.disruptors?.baselineProduct
    : Object.values(sustainablePackagingData?.disruptors?.baselineProduct || {});

  const myProduct = Array.isArray(sustainablePackagingData?.disruptors?.myproduct)
    ? sustainablePackagingData?.disruptors?.myproduct
    : Object.values(sustainablePackagingData?.disruptors?.myproduct || {});

  // Choose the correct data based on the `baseline` prop
  const productData = baseline ? baselineProduct : myProduct;

  return (
    <div>
      {!isBaselineSkipped || productData.length !== 0 ? <TableContainer component={Paper} className="pef-cf-forulation-custom-table-container" style={{ width: '100%' }}>
        <Table stickyHeader>
          <TableHead
            sx={{
              "& th": {
                alignItems: "flex-start",
                gap: "12px",
                fontFamily: "kenvue-sans",
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: '18px',
                color: "#000",
                padding: "16px 17px",
                backgroundColor: "#F8F8F8",
                border: "1px solid #E4E7EC",

              },
            }}
          >
            <TableRow>
              <TableCell>Component Type</TableCell>
              <TableCell>Recyclability Disruptors</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {productData.map((component: PackagingComponentData) => (
              (component.recyclability_disruptors_list_formatted_4_5 && <TableRow
                key={component?._id}
                sx={{
                  cursor: "pointer",
                  "& td": {
                    color: '#000',
                    border: "1px solid #E4E7EC",
                    padding: "16px 17px !important",
                    fontFamily: "kenvue-sans-regular",
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '18px',
                    textAlign: 'left',
                    height: '72px'
                  },
                }}
              >
                <TableCell>{component.component_type}</TableCell>
                <TableCell>
                  {component.recyclability_disruptors_list_formatted_4_5}
                </TableCell>
              </TableRow>)
            ))}
          </TableBody>
        </Table>
      </TableContainer> : <p style={{
        fontWeight: 700,
        fontFamily: "Kenvue Sans",
        fontSize: "15.2px",
        lineHeight: "150%",
        marginLeft: "4.3rem"
      }}>
        N/A
      </p>
      }
    </div>);

    }
  export default DetailedTableDisruptors;
