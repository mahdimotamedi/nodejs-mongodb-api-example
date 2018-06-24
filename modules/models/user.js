const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

const UserSchema = new Schema({
    firstName : { type : String , required : true} ,
    lastName : { type : String , required : true} ,
    email : { type : String , required : true , unique : true} ,
    emailVerify : { type : Object } ,
    forgotPasswordRequest : { type : Object } ,
    password : { type : String , required : true} ,
    type : { type : Number , default : config.userTypes.normal},
    avatar : { type : String , default : ''},
});
UserSchema.plugin(timestamps);

module.exports = mongoose.model('User' , UserSchema);