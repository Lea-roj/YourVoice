var express = require('express');
var router = express.Router();
var ChatModel = require('../models/ChatModel');
var UserModel = require('../models/UserModel');
var MessageModel = require('../models/MessageModel');
const {ObjectId} = require('mongodb');

router.post('/newMessage', function (req, res) {
    const data = req.body;
    console.log(data);
    UserModel.findById(data.userId).exec(function (err, User) {
        if (err) {
            return res.status(500).json({
                message: 'Error when getting User.',
                error: err
            });
        }
        if (!User) {
            return res.status(404).json({
                message: 'No such User'
            });
        }
        else {
            console.log("User found")
            ChatModel.findById(data.chatId).exec(function (err, Chat) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting Chat.',
                        error: err
                    });
                }
                var newMsg = new MessageModel({
                    userId: new ObjectId(data.userId),
                    chatId: Chat._id,
                    content: data.content,
                })
                console.log(newMsg);
                newMsg.save(function (err, Message) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating Message',
                            error: err,
                        });
                    }
                    return res.status(201).json(Message);
                })
            })
        }
    })
})

router.post('/getChatMessages', function (req, res) {
    const data = req.body;
    ChatModel.findById(data.chatId).exec(function (err, User) {
        if (err) {
            return res.status(500).json({
                message: 'Error when getting Chat.',
                error: err
            });
        }
        MessageModel.find({chatId: data.chatId}).exec(function (err, Messages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Messages.',
                    error: err
                });
            }
            res.status(200).json(Messages);
        })
    })
})

module.exports = router;