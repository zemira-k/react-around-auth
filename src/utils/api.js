import Api from "../components/Api";

const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/group-12",
  options: {
    authorization: "f0ace597-b017-4eaf-8da3-94e369745d83",
    "Content-Type": "application/json",
  },
});

export default api;
