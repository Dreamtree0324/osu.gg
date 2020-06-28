var mongoose = require('mongoose');

var ctb_userSchema = mongoose.Schema({
    user_name:{type: String, required: true, unique: true},
    user_id:{type: String, required: true, unique: true},
    user_country:{type:String},
    user_playCount:{type: String},
    user_grank:{type: String},
    user_crank:{type: String},
    user_performance:{type: String},
    countSS:{type: String},
    countSSH:{type: String},
    countS:{type: String},
    countSH:{type: String},
    countA:{type: String},
    update_time: {type: String}

}, {
    writeConcern: {
        j: true,
        wtimeout: 1000
      }
});

var CtbUser = mongoose.model('ctb_user', ctb_userSchema);

module.exports = CtbUser;