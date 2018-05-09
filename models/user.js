/*
*
*   @Description: User-Model
*   @Author: WuWangCheng
*   @Date: 2018-05-08
*
* */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    password: String,
    age: String,
    gender: Number,
    telephone: String,
    picture: String,
    address: String,
    status: {type: Number, default: 1},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);
