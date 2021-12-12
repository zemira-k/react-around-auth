const costumFetch = (url, options) =>
  fetch(url, options).then((res) =>
    res.ok ? res.json() : Promise.reject(res.statusText)
  );

class Api {
  constructor({ baseUrl, options }) {
    this._url = baseUrl;
    this._options = options;
  }

  getInitialCards() {
    return costumFetch(`${this._url}/cards`, {
      headers: this._options,
    });
  }

  getUserInfo() {
    return costumFetch(`${this._url}/users/me`, {
      headers: this._options,
    });
  }

  changeLikeCardStatus(id, isLiked) {
    return costumFetch(`${this._url}/cards/likes/${id}`, {
      headers: this._options,
      method: `${isLiked ? "PUT" : "DELETE"}`,
    });
  }

  deleteCard(id) {
    return costumFetch(`${this._url}/cards/${id}`, {
      headers: this._options,
      method: "DELETE",
    });
  }

  setUserInfo(data) {
    return costumFetch(`${this._url}/users/me`, {
      headers: this._options,
      method: "PATCH",
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    });
  }

  setUserAvatar(data) {
    return costumFetch(`${this._url}/users/me/avatar`, {
      headers: this._options,
      method: "PATCH",
      body: JSON.stringify({ avatar: data }),
    });
  }

  addCard(data) {
    return costumFetch(`${this._url}/cards`, {
      headers: this._options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export default Api;
