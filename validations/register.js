const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};
  const { name, email, password, cpassword } = data;

  if(isEmpty(name)) {
      errors.name = 'Name is required';
  } else if (!Validator.isLength(name, { min: 2, max: 30 })) {
      errors.name = 'Name must be between 2 and 30 characters';
  }    

  if (isEmpty(email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (isEmpty(password)) {
    errors.password = 'Password field is required';
  } else if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (isEmpty(cpassword)) {
    errors.cpassword = 'Confirm Password field is required';
  } else if (!Validator.equals(password, cpassword)) {
    errors.cpassword = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
