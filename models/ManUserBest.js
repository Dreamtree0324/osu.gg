var mongoose = require('mongoose');

var man_user_bestSchema = mongoose.Schema({
    user_name : {type:String, require:true, unique:true},
    best_score : [Object],
    song_info : [Object],
}, {
    writeConcern: {
        j: true,
        wtimeout: 1000
      }
});

var ManUserBest = mongoose.model('man_user_best', man_user_bestSchema);

module.exports = ManUserBest;