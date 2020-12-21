import axios from "axios";

export const loginUser = user => {
  console.log(user);
  return dispatch => {
    console.log("before request");
    axios
      .post("http://localhost:5000/api/users/login", {
        email: user.email,
        password: user.password
      })
      .then(res => {
        console.log(res);
        if (res.data.token) {
          localStorage.setItem("token", "");
          localStorage.setItem("name", res.data.name);
          localStorage.setItem("id", res.data.id);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("token", res.data.token);
          dispatch({
            type: "SET_USER",
            payload: {
              token: res.data.token,
              name: res.data.name,
              email: res.data.email,
              id: res.data.id,
              loggedIn: true
            }
          });
        }
      })
      .catch(err => {
        console.log("reqeust error");
        if (err.response.data.errors !== undefined) {
          dispatch({
            type: "USER_ERRORS",
            payload: {
              errors: {
                email: "Invalid credentials.",
                password: "Invalid credentials."
              }
            }
          });
        }
      });
  };
};

export const registerUser = data => {
  return dispatch => {
    axios
      .post("http://localhost:5000/api/users/register", data)
      .then(res => {
        dispatch({
          type: "SET_USER",
          payload: {
            loggedIn: true,
            token: res.data.token,
            name: res.data.name,
            id: res.data.id,
            email: res.data.email
          }
        });
      })
      .catch(err => {
        if (err.response !== undefined) {
          if (
            err.response.data !== undefined &&
            err.response.data.errors !== undefined
          ) {
            dispatch({
              type: "USER_ERRORS",
              payload: err.response.data.errors
            });
          }
        }
      });
  };
};

export const followUser = (userId) => {
    let token = localStorage.getItem('token');
    return dispatch => {
        axios
        .get("http://localhost:5000/api/users/follow/" + userId, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            dispatch({
                type: 'SET_USER_FOLLOWING',
                payload: res.data.following
            });
        });
    };
}
