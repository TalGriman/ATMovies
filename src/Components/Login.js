import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, TextField, Typography, Grid, Card, CardActions, CardContent, Divider, InputAdornment, IconButton } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from '@material-ui/icons';

const CssTextField = withStyles({ // טקסט-פילד בעיצוב אישי
    root: {
        '& label': {
            fontFamily: "Comic Sans MS",
        },
        '& input': {
            fontFamily: "Comic Sans MS",
        },
        '& label.Mui-focused': {
            color: '#612837',
            fontFamily: "Comic Sans MS",
        },
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
                borderColor: '#5a585d',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#612837',
            },
        },
    },
})(TextField);

const styles = theme => ({ // עיצוב במטריאל-יו-איי
    btn: {
        fontFamily: "Comic Sans MS",
        color: "#612837",
        "&:focus": {
            outline: "none"
        },
    },
    registerLinkText: {
        color: "#612837",
        fontFamily: "Comic Sans MS",
    },
    registerLink: {
        color: "#cea225",
        fontFamily: "Comic Sans MS",
        '&:hover': {
            color: "#cea225",
        }
    },
    aboutUsText: {
        color: "#612837",
        fontFamily: "Comic Sans MS",
        [theme.breakpoints.up("xs")]: {
            fontSize: 18
        },
        [theme.breakpoints.up("sm")]: {
            fontSize: 22
        },
        [theme.breakpoints.up("md")]: {
            fontSize: 26
        },
    },
    aboutUs: {
        color: "#612837",
        fontFamily: "Comic Sans MS",
        [theme.breakpoints.up("xs")]: {
            marginTop: 30,
            marginBottom: 30
        },
        [theme.breakpoints.up("sm")]: {
            marginTop: 40,
            marginBottom: 40
        },
        [theme.breakpoints.up("md")]: {
            marginTop: 50,
            marginBottom: 50
        },
    },
    card: {
        background: "rgba(146, 139, 129, 0.2)",
        [theme.breakpoints.up("xs")]: {
            marginBottom:25
        },
        [theme.breakpoints.up("sm")]: {
            boxShadow: "0 8px 16px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23)",
            marginBottom:50
        },
        [theme.breakpoints.up("md")]: {
            boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
            marginBottom:50
        },
    },
    title: {
        color: "#612837",
        fontFamily: "Comic Sans MS",
        [theme.breakpoints.up("xs")]: {
            fontSize: 22
        },
        [theme.breakpoints.up("sm")]: {
            fontSize: 26
        },
        [theme.breakpoints.up("md")]: {
            fontSize: 28
        },
    },
});


class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            invalidMessage: "",
            email: "",
            password: "",
            passwordEyeBool: false
        };
    };

    componentDidMount() {
        const handleLoginUser = async () => { // כדי לבדוק האם יש משתמש מחובר 
            await this.props.updateCurrentUserAndUsersState();
            if (this.props.currentUser !== undefined) { // במידה ויש משתמש מחובר יעביר למיין 
                this.props.history.push({
                    pathname: '/Main'
                });
            }
        };
        handleLoginUser();
    };

    onChangeInputs = (e, index) => { // מעדכן את הסטיטים של האימייל והסיסמה 
        if (index === 0) {
            this.setState({ email: e.target.value });
        }
        else {
            this.setState({ password: e.target.value });
        }
    };

    login = () => { // בודק האם פרטי המשתמש נכונים במידה ולא מציג שגיאה במידה וכן יעביר לדף של המיין
        let loginUser = this.props.users.find((user) => user.email.toUpperCase() === this.state.email.toUpperCase() && user.password === this.state.password);
        if (loginUser === undefined) {
            this.setState({ invalidMessage: "Wrong details!" });
            return;
        }
        this.setState({ invalidMessage: "" });
        this.props.login(loginUser);
        this.props.history.push({
            pathname: '/Main'
        });


    };

    clickEye = () => { // בלחיצה על העיין בסיסמה 
        this.setState({ passwordEyeBool: !this.state.passwordEyeBool })
    };

    render() {
        const { classes } = this.props;
        const inputs = ["Email", "Password"];
        const renderedInputs = inputs.map((input, index) => {
            return (
                <Grid style={{ marginTop: 10, }} key={index}>
                    {
                        index === 0 ?
                            <CssTextField
                                value={this.state.email}
                                onChange={(e) => this.onChangeInputs(e, index)}
                                type="text"
                                label={input}
                                variant="outlined"
                                error={this.state.invalidMessage !== ""}
                                fullWidth
                            />
                            :
                            <CssTextField
                                value={this.state.password}
                                onChange={(e) => this.onChangeInputs(e, index)}
                                type={this.state.passwordEyeBool ? "text" : "password"}
                                label={input}
                                variant="outlined"
                                error={this.state.invalidMessage !== ""}
                                fullWidth
                                InputProps={{ endAdornment: <InputAdornment><IconButton className={classes.btn} onClick={this.clickEye}>{this.state.passwordEyeBool ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }}
                            />
                    }
                </Grid>
            );
        });
        return (
            this.props.currentUser === undefined ? // אם אין יוזר מחובר יציג את הדברים אחרת נאל
                <Grid container justify="center">
                    <Grid container className={classes.aboutUs} item xs={11} justify="center">
                        <Typography className={classes.aboutUsText} align="center" >
                            Welcome to a world full of imagination, action, adventure and more ...
                        <br />
                            A Huge variety of movies from different genres!
                        <br />
                            We invite you to review, comment and rate the movies.
                        </Typography>
                    </Grid>
                    <Grid container justify="center" item xs={12}>
                        <Grid item xs={12} sm={10} md={8}>
                            <Card className={classes.card} variant="outlined">
                                <CardContent>
                                    <Typography className={classes.title} variant="h5" component="h2">
                                        Login
                                    </Typography>
                                    <Divider />
                                    {renderedInputs}
                                </CardContent>
                                <CardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
                                    <Typography variant="subtitle1" style={{ color: `red` }}>
                                        {this.state.invalidMessage}
                                    </Typography>
                                </CardContent>
                                <CardActions style={{ padding: 16 }}>
                                    <Button className={classes.btn} fullWidth size="large" onClick={this.login} variant="outlined">Login</Button>
                                </CardActions>
                                <CardContent style={{ paddingTop: 0, paddingBottom: 5 }}>
                                    <Typography className={classes.registerLinkText}>
                                        Not a memeber? <Link className={classes.registerLink} to="/Register">Register now</Link>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                </Grid>
                :
                null
        );
    };
};
export default withStyles(styles, { withTheme: true })(withRouter(Login));