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

const pixabay = require('pixabay-api');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));



app.get("/api/imagesearch/:keywords*", function (request, response, next) {
  
  var {keywords} = request.params;
  var {offset} = request.query;
  //console.log(offset);
  //console.log(keywords);
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
    /*db.collection('search').insert(data, (err, res) => {
      if(err) {
        console.log('Unable to insert to database...');
        throw err;
    } else {
      console.log('Inserted...');
      
    }
    }); */
  });
  
  pixabay.searchImages(key, keywords).then((res, err) => {
    let resArr = [];
    console.log(+offset +10);
    if(!offset) offset=0;
    for(let i=+offset; i<(+offset +10); i++){
      let snippet = res.hits[i].pageURL.split('').splice(23);
      snippet.slice(7);
      resArr.push({
        url: res.hits[i].pageURL,
        thumbnail: res.hits[i].previewURL,
        snippet: snippet
      })
    }
    response.json(resArr);
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
