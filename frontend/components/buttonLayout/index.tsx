import React from 'react';
import { Button, Typography, Box } from '@mui/material';

interface ButtonComponentProps {
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode; 
}
const ButtonLayout: React.FC<ButtonComponentProps> = ({ onClick, children, icon }) => {
  const buttonStyle = {
    width: '306px',
    height: '130px',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #302F36',
    background: 'linear-gradient(0deg, #1C1C1F, #1C1C1F), linear-gradient(0deg, #302F36, #302F36)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '20px',
    '&:hover': {
      background: '#302F36',
    },
  };

  const typographyStyle = {
    fontFamily: 'Roboto',
    fontSize: '24px',
    fontWeight: 500,
    lineHeight: '28.01px',
    letterSpacing: '0px',
    textAlign: 'left',
    color: '#F7F8F8',
    width: '274px', 
    height: '28px',
    textTransform: 'none',
  };

  const iconBoxStyle = {
    width: '51px',
    height: '50px',
    borderRadius: '8px',
    background: '#5D50C34D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <>
    <Button variant="contained" onClick={onClick} sx={buttonStyle}>
      <Box sx={iconBoxStyle}>
        {icon} 
      </Box>
      <Typography sx={typographyStyle}>
        {children}
      </Typography>
    </Button>
    </>
  );
};

export default ButtonLayout;
