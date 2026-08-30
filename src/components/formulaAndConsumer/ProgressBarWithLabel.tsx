// ProgressBarWithLabel.tsx
import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import {ProgressBarWithLabelProps} from "../../structures/formulation";

const ProgressBarWithLabel: React.FC<ProgressBarWithLabelProps> = ({ value, color, label, width = '100%' }) => {
  return (
    <Box display="flex" alignItems="center">
      <LinearProgress
        sx={{
          "--LinearProgress-thickness": "19px",
          width: width,
          minWidth: width,
          flexShrink: 0,
          background: "#D2D1D2",
          [`& .MuiLinearProgress-bar`]: {
            backgroundColor: color,
          },
        }}
        variant="determinate"
        value={value ?? 0}
        className="linear-progress-bar"
      />
      {label && <Typography variant="body2" className="progress-value">
        {label}
      </Typography>
      }
    </Box>
  );
};

export default ProgressBarWithLabel;
