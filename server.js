const express = require('express');
const app = express();
//API_KEY=7641036-00f0de21904d2ec6d7c284636
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoUrl = process.env.MONGOLAB_URI;
const mongodb = require("mongodb");
//const mongoose = require('mongoose');
const MongoClient = mongodb.MongoClient;
//const key = process.env.API_KEY;
const key = "7641036-00f0de21904d2ec6d7c284636";
const searchModel = require("./searchModel.js");
const { $ } = require("jquery");

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
      response.json(data);
    }
    });
  });
  // create URL for pixabay API with params from user
  var URL = "https://pixabay.com/api/?key="+key+"&q="+encodeURIComponent(keywords);
  $.getJSON(URL, function(data){
    if (parseInt(data.totalHits) > 0)
      $.each(data.hits, function(i, hit){ console.log(hit.pageURL); });
    else
      console.log('No hits');
});
  
  
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
