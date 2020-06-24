var mongoose = require('mongoose');

var tai_user_bestSchema = mongoose.Schema({
    user_name : {type:String, require:true, unique:true},
    best_score : [Object]
}, {
    writeConcern: {
        j: true,
        wtimeout: 1000
      }
});

var TaiUserBest = mongoose.model('tai_user_best', tai_user_bestSchema);

module.exports = TaiUserBest;