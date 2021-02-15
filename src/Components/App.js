import React from 'react';
import Main from './Main';
import { Route, Switch, withRouter } from 'react-router-dom';
import TopBar from './TopBar';
import axios from 'axios';
import MBGenre from './MBGenre';
import MDetails from './MDetails';
import Register from './Register';
import Login from './Login';
import AccountDetails from './AccountDetails';
import { Carousel } from 'react-bootstrap';
import logo from '../Images/logo.png'

//עזר לייבוא מהאיי-פי-איי
const apiKey = 'b6b74320b2c0800da5ff095153e87afa';
const url = 'https://api.themoviedb.org/3';
const genreList = `${url}/genre/movie/list`;
const moviesByGenres = `${url}/discover/movie`;
const movieById = `${url}/movie`;
const search = `${url}/search/movie`;

const categories = [
  { url: `${url}/movie/now_playing`, name: 'nowPlaying' },
  { url: `${url}/movie/top_rated`, name: 'topRated' }
];

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      nowPlaying: undefined,
      topRated: undefined,
      genres: undefined, //שמות והאיי-די של הגאנרים לטובת הכפתורים
      movieByGenre: [], // כל הסרטים של הגאנר בו אנו נמצאים
      users: [],
      currentUser: undefined,
      movieComments: [],
      favoriteUserGenre: undefined,
      searchMovieResults: undefined
    };
  };

  getMoviesByCategory = async (categoryName) => { // עבור מערכי - nowPlaying , topRated
    let category = categories.find((c) => c.name === categoryName); // הדרך שלנו לתקשר עם ה-איי-פי-איי axios
    try {
      const response = await axios.get(category.url, {
        params: { // דרך יעילה להעביר פרמטרים של בקשה משרת
          api_key: apiKey,
          language: 'en_US',
          page: 1,
        }
      });

      const posterUrl = 'https://image.tmdb.org/t/p/w154'
      let modifiedData = response.data.results.map((movie) => ({ // הוא כדי שהמערך יהיה עם המפתחות שלנו וגם כדי לקבל את הפוסטר ככתובת שלמה
        id: movie.id,
        backPoster: posterUrl + movie.backdrop_path,
        popularity: movie.popularity,
        title: movie.title,
        poster: posterUrl + movie.poster_path,
        overview: movie.overview,
        rating: movie.vote_average,
      }));

      //סינונים כדי לקבל סרטים עם תמונה בלבד וכדי לסנן סרטים עם כותרת ארוכה מדי
      modifiedData = modifiedData.filter((movie) => (!movie.backPoster.includes(null)));
      modifiedData = modifiedData.filter((movie) => (!movie.poster.includes(null)));
      modifiedData = modifiedData.filter((movie) => movie.title.length < 40);

      if (categoryName === 'nowPlaying') {
        this.setState({ nowPlaying: modifiedData })
      }
      else {
        this.setState({ topRated: modifiedData })
      }
    } catch (error) { }
  };

  getMoviesByGenre = async (genreId, pageNum, isMovieByGenre) => { // עבור מערכים movieByGenre or favoritesUserGenre
    try {
      const response = await axios.get(moviesByGenres, {
        params: {
          api_key: apiKey,
          language: 'en_US',
          page: pageNum,
          with_genres: genreId,
        }
      });

      const posterUrl = 'https://image.tmdb.org/t/p/w154'
      let modifiedData = response.data.results.map((movie) => ({
        id: movie.id,
        backPoster: posterUrl + movie.backdrop_path,
        popularity: movie.popularity,
        title: movie.title,
        poster: posterUrl + movie.poster_path,
        overview: movie.overview,
        rating: movie.vote_average,
      }));

      modifiedData = modifiedData.filter((movie) => (!movie.backPoster.includes(null)));
      modifiedData = modifiedData.filter((movie) => (!movie.poster.includes(null)));
      // תנאי כדי לבחור לאיזה מערך להכניס את המידע מועדפים או ג'אנר מסויים
      if (isMovieByGenre) {
        this.setState({ movieByGenre: modifiedData })
      }
      else {
        modifiedData = modifiedData.filter((movie) => movie.title.length < 40);
        this.setState({ favoriteUserGenre: modifiedData })
      }
    } catch (error) { }
  };

  getGenres = async () => { // בשביל הכפתורים
    try {
      const response = await axios.get(genreList, {
        params: {
          api_key: apiKey,
          language: 'en_US',
          page: 1
        }
      });
      this.setState({ genres: response.data.genres })
    } catch (error) { }

  };

  searchMovie = async (term) => {
    try {
      const response = await axios.get(search, {
        params: {
          api_key: apiKey,
          language: 'en_US',
          query: term, // לפי מה החיפוש
          page: 1
        }
      });

      const posterUrl = 'https://image.tmdb.org/t/p/w154';
      let modifiedData = response.data.results.map((movie) => ({
        id: movie.id,
        backPoster: posterUrl + movie.backdrop_path,
        popularity: movie.popularity,
        title: movie.title,
        poster: posterUrl + movie.poster_path,
        overview: movie.overview,
        rating: movie.vote_average,
      }));

      modifiedData = modifiedData.filter((movie) => (!movie.backPoster.includes(null)));
      modifiedData = modifiedData.filter((movie) => (!movie.poster.includes(null)));
      this.setState({ searchMovieResults: modifiedData });

    } catch (error) { }
  };

  addUser = async (details) => { // הוספת משתמשים
    await this.getGenres(); // השתמשנו לטובת יצירת מערך הקלקות לצורך ג'אנר מועדף
    let genresCounter = [];
    this.state.genres.map((g) => genresCounter = [...genresCounter, { genre: g.id, name: g.name, clicks: 0 }]);
    let users = JSON.parse(localStorage.getItem("users")); // למשוך את היוזרים הקיימים מהלוקאל
    if (users === null) { // אם עדיין אין יוזרים בלוקאל
      users = [];
      users = [...users, { email: details.email, password: details.password, displayName: "newUser", img: "https://img.icons8.com/pastel-glyph/2x/person-male.png", genresCounter: genresCounter, myFavorites: [] }];
      localStorage.setItem("users", JSON.stringify(users));
    }
    else {
      users = [...users, { email: details.email, password: details.password, displayName: "newUser", img: "https://img.icons8.com/pastel-glyph/2x/person-male.png", genresCounter: genresCounter, myFavorites: [] }];
      localStorage.setItem("users", JSON.stringify(users));
    }
    this.setState({ users: users });
  };

  updateCurrentUserAndUsersState = () => { // בגלל שאין לנו שרת אנו רוצים להתחל את הסטיייט כי יש בו שימושים
    let users = JSON.parse(localStorage.getItem("users"));
    if (users !== null) {
      this.setState({ users: users });
    }
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (currentUser !== null) {
      this.setState({ currentUser: currentUser });
    }
  };

  login = (user) => { // בהתחברות כדי לעדכן את הסיישן סטורג והסטיייט
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    this.setState({ currentUser: user });
  };

  logout = () => { // בלחיצה על כפתור ההתנתקות נסיר את המשתמש בהסיישן סטורג
    sessionStorage.removeItem("currentUser");
    this.setState({ currentUser: undefined, favoriteUserGenre: undefined }, () => {
      this.props.history.push({
        pathname: '/'
      });
    });

  };

  updateUserDetails = (user) => { // עדכון הפרטים של המשתמש
    let newUsers = this.state.users.filter((u) => u.email.toUpperCase() !== user.email.toUpperCase());
    newUsers = [...newUsers, user]

    this.setState({ currentUser: user, users: newUsers }, () => {
      localStorage.setItem("users", JSON.stringify(this.state.users));
      sessionStorage.setItem("currentUser", JSON.stringify(this.state.currentUser));
    });
  };

  addMovieToMovieComments = (movieId) => { // מוסיף סרט למערך סרטים שהגיבו עליהם, נקרא בדף סרט בודד בקומפוננט דיד-מאונט
    let movieComments = JSON.parse(localStorage.getItem("movieComments"));
    if (movieComments === null) {
      movieComments = [];
      movieComments = [...movieComments, { movieId: movieId, comments: [] }];
      localStorage.setItem("movieComments", JSON.stringify(movieComments));
    }
    else {
      let existMovie = movieComments.find((m) => m.movieId === movieId) !== undefined;
      if (!existMovie) {
        movieComments = [...movieComments, { movieId: movieId, comments: [] }];
        localStorage.setItem("movieComments", JSON.stringify(movieComments));
      }
    }
    this.setState({ movieComments: movieComments });
  }

  addCommentToMovieComments = (movieId, comment) => { // הוספת תגובה לסרט מסויים במערך movieComments
    let movie = this.state.movieComments.find((m) => m.movieId === movieId);
    movie.comments = [comment, ...movie.comments];
    localStorage.setItem("movieComments", JSON.stringify(this.state.movieComments));
    this.setState({ movieComments: this.state.movieComments })
  };

  deleteComment = (movieId, index) => { // הסרט תגובה מסרט ספציפי
    let movie = this.state.movieComments.find((m) => m.movieId === movieId);
    movie.comments = movie.comments.filter((c, i) => i !== index);
    localStorage.setItem("movieComments", JSON.stringify(this.state.movieComments));
    this.setState({ movieComments: this.state.movieComments })
  };

  deleteAccount = () => { // מחיקת משתמש
    let arr = this.state.users.filter((u) => u.email.toUpperCase() !== this.state.currentUser.email.toUpperCase());
    localStorage.setItem("users", JSON.stringify(arr));
    this.setState({ users: arr }, () => {
      this.logout();
    })
  };

  handleUserGenreClicks = (genreId) => { // פונקציה שעושה ספירה לפי הגאנר שנלחץ, בשביל גאנר מועדף
    let user = this.state.users.find((u) => u.email.toUpperCase() === this.state.currentUser.email.toUpperCase());
    user.genresCounter.map((g) => {
      if (g.genre === genreId) {
        g.clicks++;
      }
      return user
    });

    this.setState({ currentUser: user }, () => {
      localStorage.setItem("users", JSON.stringify(this.state.users));
      sessionStorage.setItem("currentUser", JSON.stringify(this.state.currentUser));
    })
  }

  addMovieToUserFavorites = (movie) => { // הוספת סרט מועדף לרשימת המועדפים של משתמש
    let user = this.state.users.find((u) => u.email.toUpperCase() === this.state.currentUser.email.toUpperCase());
    user.myFavorites = [...user.myFavorites, movie];
    this.setState({ currentUser: user }, () => {
      localStorage.setItem("users", JSON.stringify(this.state.users));
      sessionStorage.setItem("currentUser", JSON.stringify(this.state.currentUser));
    });
  };

  removeMovieFromUserFavorites = (movie) => { // הסרת סרט מהמועדפים של משתמש
    let user = this.state.users.find((u) => u.email.toUpperCase() === this.state.currentUser.email.toUpperCase());
    user.myFavorites = user.myFavorites.filter((m) => m.id !== movie.id);
    this.setState({ currentUser: user }, () => {
      localStorage.setItem("users", JSON.stringify(this.state.users));
      sessionStorage.setItem("currentUser", JSON.stringify(this.state.currentUser));
    });
  };

  clearSearchMovieResults = () => { // מרוקן את תוצאות החיפוש, לחיצה על איקס בתיבת החיפוש
    this.setState({ searchMovieResults: undefined });
  };

  render() {
    return (
      <div>
        <TopBar currentUser={this.state.currentUser} logout={this.logout} />

        <Carousel
          indicators={false}
          controls={false}
        >
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={logo}
              alt="First slide"
              style={{ minHeight: 50, borderTop: "2px solid #5a585d", borderBottom: "1px solid #5a585d" }}
            />
          </Carousel.Item>
        </Carousel>

        <Switch>
          <Route path="/Main" render={() =>
            <Main
              getMoviesByCategory={this.getMoviesByCategory}
              getMoviesByGenre={this.getMoviesByGenre}
              getGenres={this.getGenres}
              updateCurrentUserAndUsersState={this.updateCurrentUserAndUsersState}
              nowPlaying={this.state.nowPlaying}
              topRated={this.state.topRated}
              genres={this.state.genres}
              currentUser={this.state.currentUser}
              handleUserGenreClicks={this.handleUserGenreClicks}
              favoriteUserGenre={this.state.favoriteUserGenre}
              searchMovie={this.searchMovie}
              searchMovieResults={this.state.searchMovieResults}
              clearSearchMovieResults={this.clearSearchMovieResults}
            />}
          />
          <Route path="/MBGenre/:genre/:page" render={() =>
            <MBGenre
              movieByGenre={this.state.movieByGenre}
              getMoviesByGenre={this.getMoviesByGenre}
              updateCurrentUserAndUsersState={this.updateCurrentUserAndUsersState}
              currentUser={this.state.currentUser}
            />
          } />
          <Route path="/MDetails/:id" render={() => <MDetails
            apiKey={apiKey}
            movieById={movieById}
            addMovieToMovieComments={this.addMovieToMovieComments}
            addCommentToMovieComments={this.addCommentToMovieComments}
            users={this.state.users} currentUser={this.state.currentUser}
            movieComments={this.state.movieComments}
            updateCurrentUserAndUsersState={this.updateCurrentUserAndUsersState}
            deleteComment={this.deleteComment}
            addMovieToUserFavorites={this.addMovieToUserFavorites}
            removeMovieFromUserFavorites={this.removeMovieFromUserFavorites}
          />}
          />
          <Route path="/Register" render={() => <Register
            users={this.state.users}
            addUser={this.addUser}
            updateCurrentUserAndUsersState={this.updateCurrentUserAndUsersState}
            currentUser={this.state.currentUser}
          />}
          />
          <Route exact path="/" render={() => <Login
            users={this.state.users}
            updateCurrentUserAndUsersState={this.updateCurrentUserAndUsersState}
            login={this.login}
            currentUser={this.state.currentUser}
          />}
          />
          <Route path="/AccountDetails" render={() => <AccountDetails
            currentUser={this.state.currentUser}
            updateCurrentUserAndUsersState={this.updateCurrentUserAndUsersState}
            updateUserDetails={this.updateUserDetails}
            deleteAccount={this.deleteAccount}
          />
          } />
        </Switch>
      </div >
    );
  };
}

export default withRouter(App);
