//edit does not correctly update teams and nemesis because hid/vid doesn't exist in junction
//table yet. Need to come up with a solution.

var express = require("express");
var router = express.Router();
var getFunctions = require("../public/js/public.js");

//index route
router.get("/", function(req, res) {
  var context = {};
  var callbackCount = 0;
  var mysql = req.app.get('mysql');
  getFunctions.getHeros(res, mysql, context, complete);
  getFunctions.getVillains(res, mysql, context, complete);
  context.char = true;
  function complete(){
    callbackCount++;
    if(callbackCount >= 2) {
      console.log("the context of index is: ");
      console.log(context);
      res.render('character/index', context);
    }
  }
});

//create route
router.post("/", function(req, res){
  var mysql = req.app.get('mysql');
  var characterType = null;
  var monikerType = null;
  var typeid = null;
  var nemid = null;
  if (req.body.herovillain == 1) {
    characterType = 'hero';
    monikerType = 'moniker';
    typeid = "hid";
    nemid = "vid";
  } else {
    characterType = 'villain';
    monikerType = 'villain_moniker';
    typeid = "vid"
    nemid = "hid";
  }

  // 'INSERT INTO ' + characterType === `INSERT INTO ${characterType}`

  var sql = "INSERT INTO " + characterType + " (" + monikerType + ", first_name, last_name, powers, pid, sid) VALUES (?, ?, ?, ?, ?, ?)";
  var inserts = [req.body.moniker, req.body.firstname, req.body.lastname, req.body.powers, req.body.planet,
                 req.body.series];
  var sql2 = "INSERT INTO hero_villain_nemesis (" + typeid + ", " + nemid + ") VALUES ((SELECT MAX(id) FROM " + characterType + "), ?)";
  var inserts2 = [req.body.nemesis];
  var sql3 = "INSERT INTO " + characterType + "_team (" + typeid + ", tid) VALUES ((SELECT MAX(id) FROM "+ characterType + "), ?)";
  var inserts3 = [req.body.teams];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    } else {
      sql = mysql.pool.query(sql2, inserts2, function(error, results,fields){
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        } else {
          sql = mysql.pool.query(sql3, inserts3, function(error, results, fields){
            if (error) {
              res.write(JSON.stringify(error));
              res.end();
            } else {
              res.redirect("/character");
            }
          })
        }
      })
    }
  });
});


//new route
router.get("/new", function(req, res){
  var context = {};
  var callbackCount = 0;
  var mysql = req.app.get('mysql');
  ['getHeros',
  'getVillains',
  'getPlanets',
  'getTeams',
  'getSeries'].forEach(function(func) {
    getFunctions[func](res, mysql, context, complete);
  });
  function complete() {
    callbackCount++
    if(callbackCount >= 5){
      res.render('character/new', context);
    }
  }
});

//show routes
router.get("/hero/:id", function(req, res){
  callbackCount = 0;
  var context = {};
  var mysql = req.app.get('mysql');
  getFunctions.getHero(res, mysql, context, req.params.id, complete);
  getFunctions.getTeamForHero(res, mysql, context, req.params.id, complete);
  getFunctions.getNemesisForHero(res, mysql, context, req.params.id, complete);
  getFunctions.getVillains(res, mysql, context, complete);
  getFunctions.getTeams(res, mysql, context, complete);
  function complete(){
    callbackCount++;
    if (callbackCount >= 5) {
      console.log(context);
      res.render('character/show', context);
    }
  }
});

router.get("/villain/:id", function(req, res){
  callbackCount = 0;
  var context = {};
  var mysql = req.app.get('mysql');
  getFunctions.getTeamForVillain(res, mysql, context, req.params.id, complete);
  getFunctions.getVillain(res, mysql, context, req.params.id, complete);
  getFunctions.getNemesisForVillain(res, mysql, context, req.params.id, complete);
  getFunctions.getHeros(res, mysql, context, complete);
  getFunctions.getTeams(res, mysql, context, complete);
  function complete(){
    callbackCount++;
    if (callbackCount >= 5) {
      res.render('character/show', context);
    }
  }
});

//add a team
router.post("/:herotype/:id/addTeam", function(req, res){
  if (req.params.herotype == "hero"){
    var charType = "hero";
    var charid = "hid";
  } else {
    var charType = "villain";
    var charid = "vid";
  }
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO " + charType + "_team (" + charid + " ,tid) VALUES (?, ?)";
  var inserts = [req.params.id, req.body.addTeam];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if(error) {
      res.write(JSON.stringify(error));
      res.end()
    } else {
      res.redirect("/character/" + req.params.herotype + "/" + req.params.id);
    }

  })
});

