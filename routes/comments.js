const express = require('express');
const router = express.Router();

const passport = require('passport');
const Comment = require('../models/Comment');

router.post('/post/:postId', passport.authenticate('jwt', {session: false}), (req, res) => {
    let postId = req.params.postId;
    let userId = req.user._id;
    let comment = req.body.comment;
    
    new Comment({
        user: userId,
        post: postId,
        comment: comment
    }).save().then(comment => {
        if(comment)
            res.status(200).send({message: 'Comment added successfully.'});
    }).catch(err => {
        res.status(400).send({message: 'An error occurred'});
    });
});

router.get('/get/:postId', (req, res) => {
    let postId = req.params.postId;

    Comment.find({post: postId}).populate('user').populate('post').then(comments => {
        res.status(200).send({comments});
    }).catch(err => {
        res.status(400).send({message: 'An error occurred'});
    });
});

module.exports = router;