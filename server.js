
// SERVER-SIDE JAVASCRIPT

// require express framework and additional modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    mongoose = require('mongoose'),
    Status = require('./models/Status');

    mongoose.connect("mongodb://localhost/test");

var statusArray = [
  {
    id: 1,
    game: "Shovel Knights",
    status: "This is a weird little game."
  },
  {
    id: 2,
    game: "League of Legends",
    status: "I love this game with all my heart!"
  },
  {
    id: 3,
    game: "Payday 2",
    status: "A shooter that doesn't pit you against teenagers with no time on their hands!"
  }
];

// tell app to use bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));


//STATIC ROUTES

// serve js and css pages on main page
app.use(express.static(__dirname + '/public'))


// set up root route to respond with index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

//API ROUTES

//status index
app.get('/api/status', function (req, res) {
  //send all status as JSON response
  Status.find(function (err, statuses){
    res.json(statusArray + statuses);
  })
});

//create new status
app.post('/api/status', function (req, res) {
  // grab params from form data (image, game, status)
  var newStatus = new Status({
    image: req.body.image,
    game: req.body.game,
    status: req.body.status
  });

  //save new status into database
  newStatus.save(function (err, savedStatus) {
    res.json(savedStatus);
  });
});

// find a status by the id
app.get('/api/status/:id', function (req, res) {
  // set the value of the id
  var targetId = req.params.id;

  // find status in db by id
  Status.findOne({_id: targetId}, function (err, foundStatus) {
    res.json(foundStatus);
  });
});
  
// update status
app.put('/api/status/:id', function (req, res) {

  //set the value of the id
  var targetId = req.params.id;

  // find the phrase in db by id
  Status.findOne({_id:targetId}, function (err, foundStatus){
    //update the status's image, game, and body
    foundStatus.image = req.body.image;
    foundStatus.game = req.body.game;
    foundStatus.status = req.body.status;

    //save updated status in db
    foundStatus.save(function (err, savedStatus) {
      res.json(savedStatus);
    });
  });
});

// delete status
app.delete('/api/status/:id', function (req, res) {

    //set the value of the id
  var targetId = req.params.id;

  // find status in db by id and remove 
  Status.findOneAndRemove({_id: targetId}, function (err, deletedStatus) {
    res.json(deletedStatus);
  });
});


// listen on port 5000
app.listen(5000, function () {
  console.log('server started on localhost:5000');
});