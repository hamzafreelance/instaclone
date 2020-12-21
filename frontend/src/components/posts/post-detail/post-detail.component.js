import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";

import Comments from "../../comments/comments.component";
import { pathToFileURL } from "url";

const PostDetail = props => {
  let params = useParams();
  let postId = props.match.params.postId;
  const [post, setPost] = useState(null);

  useEffect(function() {
    if (postId !== null) {
      axios
        .get("http://localhost:5000/api/posts/detail/" + postId)
        .then(res => {
          if (res.data.post !== undefined) {
            setPost(res.data.post[0]);
          }
        });
    }
  }, []);
  let postDetail = "Loading....";
  if (post !== null) {
    postDetail = (
      <div className="row">
        <img
          src={"http://localhost:5000/" + post.path.replace("./uploads", "")}
        />
      </div>
    );
  }
  return (
    <div className="container">
      {postDetail}

      <Comments postId={params.postId} test={postId} />
    </div>
  );
};

const mapStateToProps = state => ({
  token: state.user.token
});

export default connect(mapStateToProps)(PostDetail);
