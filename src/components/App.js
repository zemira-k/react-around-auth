import React, { useState } from "react";
import { Route, withRouter, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/api";
import * as auth from "../utils/auth";
// routs components
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import Login from "./Login";
import Register from "./Register";
// popup components
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import InfoTooltip from "./InfoTooltip";

function App() {
  const history = useHistory();
  // states for cards and user
  const [currentUser, setcurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  // states for login logout and register
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [infoToolTip, setInfoTooltip] = useState({
    isOpen: false,
    isSuccessful: false,
  });

  // get cards
  React.useEffect(() => {
    api
      .getInitialCards()
      .then((res) => {
        setCards(...cards, res);
      })
      .catch((err) => console.log(err));
  }, []);

  //get user info
  React.useEffect(() => {
    api
      .getUserInfo()
      .then((res) => {
        setcurrentUser(res);
      })
      .catch((err) => console.log(err));
  }, []);

  // check if logged in
  React.useEffect(() => {
    // if user has a token in storage, check if it is valid
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      auth.getContent(jwt).then((res) => {
        if (res) {
          setEmail(res.data.email);
          console.log(res);
          setLoggedIn(true);
          history.push("/");
        }
      });
    }
  }, []);

  // handles for cards
  function handleAddPlaceSubmit(data) {
    api
      .addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .catch((err) => console.log(err));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c)),
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then((res) => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  // handles for user
  function handleUpdateUser(data) {
    api
      .setUserInfo(data)
      .then((res) => {
        setcurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(data) {
    api
      .setUserAvatar(data.avatar)
      .then((res) => {
        setcurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  // handles for login logout and register
  function handleLogin({ email, password }) {
    setEmail(email);
    if (!email || !password) {
      console.log("fail");
      return;
    }
    console.log("success");
    auth.login(password, email).then((data) => {
      if (data.token) {
        setLoggedIn(true);
        history.push("/");
      }
    });
  }

  function handleLogout() {
    console.log("logged out");
    setLoggedIn(false);
    localStorage.removeItem("jwt");
    history.push("/");
  }

  function handleRegister({ email, password }) {
    auth.register(password, email).then((res) => {
      if (res) {
        handleSuccessTooltip();
        history.push("/signin");
        console.log("Register success");
      } else {
        handleFailureTooltip();
        console.log("Something went wrong.");
      }
    });
  }

  // handles to open and close popups
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(props) {
    setSelectedCard(props);
  }

  const handleSuccessTooltip = () => {
    setInfoTooltip({
      isOpen: true,
      isSuccessful: true,
    });
  };

  const handleFailureTooltip = () => {
    setInfoTooltip({
      isOpen: true,
      isSuccessful: false,
    });
  };

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
    setInfoTooltip({
      isOpen: false,
      isSuccessful: false,
    });
  }

  return (
    <div className="page__container">
      <CurrentUserContext.Provider value={currentUser}>
        <Switch>
          <Route path="/signin">
            <Header link="/signup" text="sign up" />
            <Login onLogin={handleLogin} />
          </Route>
          <Route path="/signup">
            <Header link="/signin" text="Log in" />
            <Register onRegister={handleRegister} />
          </Route>
          <ProtectedRoute exact path="/" loggedIn={loggedIn}>
            <Header
              link="/signin"
              text="Log in"
              loggedin={loggedIn}
              email={email}
              onSignOut={handleLogout}
            />
            <Main
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditAvatarClick={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
            />
          </ProtectedRoute>
        </Switch>
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlaceSubmit={handleAddPlaceSubmit}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          isOpen={infoToolTip.isOpen}
          isSuccessful={infoToolTip.isSuccessful}
          onClose={closeAllPopups}
        />
        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}
export default withRouter(App);
