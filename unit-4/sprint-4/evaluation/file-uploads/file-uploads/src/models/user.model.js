const mongoose = require("mongoose");
// User Model
// - firstName (string, required, minimum length 3 and maximum length 30)
// - lastName (string, optional, if given then minimum length 3 and maximum length 30)
// - age (integer, required, should be between 1 and 150)
// - email (string, required, unique)
// - profileImages: (array of imageUrls and atleast 1 profile image is required)
// - timestamps (string, required)


const userSchema = new mongoose.Schema(
  {
   
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    profileImages: [{ type: String }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema); 
// Post Model
// - body (string, optional),
// - likes (integer, minimum default is 0)
// - image (string, optional)
// - timestamps (string, required)
const postSchema = new mongoose.Schema({
  likes: { type: String, required: true },
  body: { type: String, required: false },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  image: [{ type: String }]
},{
  versionKey: false,
  timestamps: true,
});
const Post = mongoose.model("post", postSchema);
// PostLike Model
// - postId ( references post collection)
// - userId ( references user collection)
const postLikeSchema = new mongoose.Schema({
  postId:{ type: mongoose.Schema.Types.ObjectId,
    ref: "post",
    required: true,},
  userId:{type: mongoose.Schema.Types.ObjectId,
  ref:"user",
required:true}
});
const PostLike = mongoose.model("postLike",postLikeSchema);
// Comment Model
// - body ( string, required)
// - timestamps (string, required)
const commentSchema = new mongoose.Schema({
  body:{type:String, required:true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
    required: true,
  },
},{
  timestamps:true,
  versionKey:false
})
// There will be a relationship between User and Post
// - There will be a relationship between User and Comment
// - There will be a relationship between Post and Comment

module.exports = User;
