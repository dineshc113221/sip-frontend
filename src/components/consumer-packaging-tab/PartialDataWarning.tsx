
import React from 'react'
import WarningIcon from '../../assets/images/warning-icon.svg'

interface PartialDataWarningProps {
    message: string;
  }
  
  export const PartialDataWarning: React.FC<PartialDataWarningProps> = ({ message }) => {
    return(
        <div style={{height:"76px",width:"100%",borderLeft:"4px solid #EDB600",marginTop:"0px",marginBottom:"25px", backgroundColor:"#FDF8E5",display:"flex",alignItems:'center',padding:"8px",paddingLeft: "16px"}}>
            <div style={{width:"100%",display:'flex',flexDirection:'row',height:"44px",gap:"8px"}}>
                {/* icon div */}
                <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginRight:"10px"}}>
                    <img src={WarningIcon} alt='warning-icon' style={{height:"24px",width:'24px'}} />
                </div>
                {/* content div */}
                <div style={{width:"100%",padding:"0px",display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                    <p  style={{fontFamily:"kenvue-sans",fontWeight:"700",margin:'0px',padding:"0px",fontSize:"15.2px",height:"18px",color:"#000000"}} >Warning!</p>
                    <p  style={{fontFamily:"kenvue-sans-regular",fontWeight:"400",margin:'0px',padding:"0px",fontSize:"12px",height:"18px",color:"#000000"}} > {message} </p>
                </div>
            </div>
        </div>
    )
}