import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

import CloseIcon from '../../images/close.svg';
import CloseIconHover from '../../images/close-hover.svg';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "transparent",
    boxShadow: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 99,
    '& .MuiTouchRipple-root': {
      backgroundImage: `url(${CloseIcon})`,
      backgroundPosition: 'center',
      backgroundSize: 'auto',
      backgroundRepeat: 'no-repeat',
    },
    '&:hover': {
      '& .MuiTouchRipple-root': {
        backgroundImage: `url(${CloseIconHover})`,

      }
    }
  },
}));
// <button mat-button aria-label="settings" className={classes.icon} onClick={(event) => handleClickOpen(event)}></button>
const CloseButton = ({ action }) => {

  const classes = useStyles();

  return (
    <Fab color="inherit" aria-label="settings" className={classes.root} onClick={action}> </Fab>
  )
}
export default CloseButton;