import { makeStyles } from '@mui/styles';
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}
const useStyles = makeStyles({
  root: {
    float: "left",
    fontSize: "16px",
    height: "53px",
    width: "77px",
    fontWeight: "400",
    fontFamily: "kenvue-sans-regular",
    padding: "16px",
    cursor: "pointer",
    backgroundColor: "white",
    color: "black",
    borderRadius: "24px",
    border: "1px solid #000000",
  },
});

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  const classess =  useStyles()

  return <button onClick={onClick} className={classess.root}>{label}</button>;
};

export default Button;