//remove a team
router.post("/:herotype/:id/removeTeam", function(req, res){
  if (req.params.herotype == "hero"){
    var charType = "hero";
    var charid = "hid";
  } else {
    var charType = "villain";
    var charid = "vid";
  }
  var mysql = req.app.get('mysql');
  var sql = "DELETE FROM " + charType + "_team WHERE tid=? AND " + charid + "=?";
  var inserts = [req.body.currentTeams, req.params.id];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    } else {
      res.redirect("/character/" + req.params.herotype + "/" + req.params.id);
    }
  });
});

//add a nemesis
router.post("/:herotype/:id/addNemesis", function(req, res){
  if (req.params.herotype == "hero"){
    var charType = "hero";
    var charid = "hid";
    var nemid = "vid";
  } else {
    var charType = "villain";
    var charid = "vid";
    var nemid = "hid";
  }
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO hero_villain_nemesis (" + charid + ", " + nemid + ") VALUES (?, ?)";
  var inserts = [req.params.id, req.body.addNemesis];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if (error){
      res.write(JSON.stringify(error));
      res.end();
    } else {
      res.redirect("/character/" + req.params.herotype + "/" + req.params.id);
    }
  });
});

//remove a nemesis
router.post("/:herotype/:id/removeNemesis", function(req, res){
  if (req.params.herotype == "hero"){
    var charType = "hero";
    var charid = "hid";
    var nemid = "vid";
  } else {
    var charType = "villain";
    var charid = "vid";
    var nemid = "hid";
  }
  var mysql = req.app.get('mysql');
  var sql = "DELETE FROM hero_villain_nemesis WHERE " + charid + "=? AND " + nemid + "=?";
  var inserts = [req.params.id, req.body.currentNemesis];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    } else {
      res.redirect("/character/" + req.params.herotype + "/" + req.params.id);
    }
  });
});




//edit route
router.get("/hero/:id/edit", function(req, res){
  callbackCount = 0;
  var contextSingleHero = {};
  var contextAll ={};
  var contextNemesis = {};
  var mysql = req.app.get('mysql');
  getFunctions.getHero(res, mysql, contextSingleHero, req.params.id, complete);
  getFunctions.getVillains(res, mysql, contextAll, complete);
  getFunctions.getPlanets(res, mysql, contextAll, complete);
  getFunctions.getTeams(res, mysql, contextAll, complete);
  getFunctions.getSeries(res, mysql, contextAll, complete);
  function complete(){
    callbackCount++;
    if (callbackCount >= 5) {
      res.render('character/edit', {contextAll: contextAll, contextSingleHero: contextSingleHero, contextNemesis: contextNemesis});
    }
  }
});

//edit route
router.get("/villain/:id/edit", function(req, res){
  callbackCount = 0;
  var contextSingleVillain = {};
  var contextAll ={};
  var contextNemesis = {};
  var mysql = req.app.get('mysql');
  getFunctions.getVillain(res, mysql, contextSingleVillain, req.params.id, complete);
  getFunctions.getHeros(res, mysql, contextAll, complete);
  getFunctions.getPlanets(res, mysql, contextAll, complete);
  getFunctions.getTeams(res, mysql, contextAll, complete);
  getFunctions.getSeries(res, mysql, contextAll, complete);
  function complete(){
    callbackCount++;
    if (callbackCount >= 5) {
      res.render('character/edit', {contextAll: contextAll, contextSingleVillain: contextSingleVillain, contextNemesis: contextNemesis});
    }
  }
});


//update route
router.put("/:herotype/:id", function(req, res){

  var monikerType = null;
  var typeid = null;
  var nemid = null;
  if (req.params.herotype == 'hero') {
    monikerType = "moniker";
    typeid = "hid";
    nemid = "vid";
  } else {
    monikerType = "villain_moniker";
    typeid= "vid";
    nemid = "hid";
  }
  var mysql = req.app.get('mysql');
  var sql = "UPDATE " + req.params.herotype + " SET " + monikerType + "=? , first_name=?, last_name=?, powers=?, pid=?, sid=? WHERE id=?";
  var inserts = [req.body.moniker, req.body.firstname, req.body.lastname, req.body.powers, req.body.planet, req.body.series, req.params.id]
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    } else {
      res.redirect("/character/" + req.params.herotype + "/" + req.params.id);
    }
  });
});


//destroy route
router.delete("/:herotype/:id", function(req, res){
  var mysql = req.app.get('mysql');
  var sql = "DELETE FROM " + req.params.herotype + " WHERE id = ?";
  var inserts = [req.params.id];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if (error) {
      res.write(JSON.stringify(error));
      res.status(400);
      res.end();
    } else {
      res.redirect("/character");
    }
  });
});

module.exports = router;
