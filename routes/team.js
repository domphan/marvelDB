var express = require("express");
var router = express.Router();
var getFunctions = require("../public/js/public.js");



//index route
router.get("/", function(req, res){
  var context = {};
  var callbackCount = 0;
  var mysql = req.app.get('mysql');
  getFunctions.getTeams(res, mysql, context, complete);
  context.tem = true;
  function complete(){
    callbackCount++;
    if(callbackCount >= 1) {
      res.render("team/index", context);
    }
  }
});

//new route

router.get("/new", function(req, res){
  res.render("team/new");
})

//create route

router.post("/", function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO team (team_name) VALUES (?)";
  var inserts = [req.body.teamname];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if (error){
      res.write(JSON.stringify(error));
      res.end();
    } else {
      res.redirect("/team");
    }
  });
});

//show route
router.get("/:id", function(req, res){
  var context = {};
  callbackCount = 0;
  var mysql = req.app.get('mysql');
  getFunctions.getTeamName(res, mysql, context, req.params.id, complete);
  getFunctions.getTeamMembers(res, mysql, context, req.params.id, complete);
  getFunctions.getHeros(res, mysql, context, complete);
  getFunctions.getVillains(res, mysql, context, complete);
  function complete(){
    callbackCount++;
    if(callbackCount >= 4) {
      console.log(context.members);
      res.render("team/show", context);
    }
  }
});

router.post("/:id/:herotype/add", function(req, res){
  if (req.params.herotype == "hero") {
    var charid = "hid";
  } else {
    var charid = "vid";
  }
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO " + req.params.herotype + "_team (" + charid + ", tid) VALUES (?,?)";
  if (req.params.herotype == "hero") {
    var inserts = [req.body.addHero, req.params.id];
  } else {
    var inserts = [req.body.addVillain, req.params.id];
  }
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if (error){
      res.write(JSON.stringify(error));
      res.end()
    } else {
      res.redirect("/team/" + req.params.id);
    }
  });

});

router.delete("/:id/delete", function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "DELETE FROM team WHERE id = ?";
  var inserts = [req.params.id];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if (error) {
      res.write(JSON.stringify(error));
      res.status(400);
      res.end();
    } else {
      res.redirect("/team");
    }
  });
});



module.exports = router;
