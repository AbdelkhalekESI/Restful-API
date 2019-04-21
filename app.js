var     bodyParser = require("body-parser"),
        methodOverride = require("method-override"),
        expressSanitizer = require("express-sanitizer"),
        mongoose       = require("mongoose"),
        express        = require("express"),
        app            = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSanitizer());
app.use(bodyParser.json());
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now()}
});
var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
app.get("/", function (req, res) {
   res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
   Blog.find({}, function (err, blogs) {
       if (err) {
          console.log(err);
       } else {
          res.render("index", {blogs: blogs});
       }
   });
});

app.get("/blogs/new", function (req, res) {
   res.render("new");
});

app.post("/blogs", function(req, res) {
   var t = req.body.title;
   var i = req.body.image;
   var b = req.body.body;
   /*b = req.sanitize(b);*/
   var newPost = {title: t, image: i, body: b};
   Blog.create(newPost, function(err, newBlog) {
      if (err) {
         res.render("new");
      } else {
         res.redirect("/blogs");
      }
   });
});

app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id, function(err, foundBlog) {
      if (err) {
         res.redirect("/blogs");
      } else {
         res.render("show", {blog: foundBlog});
      }
   });
});

app.get("/blogs/:id/edit", function (req,res) {
   Blog.findById(req.params.id, function (err, foundBlog) {
      if (err) {
         res.redirect("/blogs");
      } else {
         res.render("edit", {blog: foundBlog});
      }
   });
});

app.put("/blogs/:id", function (req, res) {
   var t = req.body.title;
   var i = req.body.image;
   var b = req.body.body;
   b = req.sanitize(b);
   var newpost = {title: t, image: i, body: b}; 
   Blog.findByIdAndUpdate(req.params.id, newpost, function(err, updatedBlog) {
      if (err) {
         res.redirect("/blogs");
      } else {
         res.redirect("/blogs/" + req.params.id);
      }
   });
});

app.delete("/blogs/:id", function (req, res) {   
   Blog.findByIdAndDelete(req.params.id, function (err) {
      if (err) {
         res.redirect("/blogs");
      } else {
         res.redirect('/blogs');
         
      }
   })
});

app.listen(2300, function () {
   console.log("HERE WE ARE") ;
});