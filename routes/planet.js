var express = require("express");
var router = express.Router();
var getFunctions = require("../public/js/public.js");



//index route
router.get("/", function(req, res){
  var context = {};
  var callbackCount = 0;
  var mysql = req.app.get('mysql');
  getFunctions.getPlanets(res, mysql, context, complete);
  context.plan = true;
  function complete(){
    callbackCount++;
    if (callbackCount >= 1) {
      console.log(context);
      res.render('planet/index', context);
    }
  }
});

//new route
router.get("/new", function(req, res){
  res.render('planet/new');
});

//create route
router.post("/", function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO planet (planet_name, description, level_of_technology) VALUES (?,?,?)";
  var inserts = [req.body.planetname, req.body.description, req.body.technology];
  sql = mysql.pool.query(sql,inserts, function(error, results, fields){
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    } else {
      res.redirect("/planet")
    }
  });
});

//DELETE
router.delete("/:id/delete", function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "DELETE FROM planet WHERE id = ?";
  var inserts = [req.params.id];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if (error) {
      res.write(JSON.stringify(error));
      res.status(400);
      res.end();
    } else {
      res.redirect("/planet");
    }
  });
});

module.exports = router;
