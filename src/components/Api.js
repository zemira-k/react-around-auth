class Api {
  constructor({ baseUrl, options }) {
    this._url = baseUrl;
    this._options = options;
  }

  costumFetch = (url, options) =>
    fetch(url, options).then((res) =>
      res.ok ? res.json() : Promise.reject(res.statusText),
    );

  getInitialCards() {
    return this.costumFetch(`${this._url}/cards`, {
      headers: this._options,
    });
  }

  getUserInfo() {
    return this.costumFetch(`${this._url}/users/me`, {
      headers: this._options,
    });
  }

  changeLikeCardStatus(id, isLiked) {
    return this.costumFetch(`${this._url}/cards/likes/${id}`, {
      headers: this._options,
      method: `${isLiked ? "PUT" : "DELETE"}`,
    });
  }

  deleteCard(id) {
    return this.costumFetch(`${this._url}/cards/${id}`, {
      headers: this._options,
      method: "DELETE",
    });
  }

  setUserInfo(data) {
    return this.costumFetch(`${this._url}/users/me`, {
      headers: this._options,
      method: "PATCH",
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    });
  }

  setUserAvatar(data) {
    return this.costumFetch(`${this._url}/users/me/avatar`, {
      headers: this._options,
      method: "PATCH",
      body: JSON.stringify({ avatar: data }),
    });
  }

  addCard(data) {
    return this.costumFetch(`${this._url}/cards`, {
      headers: this._options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export default Api;
