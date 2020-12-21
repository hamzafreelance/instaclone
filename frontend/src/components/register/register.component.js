import React, { Component } from "react";
import { registerUser } from '../../redux/user/user.actions';

import { connect } from 'react-redux';


import "./register.styles.css";

class Register extends Component {
  state = {
    name: "",
    picture: null,
    email: "",
    password: "",
    errors: [],
    errorMessage: "",
    loggedIn: false
  };

  onChange = e => {
    this.setState({ ...this.state, errorMessage: "" });
    this.setState({ [e.target.name]: e.target.value });
  };

  onFileUpload = e => {
    this.setState({...this.state, picture: e.target.files[0]});
  };

     onSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('name', this.state.name);
    formData.set('email', this.state.email);
    formData.set('password', this.state.password);
    formData.set('cpassword', this.state.password);
    formData.append('picture', this.state.picture);
    this.props.registerUser(formData);
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="container">
          <div className="formBox">
            <form onSubmit={this.onSubmit} method="post">
              <div className="row">
                <div className="col-sm-12">
                  <h1>Register</h1>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="inputBox">
                    <input
                      type="text"
                      name="name"
                      className="input"
                      onChange={this.onChange}
                      placeholder="Name"
                    />
                    {this.props.errors.name !== undefined && (
                      <span className="error">{this.props.errors.name}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="inputBox">
                    <input
                      type="email"
                      name="email"
                      className="input"
                      onChange={this.onChange}
                      placeholder="Email"
                    />
                    {this.props.errors.email !== undefined && (
                      <span className="error">{this.props.errors.email}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="inputBox">
                    <input
                      type="password"
                      name="password"
                      className="input"
                      onChange={this.onChange}
                      placeholder="Password"
                    />
                    {this.props.errors.password !== undefined && (
                      <span className="error">
                        {this.props.errors.password}
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="inputBox">
                    <input
                      type="file"
                      name="picture"
                      className="input"
                      onChange={this.onFileUpload}
                      placeholder="Profile Picture"
                    />
                    {this.props.errors.picture !== undefined && (
                      <span className="error">{this.props.errors.picture}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-4 offset-4">
                  {this.state.errorMessage !== undefined && (
                    <span>{this.state.errorMessage}</span>
                  )}
                  <input
                    type="submit"
                    name=""
                    className="button"
                    value="Register"
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

const mapStateToProps = state => ({
  loggedIn: state.user.loggedIn,
  errors: state.user.errors
});

const mapDispatchToProps = dispatch => ({
  registerUser: (data) => dispatch(registerUser(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
