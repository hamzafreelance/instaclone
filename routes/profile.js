const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Post = require('../models/Post');

router.get('/:profileId',  (req, res) => {
     User.find({_id: req.params.profileId}).populate('posts', ['title', 'description', 'path', 'type', '_id']).then(user => {
        if(!user)
            res.send({error: true, message: 'User not found.'});

        let posts = [];
        Post.find({user: req.params.profileId})
        .then(posts => {
            res.status(200).send({error: false, user: user, posts});
      });
        //res.status(200).send({error: false, user: user, posts});
    }); 
});

module.exports = router;

