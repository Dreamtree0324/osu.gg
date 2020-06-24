const express = require('express');
const fetch = require("node-fetch");
const dotenv = require('dotenv');
const StdUser = require('../models/StdUser');
const ManUser = require('../models/ManUser');
const TaiUser = require('../models/TaiUser');
const CtbUser = require('../models/CtbUser');
const StdUserBest = require('../models/StdUserBest');
const ManUserBest = require('../models/ManUserBest');
const TaiUserBest = require('../models/TaiUserBest');
const CtbUserBest = require('../models/CtbUserBest');
dotenv.config();

const router = express.Router();

let key = process.env.API_KEY;

router.get('/search', function (req, res) {
    let cookiezi = [req.cookies.userName, req.cookies.userName2, req.cookies.userName3];
    res.render('usersearch', { cookiezi: cookiezi });
})

router.get('/info', function (req, res) {
    let user = req.query.user;
    let mode;
    if (req.cookies.userName != null && req.cookies.userName2 != null && req.cookies.userName3 != null) {
        if (req.cookies.userName != user && req.cookies.userName2 != user && req.cookies.userName3 != user) {
            res.cookie("userName2", req.cookies.userName);
            res.cookie("userName3", req.cookies.userName2);
            res.cookie("userName", user);
        }
    } else if (req.cookies.userName != null && req.cookies.userName2 != null) {
        if (req.cookies.userName != user && req.cookies.userName2 != user) {
            res.cookie("userName3", user);
        }
    } else if (req.cookies.userName != null) {
        if (req.cookies.userName != user) {
            res.cookie("userName2", user);
        }
    } else {
        res.cookie("userName", user);
    }

    if (req.query.mode == "" || req.query.mode == null) {
        mode = "0";
    } else {
        mode = req.query.mode;
    }

    let user_url = `https://osu.ppy.sh/api/get_user?u=${user}&m=${mode}&k=${key}`;
    const best_url = `https://osu.ppy.sh/api/get_user_best?u=${user}&m=${mode}&k=${key}&limit=20`

    let userID;
    let userName;
    let playCount;
    let gRank;
    let cRank;
    let countSS;
    let countSSH;
    let countS;
    let countSH;
    let countA;
    let pp;
    let userCountry;
    let modeName;

    //mode 체크
    switch (mode) {
        case "0":
            modeName = "standard";
            break;
        case "1":
            modeName = "taiko";
            break;
        case "2":
            modeName = "catch";
            break;
        case "3":
            modeName = "mania";
            break;
    }

    let userList = [];
    let User;
    switch (mode) {
        case "0":
            User = StdUser;
            break;
        case "1":
            User = TaiUser;
            break;
        case "2":
            User = CtbUser;
            break;
        case "3":
            User = ManUser;
            break;
    }

    User.find({ user_name: { $regex: new RegExp(user, "i") } }, async function (err, userinfo) {
        if (userinfo != false) {
            console.log("Data Load Success");

            StdUserBest.find({user_name : { $regex: new RegExp(user, "i") }}, function(err, user_best_info){
                user_best_info[0].best_score.forEach(element => {
                    console.log(element.mapId + " / " + element.mods);
                })
            })

        } else {
            await fetch(user_url)
                .then(response => response.json())
                .then(json => {
                    let player_info = {
                        user_name: json[0].username,
                        user_id: json[0].user_id,
                        user_country: json[0].country,
                        user_playCount: json[0].playcount,
                        user_grank: json[0].pp_rank,
                        user_crank: json[0].pp_country_rank,
                        user_performance: json[0].pp_raw,
                        countSS: json[0].count_rank_ss,
                        countSSH: json[0].count_rank_ssh,
                        countS: json[0].count_rank_s,
                        countSH: json[0].count_rank_sh,
                        countA: json[0].count_rank_a
                    }
                    switch (mode) {
                        case "0":
                            StdUser.create(player_info, function (err, user) {
                                if (err) return res.json(err);
                            })
                            break;
                        case "1":
                            TaiUser.create(player_info, function (err, user) {
                                if (err) return res.json(err);
                            })
                            break;
                        case "2":
                            CtbUser.create(player_info, function (err, user) {
                                if (err) return res.json(err);
                            })
                            break;
                        case "3":
                            ManUser.create(player_info, function (err, user) {
                                if (err) return res.json(err);
                            })
                    }
                })
            let array_best_info = [];

            await fetch(best_url)
                .then(response => response.json())
                .then(json => {
                    json.forEach(element => {
                        let best_info = {
                            score: element.score,
                            pp: element.pp,
                            rank: element.rank,
                            date: element.date,
                            mapId: element.beatmap_id,
                            count320: element.countgeki,
                            count300: element.count300,
                            count200: element.countkatu,
                            count100: element.count100,
                            count50: element.count50,
                            countMiss: element.countmiss,
                            mods: element.enabled_mods
                        }

                        array_best_info.push(best_info);
                    })

                    switch (mode) {
                        case "0":
                            StdUserBest.create({ user_name: user, best_score: array_best_info }, function (err, best_info) {
                                if (err) return res.json(err);
                            })
                            break;
                        case "1":
                            TaiUserBest.create({ user_name: user, best_score: array_best_info }, function (err, best_info) {
                                if (err) return res.json(err);
                            })
                            break;
                        case "2":
                            CtbUserBest.create({ user_name: user, best_score: array_best_info }, function (err, best_info) {
                                if (err) return res.json(err);
                            })
                            break;
                        case "3":
                            ManUserBest.create({ user_name: user, best_score: array_best_info }, function (err, best_info) {
                                if (err) return res.json(err);
                            })
                            break;
                    }

                    switch (mode) {
                        case "0":
                            StdUserBest.find({user_name : { $regex: new RegExp(user, "i") }}, function(err, user_best_info){
                                user_best_info[0].best_score.forEach(element => {
                                    let songUrl = `https://osu.ppy.sh/api/get_beatmaps?b=${element.mapId}&a=1&m=${mode}&k=${key}&limit=20&mods=${element.mods}`;

                                    fetch(songUrl)
                                    .then(response => response.json())
                                    .then(json => {
                                        
                                    })
                                })
                            })
                    }
                })
        }
    });

    //유저 정보 chapi 호출
    fetch(user_url)
        .then(response => {
            if (response.status === 200 || response.status === 201) {
                response.json().then(json => {
                    if (json == "") {
                        res.render("userpage", { msg: "정보가 없습니다.", userName: user });
                        return;
                    }
                    userID = json[0].user_id;
                    userName = json[0].username;
                    userCountry = json[0].country;
                    playCount = json[0].playcount;
                    gRank = +json[0].pp_rank;
                    cRank = +json[0].pp_country_rank;
                    pp = parseInt(json[0].pp_raw);
                    countSS = +json[0].count_rank_ss
                    countSSH = +json[0].count_rank_ssh
                    countS = +json[0].count_rank_s
                    countSH = +json[0].count_rank_sh
                    countA = +json[0].count_rank_a
                    userList = [userName, userCountry, playCount, gRank, cRank, pp, countSS, countSSH, countS, countSH, countA, userID, modeName, mode];

                    const best_url = `https://osu.ppy.sh/api/get_user_best?u=${user}&m=${mode}&k=${key}&limit=20`

                    !async function () {
                        let score;
                        let pp;
                        let rank;
                        let date;
                        let mapId;
                        let count320;
                        let count300;
                        let count200;
                        let count100;
                        let count50;
                        let countMiss;
                        let mods;

                        let middle = [];
                        let mapInfo = [];
                        let bestPP = [];

                        //유저 베퍼포 api 호출
                        let user_best = await fetch(best_url)
                            .then(response => response.json())
                            .then(json => {
                                json.forEach(element => {
                                    let i = 0;
                                    score = element.score;
                                    let comma = numberFormat(score);
                                    pp = +element.pp;
                                    rank = element.rank;
                                    date = element.date;
                                    mapId = element.beatmap_id;
                                    count320 = +element.countgeki;
                                    count300 = +element.count300;
                                    count200 = +element.countkatu;
                                    count100 = +element.count100;
                                    count50 = +element.count50;
                                    countMiss = +element.countmiss;
                                    mods = element.enabled_mods;
                                    middle[i] = [comma, pp, rank, date, mapId, count320, count300, count200, count100, count50, countMiss, mods, score];
                                    bestPP.push(middle[i]);
                                    i++;
                                })
                                return bestPP;
                            }).catch(err => console.log(err));
                        !async function () {
                            let best_beatmap;
                            let songTitle;
                            let songDiff;
                            let songSet;
                            let starRating;
                            let modsMirror;
                            for (let i = 0; i < user_best.length; i++) {
                                if (user_best[i][11] >= 1073741824) {
                                    modsMirror = user_best[i][11] - 1073741824;
                                } else {
                                    modsMirror = user_best[i][11];
                                }
                                modsMirror = user_best[i][11] - (modsMirror.toString(2) & 512);
                                let URL = `https://osu.ppy.sh/api/get_beatmaps?b=${user_best[i][4]}&a=1&m=${mode}&k=${key}&limit=20&mods=${modsMirror}`;
                                //베퍼포별 곡 정보 api 호출
                                best_beatmap = await fetch(URL)
                                    .then(response => response.json())
                                    .then(json => {
                                        songTitle = json[0].title;
                                        songDiff = json[0].version;
                                        songSet = json[0].beatmapset_id;
                                        starRating = json[0].difficultyrating;
                                        songOD = json[0].diff_overall;

                                        mapInfo[i] = [songTitle, songDiff, songSet, starRating, songOD];

                                        user_best[i].push(mapInfo[i]);
                                        return user_best;

                                    }).catch(err => console.log(err));
                            }
                            res.render('userpage', { userList: userList, best_beatmap: best_beatmap });
                        }();
                    }();
                }).catch(err => { console.log(err) });
            }
        })
});


//score 표기시 , 를 제거 해주는 정규식, 점수 관련 계산이 필요해 작성함
function numberFormat(inputNumber) {
    return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = router;