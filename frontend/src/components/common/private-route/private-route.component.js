import React from 'react';

import { Redirect } from 'react-router-dom';

const PrivateRoute = ({Component, ...otherProps}) => (
localStorage.getItem('token') ? <Component {...otherProps} /> : <Redirect to="/" />
);

export default PrivateRoute;