import mongoose from "mongoose";

const Schema = mongoose.Schema({
    title: String,
    desc: String,
    postID: Number,
})

const postModel = mongoose.model('post', Schema)

export default postModel;