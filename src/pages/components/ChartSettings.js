import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Icon from '../../images/settings.svg';
import IconHover from '../../images/settings-hover.svg';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  button: {
    width: '100%',
    borderRadius: 0
  },
  modal: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: theme.spacing(0),
    minWidth: 300,
    borderRadius: 0
  },
  body: {
    padding: theme.spacing(4, 4, 2, 4),
  },
  form: {
    padding: theme.spacing(3, 0, 0, 0),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiFormControl-root': {
      width: '100%',
      padding: theme.spacing(0, 0, 2, 0),
    }
  },
  icon: {
    backgroundColor: "transparent",
    boxShadow: 'none',
    '& .MuiTouchRipple-root': {
      backgroundImage: `url(${Icon})`,
      backgroundPosition: 'center',
      backgroundSize: 'auto',
      backgroundRepeat: 'no-repeat',
    },
    '&:hover': {
      '& .MuiTouchRipple-root': {
        backgroundImage: `url(${IconHover})`,

      }
    }
  },
}));
// <button mat-button aria-label="settings" className={classes.icon} onClick={(event) => handleClickOpen(event)}></button>
const ChartSettings = ({ title, buttonText, action, children }) => {

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  title = title ? title : 'Settings';
  buttonText = buttonText ? buttonText : 'Update graphs';

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleConfirm = (event) => {
    if (action) {
      action(event);
    }
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Fab color="inherit" aria-label="settings" className={classes.icon} onClick={handleClickOpen}> </Fab>
      {open &&
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper
            elevation={3}
            className={classes.modal}
          >
            <div className={classes.body}>
              <Typography variant="h3" component="h3">{title}</Typography>
              <div className={classes.form}>
                {children}
              </div>
            </div>

            <Button onClick={(event) => handleConfirm(event)} className={classes.button} variant="contained" color="primary">{buttonText}</Button>
          </Paper>
        </ClickAwayListener>
      }
    </div>
  )
}
export default ChartSettings;