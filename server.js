// Dependencies
let express = require("express"),
    bodyParser = require("body-parser"),
    logger = require("morgan"),
    mongoose = require("mongoose");
// Requiring our Note and Article models
let Note = require("./models/Note.js"),
    Article = require("./models/Article.js");
// Our scraping tools
let request = require("request"),
    cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

const PORT = process.env.PORT || 3001;
// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
let databaseUri = process.env.MONGODB_URI || "mongodb://localhost/mongotimes";
mongoose.connect( databaseUri );
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
  let scrapedArticles = [];
  // First, we grab the body of the html with request
  request("http://m.mlb.com/news/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    //$("li.article.rail-ad-mini").each(function(i, element) {
    $(".bam-article").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      // result.title = $(this).children("a").text().trim();
      // result.link = $(this).children("a").attr("href");
      result.title = $(this).attr('data-title');
      result.link = 'http://m.mlb.com' + $(this).attr("data-url");
      result.blurb = $(this).children("section").children('.blurb').text().trim().split('\n');
      console.log('result', i, '=', result.title)
      scrapedArticles.push(result);

    });
    console.log('--------- SCRAPED --------', scrapedArticles);
    res.send(scrapedArticles);
  });
  
  // Tell the browser that we finished scraping the text
  
});

// This will get the articles we saved to the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// This will save articles to the mongoDB
app.post("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.create(req.body, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Grab an article by its ObjectId
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("notes")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});


// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Use our Note model to make a new note from the req.body
  var newNote = new Note(req.body);
  // Save the new note to mongoose
  newNote.save(function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise
    else {
      // Find our user and push the new note id into the User's notes array
      Article.findOneAndUpdate({_id: req.params.id}, { $push: { "notes": doc._id } }, { new: true }, function(err, newdoc) {
        // Send any errors to the browser
        if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
          res.send(newdoc);
        }
      });
    }
  });
});

app.delete('/articles/:id', function(req, res) {
  Article.remove({ _id: req.params.id }, function(err) {
    if (err) res.sendStatus(500);
    
    res.send('Success!');
  });
})

app.delete('/notes/:id', function(req, res) {
  Note.remove({ _id: req.params.id }, function(err) {
    if (err) res.sendStatus(500);
    
    res.send('Success!');
  });
})

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port", PORT);
});
