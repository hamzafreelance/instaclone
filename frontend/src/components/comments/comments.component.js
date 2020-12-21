import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";

export const Comments = props => {
  let { postId, test, loggedIn, token } = props;
  const [comment, setComment] = useState(null);
  const [postComments, setPostComments] = useState([]);

  const commentChange = e => {
    let val = e.target.value;
    setComment(val);
  };

  const getComments = () => {
    axios
      .get("http://localhost:5000/api/comments/get/" + postId)
      .then(res => {
        setPostComments(res.data.comments);
        console.log(res.data.comments);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (postId !== undefined) getComments();
  }, []);

  const postComment = () => {
    if (comment !== null) {
      axios
        .post(
          "http://localhost:5000/api/comments/post/" + postId,
          {
            comment: comment
          },
          {
            headers: { Authorization: "Bearer " + token }
          }
        )
        .then(res => getComments())
        .catch(err => {
          console.log(err);
        });
    }
  };

  return (
    <div className="row">
      <div className="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-8 col-xs-offset-2">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              <span className="glyphicon glyphicon-comment"></span>  Recent
              Comments
            </h3>
          </div>
          <div className="panel-body">
            <ul className="media-list">
              {postComments.length > 0 &&
                postComments.map(comment => {
                  return (
                    <li className="media">
                      <div className="media-left">
                        <img
                          src="http://placehold.it/60x60"
                          className="img-circle"
                        />
                      </div>
                      <div className="media-body">
                        <h4 className="media-heading">
                          { comment.user.name }
                          <br />
                          <small>
                            commented on <a href="#">{ comment.post.title }</a>
                          </small>
                        </h4>
                        <p>
                          {comment.comment}
                        </p>
                      </div>
                    </li>
                  );
                })}

              {loggedIn && (
                <li className="media">
                  <input type="text" name="comment" onChange={commentChange} />
                  <button onClick={postComment}>Post</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    token: state.user.token,
    loggedIn: state.user.loggedIn
  };
};

export default connect(mapStateToProps)(Comments);
