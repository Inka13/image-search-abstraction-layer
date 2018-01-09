const express = require('express');
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

const mongodb = require("mongodb");
//const mongoose = require('mongoose');
const MongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGOLAB_URI;
const key = process.env.API_KEY;
const searchModel = require("./searchModel.js");

const { searchImages } = require('pixabay-api').searchImages;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));



app.get("/api/imagesearch/:keywords*", function (request, response, next) {
  var {keywords} = request.params;
  var {offset} = request.query;
  var data = new searchModel({
    keywords,
    date: new Date()
    });
  // insert search to db for later use of returning latest records
  MongoClient.connect(mongoUrl, function (err, db) {
    if(err) {
      console.log('Unable to connect to database...');
      throw err;
    } else console.log('Connected...');
    db.collection('search').insert(data, (err, res) => {
      if(err) {
        console.log('Unable to insert to database...');
        throw err;
    } else {
      console.log('Inserted...');
      
    }
    });
  });
  
  searchImages(key, 'puppy').then((r) => console.log(r));
  response.json(data);
  
});

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  
  response.sendStatus(200);
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
