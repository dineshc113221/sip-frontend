import React from 'react';
import { Link } from 'react-router-dom';

const SipBreadcrumb:React.FC = ()=>{
    let currentLink = "";

    const crumbs = window.location.pathname
      .split("/")
      .filter((crumb) => crumb !== "")
      .map((crumb) => {
        currentLink = `| ${(crumb)}`;
  
        return (
            <div key={crumb}>
              <Link style={{ color: "black" }} to={currentLink}>
                {crumb}
              </Link>
            </div>
        );
      });

    return(<div>{crumbs}</div>)
}

export default SipBreadcrumb;