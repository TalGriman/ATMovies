import { Grid, Typography, Button, IconButton, TextField, GridList, SwipeableDrawer, List, ListItem, ListItemText, Divider } from '@material-ui/core';
import React from 'react';
import { withRouter } from 'react-router-dom';
import MCardScroll from './MCardScroll';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from '@material-ui/icons/Close';
import MenuOpenSharpIcon from '@material-ui/icons/MenuOpenSharp';

const CssTextField = withStyles({ // שדה שמעוצב אישית כדי לדרוס את העיצוב הקיים
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

const styles = theme => ({ // כדי לעצב במטריאל-יו-איי
    wrapper: {
        [theme.breakpoints.up("xs")]: {
            marginBottom: 15
        },
        [theme.breakpoints.up("sm")]: {
            marginBottom: 30
        },
        [theme.breakpoints.up("md")]: {
            marginBottom: 45
        },
    },

    btn: {
        "&:focus": {
            outline: "none"
        },
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    slideShow: {
        background: '#f2f0eb',
        [theme.breakpoints.up("sm")]: {
            paddingLeft: 80,
            paddingRight: 80
        },
        [theme.breakpoints.up("md")]: {
            paddingLeft: 200,
            paddingRight: 200
        },
    },
    list: {
        [theme.breakpoints.up("sm")]: {
            width: 180
        },
        [theme.breakpoints.up("md")]: {
            width: 200
        },
    },
    listTitle: {
        fontFamily: "Comic Sans MS"
    },
    searchGrid: {
        borderBottom: "1px solid #5a585d",
        margin: 0,
        backgroundColor: "#dddad3",
        padding: "5px 0px"

    },
    divider: {
        margin: "10px 0px"
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

});

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: "",
            windowsWidth: window.innerWidth, // כדי לקבל את רוחב המסך  כדי לבצע תנאים על חלק מהדברים
            drawerIsOpen: false,
            favoriteGenreName: ""
        };
    };

    handleScreenResize = () => { // מעדכן את רוחב המסך
        this.setState({ windowsWidth: window.innerWidth })
    };

    componentDidMount() {
        const handleLoginUser = async () => { // עדכון המשתמש ובמידה והוא לא מחובר להעביר אותו לעמוד התחברות ואם כן מחובר לבצע מספר דברים בתוכו
            await this.props.updateCurrentUserAndUsersState();
            if (this.props.currentUser === undefined) {
                this.props.history.push({
                    pathname: '/'
                });
            }
            else {
                window.addEventListener("resize", this.handleScreenResize); // פותח אירוע של שינוי רוחב המסך
                this.props.clearSearchMovieResults(); // מרוקן את תוצאות החחיפוש הקודם
                this.props.getGenres(); // מביא את הגאנרס כדי שנוכל לייצר כפתורים
                this.props.getMoviesByCategory('nowPlaying'); // מבקש מה-איי-פי-איי את הסרטים המוקרנים עכשיו
                this.props.getMoviesByCategory('topRated');// מבקש מה-איי-פי-איי את הסרטים המדורגים בטופ
                this.getFavoriteByUserClicks(); // מתודה מקומית כדי להביא את הסרטים מגאנר המועדף ע"י לחיצות
            }
        };
        handleLoginUser();
    };

    componentWillUnmount() { // ברגע של יציאה מהקומפוננטה שידרוס את האירוע של רוחב המסך
        window.removeEventListener("resize", this.handleScreenResize);
    };

    getFavoriteByUserClicks = () => { // בודק איזה גאנר מועף לפי הקלקוט ומבקשת מהשרת את הסרטים של אותו גאנר
        let max = 0, genreId, gName = "";
        this.props.currentUser.genresCounter.map((g) => {
            if (g.clicks > max) {
                max = g.clicks;
                genreId = g.genre;
                gName = g.name;
            }
            return max;
        });
        if (max > 0) { // רק במידה ויש גאנר מועדף
            this.props.getMoviesByGenre(genreId, 1, false); // בקשה מהשרת לסרטים לפי הגאנר המועדף
            this.setState({ favoriteGenreName: gName }); // להצגת השם של הגאנר המועדף
        }

    };

    movieByGenre = async (genreId, genreName) => { // הפונקציה אסינכרונית מפני שאנחנו רוצים שקודם יטען את הסרטים שרק אז יעבור לדף של הגאנר
        // הפונקציה אחראית על הכנסת הגאנר הספציפי למערך של הגאנרים
        await this.props.getMoviesByGenre(genreId, 1, true);
        this.props.handleUserGenreClicks(genreId); // כדי לספור לחיצות עלח גאנר מסויים

        this.props.history.push({
            pathname: `/MBGenre/${genreName}/1`,
            state: { genreId: genreId, genreName: genreName }
        });
    };

    changeSearchTerm = (e) => { // כדי לשנות את הסטייט של הפרמטר לחיפוש
        this.setState({ searchTerm: e.target.value });
    };

    handleSearchResults = async () => { // בלחיצה על חיפוש יחפש את הסרט
        if (this.state.searchTerm === "") {
            return;
        }
        await this.props.searchMovie(this.state.searchTerm); // כדי להתחל את ההמערך של תוצאות החיפוש
        this.setState({ searchTerm: "" })
    };

    handleSwitchDrawer = (isOpen) => { // כדי לטפל בפתיחה או סגירה של התפריט גאנרים
        this.setState({ drawerIsOpen: isOpen })
    };

    list = () => ( // להצגת הגאנרים בתפריט הגאנרים וגם נתימת רוחב לתפריט
        <div
            role="presentation"
            className={`${this.props.classes.list}`}
        >
            <List>
                {this.props.genres.map((g, index) => (
                    <ListItem button onClick={() => this.movieByGenre(g.id, g.name)} key={index}>
                        <ListItemText primary={<Typography className={this.props.classes.listTitle}>{g.name}</Typography>} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    render() {
        const { classes } = this.props;
        return (
            this.props.currentUser !== undefined && this.props.genres !== undefined && this.props.nowPlaying !== undefined && this.props.topRated !== undefined ?
                < Grid container className={classes.wrapper}>
                    <Grid item xs={12} sm={12} md={12} className={classes.searchGrid}>
                        <Grid container item xs={12} justify="center" alignItems="center" >
                            <Grid item xs={10} sm={3} md={2} align={this.state.windowsWidth < 600 ? "left" : "center"}>
                                <React.Fragment>
                                    <Button
                                        variant="outlined"
                                        className={`${classes.btn} ${classes.listTitle}`}
                                        startIcon={<MenuOpenSharpIcon />}
                                        onClick={() => this.handleSwitchDrawer(true)}
                                    >
                                        Genres
                                </Button>
                                    <SwipeableDrawer
                                        anchor="left"
                                        open={this.state.drawerIsOpen}
                                        onClose={() => this.handleSwitchDrawer(false)}
                                        onOpen={() => this.handleSwitchDrawer(true)}
                                    >
                                        {this.list()}
                                    </SwipeableDrawer>
                                </React.Fragment>
                            </Grid>
                            <Grid item xs={9} sm={8} md={9}>
                                <CssTextField
                                    value={this.state.searchTerm}
                                    label="Search movie"
                                    type="search"
                                    variant="outlined"
                                    size="small"
                                    onChange={this.changeSearchTerm} fullWidth
                                />
                            </Grid>
                            <Grid item xs={1} sm={1} md={1}>
                                <IconButton className={classes.btn} onClick={this.handleSearchResults}>
                                    <SearchIcon />
                                </IconButton>
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={`${classes.slideShow}`}>
                        {
                            this.props.searchMovieResults === undefined ? // תנאי להצגת תוצאות החיפוש 
                                null
                                :
                                this.props.searchMovieResults.length === 0 ? // תנאי במידה ואין תוצאות ואם ישתוצאות שיציג בצורה שונה
                                    <Grid item xs={12}>
                                        <Grid container justify="flex-end">
                                            <IconButton onClick={this.props.clearSearchMovieResults} className={classes.btn}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Grid>
                                        <Typography className={classes.subTitleTypography} variant="h4" component="h4">
                                            No Search Results Match!
                                        </Typography>
                                    </Grid>
                                    :
                                    <Grid container direction="row" justify="space-around" alignItems="center">
                                        <Grid container justify="flex-end">
                                            <IconButton onClick={this.props.clearSearchMovieResults} className={classes.btn}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography className={classes.subTitleTypography} variant="h4" component="h4">
                                                Search Results
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider className={classes.divider} />
                                        </Grid>
                                        <GridList className={classes.gridList} cols={10} spacing={5} style={{ margin: 0 }}>
                                            {this.props.searchMovieResults.map((m, i) => {
                                                return (
                                                    <MCardScroll key={i} movie={m} />
                                                );
                                            })}
                                        </GridList>
                                        <Grid item xs={12}>
                                            <Divider className={classes.divider} />
                                        </Grid>
                                    </Grid>
                        }

                        {
                            this.props.favoriteUserGenre !== undefined ? // תנאי להצגת הגאנר המועדף
                                <Grid className={classes.categoriesShow}>
                                    <Grid item xs={12}>
                                        <Typography className={classes.subTitleTypography} variant="h4" component="h4">
                                            Favorite Genre - {this.state.favoriteGenreName}
                                        </Typography>
                                    </Grid>
                                    <Grid >
                                        <Divider className={classes.divider} />
                                        <GridList className={`${classes.gridList}`} cols={10} spacing={5} style={{ margin: 0 }}>
                                            {this.props.favoriteUserGenre.reverse().map((m, i) => {
                                                return (
                                                    <MCardScroll key={i} movie={m} />
                                                );
                                            })}
                                        </GridList>
                                        <Divider className={classes.divider} />
                                    </Grid>
                                </Grid>
                                :
                                null
                        }
                        <Grid className={classes.categoriesShow}>
                            <Grid item xs={12}>
                                <Typography className={classes.subTitleTypography} variant="h4" component="h4">
                                    Now Playing
                                </Typography>
                            </Grid>
                            <Divider className={classes.divider} />
                            <GridList className={classes.gridList} cols={10} spacing={5} style={{ margin: 0 }}>
                                {this.props.nowPlaying.map((m, i) => {
                                    return (
                                        <MCardScroll key={i} movie={m} />
                                    );
                                })}
                            </GridList>
                            <Divider className={classes.divider} />
                        </Grid>

                        <Grid className={classes.categoriesShow}>
                            <Grid item xs={12}>
                                <Typography className={classes.subTitleTypography} variant="h4" component="h4">
                                    Top Rated
                                </Typography>
                            </Grid>
                            <Divider className={classes.divider} />
                            <GridList className={classes.gridList} style={{ margin: 0 }}>
                                {this.props.topRated.map((m, i) => {
                                    return (
                                        <MCardScroll key={i} movie={m} />
                                    );
                                })}
                            </GridList>
                            <Divider className={classes.divider} />
                        </Grid>
                    </Grid >
                </Grid>
                :
                null
        );
    };

};

export default withStyles(styles, { withTheme: true })(withRouter(Main));