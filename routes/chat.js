const express = require('express');

const router = express.Router();
const passport = require('passport');

const Chat = require('../models/Chat');
const Messages = require('../models/Messages');



router.get('/:toUserId', passport.authenticate('jwt', {session: false}), (req, res) => {
    let toUser = req.params.toUserId;
    let fromUser = req.user._id;

    Chat.findOne({to: toUser, from: fromUser}).then((chat) => {
        if(!chat) {
            res.send({messages: []});
        } else {
            Messages.find({chat: chat._id}).sort({created_at: 1}).then(messages => {
                res.send({messages: messages});
            });
        }
    });
});

router.post('/sendMessage/:toUserId', passport.authenticate('jwt', {session: false}), (req, res) => {
    let toUser = req.params.toUserId;
    let fromUser = req.user._id;
    let message = req.body.message;
    //let chatId = req.params.chatId;
    
    Chat.findOne({to: toUser, from: fromUser}).then((chat) => {
        if(!chat) {
            new Chat({
                to: toUser,
                from: fromUser,
                created_at: new Date()  
            }).save().then(chat => {
                let id = chat._id;
                new Messages({
                    chat: id,
                    user: fromUser,
                    message: message
                }).save().then(message => {
                    res.status(200).send({message: 'Message sent.'});
                });
            });
        } else {
            let id = chat._id;
            new Messages({
                chat: id,
                user: fromUser,
                message: message
            }).save().then(message => {
                res.status(200).send({message: 'Message sentt.'});
            });
        }
    });
});

module.exports = router;