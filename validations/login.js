const isEmpty = require('./is-empty');
const Validtor = require('validator');

module.exports = data => {
    const {email, password}  = data;
    const errors = {};
    if(isEmpty(email)) {
        errors.email = 'Email is required';
    } else if(!Validtor.isEmail(email)) {
        errors.email = 'Please enter a correct email address';
    }

    if(isEmpty(password)) {
        errors.password = 'Password is required';
    }

    return {
        errors: errors,
        isValid : isEmpty(errors)
    }
};