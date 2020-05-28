const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    userID: { type: String, required: true, unique: true }
})

const User = mongoose.model('User', userSchema);

const user = new User({
    userName: json[0].username,
    userID: json[0].user_id
});

user.save(() => console.log('save success'));

module.exports = mongoose.model('User', userSchema);