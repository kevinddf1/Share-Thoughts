//jshint esversion:6

const password = require(__dirname + "/password.js");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect(password.mongodbURL, {
  useNewUrlParser: true
});




//--------------------------global variables------------------------------//
const homeStartingContent = "";
const aboutContent = "This website is designed for everyone to share their thoughts or secrets.";
const contactContent = "Email: kevinddf1@gmail.com";

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);



//--------------------------functions------------------------------------//



//main page rendering
app.get("/", function(req, res) {
  Post.find({}, function(err, allPosts) {
    res.render("home", {
      startText: homeStartingContent,
      postsArray: allPosts
    });
  });
});

//about page rendering
app.get("/about", function(req, res) {
  res.render("about", {
    startText: aboutContent
  });
});

//contact page rendering
app.get("/contact", function(req, res) {
  res.render("contact", {
    startText: contactContent
  });
});

//compose rage rendering
app.get("/compose", function(req, res) {
  res.render("compose");
});

//compose get message
app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.composeTitle,
    content: req.body.composeText
  });
  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});


//posts rage rendering
app.get("/posts/:postID", function(req, res) {
  const requestedPostId = req.params.postID;
  Post.findOne({_id: requestedPostId}, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});



//posts rage rendering
app.post("/deleteAll", function(req, res) {
  Post.remove({}, function(){});
  res.redirect("/");
});







let port = process.env.PORT;
app.listen(port);
