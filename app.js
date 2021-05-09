//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "A blog (shortening of “weblog”) is an online journal or informational website displaying information in the reverse chronological order, with the latest posts appearing first. It is a platform where a writer or even a group of writers share their views on an individual subject.";
const aboutContent = "A blog (shortening of “weblog”) is an online journal or informational website displaying information in the reverse chronological order, with the latest posts appearing first. It is a platform where a writer or even a group of writers share their views on an individual subject.The main purpose a blog is to connect you to the relevant audience.One is to boost your traffic and send quality leads to your website.blogs promote perfect reader engagement. Readers get a chance to comment and voice their different concerns to the viewer. Static websites, on the other hand, consists of the content presented on static pages. Static website owners rarely update their pages. Blog owners update their site with new blog posts on a regular basis.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://abhishek:test@cluster0-bvva7.mongodb.net/blogDB", {useNewUrlParser: true});
//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
const postSchema = {
  title: String,
  content: String,
  image: String
};

const Post = mongoose.model("Post", postSchema);
app.get("/blog", function(req, res){

  Post.find({}, function(err, posts){
    res.render("blog", {
      posts: posts
      });
  });
});
app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    image: req.body.imageField
  });

  post.save(function(err){
    if (!err){
        res.redirect("/blog");
    }
  });
});

app.get("/posts/:postId", function(req, res){
const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content,
      image: post.image
    });
  });
});
app.get("/image/:imageid",function(req,res){

var ImageAsset = require("../models/imageModel.js");
var path = require("path");

var imageidn = req.params.imageid.toString();
var imageId = mongoose.Types.ObjectId(imageidn);

EventAsset.findOne({"_id":imageId}, function(err,im ,imageasset){
if(err) console.log("Unable to find a Thumbnail Asset associated with the given imageid" + err);

res.contentType(imageasset.mimeType);
res.sendfile(path.resolve(imageasset.filePath));
      });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

let port = process.env.PORT;
if(port == null || port == "")
{
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
