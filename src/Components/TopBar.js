import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Grid, Button } from '@material-ui/core/';
import { withRouter } from 'react-router-dom';
import semiLogo from '../Images/semi-logo.png'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    navBackGround: {
        background: 'linear-gradient(45deg, #501f2c 30%, #612837 60% )'

    },

    title: {
        flexGrow: 1,
    },
    btn: {
        fontFamily: "Comic Sans MS",

        "&:focus": {
            outline: "none"
        },
    },
    logo: {
        maxWidth: 60
    },
}));

function TopBar(props) {
    const classes = useStyles();

    const handleClickButton = (target) => { // טיפול בלחיצת כפתור בתפריט
        if (target === "Main") {
            props.history.push({
                pathname: '/Main'
            });
        }
        else if (target === "AccountDetails") {
            props.history.push({
                pathname: '/AccountDetails'
            });
        }
        else if (target === "Logout") {
            props.logout();
        }
        else if (target === "Register") {
            props.history.push({
                pathname: '/Register'
            });
        }
        else {
            props.history.push({
                pathname: '/'
            });
        }
    };

    return (
        props.currentUser !== undefined ? // במידה והמשתמש מחובר
            <Grid>
                <AppBar position="static" className={classes.navBackGround}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            <img className={classes.logo}  src={semiLogo} alt="semi-logo" />
                        </Typography>
                        <Button onClick={() => handleClickButton("Main")} className={classes.btn} size="small" color="inherit">Main</Button>
                        <Button onClick={() => handleClickButton("AccountDetails")} className={classes.btn} size="small" color="inherit">Account</Button>
                        <Button onClick={() => handleClickButton("Logout")} className={classes.btn} size="small" variant="outlined" color="inherit">Logout</Button>
                    </Toolbar>
                </AppBar>
            </Grid>
            :
            <Grid>
                <AppBar position="static" className={classes.navBackGround}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            <img className={classes.logo} src={semiLogo} alt="semi-logo" />
                        </Typography>
                        <Button onClick={() => handleClickButton("Register")} className={classes.btn} size="small" color="inherit">Register</Button>
                        <Button onClick={() => handleClickButton("Login")} className={classes.btn} size="small" color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </Grid>
    );
}

export default withRouter(TopBar);