import React, { useRef, useState, useLayoutEffect } from "react";
import { TableCell, SxProps, Theme } from "@mui/material";
import { CustomTooltip } from "../consumer-packaging-tab/TableViewPackaging.component";

interface EllipsisTooltipCellProps {
  children: React.ReactNode;
  maxWidth?: number;
  sx?: SxProps<Theme>;
  align?: "left" | "center" | "right" | "inherit" | "justify";
}

const EllipsisTooltipCell: React.FC<EllipsisTooltipCellProps> = ({
  children,
  maxWidth = 200,
  sx,
  align = "left",
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

const breakFirst = (str: string) => {
  const index = str.indexOf("-") !== -1 ? str.indexOf("-") : str.indexOf(" ");
  if (index === -1) return str;

  const first = str.substring(0, index + 1);
  const second = str.substring(index + 1).trimStart();

  return (
    <>
      {first}
      <br />
      {second}
    </>
  );
};
useLayoutEffect(() => {
  const el = spanRef.current;
  if (el) {
    // Horizontal overflow (text too long without breaking)
    const widthOverflow = el.scrollWidth > el.clientWidth + 1;

    // Vertical overflow (text exceeding allowed line clamp height)
    const heightOverflow = el.scrollHeight > el.clientHeight + 1;

    // If either overflows, mark as truncated
    setIsTruncated(widthOverflow || heightOverflow);
  }
}, [children]);


  return (
    <TableCell
      align={align}
      sx={{
        maxWidth,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "normal",
        wordBreak: "break-word",
        ...sx,
      }}
    >
      <CustomTooltip
  title={
    isTruncated && (typeof children === "string" || typeof children === "number")
      ? children
      : ""
  }
        disableHoverListener={!isTruncated}
        PopperProps={{
          modifiers: [
            {
              name: "offset",
              // options: {
              //   offset: [10, -15], // Adjust the vertical offset here
              // },
            },
          ],
        }}
      >
       <span
          ref={spanRef}
          style={{
            display: "-webkit-box",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2, // ⬅️ limit to 2 lines
            maxHeight: "3em", // ~2 lines depending on line-height
            lineHeight: "1.5em",
            wordBreak: "break-word",
          }}
        >
          {breakFirst(String(children))}
        </span>
      </CustomTooltip>
    </TableCell>
  );
};

export default EllipsisTooltipCell;
