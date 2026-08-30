import React from "react";
import "../assets/css/tooltip.scss";


const Tooltipcommon = (props: {
  content: string;
  direction: string;
  subTitle?: string;
  delay?: number;
  children?: React.ReactNode;
  disable?: boolean;
  setEnableCustomTooltip?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  let timeout: ReturnType<typeof setTimeout>;
  const [active, setActive] = React.useState(false);

  const showTip = (event: React.MouseEvent<HTMLButtonElement>) => {
    timeout = setTimeout(() => {
      props.setEnableCustomTooltip?.(false)
      event.stopPropagation();
      event.preventDefault();
      setActive(true);
    }, props.delay || 400);
  };

  const hideTip = () => {
    props.setEnableCustomTooltip?.(true)
    clearTimeout(timeout);
    setActive(false);
  };

  return (
    <button
      className="Tooltip-Wrapper"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      style={{ margin: "0px", padding: "0px" }}
    >
      <div
        style={{
          cursor: "pointer",
          marginLeft: "10px",
          width: "18px",
          height: "23px",
          color: props.disable ? "#444444BF" : "black",
        }}
      >
        {props.children}
      </div>

      {active && (
        <div className={`Tooltip-Tip ${props.direction || "top"}`}>
          {props.subTitle && (
            <h3
              className="header"
              style={{
                fontWeight: "700px",
                fontSize: "19.2px",
                lineHeight: "27px",
                marginTop: "9px",
              }}
            >
              {props.subTitle}
            </h3>
          )}
          {/* Content */}
          {props.content}
        </div>
      )}
    </button>
  );
};

export default Tooltipcommon;
