const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = validateProfileInput = (data) => {
    const { handle, skills, status, website, youtube, twitter, facebook, linkedin, instagram } = data;

    let errors = {};

    if(isEmpty(handle)) {
        errors.handle = 'Handle is required';
    } else  if(!Validator.isLength(handle,{min: 2, max: 40})) {
        errors.handle = 'Handle must ebe between 2 and 40 characters in length';
    }

    if(isEmpty(skills)) {
        errors.skills = 'Skills are required';
    }

    if(isEmpty(status)) {
        errors.skills = 'Status is required';
    }

    if(!isEmpty(website)) {
        if(!Validator.isURL(website)) {
            errors.website = 'Website is not a valid URL.';
        }
    }

    if(!isEmpty(youtube)) {
        if(!Validator.isURL(youtube)) {
            errors.youtube = 'Youtube is not a valid URL.';
        }
    }

    if(!isEmpty(twitter)) {
        if(!Validator.isURL(twitter)) {
            errors.twitter = 'Twitter is not a valid URL.';
        }
    }

    if(!isEmpty(facebook)) {
        if(!Validator.isURL(facebook)) {
            errors.facebook = 'Facebook is not a valid URL.';
        }
    }

    if(!isEmpty(linkedin)) {
        if(!Validator.isURL(linkedin)) {
            errors.linkedin = 'Linkedin is not a valid URL.';
        }
    }

    if(!isEmpty(instagram)) {
        if(!Validator.isURL(instagram)) {
            errors.instagram = 'Instagram is not a valid URL.';
        }
    }

    return {
        isValid: !errors,
        errors: errors
    }
};