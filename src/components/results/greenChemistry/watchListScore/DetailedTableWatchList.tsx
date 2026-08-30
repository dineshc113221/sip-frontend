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

const getBackgroundColor = (score: number): string => {
  if (score === 5) {
    return '#FF6B6B';
  }
  if (score === 3 || score === 4) {
    return 'var(--color-brand-kenvue-yellow-tint-50, #FFD780)';
  }
  return 'inherit';
};
interface IDetailedTableWatchList {
  baseline: boolean;
}
const DetailedTableWatchList: React.FC<IDetailedTableWatchList> = ({ baseline }) => {
  const { greenChemistryData } = useContext(ResultDataContext);

  // Ensure baselineProduct and myproduct are arrays
  const baselineProduct = Array.isArray(greenChemistryData?.watchList?.baselineData)
    ? greenChemistryData?.watchList?.baselineData
    : Object.values(greenChemistryData?.watchList?.baselineData || []);

  const myProduct = Array.isArray(greenChemistryData?.watchList?.myProductData)
  ? greenChemistryData?.watchList?.myProductData
  : Object.values(greenChemistryData?.watchList?.myProductData || []);

  // Choose the correct data based on the `baseline` prop
  const productData = baseline ? baselineProduct : myProduct;
  return (
    <TableContainer component={Paper} className="custom-table-container">
      <Table stickyHeader>
        <TableHead
          sx={{
            "& th": {
              fontFamily: "kenvue-sans",
              fontSize: '12px',
              fontWeight: 700,
              lineHeight: '18px',
              color: "#000",
              padding: "16px 19px",
              backgroundColor: "#F8F8F8",
              border: "1px solid #E4E7EC",
            },
          }}
        >
          <TableRow>
            <TableCell
              sx={{
                border: "0px 1px 0px 0px",
              }}
            >
              Constituent Name
            </TableCell>
            <TableCell
              sx={{
                border: "1px 0px 0px 0px",
              }}
            >
              RAW Code
            </TableCell>
            <TableCell
              sx={{
                border: "1px 0px 0px 0px",
              }}
            >
              Score
            </TableCell>
            <TableCell
              sx={{
                border: "1px 1px 0px 0px",
              }}
            >
              Reason
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productData.map((item, index) => (
            (
              item["Score"]!= null ?
                (<TableRow
                  key={index + 1}
                  sx={{
                    "& td": {
                      color: '#000000',
                      border: "1px solid #E4E7EC",
                      padding: "16px 22px !important",
                      fontFamily: "kenvue-sans-regular",
                      fontSize: '13px',
                      fontWeight: 400,
                      lineHeight: '18px',
                      textAlign: 'left',
                      height: '72px',
                    },
                  }}
                >
                  <TableCell>{item['Constituent Name']}</TableCell>
                  <TableCell>{item["RAW Code"]}</TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: getBackgroundColor(item["Score"]),
                      color: '#000',
                      textAlign: 'center !important'
                    }}
                  >
                    {item["Score"]}
                  </TableCell>
                  <TableCell>{item["Reason"]}</TableCell>
                </TableRow>) : ''
            )
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DetailedTableWatchList;