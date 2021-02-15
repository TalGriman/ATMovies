import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, TextField, Grid, IconButton, Typography, Avatar, Divider, GridList, Card, CardActions, CardContent, InputAdornment } from '@material-ui/core';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from '@material-ui/icons/Delete';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import CloseIcon from '@material-ui/icons/Close';
import MCardScroll from './MCardScroll';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';
import StarsIcon from '@material-ui/icons/Stars';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const CssTextField = withStyles({ // אינפור עוצב מטריאל-יו-איי
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

const styles = theme => ({ // הצורה בה מעצבים ועורכים עיצוב במטריאל-יו-איי
    btn: {
        fontFamily: "Comic Sans MS",
        color: "#612837",
        "&:focus": {
            outline: "none"
        },
    },
    btnDelete: {
        color: "white",
        fontFamily: "Comic Sans MS",
        "&:focus": {
            outline: "none"
        },
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        border: "1px solid black",
        marginLeft: 10
    },
    image: {
        border: "1px solid black",
        [theme.breakpoints.up("xs")]: {
            width: theme.spacing(10),
            height: theme.spacing(10),
        },
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(13),
            height: theme.spacing(13),
        },
        [theme.breakpoints.up("md")]: {
            width: theme.spacing(15),
            height: theme.spacing(15),
        },
    },
    gridList: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
    },
    divider: {
        margin: "10px 0px"
    },
    card: {
        background: "rgba(146, 139, 129, 0.2)",
        [theme.breakpoints.up("xs")]: {
        },
        [theme.breakpoints.up("sm")]: {
            boxShadow: "0 8px 16px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23)"
        },
        [theme.breakpoints.up("md")]: {
            boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
        },
    },
    categoriesShow: {
        [theme.breakpoints.up("xs")]: {
            marginTop: 15
        },
        [theme.breakpoints.up("sm")]: {
            marginTop: 30
        },
        [theme.breakpoints.up("md")]: {
            marginTop: 45
        },
    },
    searchResultsTypography: {
        fontFamily: "Comic Sans MS",
        color: "#612837",
        [theme.breakpoints.up("xs")]: {
            fontSize: 18
        },
        [theme.breakpoints.up("sm")]: {
            fontSize: 22,
            marginTop: 8,
        },
        [theme.breakpoints.up("md")]: {
            fontSize: 24,
            marginTop: 15,
        },
    },
    secondarySearchResultsTypography: {
        fontFamily: "Comic Sans MS",
        color: "#612837",
        [theme.breakpoints.up("xs")]: {
            fontSize: 16,
            marginTop: 7,
            marginBottom: 7
        },
        [theme.breakpoints.up("sm")]: {
            fontSize: 18,
            marginTop: 15,
            marginBottom: 15
        },
        [theme.breakpoints.up("md")]: {
            fontSize: 22,
            marginTop: 30,
            marginBottom: 30
        },
    },
    subTitleTypography: {
        fontFamily: "Comic Sans MS",
        color: "#612837",
        [theme.breakpoints.up("xs")]: {
            fontSize: 20
        },
        [theme.breakpoints.up("sm")]: {
            fontSize: 24
        },
        [theme.breakpoints.up("md")]: {
            fontSize: 27
        },
    },
    userDetails: {
        [theme.breakpoints.up("xs")]: {
            marginTop: 30,
            marginBottom: 15
        },
        [theme.breakpoints.up("sm")]: {
            marginTop: 80,
            marginBottom: 40
        },
        [theme.breakpoints.up("md")]: {
            marginTop: 100,
        },
    },
    cardContent: {
        [theme.breakpoints.up("xs")]: {
            marginTop: 15,
        },
        [theme.breakpoints.up("sm")]: {
            marginTop: 35,
            marginBottom: 10
        },
        [theme.breakpoints.up("md")]: {
            marginTop: 50,
            marginBottom: 25
        },
    },
    cardImage: {
        [theme.breakpoints.up("xs")]: {
            marginBottom: 15,
        },
        [theme.breakpoints.up("sm")]: {
            marginBottom: 0
        },
        [theme.breakpoints.up("md")]: {
            marginBottom: 0
        },
    },
    cardText: {
        color: "#612837",
        fontFamily: "Comic Sans MS",
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
    slideShow: {
        background: '#f2f0eb',
        [theme.breakpoints.up("xs")]: {
            marginBottom: 20
        },
        [theme.breakpoints.up("sm")]: {
            paddingLeft: 80,
            paddingRight: 80,
            marginBottom: 40
        },
        [theme.breakpoints.up("md")]: {
            paddingLeft: 200,
            paddingRight: 200,
            marginBottom: 60
        },
    },
});

class AccountDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            cPassword: "",
            displayName: "",
            img: "",
            rgxPasswordMessage: "",
            rgxCPasswordMessage: "",
            rgxImgMessage: "",
            rgxDisplayNameMessage: "",
            rgxImgBool: false,
            rgxDisplayNameBool: false,
            rgxPasswordBool: false,
            rgxCPasswordBool: false,
            switchEditGrid: false, // להחלפה של האייקון עריכה באייקון של איקס ולהפך
            favoriteGenreName: "",
            passwordEyeBool: false,
            cPasswordEyeBool: false
        };
    };

    componentDidMount() {
        const handleLoginUser = async () => {
            await this.props.updateCurrentUserAndUsersState(); // עדכון היוזר במקרה של רענון או כניסה ראשונה לעמוד
            if (this.props.currentUser === undefined) { // במידה והיוזר לא מחובר לך להתחברות
                this.props.history.push({
                    pathname: '/'
                });
            }
            else {
                this.updateFavoriteGenreName(); // עדכון של שם הגאנר המועדף
                this.setState({ email: this.props.currentUser.email, password: this.props.currentUser.password, cPassword: this.props.currentUser.password, displayName: this.props.currentUser.displayName, img: this.props.currentUser.img }); // השמה של הפרטים של המשתמש שמחובר
            }
        };
        handleLoginUser();
    };

    updateFavoriteGenreName = () => { // בודק את הגאנר המועדף על המשתמש ומוציא מהמערך את שם הג'אנר
        let max = 0, gName = "";
        this.props.currentUser.genresCounter.map((g) => {
            if (g.clicks > max) {
                max = g.clicks;
                gName = g.name;
            }
            return max;
        });
        if (max > 0) { // במידה ויש ג'אנר מועדף
            this.setState({ favoriteGenreName: gName });
        }
        else { // במידה ואין ג'אנר מועדף
            this.setState({ favoriteGenreName: "No favorite yet!" });
        }
    };

    onChangeImage = (event) => { // ברגע שינוי התמונה
        const imgRgx = /\.(jpe?g|png)$/;
        if (!event.target.files[0]) { // במידה שברגע של שינוי מחליטים לא לשים תמונה
            this.setState({ rgxImgMessage: "", img: this.props.currentUser.img, rgxImgBool: false });
            return;
        }
        if (!imgRgx.test(event.target.files[0].name.toLowerCase())) { // במידה וזה קובץ שאנו לא מקבלים
            this.setState({ rgxImgMessage: "only jpg/jpeg/png files allowed!", img: this.props.currentUser.img, rgxImgBool: true });
            return;
        }
        this.setState({ rgxImgMessage: "", rgxImgBool: false })
        const uploadImage = async (event) => {
            const file = event.target.files[0];
            const base64 = await this.convertBase64(file);
            this.setState({ img: base64 })
        };
        uploadImage(event);
        //this.setState({ recipeImg: event.target.value });
    };

    convertBase64 = (file) => {
        return new Promise((resolve, reject) => { // פרומיס מקבל פונקציה המקבלת 2 פרמטרים ריסולב-הצלחה וריג'קט כילשון
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file); // ממיר את הקובץ לדטה base64
            fileReader.onload = () => {
                resolve(fileReader.result); // פה זה בהצלחה ויחזיר את התוצאה
            };
            fileReader.onerror = (error) => {
                reject(error); // יחזיר שגיאה
            };
        });
    };

    onChangeInputs = (e, index) => { // כדי לבצע שינויים בסטייטס
        if (index === 1) {
            this.setState({ displayName: e.target.value });
        }
        else if (index === 2) {
            this.setState({ password: e.target.value });
        }
        else {
            this.setState({ cPassword: e.target.value });
        }
    };

    saveChanges = () => { // בלחיצה על שמיררת הנתונים
        const passwordRgx = /^(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&*_=@])[A-Za-z0-9!#$%&*_=@]{7,}$/;
        const displayNameRgx = /^[a-zA-Z0-9]{2,15}$/;
        let validateFieldsCounter = 0;
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
        if (!displayNameRgx.test(this.state.displayName)) {
            this.setState({ rgxDisplayNameMessage: "Only english letters and digits allowed!", rgxDisplayNameBool: true });
        }
        else {
            this.setState({ rgxDisplayNameMessage: "", rgxDisplayNameBool: false });
            validateFieldsCounter++;
        }
        if (validateFieldsCounter !== 3 || this.state.rgxImgBool) {
            return;
        }
        this.props.updateUserDetails({ email: this.state.email, password: this.state.password, displayName: this.state.displayName, img: this.state.img, genresCounter: this.props.currentUser.genresCounter, myFavorites: this.props.currentUser.myFavorites }); //מעדכן את פרטי המשתמש
        this.setState({ switchEditGrid: false, cPasswordEyeBool: false, passwordEyeBool: false }) // מעדכן את הסטייט לדיפולטיבי
    };

    deleteAccount = () => { // מחיקת המשתמש
        this.props.deleteAccount();
    };

    handleSwitchEditGrid = () => { // להצגת העריכת פרטים ולסגירה
        this.setState({ switchEditGrid: !this.state.switchEditGrid, rgxImgBool: false, rgxImgMessage: "", rgxDisplayNameMessage: "", rgxDisplayNameBool: false, displayName: this.props.currentUser.displayName, rgxPasswordMessage: "", rgxPasswordBool: false, password: this.props.currentUser.password, rgxCPasswordMessage: "", rgxCPasswordBool: false, cPassword: this.props.currentUser.password, passwordEyeBool: false, cPasswordEyeBool: false })
    };

    clickEye = (index) => { // לשדות שיש בהן עיין כדי לראות מה רשום
        if (index === 2) {
            this.setState({ passwordEyeBool: !this.state.passwordEyeBool });
        }
        else {
            this.setState({ cPasswordEyeBool: !this.state.cPasswordEyeBool });
        }
    };

    render() {
        const { classes } = this.props;
        const inputs = ["Email", "Display name", "Password", "Confirm password"];
        const renderedInputs = inputs.map((input, index) => {
            return (
                <Grid item xs={12} sm={12} md={6} align="center" key={index}>
                    {
                        index !== 2 && index !== 3 ?
                            <CssTextField
                                disabled={index === 0}
                                value={index === 0 ? this.state.email : this.state.displayName}
                                label={input}
                                type="text"
                                variant="outlined"
                                onChange={(e) => this.onChangeInputs(e, index)}
                                fullWidth
                                error={index === 1 ? this.state.rgxDisplayNameBool : false}
                            />
                            :
                            <CssTextField
                                value={index === 2 ? this.state.password : this.state.cPassword}
                                label={input}
                                variant="outlined"
                                type={index === 2 ? this.state.passwordEyeBool ? "text" : "password" : this.state.cPasswordEyeBool ? "text" : "password"}
                                onChange={(e) => this.onChangeInputs(e, index)}
                                fullWidth
                                InputProps={
                                    index === 2 ?
                                        { endAdornment: <InputAdornment><IconButton className={classes.btn} onClick={() => this.clickEye(index)}>{this.state.passwordEyeBool ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }
                                        :
                                        { endAdornment: <InputAdornment><IconButton className={classes.btn} onClick={() => this.clickEye(index)}>{this.state.cPasswordEyeBool ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }
                                }
                                error={index === 2 ? this.state.rgxPasswordBool : this.state.rgxCPasswordBool}
                            />
                    }
                    <Typography variant="subtitle1" style={{ color: `red` }}>
                        {index === 1 ? this.state.rgxDisplayNameMessage : index === 2 ? this.state.rgxPasswordMessage : index === 3 ? this.state.rgxCPasswordMessage : null}
                    </Typography>

                </Grid>
            );
        });

        return (
            this.props.currentUser !== undefined ? //בדיקה האם יש יוזר מחובר
                <Grid container>
                    <Grid container item xs={12} justify="center" className={classes.userDetails}>
                        <Grid item xs={12} sm={9} md={6}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography className={classes.title} variant="h5" component="h2">
                                        Account details
                                    </Typography>
                                    <Divider />
                                    <Grid container item xs={12} className={classes.cardContent}>
                                        <Grid container item xs={12} sm={3} md={4} className={classes.cardImage} justify="center" alignItems="center">
                                            <Avatar className={classes.image} src={this.props.currentUser.img} alt="userImg" />
                                        </Grid>
                                        <Grid item xs={12} sm={9} md={8} className={classes.cardText} style={{ paddingLeft: "15%" }}>
                                            <Typography className={classes.cardText} color="textSecondary" gutterBottom>
                                                <MailOutlineOutlinedIcon /> Email - {this.props.currentUser.email}
                                            </Typography>
                                            <Typography className={classes.cardText} color="textSecondary" gutterBottom>
                                                <LabelOutlinedIcon /> Displayname - {this.props.currentUser.displayName}
                                            </Typography>
                                            <Typography className={classes.cardText} color="textSecondary" gutterBottom>
                                                <FavoriteIcon /> Favorites - {this.props.currentUser.myFavorites.length}
                                            </Typography>
                                            <Typography className={classes.cardText} color="textSecondary" gutterBottom>
                                                <StarsIcon /> Favorite genre - {this.state.favoriteGenreName}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardActions >
                                    {
                                        this.state.switchEditGrid ? // בצגה או הסתרה של אייקון העריכה
                                            null
                                            :
                                            <IconButton onClick={this.handleSwitchEditGrid} className={classes.btn}>
                                                <BorderColorIcon />
                                            </IconButton>
                                    }
                                </CardActions>
                                {
                                    this.state.switchEditGrid ? // הצגה או התרה של העריכה
                                        <CardContent>
                                            <Grid container item xs={12}>
                                                <Typography className={classes.title} variant="h5" component="h2">
                                                    Edit details
                                                </Typography>
                                                <IconButton onClick={this.handleSwitchEditGrid} style={{ marginLeft: "auto" }} className={classes.btn}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </Grid>

                                            <Divider />
                                            <Grid container spacing={4} item xs={12} style={{ margin: 0 }} className={classes.cardContent}>
                                                {renderedInputs}
                                                <Grid container item xs={12}>
                                                    <IconButton aria-label="photo" className={classes.btn} component="label">
                                                        <AddAPhotoIcon />
                                                        <input onChange={this.onChangeImage} type="file" hidden accept="image/*" />
                                                    </IconButton>
                                                    <Avatar className={classes.large} src={this.state.img !== "" ? this.state.img : this.props.currentUser.img} alt="userImg" />
                                                </Grid>
                                                <Typography variant="subtitle1" style={{ color: `red` }}>
                                                    {this.state.rgxImgMessage}
                                                </Typography>
                                            </Grid>
                                            <CardActions>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12} sm={6} md={6} align="center">
                                                        <Button fullWidth onClick={this.saveChanges} className={classes.btn} variant="outlined">Save</Button>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={6}>
                                                        <Button
                                                            fullWidth
                                                            variant="contained"
                                                            color="secondary"
                                                            className={classes.btnDelete}
                                                            startIcon={<DeleteIcon />}
                                                            onClick={this.deleteAccount}
                                                        >
                                                            Delete Account
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </CardActions>
                                        </CardContent>
                                        :
                                        null
                                }
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={`${classes.slideShow}`}>
                        <Grid className={classes.categoriesShow}>
                            <Grid container item xs={12}>
                                <Typography className={classes.subTitleTypography} variant="h4" component="h4">
                                    My Favorites
                                </Typography>
                            </Grid>
                            <Divider className={classes.divider} />
                            {
                                this.props.currentUser.myFavorites.length > 0 ?
                                    <GridList className={classes.gridList} style={{ margin: 0 }}>
                                        {
                                            this.props.currentUser.myFavorites.map((m, i) => {
                                                return (
                                                    <MCardScroll key={i} movie={m} />
                                                );
                                            })}
                                    </GridList>
                                    :
                                    <Grid item align="center">
                                        <FavoriteIcon style={{ fontSize: 100, color: "lightgray" }} />
                                        <Typography className={classes.searchResultsTypography} variant="h3" component="h3">
                                            No favorites yet!
                                        </Typography>
                                        <Typography className={classes.secondarySearchResultsTypography} variant="h3" component="h3">
                                            To add favorites go to the desired movie and click on the heart icon
                                        </Typography>
                                    </Grid>
                            }
                            <Divider className={classes.divider} />
                        </Grid>
                    </Grid>

                </Grid>
                :
                null
        );
    };
};

export default withStyles(styles, { withTheme: true })(withRouter(AccountDetails));