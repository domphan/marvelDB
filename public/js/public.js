module.exports = {
  getHeros: function(res, mysql, context, complete){
    mysql.pool.query("SELECT id, moniker FROM hero", function(error, results, fields){
      if (error) {
        res.write(JSON.stringify(error));
      }
      context.heros = results;
      complete();
    });
  },
  getVillains: function(res, mysql, context, complete) {
    mysql.pool.query("SELECT id, villain_moniker FROM villain", function(error, results, fields){
      if (error) {
        res.write(JSON.stringify(error));
      }
      context.villains = results;
      complete();
    })
  },
  getHero: function(res, mysql, context, id, complete){
    var sql = "SELECT hero.id, hero.first_name, hero.last_name, moniker, hero.powers, planet_name, series_name, team_name, GROUP_CONCAT(villain_moniker SEPARATOR ', ') AS nemesis FROM hero LEFT JOIN hero_villain_nemesis ON hero.id = hero_villain_nemesis.hid LEFT JOIN villain ON hero_villain_nemesis.vid = villain.id LEFT JOIN planet ON hero.pid = planet.id LEFT JOIN series ON hero.sid = series.id LEFT JOIN hero_team ON hero.id = hero_team.hid LEFT JOIN team ON hero_team.tid = team.id WHERE hero.id = ? GROUP BY hero.id;";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.hero = results[0];
      complete();
    });
  },
  getVillain: function(res, mysql, context, id, complete){
    var sql = "SELECT villain.id, villain.first_name, villain.last_name, villain_moniker, villain.powers, planet_name, series_name, team_name, GROUP_CONCAT(moniker SEPARATOR ', ') AS nemesis FROM villain LEFT JOIN hero_villain_nemesis ON villain.id = hero_villain_nemesis.vid LEFT JOIN hero ON hero_villain_nemesis.hid = hero.id LEFT JOIN planet ON villain.pid = planet.id LEFT JOIN series ON villain.sid = series.id LEFT JOIN villain_team ON villain.id = villain_team.vid LEFT JOIN team ON villain_team.tid = team.id WHERE villain.id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.villain = results[0];
      complete();
    });
  },
  getSeries: function(res, mysql, context, complete) {
    mysql.pool.query("SELECT id, series_name, year FROM series", function(error, results, fields){
      if (error) {
        res.write(JSON.stringify(error));
      }
      context.series = results;
      complete();
    })
  },
  getTeams: function(res, mysql, context, complete) {
    mysql.pool.query("SELECT id, team_name FROM team", function(error, results, fields){
      if (error){
        res.write(JSON.stringify(error));
      }
      context.teams = results;
      complete();
    });
  },
  getPlanets: function(res, mysql, context, complete) {
    mysql.pool.query("SELECT id, planet_name, description, level_of_technology FROM planet", function(error, results, fields){
      if (error) {
        res.write(JSON.stringify(error));
      }
      context.planets = results;
      complete();
    });
  },
  getTeamMembers: function(res, mysql, context, id, complete) {
    var sql = "SELECT team_name, moniker FROM team " +
              "LEFT JOIN hero_team ON team.id = hero_team.tid " +
              "LEFT JOIN hero ON hero_team.hid = hero.id " +
              "WHERE team.id=?";
    var inserts = [id];
    var sql2 = "SELECT villain_moniker FROM team " +
               "LEFT JOIN villain_team ON team.id = villain_team.tid " +
               "LEFT JOIN villain ON villain_team.vid = villain.id " +
               "WHERE team.id=?";
    mysql.pool.query(sql, inserts, function(error, results, fields){
      if (error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.heroMembers = results;
      context.teamid = id;
      mysql.pool.query(sql2, inserts, function(error, results, fields){
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.villainMembers = results;
        complete();
      });
    });
  },
  getTeamName: function(res, mysql, context, id, complete){
    var sql = "SELECT team_name FROM team WHERE team.id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error,results, fields){
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.teamname = results[0].team_name;
      complete();
    });
  },
  getTeamForHero: function(res, mysql, context, id, complete){
    var sql = "SELECT team.id, team_name FROM team " +
              "INNER JOIN hero_team ON team.id = hero_team.tid " +
              "INNER JOIN hero ON hero_team.hid = hero.id " +
              "WHERE hero.id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.heroTeams = results;
      complete();
    });
  },
  getTeamForVillain: function(res, mysql, context, id, complete) {
    var sql = "SELECT team.id, team_name FROM team " +
              "INNER JOIN villain_team ON team.id = villain_team.tid " +
              "INNER JOIN villain ON villain_team.vid = villain.id " +
              "WHERE villain.id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      console.log("The teams and nemesis are: ");
      console.log(results);
      context.villainTeams = results;
      complete();
    });
  },
  getNemesisForHero: function(res, mysql, context, id, complete) {
    var sql = "SELECT villain.id, villain_moniker FROM villain " +
              "INNER JOIN hero_villain_nemesis ON villain.id = hero_villain_nemesis.vid " +
              "INNER JOIN hero ON hero_villain_nemesis.hid = hero.id " +
              "WHERE hero.id =?";
    var inserts =[id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      console.log(results);
      context.heroNemesis = results;
      complete();
    });
  },
  getNemesisForVillain: function(res, mysql, context, id, complete) {
    var sql = "SELECT hero.id, moniker FROM hero " +
              "INNER JOIN hero_villain_nemesis ON hero.id = hero_villain_nemesis.hid " +
              "INNER JOIN villain ON hero_villain_nemesis.vid = villain.id " +
              "WHERE villain.id =?";
    var inserts =[id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.villainNemesis = results;
      complete();
    });
  }
};
