import React, { Component } from 'react';
import Header from './components/UI/header.component';
import Footer from './components/UI/footer.component';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Route, Switch } from 'react-router-dom';

import Layout from './components/UI/layout.component';
import Home from './pages/home';
import Profile from './components/profile/profile.component';
import Register from './components/register/register.component';
import Login from './components/login/login.component';
import PrivateRoute from './components/common/private-route/private-route.component';
import PostCreate from './components/posts/post-create/post-create.component';
import PostDetail from './components/posts/post-detail/post-detail.component';


class App extends Component {

    render() {
        return (
            <Layout>
                <Switch>
                  <Route path='/' exact={true} component={Home} />
                  <Route path='/profile/:profileId' component={Profile} />
                  <Route path='/register' component={Register} />
                  <Route path='/login' component={Login} />
                  <Route path='/post/:postId' component={PostDetail} />
                  <PrivateRoute path='/upload' Component={PostCreate} />
                </Switch>
            </Layout>
        );
    }
  
}

export default App;
