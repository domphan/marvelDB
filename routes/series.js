var express = require("express");
var router = express.Router();
var getFunctions = require("../public/js/public.js");

//index route
router.get("/", function(req, res){
  var context = {};
  var callbackCount = 0;
  var mysql = req.app.get('mysql');
  getFunctions.getSeries(res, mysql, context, complete);
  context.ser = true;
  function complete(){
    callbackCount++;
    if (callbackCount >= 1) {
      console.log(context);
      res.render('series/index', context);
    }
  }
});

router.get("/new", function(req, res){
  res.render('series/new');
});

router.post("/", function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO series (series_name, year) VALUES (?,?)";
  var inserts = [req.body.seriesname, req.body.year];
  sql = mysql.pool.query(sql,inserts, function(error, results, fields){
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    } else {
      res.redirect("/series");
    }
  });
});


//DELETE
router.delete("/:id/delete", function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "DELETE FROM series WHERE id = ?";
  var inserts = [req.params.id];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if (error) {
      res.write(JSON.stringify(error));
      res.status(400);
      res.end();
    } else {
      res.redirect("/series");
    }
  });
});

module.exports = router;
