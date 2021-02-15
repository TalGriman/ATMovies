import React from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Typography, Button, Divider } from '@material-ui/core';
import MCardScroll from './MCardScroll';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { withStyles } from "@material-ui/core/styles";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


const styles = theme => ({ // דרך לעיצוב מטריאל-יו-איי
    btn: {
        color: "#612837",
        fontFamily: "Comic Sans MS",
        "&:focus": {
            outline: "none"
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
    displayMovies: {
        background: '#f2f0eb',
        [theme.breakpoints.up("xs")]: {
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 35
        },
        [theme.breakpoints.up("sm")]: {
            paddingLeft: 80,
            paddingRight: 80,
            marginBottom: 40
        },
        [theme.breakpoints.up("md")]: {
            paddingLeft: 120,
            paddingRight: 120,
            marginBottom: 60
        },
    },
});

class MBGenre extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentGenre: undefined, // על מנת שנוכל לאפס לפני חזרה למיין כדי שלא יוצג גאנר קודם
            pageCounter: 1,
            windowsWidth: window.innerWidth, // כדי לקבל את רוחב המסך  כדי לבצע תנאים על חלק מהדברים
        };
    };

    componentDidMount() { // פועל לאחר הרינדור
        const handleLoginUser = async () => {
            await this.props.updateCurrentUserAndUsersState();
            if (this.props.currentUser === undefined || this.props.location.state === undefined) {
                this.props.history.push({
                    pathname: '/'
                });
            }
            else {
                window.addEventListener("resize", this.handleScreenResize); // הפעלת אירוע של רוחב החלון
                await this.props.getMoviesByGenre(this.props.location.state.genreId, this.props.match.params.page, true) // קראנו לזה גם פה למקרה של רענון הדף
                this.setState({ currentGenre: this.props.movieByGenre, pageCounter: this.props.match.params.page });
            }
        };
        handleLoginUser();
    }

    handleScreenResize = () => { // טיפול בעדכון רווחב המסך לסטייט
        this.setState({ windowsWidth: window.innerWidth });
    };

    componentWillUnmount() { // קורא ברגע שהקופוננטה מועמדת לסיום כלומר ביציאה מהקומפוננטה
        window.removeEventListener("resize", this.handleScreenResize); // מסיים את האירוע של רוחב המסך
    };

    backToMain = () => { // בלחיצת הכפתור לחזור למייין
        this.setState({ currentGenre: undefined },
            () => {
                this.props.history.push({
                    pathname: "/Main"
                });
            })
    };

    nextPage = () => { // כדי לעבור לעוד עמודים בתוך הגאנר
        if (this.state.pageCounter === 5) { // הגבלנו ל- 5 אפשר יותר
            return;
        }
        this.setState({ pageCounter: parseInt(this.state.pageCounter) + 1 }, async () => { // אסינכרוני מפני שרוצים לחכות לבקשה
            await this.props.getMoviesByGenre(this.props.location.state.genreId, this.state.pageCounter, true);
            this.setState({ currentGenre: this.props.movieByGenre });
            this.props.history.push({
                pathname: `/MBGenre/${this.props.location.state.genreName}/${this.state.pageCounter}`,
                state: { genreId: this.props.location.state.genreId, genreName: this.props.location.state.genreName }
            });
        });
    };

    backPage = () => {
        if (this.state.pageCounter === 1) {
            return;
        }
        this.setState({ pageCounter: parseInt(this.state.pageCounter) - 1 }, async () => {
            await this.props.getMoviesByGenre(this.props.location.state.genreId, this.state.pageCounter, true);
            this.setState({ currentGenre: this.props.movieByGenre });
            this.props.history.push({
                pathname: `/MBGenre/${this.props.location.state.genreName}/${this.state.pageCounter}`,
                state: { genreId: this.props.location.state.genreId, genreName: this.props.location.state.genreName }
            });
        });
    };

    render() {
        const { classes } = this.props;
        return (
            this.state.currentGenre !== undefined ? // במידה ויש גאנר נוכחי הצג אחרת נאל
                < Grid container>
                    <Grid item xs={12}>
                        <Button
                            className={classes.btn}
                            variant="outlined"
                            color="default"
                            size="small"
                            startIcon={<ArrowBackIosIcon />}
                            onClick={this.backToMain}
                            style={{ marginLeft: 10, marginTop: 10, marginBottom: 10 }}
                        >
                            Back to Main
                    </Button>
                    </Grid>
                    <Grid container item xs={12} className={classes.displayMovies}>
                        <Grid container item xs={12}>
                            <Typography className={classes.subTitleTypography} variant="h4" component="h4">
                                {this.props.location.state.genreName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider className={classes.divider} />
                        </Grid>
                        {
                            this.state.windowsWidth < 600 ? // במידה והמסך על פלאפון נרצה שיציג מעבר עמודים למעלה בנוסף
                                <Grid item xs={12} align="center" style={{ marginTop: 10 }}>
                                    <Button size="small" className={classes.btn} startIcon={<ArrowBackIosIcon />} onClick={this.backPage} variant="outlined">back</Button>
                                    <Button size="small" className={classes.btn} endIcon={<ArrowForwardIosIcon />} onClick={this.nextPage} variant="outlined">next</Button>
                                </Grid>
                                :
                                null
                        }
                        {this.state.currentGenre.map((m) => {
                            return (
                                <Grid key={m.id} item xs={6} sm={4} md={3} align="center" style={{ marginTop: "10px" }}>
                                    <MCardScroll movie={m} />
                                </Grid>
                            );
                        })}
                        <Grid item xs={12} align="center">
                            <Button size="small" startIcon={<ArrowBackIosIcon />} className={classes.btn} onClick={this.backPage} variant="outlined">back</Button>
                            <Button size="small" endIcon={<ArrowForwardIosIcon />} className={classes.btn} onClick={this.nextPage} variant="outlined">next</Button>
                        </Grid>
                    </Grid>
                </Grid >
                :
                null
        );
    };
};

export default withStyles(styles, { withTheme: true })(withRouter(MBGenre));