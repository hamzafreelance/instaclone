import React, { Component } from "react";
import axios from "axios";

import "./post-create.styles.css";

class PostCreate extends Component {

  state = this.initialState;

  get initialState() {
    return {
        postTitle: "",
        description: "",
        file: null,
        errors: [],
        errorMessage: "",
        done: false
      }
  }

  onChange = e => {
    this.setState({errors: {[e.target.name]: ''}});
    this.setState({ ...this.state, errorMessage: "" });
    this.setState({ [e.target.name]: e.target.value });
  }

  onFileChange = e => {
    this.setState({errors: {file: ''}});
    this.setState({file: e.target.files[0] });
  }

  onSubmit = e => {
    e.preventDefault();
    if(this.state.file == null) {
        this.setState({errors: {file: 'Please upload a file first.'}});
        return false;
    }
    const formData = new FormData();
    formData.set("title", this.state.postTitle);
    formData.set("description", this.state.description);
    formData.append("file", this.state.file);
    console.log(formData.entries());
    let token = localStorage.getItem('token');
    axios
      .post("http://localhost:5000/api/posts/create", formData,
      { headers: {"Authorization" : `Bearer ${token}`} })
      .then(res => {
        if(!res.data.error) {
            document.getElementById("post-form").reset();
            this.setState(this.initialState);
            this.setState({...this.state, done: true});
        }
       
      })
      .catch(err => {
        if (err.response.data.errors !== undefined) {
          this.setState({ ...this.state, errors: err.response.data.errors });
        } else if (err.response.data.message !== undefined) {
          this.setState({
            ...this.state,
            errorMessage: err.response.data.message,
            errors: []
          });
        }
      });
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="container">
          <div className="formBox">
            <form onSubmit={this.onSubmit} method="post" id="post-form">
              <div className="row">
                <div className="col-sm-12">
                  <h1>Upload Image/Video</h1>
                </div>
              </div>
                {
                    this.state.done && <div class="row"><div className="col-sm-6"><p className="alert alert-primary">Post created successfully.</p></div></div>
                }
              <div className="row">
                <div className="col-sm-12">
                  <div className="inputBox">
                    <input
                      type="text"
                      name="postTitle"
                      className="input"
                      onChange={this.onChange}
                      placeholder="Title"
                    />
                    {this.state.errors.postTitle !== undefined && 
                      <span className="error">{this.state.errors.postTitle}</span>
                    }
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="inputBox">
                    <textarea
                      name="description"
                      className="input"
                      onChange={this.onChange}
                      placeholder="Description"
                    ></textarea>
                    {this.state.errors.description !== undefined && 
                      <span className="error">
                        {this.state.errors.description}
                      </span>
                    }
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-sm-4">
                  <div className="inputBox">
                    <input
                      type="file"
                      name="file"
                      className="input"
                      onChange={this.onFileChange}
                      placeholder="File"
                      accept=".jpg,.jpeg,.png,.gif,.mp4"
                    />
                    {this.state.errors.file !== undefined && 
                      <span className="error">{this.state.errors.file}</span>
                    }
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-4 offset-4">
                  {this.state.errorMessage !== undefined && (
                    <span></span>
                  )}
                  <input
                    type="submit"
                    name=""
                    className="button"
                    value="Create Post"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default PostCreate;
