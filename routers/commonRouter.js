const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.render("index");
})

/*
    TODO : 비트맵 관련 페이지 제작
    STEP1 - 비트맵 목록 받아오기
*/

router.get('/error', function (req, res) {
    res.render('error', { error: "error" });
})

module.exports = router;