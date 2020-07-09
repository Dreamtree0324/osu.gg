const express = require('express');
const userController = require('../controller/UserController');

const router = express.Router();

router.get('/search', function (req, res) {
    let cookiezi = [req.cookies.userName, req.cookies.userName2, req.cookies.userName3];
    res.render('usersearch', { cookiezi: cookiezi });
})

router.get('/info', userController.searchUser);

router.post("/info", userController.updateUser);

module.exports = router;