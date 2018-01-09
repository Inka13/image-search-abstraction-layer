const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGOLAB_URI;
const searchModel = require("./searchModel.js");
const pixabay = require('pixabay-api');
const key = process.env.API_KEY;
const app = express();

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
  // insert search to db 'search' collection for later use of returning latest records
  MongoClient.connect(mongoUrl, function (err, db) {
    if(err) {
      console.log('Unable to connect to database...');
      throw err;
    }
    db.collection('search').insert(data, (err, res) => {
      if(err) {
        console.log('Unable to insert to database...');
        throw err;
      }
      db.close();
    }); 
  });
  // search for images with entered keywords using pixabay-api
  pixabay.searchImages(key, keywords).then((res, err) => {
    if(err) response.json('No results found... Try something else!');
    let resArr = [];
    if(!offset) offset=0;
    if(offset*10>res.hits.length) offset=0;
    // store 10 results to resArr, starting from offset position
    for(let i=+offset*10; i<(+offset*10 +10) && i<res.hits.length; i++){
      let snippet = res.hits[i].pageURL.split('').splice(23);
      snippet = snippet.slice(0,snippet.length-9).join('');
      resArr.push({
        url: res.hits[i].webformatURL,
        thumbnail: res.hits[i].previewURL,
        altText: snippet
      })
    }
    response.json(resArr);
  });
});

app.get("/api/latest/imagesearch", function (request, response, next) {
  MongoClient.connect(mongoUrl, function (err, db) {
    if(err) {
      console.log('Unable to connect to database...');
      throw err;
    }
    // sort 'search' collection by date and get 10 latest searches
    var data = db.collection('search').find().sort({$date: -1}).limit(10);
    let dataArr = []; 
    data.forEach(search => {
        dataArr.push(search);
    },() => {
        response.json(dataArr);
        db.close();
    });
 });
});

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});




// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
