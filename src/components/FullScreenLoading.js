import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const FullScreenLoading = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
        gap: 2,
      }}
    >
      <CircularProgress size={60} />
      {message && (
        <Typography variant="h6" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default FullScreenLoading;
