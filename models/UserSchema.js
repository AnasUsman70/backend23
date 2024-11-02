import mongoose from "mongoose";

const schema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
}) 

const UserModel = mongoose.model('user', schema)

export default UserModel;