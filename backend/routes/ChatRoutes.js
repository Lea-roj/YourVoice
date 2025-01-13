var express = require('express');
var router = express.Router();
var ChatModel = require('../models/ChatModel');
var UserModel = require('../models/UserModel');
const {ObjectId} = require('mongodb');

router.post('/newChat', function (req, res) {
    const data = req.body;
    // console.log(data);
    UserModel.findOne({username: data.user}).exec(function (err, User2) {
        if (err) {
            return res.status(500).json({
                message: 'Error when getting User.',
                error: err
            });
        }
        if (!User2) {
            return res.status(404).json({
                message: 'No such User'
            });
        }
        else {
            console.log("User found")
            UserModel.findById(data.userId).exec(function (err, User1) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting User.',
                        error: err
                    });
                }
                // console.log(User1.username);
                var newChat = new ChatModel({
                    user1: {
                        id: new ObjectId(data.userId),
                        username: User1.username,
                    },
                    user2: {
                        id: new ObjectId(User2._id),
                        username: User2.username,
                    }
                })
                console.log(newChat);
                newChat.save(function (err, Chat) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating Chat',
                            error: err,
                        });
                    }
                    return res.status(201).json(Chat);
                });
            })


    }
})
})

router.post('/getUserChats', function (req, res) {
    const data = req.body;
    ChatModel.find({$or:[{'user1.id': data.userId},{'user2.id': data.userId}]}).exec(function (err, Chats) {
        if(err){
            return res.status(500).json({
                message: 'Error when getting Chats.',
                error: err
            });
        }
        res.status(200).json(Chats);
    })
})

module.exports = router;