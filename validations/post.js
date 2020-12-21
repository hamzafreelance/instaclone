const isEmpty = require('./is-empty');
const Validtor = require('validator');

module.exports = (data, file) => {
    const {title}  = data;
    const errors = {};
    if(isEmpty(title)) {
        errors.title = 'Title is required';
    } 

    if(isEmpty(file)) {
        errors.file = 'File is required';
    }

    return {
        errors: errors,
        isValid : isEmpty(errors)
    }
};