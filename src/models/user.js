const mongoose = require('mongoose');
const UserSchema  = new mongoose.Schema({
 name :{
      type  : String,
      required : true
  } ,
email :{
    type  : String,
    required : true
} ,
password :{
    type  : String, 
    required : true
} ,
date :{
    type : Date,
    default : Date.now
},
isVerified :{
    type : Boolean,
    default : false
},
userid :{
    type  :  String,
    require  :  true
},
//default or administrator
role :{
    type  :  String,
    require  :  true
},
isVerified :{
    type  :  Boolean,
    require  :  true
},
username :{
    type  :  String,
    require  :  false
},
integrations :{
    type  :  String,
    require  :  false
}

});
const User= mongoose.model('User',UserSchema);

module.exports = User;