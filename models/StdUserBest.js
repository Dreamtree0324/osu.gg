var mongoose = require('mongoose');

var std_user_bestSchema = mongoose.Schema({
    user_name : {type:String, require:true, unique:true},
    best_score : [Object]
}, {
    writeConcern: {
        j: true,
        wtimeout: 1000
      }
});

var StdUserBest = mongoose.model('std_user_best', std_user_bestSchema);

module.exports = StdUserBest;