const express = require('express');
const fetch = require("node-fetch");
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

let key = process.env.API_KEY;

router.get('/search', function (req, res) {
    res.render('usersearch', {});
})

router.get('/info', function (req, res) {
    let user = req.query.user;
    let mode;
    let cookiezi = [];
    if(req.cookies.userName != null && req.cookies.userName2 != null && req.cookies.userName3 != null){
        if(req.cookies.userName != user && req.cookies.userName2 != user && req.cookies.userName3 != user){
            res.cookie("userName", user);
            res.cookie("userName2", req.cookies.userName3);
            res.cookie("userName3", req.cookies.userName2);
        }
    } else if (req.cookies.userName != null && req.cookies.userName2 != null){
        if(req.cookies.userName != user && req.cookies.userName2 != user){
            res.cookie("userName3", user);
        }        
    } else if (req.cookies.userName != null){
        if(req.cookies.userName != user){
            res.cookie("userName2", user);
        }
    } else{
        res.cookie("userName", user);
    }

    cookiezi = [req.cookies.userName, req.cookies.userName2, req.cookies.userName3];

    if(req.query.mode == "" || req.query.mode == null){
        mode = "0";
    } else{
        mode = req.query.mode;
    }
    
    let user_url = `https://osu.ppy.sh/api/get_user?u=${user}&m=${mode}&k=${key}`;

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

    //유저 정보 api 호출
    fetch(user_url)
        .then(response => {
            if (response.status === 200 || response.status === 201) {
                response.json().then(json => {
                    if(json == ""){
                        res.render("userpage", {msg: "정보가 없습니다.", userName: user});
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
                                if(user_best[i][11] >= 1073741824){
                                    modsMirror = user_best[i][11] - 1073741824;
                                } else {
                                    modsMirror = user_best[i][11];
                                }
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
                            res.render('userpage', { userList: userList, best_beatmap: best_beatmap, cookiezi: cookiezi });
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