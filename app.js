var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var getFunctions = require("./public/js/public.js");
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var methodOverride = require('method-override');

var landingRoute = require("./routes/landing");
var characterRoutes = require("./routes/character");
var planetRoutes = require("./routes/planet");
var teamRoutes = require("./routes/team");
var seriesRoutes = require("./routes/series");
app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine', 'handlebars');
app.set('mysql', mysql);
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use("/", landingRoute);
app.use("/character", characterRoutes);
app.use("/planet", planetRoutes);
app.use("/team", teamRoutes);
app.use("/series", seriesRoutes);

app.use(function(req, res){
  res.status(404);
  res.send('Error 404');
});

app.use(function(err, req, res, next){
  console.log(err.stack);
  res.status(500);
  res.send('Error 500');
});

app.listen(3000, 'localhost', function(){
  console.log('Express server started on localhost3000');
});
