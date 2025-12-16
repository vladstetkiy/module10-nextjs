'use client';

import { useState } from 'react';
import { Box, Switch, Typography, styled } from '@mui/material';
import styles from './Toggle.module.css';
import Button from '../Button/Button';

type visualModes = 'toggle' | 'segment-control';

interface TogglePropsInterface {
  isOn?: boolean;
  onToggle?: () => void;
  visualMode: visualModes;
  firstOption?: string;
  secondOption?: string;
  className?: string;
  isOnSegment?: boolean;
  dataTestId?: string;
}

const MaterialSwitch = styled(Switch)(({ theme }) => ({
  width: 48,
  height: 28,
  padding: 0,
  margin: '0 12px',
  '& .MuiSwitch-switchBase': {
    padding: 4,
    transition: 'all 0.3s ease',
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      '& + .MuiSwitch-track': {
        backgroundColor: 'var(--component-fill-dark-soft)',
        opacity: 1,
      },
      '& .MuiSwitch-thumb': {
        backgroundColor: 'var(--component-fill-positive)',
      },
    },
    '&.Mui-disabled': {
      '& + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 20,
    height: 20,
    backgroundColor: 'var(--component-fill-light-fixed)',
    boxShadow: 'none',
    transition: 'all 0.3s ease',
  },
  '& .MuiSwitch-track': {
    borderRadius: 9999,
    backgroundColor: 'var(--component-fill-dark-soft)',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 300,
    }),
  },
}));

function Toggle({
  isOn,
  onToggle,
  visualMode,
  firstOption,
  secondOption,
  className,
  isOnSegment,
  dataTestId,
}: TogglePropsInterface) {
  const [isOnState, setIsOnState] = useState(isOn);

  const handleClick = () => {
    setIsOnState(!isOnState);
    if (onToggle) {
      onToggle();
    }
  };

  if (visualMode === 'segment-control') {
    return (
      <Button
        className={styles.segmentControl}
        onClick={handleClick}
        isStyleDisabled={true}
        data-testid={dataTestId}
      >
        <div className={`${styles.firstOption} ${isOnSegment ? styles.toggleOn : ''}`}>
          {firstOption ? firstOption : ''}
        </div>
        <div className={`${styles.secondOption} ${!isOnSegment ? styles.toggleOn : ''}`}>
          {secondOption ? secondOption : ''}
        </div>
      </Button>
    );
  }

  return (
    <Box display="flex" alignItems="center" component="div" className={styles.toggle}>
      {firstOption && (
        <Typography variant="body2" className={styles.firstOption} sx={{ mr: '12px' }}>
          {firstOption}
        </Typography>
      )}

      <MaterialSwitch checked={isOnState} onChange={handleClick} className={className} />

      {secondOption && (
        <Typography variant="body2" className={styles.secondOption} sx={{ ml: '12px' }}>
          {secondOption}
        </Typography>
      )}
    </Box>
  );
}

export default Toggle;
