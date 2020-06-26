var mongoose = require('mongoose');

var ctb_user_bestSchema = mongoose.Schema({
    user_name : {type:String, require:true, unique:true},
    best_score : [Object],
    song_info : [Object],
}, {
    writeConcern: {
        j: true,
        wtimeout: 1000
      }
});

var CtbUserBest = mongoose.model('ctb_user_best', ctb_user_bestSchema);

module.exports = CtbUserBest;