const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoUrl = process.env.MONGOLAB_URI;
const mongodb = require("mongodb");
const mongoose = require('mongoose');
const MongoClient = mongodb.MongoClient;
const key = process.env.API_KEY;
const searchModel = require("./searchModel.js");

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
  
  mongoose.connect(mongoUrl, (res, err) => {
    if(err) throw err;
    console.log('Connected..');
    data.save((res, err) => {
    if(err) console.log('error inserting');
    response.json(data);
  });
    
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
