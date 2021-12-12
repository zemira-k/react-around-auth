const base_url = "https://register.nomoreparties.co";

export const register = (password, email) => {
  return (
    // fetch(`${base_url}/auth/local/signup`, {
    fetch(`${base_url}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((response) => {
        // if response returns 201-created, parse the data and return to next handler
        if (response.status === 201) {
          return response.json();
        }
      })
      .then((res) => {
        // return the parsed data to client
        // importantly, this data includes a unique, signed JWT
        return res;
      })
      // catch all errors
      .catch((err) => console.log(err))
  );
};

export const login = (password, email) => {
  // return fetch(`${base_url}/auth/local/signin`, {
  return fetch(`${base_url}/signin`, {
    method: "POST",
    headers: {
      // Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
      email,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // does data have a jwt in it?
      if (data.token) {
        // if so, save it to local storage and return data
        // don't worry about this line now -- it will be explained soon
        localStorage.setItem("jwt", data.token);
        return data;
      }
    })
    .catch((err) => console.log(err));
};

export const getContent = (token) => {
  return (
    fetch(`${base_url}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      // received data will include user data, such as email
      .then((data) => data)
  );
};
