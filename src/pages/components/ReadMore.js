import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Arrow from '../../images/arrow-drop-down.svg';
import ArrowHover from '../../images/arrow-drop-down-hover.svg';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    cursor: 'pointer',
    padding: theme.spacing(0, 4, 0, 0),
    maxWidth: '80%',
    '& > div': {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
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
    '&.expanded > div': {
      whiteSpace: 'normal',
      overflow: 'visible',
      '&:after': {
        transform: 'rotate(180deg)'

      }
    }
  },
  expanded: {

  },

}));

const ReadMore = ({ children }) => {

  const classes = useStyles();
  const [showMore, setShowMore] = useState(false);

  const showHide = (event) => {
    if (event.type === 'click' || event.key === 'Enter' || event.key === ' ') {
      setShowMore(!showMore);
      event.preventDefault();
    }
  }

  return children ? (
    <Box onClick={(event) => showHide(event)} onKeyDown={(event) => showHide(event)} className={`${classes.root} ${showMore ? 'expanded' : ''}`}>
      {children}
    </Box>
  ) : '';
}
export default ReadMore;
