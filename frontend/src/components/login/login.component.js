import React, { Component } from "react";
import { connect } from 'react-redux';

import { loginUser } from '../../redux/user/user.actions';

import "./login.styles.css";

class Login extends Component {

  componentDidMount() {
    if(this.props.loggedIn !== undefined && this.props.loggedIn) {
      this.props.history.push('/');
   }
  }

    state = {
        email :'',
        password: '',
        errors: [],
        errorMessage: '',
        loggedIn: false
    }

    onChange = (e) => {
        this.setState({...this.state, errorMessage: ''});
        this.setState({[e.target.name]: e.target.value});
    }

     onSubmit = (e) => {
         e.preventDefault();
         this.props.loginUser({email: this.state.email, password: this.state.password});
        if(this.props.loggedIn !== undefined) {
           this.props.history.push('/');
        }
    }

    render() {
        return (
            <div className="container-fluid">
              <div className="container">
                <div className="formBox">
                  <form onSubmit={this.onSubmit} method="post">
                    <div className="row">
                      <div className="col-sm-12">
                        <h1>Login</h1>
                      </div>
                    </div>
        
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="inputBox">
                          <input type="text" name="email" className="input" onChange={this.onChange} placeholder="Email" />
                          {
                            this.props.errors.email !== undefined &&  <span className="error">{this.props.errors.email}</span>
                          }
                        </div>
                      </div>
        
                      <div className="col-sm-6">
                        <div className="inputBox">
                          <input type="password" name="password" className="input" onChange={this.onChange} placeholder="Password" />
                          {
                            this.props.errors.password !== undefined &&  <span className="error">{this.props.errors.password}</span>
                          }
                        </div>
                      </div>
                    </div>
        
        
                    <div className="row">
                      <div className="col-sm-4 offset-4">
                      {
                            this.state.errorMessage !== undefined &&  <span>{this.state.errorMessage}</span>
                          }
                        <input
                          type="submit"
                          name=""
                          className="button"
                          value="Login"
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

const mapStateToProps  = state => ({
  errors: state.user.errors,
  loggedIn: state.user.loggedIn
});

const mapDispatchToProps = (dispatch) => ({
  loginUser: user => dispatch(loginUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
