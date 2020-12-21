import React from "react";
import { withRouter } from 'react-router-dom';
import './post-item.styles.css';

const PostItem = ({post, history}) => {
  const {title, description, path, _id} = post; 
  return (
    <div className="col-sm-12 col-md-6 col-lg-3 no-padding">
      <div className="portfolio-content" onClick={() => history.push('/post/' + _id)}>
        <figure >
          <img src={"http://localhost:5000/"+path.replace("./uploads",'')} alt="" />
        </figure>

        <div className="entry-content flex flex-column align-items-center justify-content-center">
          <h3>
            <a href="#">{title}</a>
          </h3>

          <ul className="flex flex-wrap justify-content-center">
            <li>
              <a href="#">Profile,</a>
            </li>
            <li>
              <a href="#">Tree</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default withRouter(PostItem);
