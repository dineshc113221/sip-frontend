import React from 'react'
import WarningIcon from '../../assets/images/warning-icon.svg'
import "../../assets/css/formulation-tab.scss";

interface PartialDataWarningProps {
    message: string;
}

export const PartialDataWarning: React.FC<PartialDataWarningProps> = ({ message }) => {
    return(
        <div className="partial-data-warning">
            <div style={{width:"100%",display:'flex',flexDirection:'row',height:"44px",gap:"8px"}}>
                {/* icon div */}
                <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginRight:"10px"}}>
                    <img src={WarningIcon} alt='warning-icon' style={{height:"24px",width:'24px'}} />
                </div>
                {/* content div */}
                <div style={{width:"100%",padding:"0px",display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                    <p  style={{fontFamily:"kenvue-sans",fontWeight:"700",margin:'0px',padding:"0px",fontSize:"15.2px",height:"18px",color:"#000000"}} >Warning!</p>
                     <p style={{fontFamily:"kenvue-sans-regular",fontWeight:"400",margin:'0px',padding:"0px",fontSize:"12px",lineHeight:"18px",color:"#000000"}} >{message}</p>
                </div>
            </div>
        </div>
    )
}