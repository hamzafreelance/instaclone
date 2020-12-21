import axios from "axios";

export const getUserPosts = profileId => {
    return dispatch => {
        axios
          .get("http://localhost:5000/api/profile/"+profileId)
          .then(res => {
            dispatch({
                type: 'GET_USER_POSTS',
                payload: res.data.posts
            });
          })
          .catch(err => {
            if (err.response.status == 401) {
              localStorage.removeItem("token");
            }
          });
    }
} 