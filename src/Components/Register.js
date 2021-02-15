import React from 'react';
import { Button, TextField, Typography, Grid, Card, CardContent, Divider, CardActions, InputAdornment, IconButton } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { withStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from '@material-ui/icons';

const CssTextField = withStyles({
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

const styles = theme => ({
    btn: {
        fontFamily: "Comic Sans MS",
        color: "#612837",
        "&:focus": {
            outline: "none"
        },
    },
    loginLinkText: {
        color: "#612837",
        fontFamily: "Comic Sans MS",
    },
    loginLink: {
        color: "#cea225",
        fontFamily: "Comic Sans MS",
        '&:hover': {
            color: "#cea225",
        }
    },
    card: {
        background: "rgba(146, 139, 129, 0.2)",
        [theme.breakpoints.up("xs")]: {
            marginTop:50,
            marginBottom:50
        },
        [theme.breakpoints.up("sm")]: {
            boxShadow: "0 8px 16px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23)",
            marginTop:80,
            marginBottom:80
        },
        [theme.breakpoints.up("md")]: {
            boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
            marginTop:100,
            marginBottom:100
            
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


class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            cPassword: "",
            rgxEmailMessage: "",
            rgxPasswordMessage: "",
            rgxCPasswordMessage: "",
            rgxEmailBool: false,
            rgxPasswordBool: false,
            rgxCPasswordBool: false,
            existUserMessage: "",
            passwordEyeBool: false,
            cPasswordEyeBool: false
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

    onChangeInputs = (e, index) => { // מעדכן את הסטיטים של האימייל, סיסמה ואימות סיסמה 
        if (index === 0) {
            this.setState({ email: e.target.value });
        }
        else if (index === 1) {
            this.setState({ password: e.target.value });
        }
        else {
            this.setState({ cPassword: e.target.value });
        }
    };

    register = () => { // בפעולת ההרשמה בודק את הפרטים ובמידה והמשמש לא קיים וכל האינפוטים נכונים ירשום יעבור ללוגין
        const emailRgx = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]{2,15}(?:\.[a-zA-Z]+){1,2}$/;
        const passwordRgx = /^(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&*_=@])[A-Za-z0-9!#$%&*_=@]{7,}$/;
        let validateFieldsCounter = 0;
        if (!emailRgx.test(this.state.email)) {
            this.setState({ rgxEmailMessage: "Invalid email format!", rgxEmailBool: true });
        }
        else {
            this.setState({ rgxEmailMessage: "", rgxEmailBool: false });
            validateFieldsCounter++;
        }
        if (!passwordRgx.test(this.state.password)) {
            this.setState({ rgxPasswordMessage: "Password must include at least one capital letter, one number and one special character (!#$%&*_=@)", rgxPasswordBool: true });
        }
        else {
            this.setState({ rgxPasswordMessage: "", rgxPasswordBool: false });
            validateFieldsCounter++;
        }
        if (!(this.state.cPassword === this.state.password) || this.state.cPassword === "") {
            this.setState({ rgxCPasswordMessage: "Password does not match!", rgxCPasswordBool: true });
        }
        else {
            this.setState({ rgxCPasswordMessage: "", rgxCPasswordBool: false });
            validateFieldsCounter++;
        }
        let existUser = this.props.users.find((user) => user.email.toUpperCase() === this.state.email.toUpperCase()) !== undefined;
        if (existUser) {
            this.setState({ existUserMessage: "This account is already exist" });
        }
        else {
            this.setState({ existUserMessage: "" });
            validateFieldsCounter++;
        }
        if (validateFieldsCounter !== 4) {
            return;
        }
        this.props.addUser({ email: this.state.email, password: this.state.password });
        this.setState({ email: "", password: "", cPassword: "", rgxEmailMessage: "", rgxPasswordMessage: "", rgxCPasswordMessage: "", rgxEmailBool: false, rgxPasswordBool: false, rgxCPasswordBool: false, existUserMessage: "" });
        this.props.history.push({
            pathname: '/'
        });
    };

    clickEye = (index) => { // בלחיצה על העיין שבסיסמאות
        if (index === 1) {
            this.setState({ passwordEyeBool: !this.state.passwordEyeBool });
        }
        else {
            this.setState({ cPasswordEyeBool: !this.state.cPasswordEyeBool });
        }
    };

    render() {
        const { classes } = this.props;
        const inputs = ["Email", "Password", "Confirm password"];
        const renderedInputs = inputs.map((input, index) => {
            return (
                <Grid style={{ marginTop: 10 }} key={index}>
                    {
                        index === 0 ?
                            <CssTextField
                                value={this.state.email}
                                onChange={(e) => this.onChangeInputs(e, index)}
                                type="text"
                                label={input}
                                variant="outlined"
                                error={this.state.rgxEmailBool}
                                fullWidth
                            />
                            :
                            <CssTextField
                                value={index === 1 ? this.state.password : this.state.cPassword}
                                onChange={(e) => this.onChangeInputs(e, index)}
                                type={index === 1 ? this.state.passwordEyeBool ? "text" : "password" : this.state.cPasswordEyeBool ? "text" : "password"}
                                label={input}
                                variant="outlined"
                                fullWidth
                                InputProps={
                                    index === 1 ?
                                        { endAdornment: <InputAdornment><IconButton className={classes.btn} onClick={() => this.clickEye(index)}>{this.state.passwordEyeBool ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }
                                        :
                                        { endAdornment: <InputAdornment><IconButton className={classes.btn} onClick={() => this.clickEye(index)}>{this.state.cPasswordEyeBool ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }
                                }
                                error={index === 1 ? this.state.rgxPasswordBool : this.state.rgxCPasswordBool}
                            />
                    }
                    <Typography variant="subtitle1" style={{ color: `red` }}>
                        {index === 0 ? this.state.rgxEmailMessage : index === 1 ? this.state.rgxPasswordMessage : this.state.rgxCPasswordMessage}
                    </Typography>
                </Grid>
            );
        });
        return (
            this.props.currentUser === undefined ? // בדיקה האם אין משמתמש מחובר,במידה ואין אז יציג את הדף אחרת נאל
            
                <Grid container justify="center">
                    <Grid container justify="center" item xs={12}>
                        <Grid item xs={12} sm={10} md={8}>
                            <Card className={classes.card} variant="outlined">
                                <CardContent>
                                    <Typography className={classes.title} variant="h5" component="h2">
                                        Register
                                    </Typography>
                                    <Divider />
                                    {renderedInputs}
                                </CardContent>
                                <CardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
                                    <Typography variant="subtitle1" style={{ color: `red` }}>
                                        {this.state.existUserMessage}
                                    </Typography>
                                </CardContent>
                                <CardActions style={{ padding: 16 }}>
                                    <Button className={classes.btn} fullWidth size="large" onClick={this.register} variant="outlined">Register</Button>
                                </CardActions>
                                <CardContent style={{ paddingTop: 0, paddingBottom: 5 }}>
                                    <Typography className={classes.loginLinkText}>
                                        Already have account? <Link className={classes.loginLink} to="/">Login</Link>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>


                : null
        );
    };
};

export default withStyles(styles, { withTheme: true })(withRouter(Register));