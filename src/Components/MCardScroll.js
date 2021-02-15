import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { withRouter } from 'react-router-dom';
import '../css/MCard.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({ // לעיצוב במטריאל-יו-איי
  screensImg: {
    opacity: 1,
    transition: "1s ease",
    '&:hover': {
      opacity: 0.7,
      transition: "1s ease",
    },
    [theme.breakpoints.up("xs")]: {
      width: 92,
      height: 138
    },
    [theme.breakpoints.up("sm")]: {
      width: 120,
      height: 180
    },
    [theme.breakpoints.up("md")]: {
      width: 154,
      height: 231
    },
  },
  screensTitle: {
    fontFamily: "Comic Sans MS",
    [theme.breakpoints.up("xs")]: {
      fontSize: 12
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: 14

    },
    [theme.breakpoints.up("md")]: {
      fontSize: 16

    },
  },
}));


function MCardScroll(props) {
  const classes = useStyles();

  const goToMovie = () => {
    props.history.push({
      pathname: `/MDetails/${props.movie.id}`
    });
  };

  return (
    <Grid item align="center" style={{ marginLeft: '25px', marginRight: '25px', marginTop: "10px" }}>
      <img onClick={goToMovie} src={props.movie.poster} className={`pointer ${classes.screensImg} poster`} alt={props.movie.title} />
      <Typography onClick={goToMovie} variant="h6" component="h6">
        <p className={`pointer ${classes.screensTitle}`}>{props.movie.title}</p>
      </Typography>

    </Grid>
  );
}

export default withRouter(MCardScroll);