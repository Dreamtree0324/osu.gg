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
    let detailUser;
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

    const user_url = `https://osu.ppy.sh/api/get_user?u=${user}&m=${mode}&k=${key}`;
    const best_url = `https://osu.ppy.sh/api/get_user_best?u=${user}&m=${mode}&k=${key}&limit=20`

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
    let User;
    let UserBest;
    let searchMode;

    switch (mode) {
        case "0":
            User = StdUser;
            searchMode = "standard";
            break;
        case "1":
            User = TaiUser;
            searchMode = "taiko";
            break;
        case "2":
            User = CtbUser;
            searchMode = "catch";
            break;
        case "3":
            User = ManUser;
            searchMode = "mania";
            break;
    }

    switch (mode) {
        case "0":
            UserBest = StdUserBest;
            break;
        case "1":
            UserBest = TaiUserBest;
            break;
        case "2":
            UserBest = CtbUserBest;
            break;
        case "3":
            UserBest = ManUserBest;
            break;
    }

    User.find({ user_name: { $regex: new RegExp(user, "i") } }, async function (err, user_info) {
        if (user_info != false) {

            console.log("Data Load Success");

            UserBest.find({ user_name: { $regex: new RegExp(user, "i") } }, function (err, user_best) {
                res.render('userpage', { user_info: user_info, user_best: user_best, searchMode: searchMode });
            })
        } else {

            let fetchUser = await fetch(user_url);
            let user_info = await fetchUser.json();
            if (user_info == false) {
                res.render("error", { msg: "존재하지 않는 유저입니다." })
            }
            detailUser = user_info[0].user_name;
            let player_info = {
                user_name: user_info[0].username,
                user_id: user_info[0].user_id,
                user_country: user_info[0].country,
                user_playCount: +user_info[0].playcount,
                user_grank: +user_info[0].pp_rank,
                user_crank: +user_info[0].pp_country_rank,
                user_performance: parseInt(user_info[0].pp_raw),
                countSS: parseInt(user_info[0].count_rank_ss),
                countSSH: parseInt(user_info[0].count_rank_ssh),
                countS: parseInt(user_info[0].count_rank_s),
                countSH: parseInt(user_info[0].count_rank_sh),
                countA: parseInt(user_info[0].count_rank_a),
                update_time: Date.now().toString()
            }

            for (const [key, value] of Object.entries(player_info)) {
                if (typeof value == "number" && isNaN(value)) {
                    Object.defineProperty(player_info, key, {
                        value: 0
                    })
                }
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
            let array_best_info = [];

            let best = await fetch(best_url);
            let best_info = await best.json();

            best_info.forEach(element => {
                let best_info = {
                    score: element.score,
                    pp: +element.pp,
                    rank: element.rank,
                    date: element.date,
                    mapId: element.beatmap_id,
                    count320: +element.countgeki,
                    count300: +element.count300,
                    count200: +element.countkatu,
                    count100: +element.count100,
                    count50: +element.count50,
                    countMiss: +element.countmiss,
                    mods: element.enabled_mods,
                    comma: numberFormat(element.score)
                }

                array_best_info.push(best_info);
            })

            switch (mode) {
                case "0":
                    StdUserBest.create({ user_name: user, best_score: array_best_info, song_info: [""] }, function (err, best_info) {
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

            let array_song_info = [];

            array_best_info.forEach(async (element, idx, array) => {

                if (element.mods >= 1073741824) {
                    modsMirror = element.mods - 1073741824;
                } else {
                    modsMirror = element.mods;
                }
                let URL = `https://osu.ppy.sh/api/get_beatmaps?b=${element.mapId}&a=1&m=${mode}&k=${key}&limit=20&mods=${element.mods}`;

                let song = await fetch(URL);
                let songs = await song.json();

                let best_song_info = {
                    obj_idx: idx,
                    song_title: songs[0].title,
                    song_diff: songs[0].version,
                    song_set: songs[0].beatmapset_id,
                    star_rating: songs[0].difficultyrating,
                    song_overall: songs[0].diff_overall,
                    song_id: songs[0].beatmap_id
                }

                array_song_info.push(best_song_info);

                setTimeout(async function () {
                    array_song_info.sort(function (a, b) {
                        if (a.obj_idx > b.obj_idx) {
                            return 1;
                        }
                        if (a.obj_idx < b.obj_idx) {
                            return -1;
                        }

                        return 0;
                    });

                    if (idx === array.length - 1) {
                        switch (mode) {
                            case "0":
                                await StdUserBest.updateOne({ user_name: { $regex: new RegExp(user, "i") } }, { $set: { song_info: array_song_info } }, function (err, sibal) {
                                    if (err) return res.json(err);
                                    console.log("update Success");
                                })
                                res.redirect("/user/info?mode=0&user=" + user);
                                break;
                            case "1":
                                await TaiUserBest.updateOne({ user_name: { $regex: new RegExp(user, "i") } }, { $set: { song_info: array_song_info } }, function (err, sibal) {
                                    if (err) return res.json(err);
                                    console.log("update Success");
                                })
                                res.redirect("/user/info?mode=1&user=" + user);
                                break;
                            case "2":
                                await CtbUserBest.updateOne({ user_name: { $regex: new RegExp(user, "i") } }, { $set: { song_info: array_song_info } }, function (err, sibal) {
                                    if (err) return res.json(err);
                                    console.log("update Success");
                                })
                                res.redirect("/user/info?mode=2&user=" + user);
                                break;
                            case "3":
                                await ManUserBest.updateOne({ user_name: { $regex: new RegExp(user, "i") } }, { $set: { song_info: array_song_info } }, function (err, sibal) {
                                    if (err) return res.json(err);
                                    console.log("update Success");
                                })
                                res.redirect("/user/info?mode=3&user=" + user);
                                break;
                        }

                    }
                }, 3000)

            })

        }
    });
});

router.post("/info", async function (req, res) {
    let user_name = req.body.updateName;
    let mode = req.body.updateMode;

    let User;
    let UserBest;
    let searchMode;

    switch (mode) {
        case "standard":
            mode = "0";
            break;
        case "taiko":
            mode = "1";
            break;
        case "catch":
            mode = "2";
            break;
        case "mania":
            mode = "3";
            break;
    }

    switch (mode) {
        case "0":
            User = StdUser;
            searchMode = "standard";
            break;
        case "1":
            User = TaiUser;
            searchMode = "taiko";
            break;
        case "2":
            User = CtbUser;
            searchMode = "catch";
            break;
        case "3":
            User = ManUser;
            searchMode = "mania";
            break;
    }

    switch (mode) {
        case "0":
            UserBest = StdUserBest;
            break;
        case "1":
            UserBest = TaiUserBest;
            break;
        case "2":
            UserBest = CtbUserBest;
            break;
        case "3":
            UserBest = ManUserBest;
            break;
    }

    await User.deleteOne({ user_name: { $regex: new RegExp(user_name, "i") } });
    await UserBest.deleteOne({ user_name: { $regex: new RegExp(user_name, "i") } });

    res.redirect("/user/info?mode=" + mode + "&user=" + user_name);
})


//score 표기시 , 를 제거 해주는 정규식, 점수 관련 계산이 필요해 작성함
function numberFormat(inputNumber) {
    return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = router;