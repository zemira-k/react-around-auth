const BaseUrl = "https://register.nomoreparties.co";
const headers = { "Content-Type": "application/json" };

export const register = (password, email) => {
  return fetch(`${BaseUrl}/signup`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      password,
      email,
    }),
  }).then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)));
};

export const login = (password, email) => {
  return fetch(`${BaseUrl}/signin`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      password,
      email,
    }),
  }).then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)));
};

export const getContent = (token) => {
  return fetch(`${BaseUrl}/users/me`, {
    method: "GET",
    headers: { headers, Authorization: `Bearer ${token}` },
  }).then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)));
};
