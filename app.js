const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));


mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully added!");
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted all articles");
      }
    });

  });

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No articles found");
    }
  });
})

//To update the whole article, no overwrite
.put(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content}, function(err){
    if(!err){
      res.send("Article successfully updated");
    }else{
    } res.send(err);
  });
})

.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Article successfully updated ");
      }else{
        res.send(err);
      }
    }
  )
})

.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Article successfully deleted");
      }else{
        res.send(err);
      }
    }
  );
});


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");

});

app.listen(3000, function(req, res) {
  console.log("Server is running on port 3000");
});
