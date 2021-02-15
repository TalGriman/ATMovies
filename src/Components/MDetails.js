import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { FormControlLabel, Grid, IconButton, TextField, Typography, Switch, Divider, Chip, GridList, List } from '@material-ui/core';
import AddCommentIcon from '@material-ui/icons/AddComment';
import { withStyles } from "@material-ui/core/styles";
import { Rating } from '@material-ui/lab';
import Comment from './Comment';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import CastCard from './CastCard';

const CssTextField = withStyles({ // טקסט-פילד בעיצוב אישי במטריאל-יו-איי
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
    wrapper: {
        [theme.breakpoints.up("xs")]: {
            marginBottom: 5
        },
        [theme.breakpoints.up("sm")]: {
            marginBottom: 10
        },
        [theme.breakpoints.up("md")]: {

            marginBottom: 20
        },
    },
    btn: {
        color: "#612837",
        "&:focus": {
            outline: "none"
        },
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    switch: {
        margin: 0
    },
    movieOverview: {
        fontFamily: "Comic Sans MS",
        color: "#612837",
        [theme.breakpoints.up("xs")]: {
            paddingLeft: 20,
            paddingRight: 12,
        },
        [theme.breakpoints.up("sm")]: {
            paddingLeft: 40,
            paddingRight: 25,
            marginTop: 20
        },
        [theme.breakpoints.up("md")]: {
            paddingLeft: 150,
            paddingRight: 100,
            marginTop: 0
        },
    },
    movieDetails: {
        [theme.breakpoints.up("xs")]: {
            marginTop: 5,
            marginBottom: 10
        },
        [theme.breakpoints.up("sm")]: {
            marginTop: 10,
            marginBottom: 10
        },
        [theme.breakpoints.up("md")]: {
            marginTop: 15,
            marginBottom: 15
        },
    },
    titleWrapper: {
        [theme.breakpoints.up("xs")]: {
            marginBottom: 15
        },
        [theme.breakpoints.up("sm")]: {
            marginBottom: 15
        },
        [theme.breakpoints.up("md")]: {
            marginBottom: 15
        },
    },
    movieTitle: {
        fontFamily: "Comic Sans MS",
        color: "#612837",
        marginLeft: 5,
        [theme.breakpoints.up("xs")]: {
            fontSize: 23
        },
        [theme.breakpoints.up("sm")]: {
            fontSize: 27
        },
        [theme.breakpoints.up("md")]: {
            fontSize: 30
        },
    },
    movieOverviewText: {
        fontFamily: "Comic Sans MS",
        color: "#612837",
        [theme.breakpoints.up("xs")]: {
            fontSize: 16
        },
        [theme.breakpoints.up("sm")]: {
            fontSize: 19
        },
        [theme.breakpoints.up("md")]: {
            fontSize: 22
        },
    },
    movieRating: {
        fontFamily: "Comic Sans MS",
        color: "#612837",
        [theme.breakpoints.up("xs")]: {
            marginTop: 10,
            fontSize: 18,
            marginBottom: 5
        },
        [theme.breakpoints.up("sm")]: {
            marginTop: 0,
            fontSize: 20,
            marginBottom: 0
        },
        [theme.breakpoints.up("md")]: {
            marginTop: 0,
            fontSize: 21,
            marginBottom: 0

        },
    },
    subTitleTypography: {
        fontFamily: "Comic Sans MS",
        color: "#612837",
        marginLeft: 5,
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
    iconFavorite: {
        color: "red"
    },
    rootComments: {
        width: '100%',
        background: "rgba(255, 255, 255, 0.4)"

    },
    inlineComments: {
        display: 'inline',
    },
    slideShow: {
        [theme.breakpoints.up("xs")]: {
        },
        [theme.breakpoints.up("sm")]: {
        },
        [theme.breakpoints.up("md")]: {
        },
    },
    categoriesShow: {
        background: '#f2f0eb',
        [theme.breakpoints.up("xs")]: {
            marginBottom: 15,
            marginTop: 15
        },
        [theme.breakpoints.up("sm")]: {
            paddingLeft: 80,
            paddingRight: 80,
            marginBottom: 15,
            marginTop: 15
        },
        [theme.breakpoints.up("md")]: {
            paddingLeft: 200,
            paddingRight: 200,
            marginBottom: 15,
            marginTop: 15
        },

    },
    commentInputs: {
        [theme.breakpoints.up("xs")]: {
            marginTop: 15
        },
        [theme.breakpoints.up("sm")]: {

            marginTop: 15
        },
        [theme.breakpoints.up("md")]: {

            marginTop: 15
        },
    },
    comments: {
        marginBottom: 15,
    },

});

class MDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentMovie: undefined,
            movieCast: undefined,
            title: "",
            content: "",
            rgxTitleMessage: "",
            rgxTitleBool: false,
            rgxContentMessage: "",
            rgxContentBool: false,
            comments: undefined,
            existMovie: false,
            userRating: 0, // הערך של אינפוט הכוכבים לדרוג בתוגה חדשה
            toRate: false, // האם לדרג או לא לדרג / סוויטש
            usersRatingAverage: 0, // להצגת ממוצע הדירוגים של המשתמשים
            isFavoriteMovie: false,
            windowsWidth: window.innerWidth, // כדי לקבל את רוחב המסך  כדי לבצע תנאים על חלק מהדברים
            commentsWithRatingCounter: 0 // תגובות עם דירוג כמה יש לנו, כדי לדעת האם יש דירוג או אין לנו
        };
    };


    componentDidMount() {
        const handleRender = async () => {
            await this.props.updateCurrentUserAndUsersState();
            if (this.props.currentUser === undefined) { // אם היוזר לא מחובר תעבור לעמוד ההתחברות
                this.props.history.push({
                    pathname: '/'
                });
            }
            else {
                window.addEventListener("resize", this.handleScreenResize); // פתיחת אירוע שיתן את רוחב המסך
                await this.getMovieById(this.props.match.params.id); // בקשה לפרטים של סרט נוכחי
                if (!this.state.existMovie) { //תנאי במידה ואין והייתה שגיאה בקבלת הסרט אז שלא תיהיה שגיאה בשאר הפונקציות
                    return
                }
                this.getCastByMovieId(this.props.match.params.id); // קבלת השחקנים
                await this.props.addMovieToMovieComments(this.props.match.params.id); // הוספת הסרט למערך של ה - movieComments
                this.updateComments(); // לבצגת תגובות במידה וקיימות מלפני
                this.updateIsFavoriteMovie(); // בודק האם הסרט הוא במועדפים או לא , לטובת הלב
            }
        };
        handleRender();
    };

    componentWillUnmount() { // קורא ברגע שהקופוננטה מועמדת לסיום כלומר ביציאה מהקומפוננטה
        window.removeEventListener("resize", this.handleScreenResize); // מסיים את האירוע של רוחב המסך
    };

    handleScreenResize = () => {  // טיפול בעדכון רווחב המסך לסטייט
        this.setState({ windowsWidth: window.innerWidth }); 
    };

    updateComments = () => { // עדכון סטייט התגובות של הסרט הנוכחי
        let currentMovie = this.props.movieComments.find((m) => m.movieId === this.props.match.params.id);
        this.setState({ comments: currentMovie.comments }, () => this.calulateUsersRatingAverage()); // שמנו פה כי כדי לחשב ממוצע אנו משתמשים בסטייט של התגובות כי חייבים אותו מעודכן
    };

    updateIsFavoriteMovie = () => { // בשביל לעדכן את הסרט האם הלב מלא או לא
        let isFavorite = this.props.currentUser.myFavorites.find((m) => m.id === parseInt(this.props.match.params.id)) !== undefined;
        this.setState({ isFavoriteMovie: isFavorite });
    };

    calulateUsersRatingAverage = () => { // פונקציה שמבצעת חישוב של הממוצע של דירוג המשתמשים שלנו
        let avg = 0, counter = 0;
        this.state.comments.map((c) => {
            if (c.toRate) {
                counter++;
                avg += c.rating;
            }
            return avg;
        });
        if (counter !== 0) {
            avg /= counter;
        }
        this.setState({ usersRatingAverage: avg, commentsWithRatingCounter: counter });
    };

    getMovieById = async (id) => { // גישה לשרת כדי להתחל את הסרט הנוכחי
        try {
            const response = await axios.get(`${this.props.movieById}/${id}`, {
                params: {
                    api_key: this.props.apiKey,
                    language: 'en_US',
                }
            });
            const posterUrl = 'https://image.tmdb.org/t/p/w154'
            const modifiedData = {
                id: response.data.id,
                backPoster: posterUrl + response.data.backdrop_path,
                popularity: response.data.popularity,
                title: response.data.title,
                poster: posterUrl + response.data.poster_path,
                overview: response.data.overview,
                rating: response.data.vote_average,
                genres: response.data.genres
            }

            this.setState({ currentMovie: modifiedData, existMovie: true });
        } catch (error) {
            this.props.history.push({
                pathname: '/Main'
            });

        }
    };

    getCastByMovieId = async (id) => { // בקשה מהשרת לנתונים על השחקנים
        try {
            const response = await axios.get(`${this.props.movieById}/${id}/credits`, {
                params: {
                    api_key: this.props.apiKey,
                }

            });
            const castImageUrl = 'https://image.tmdb.org/t/p/w154'
            let modifiedData = response.data.cast.map((c) => ({
                id: c.id,
                character: c.character,
                name: c.name,
                image: castImageUrl + c.profile_path
            }));
            modifiedData = modifiedData.filter((c) => (!c.image.includes(null))); // פילטור שלמקרה שאין תמונה
            modifiedData = modifiedData.filter((c) => (!c.character.includes("uncredited")));

            this.setState({ movieCast: modifiedData });
        } catch (error) {
            this.props.history.push({
                pathname: '/Main'
            });
        }
    };

    onChangeInputs = (e, index) => { // מעדכן את הסטייט של האינפואים בתגובות
        if (index === 0) {
            this.setState({ title: e.target.value });
        }
        else {
            this.setState({ content: e.target.value });
        }
    };

    addComment = () => { // הוספת תגובה
        const titleRgx = /^(?=.{1,50}$)[A-Za-z0-9!.,?&$@-]+(?:[\s][A-Za-z0-9!.,?&$@-]+)*$/;
        const contentRgx = /^.{3,150}$/;
        let validateFieldsCounter = 0;
        if (!titleRgx.test(this.state.title)) {
            this.setState({ rgxTitleMessage: "Only english letters,digits and special chracters(!.,?&$@-) seperated by space allowed!", rgxTitleBool: true });
        }
        else {
            this.setState({ rgxTitleMessage: "", rgxTitleBool: false });
            validateFieldsCounter++;
        }
        if (!contentRgx.test(this.state.content)) {
            this.setState({ rgxContentMessage: "3-150 characters", rgxContentBool: true });
        }
        else {
            this.setState({ rgxContentMessage: "", rgxContentBool: false });
            validateFieldsCounter++;
        }
        if (validateFieldsCounter !== 2) {
            return;
        }

        this.props.addCommentToMovieComments( // הוספת תגובה למערך. הפונקציה מקבלת שני פרמטרים
            this.props.match.params.id, // האיידי של הסרט
            { // אובייקט תגובה
                title: this.state.title,
                content: this.state.content,
                rating: this.state.userRating,
                toRate: this.state.toRate,
                user: { email: this.props.currentUser.email }
            }
        )
        this.updateComments(); // מעדכן את התגובות כאן כדי לעדכן את הסטייט ואת הממוצע במידת הצורך
        this.setState({ title: "", content: "", userRating: 0, toRate: false }); // איפוס שדות
    };

    changeUserRating = (e) => { // בשביל הכוכבים שהמשתמש נותן
        this.setState({ userRating: parseInt(e.target.defaultValue) });
    };

    changeToRate = () => { // בשביל הסוויטץ כדי לדעת האם היוזר דירג או לא
        this.setState({ toRate: !this.state.toRate })
    };

    handleUserFavorites = () => { // עדכון אם הסרט הוא מועדף או לא
        if (this.state.isFavoriteMovie) {
            this.props.removeMovieFromUserFavorites(this.state.currentMovie); // הסרה מהמועדפים
            this.setState({ isFavoriteMovie: false });
        }
        else {
            this.props.addMovieToUserFavorites(this.state.currentMovie) // הוספה למועדפים
            this.setState({ isFavoriteMovie: true });
        }
    };

    render() {
        const inputs = ["Title", "Content"];
        const renderedInputs = inputs.map((input, index) => {
            return (
                this.props.currentUser !== undefined ?

                    <Grid item xs={12} key={index}>
                        {
                            index === 0 ?
                                <CssTextField
                                    value={this.state.title}
                                    onChange={(e) => this.onChangeInputs(e, index)}
                                    type="text"
                                    label={input}
                                    variant="outlined"
                                    error={this.state.rgxTitleBool}
                                    fullWidth
                                />
                                :
                                <CssTextField
                                    value={this.state.content}
                                    onChange={(e) => this.onChangeInputs(e, index)}
                                    type="text"
                                    label={input}
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    error={this.state.rgxContentBool}
                                    fullWidth
                                    style={{ marginTop: 6 }}
                                />
                        }

                        <Typography variant="subtitle1" style={{ color: `red` }}>
                            {index === 0 ? this.state.rgxTitleMessage : this.state.rgxContentMessage}
                        </Typography>
                    </Grid>
                    :
                    null
            );
        });

        return (
            this.props.currentUser !== undefined && this.state.existMovie && this.state.currentMovie !== undefined && this.state.movieCast !== undefined && this.state.comments !== undefined ? // במידה וכל אלו קיימים אז הצג אחרת נאל 
                <Grid container className={this.props.classes.wrapper}>
                    <Grid container item xs={12} className={this.props.classes.movieDetails}>
                        <Grid item xs={12} className={this.props.classes.titleWrapper}>
                            <Typography className={this.props.classes.movieTitle} variant="h4" component="h4">
                                {this.state.currentMovie.title}
                            </Typography>
                            <Divider />
                        </Grid>
                        <Grid container item xs={12} sm={12} md={4}>
                            <Grid container item xs={12} sm={7}>
                                <Grid item xs={12} align="center">
                                    <img src={this.state.currentMovie.poster} alt={this.state.currentMovie.title} />
                                </Grid>
                                <Grid item xs={12} align="center">
                                    <IconButton onClick={this.handleUserFavorites} aria-label="delete" className={this.props.classes.btn}>
                                        {
                                            this.state.isFavoriteMovie ?
                                                <FavoriteIcon className={this.props.classes.iconFavorite} fontSize="default" />
                                                :
                                                <FavoriteBorderOutlinedIcon className={this.props.classes.iconFavorite} fontSize="default" />
                                        }
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12} align="center">
                                    {
                                        this.state.currentMovie.genres.map((g, index) =>
                                            <Chip key={index} variant="outlined" size="small" label={g.name} />
                                        )
                                    }
                                </Grid>
                            </Grid>
                            <Grid container item xs={12} sm={5} alignItems="center" align={this.state.windowsWidth < 600 ? "center" : null}>
                                <Grid item xs={12}>
                                    <Typography className={this.props.classes.movieRating} variant="h4" component="h4">
                                        TMDB rating
                                    </Typography>

                                    {
                                        this.state.currentMovie.rating !== 0 ?
                                            <React.Fragment>
                                                <Typography className={this.props.classes.movieRating} variant="h4" component="h4">
                                                    {Math.round(this.state.currentMovie.rating)}
                                                </Typography>
                                                <Rating name="rating" max={10} value={this.state.currentMovie.rating} readOnly />
                                            </React.Fragment>
                                            :
                                            <Typography className={this.props.classes.movieRating} variant="h4" component="h4">
                                                No rate!
                                            </Typography>
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className={this.props.classes.movieRating} variant="h4" component="h4">
                                        Memers rating
                                    </Typography>
                                    {
                                        this.state.commentsWithRatingCounter !== 0 ?
                                            <React.Fragment>
                                                <Typography className={this.props.classes.movieRating} variant="h4" component="h4">
                                                    {Math.round(this.state.usersRatingAverage)}
                                                </Typography>
                                                <Rating name="rating" value={this.state.usersRatingAverage} readOnly />
                                            </React.Fragment>
                                            :
                                            <Typography className={this.props.classes.movieRating} variant="h4" component="h4">
                                                No rate!
                                            </Typography>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} sm={12} md={8} alignItems="center" className={this.props.classes.movieOverview}>
                            <Typography className={this.props.classes.movieOverviewText} variant="h4" component="h4">
                                {this.state.currentMovie.overview}
                            </Typography>
                        </Grid>

                    </Grid>
                    <Grid item xs={12} className={`${this.props.classes.slideShow}`}>
                        <Grid container item xs={12}>
                            <Typography className={this.props.classes.subTitleTypography} variant="h4" component="h4">
                                Cast
                                </Typography>
                        </Grid>
                        <Divider />
                        <Grid className={this.props.classes.categoriesShow}>
                            <GridList className={this.props.classes.gridList} style={{ margin: 0 }}>
                                {
                                    this.state.movieCast.map((c, i) => {
                                        return (
                                            <CastCard key={i} castDetail={c} />
                                        );
                                    })
                                }
                            </GridList>
                            <Divider className={this.props.classes.divider} />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Grid container item xs={12}>
                            <Typography className={this.props.classes.subTitleTypography} variant="h4" component="h4">
                                Comments
                                </Typography>
                        </Grid>
                        <Divider />
                        <Grid item xs={11} sm={8} md={6} className={this.props.classes.commentInputs}>
                            {renderedInputs}
                        </Grid>
                        <Grid container item xs={11} sm={8} md={6} >
                            <Grid item xs={6} style={{ textAlign: "left" }}>
                                <FormControlLabel
                                    className={this.props.classes.switch}
                                    control={
                                        <Switch
                                            checked={this.state.toRate}
                                            onChange={this.changeToRate}
                                            name="checkedB"
                                            color="default"
                                        />
                                    }
                                    label="Rate now:"
                                    labelPlacement="start"
                                />
                                {
                                    this.state.toRate ?
                                        <Grid>
                                            <Rating name="rating" value={this.state.userRating} onChange={this.changeUserRating} />
                                        </Grid>
                                        :
                                        null
                                }
                            </Grid>
                            <Grid container item xs={6} justify="flex-end">
                                <IconButton onClick={this.addComment} aria-label="delete" className={this.props.classes.btn}>
                                    <AddCommentIcon fontSize="large" />
                                </IconButton>
                            </Grid>
                            <Divider />
                        </Grid>
                        {
                            this.state.comments.length > 0 ?
                                <Grid item xs={12} sm={10} md={9} className={this.props.classes.comments} >
                                    <List className={this.props.classes.rootComments}>
                                        {
                                            this.state.comments.map((c, index) => <Comment key={index} index={index} comment={c} users={this.props.users} currentUser={this.props.currentUser} movieId={this.props.match.params.id} deleteComment={this.props.deleteComment} updateComments={this.updateComments} />)
                                        }
                                    </List>
                                </Grid>
                                :
                                null
                        }
                    </Grid>
                </Grid>
                :
                null
        );
    };
};

export default withStyles(styles, { withTheme: true })(withRouter(MDetails));
