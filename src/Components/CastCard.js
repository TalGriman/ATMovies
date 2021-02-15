import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { withRouter } from 'react-router-dom';
import '../css/MCard.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    screensImg: {
        [theme.breakpoints.up("xs")]: {
            width: 92,
            height: 138
        },
        [theme.breakpoints.up("sm")]: {
            width: 92,
            height: 138
        },
        [theme.breakpoints.up("md")]: {
            width: 92,
            height: 138
        },
    },
    name: {
        fontFamily: "Comic Sans MS",
        fontWeight: "bold",
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
    character: {
        fontFamily: "Comic Sans MS",
        marginTop: 5,
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



function CastCard(props) {
    const classes = useStyles();

    return (
        <Grid item align="center" style={{ marginLeft: '25px', marginRight: '25px', marginTop: "10px" }}>
            <img src={props.castDetail.image} className={`${classes.screensImg} poster`} alt={props.castDetail.character} />
            <Typography className={`${classes.name}`} variant="h6" component="h6">
                {props.castDetail.name}
            </Typography>
            <Typography className={`${classes.character}`} variant="h6" component="h6">
                {props.castDetail.character}
            </Typography>

        </Grid>
    );
}

export default withRouter(CastCard);