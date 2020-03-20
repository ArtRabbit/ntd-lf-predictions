import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Arrow from '../../images/arrow-drop-down.svg';
import ArrowHover from '../../images/arrow-drop-down-hover.svg';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',
    padding: theme.spacing(2, 3, 0, 3),
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99,
    '& > div': {
      padding: theme.spacing(0, 3, 0, 0),
      overflow: 'hidden',
      height: 0,
      opacity: 0,
    },
    '& > h3': {
      position: 'relative',
      padding: theme.spacing(0, 0, 2, 0),
      '&:after': {
        content: `''`,
        display: 'block',
        backgroundImage: `url(${Arrow})`,
        backgroundPosition: 'center',
        backgroundSize: 'auto',
        backgroundRepeat: 'no-repeat',
        width: '1.5rem',
        height: '1.5rem',
        position: 'absolute',
        top: 2,
        right: 0,
        transition: 'all 0.1s ease-in',
        transform: 'rotate(0deg)'
      },
      '&:hover': {
        '&:after': {
          backgroundImage: `url(${ArrowHover})`,
          textDecoration: 'none',

        }
      }
    },
    '&.expanded > h3': {
      '&:after': {
        transform: 'rotate(180deg)'

      }
    },
    '&.expanded > div': {
      opacity: 1,
      overflow: 'visible',
      height: 'auto',
      padding: theme.spacing(0, 3, 2, 0),
    }
  },
  expanded: {

  },

}));

const ExpandableInfo = ({ title, text, children }) => {

  const classes = useStyles();
  const [showMore, setShowMore] = useState(true);

  const showHide = (event) => {
    if (event.type === 'click' || event.key === 'Enter' || event.key === ' ') {
      setShowMore(!showMore);
      event.preventDefault();
    }
  }

  return title ? (
    <Paper elevation={3} onClick={(event) => showHide(event)} onKeyDown={(event) => showHide(event)} className={`${classes.root} ${showMore ? 'expanded' : ''}`}>
      <Typography display="block" variant="h3" component="h3">{title}</Typography>
      <Box display="block" variant="body2" component="div">
        {children}
      </Box>
    </Paper>
  ) : '';
}
export default ExpandableInfo;
