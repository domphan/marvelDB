------------------------------------------------------------------------
--------------------------- Get queries --------------------------------
------------------------------------------------------------------------

-- Gets the heros
SELECT id, moniker FROM hero

-- Gets the villains
SELECT id, villain_moniker FROM villain

-- Gets info about a specific hero
SELECT hero.id, hero.first_name, hero.last_name, moniker, hero.powers, planet_name, series_name, team_name, GROUP_CONCAT(villain_moniker SEPARATOR ', ') AS nemesis
FROM hero LEFT JOIN hero_villain_nemesis ON hero.id = hero_villain_nemesis.hid
LEFT JOIN villain ON hero_villain_nemesis.vid = villain.id
LEFT JOIN planet ON hero.pid = planet.id
LEFT JOIN series ON hero.sid = series.id
LEFT JOIN hero_team ON hero.id = hero_team.hid
LEFT JOIN team ON hero_team.tid = team.id WHERE hero.id = [idInput]
GROUP BY hero.id;

-- Gets info about a specific villain
SELECT villain.id, villain.first_name, villain.last_name, villain_moniker, villain.powers, planet_name, series_name, team_name, GROUP_CONCAT(moniker SEPARATOR ', ') AS nemesis
FROM villain
LEFT JOIN hero_villain_nemesis ON villain.id = hero_villain_nemesis.vid
LEFT JOIN hero ON hero_villain_nemesis.hid = hero.id
LEFT JOIN planet ON villain.pid = planet.id
LEFT JOIN series ON villain.sid = series.id
LEFT JOIN villain_team ON villain.id = villain_team.vid
LEFT JOIN team ON villain_team.tid = team.id
WHERE villain.id = [idInput]

-- Gets all series
SELECT id, series_name, year FROM series

-- Gets all teams
SELECT id, team_name FROM team

-- Gets all planets
SELECT id, planet_name, description, level_of_technology FROM planet

-- Gets team members (heroes) from a team id
SELECT team_name, moniker FROM team
LEFT JOIN hero_team ON team.id = hero_team.tid
LEFT JOIN hero ON hero_team.hid = hero.id
WHERE team.id=[idInput]

-- Gets team members (villains) from a team id
SELECT villain_moniker FROM team
LEFT JOIN villain_team ON team.id = villain_team.tid
LEFT JOIN villain ON villain_team.vid = villain.id
WHERE team.id= [idInput]

-- Gets team names
SELECT team_name FROM team WHERE team.id = [idInput]

-- Gets teams associated to this hero
SELECT team.id, team_name FROM team
INNER JOIN hero_team ON team.id = hero_team.tid
INNER JOIN hero ON hero_team.hid = hero.id
WHERE hero.id = [idInput]

-- Gets teams associated to this villain
SELECT team.id, team_name FROM team
INNER JOIN villain_team ON team.id = villain_team.tid
INNER JOIN villain ON villain_team.vid = villain.id
WHERE villain.id = [idInput]

-- Grabs all nemesis for this hero
SELECT villain.id, villain_moniker FROM villain
INNER JOIN hero_villain_nemesis ON villain.id = hero_villain_nemesis.vid
INNER JOIN hero ON hero_villain_nemesis.hid = hero.id
WHERE hero.id = [idInput]

-- Grabs all nemesis for this villain
SELECT hero.id, moniker FROM hero
INNER JOIN hero_villain_nemesis ON hero.id = hero_villain_nemesis.hid
INNER JOIN villain ON hero_villain_nemesis.vid = villain.id
WHERE villain.id = [idInput]

------------------------------------------------------------------
------------ Queries used for the character route ----------------
------------------------------------------------------------------

-- Creates a new hero
INSERT INTO hero (moniker, first_name, last_name, powers, pid, sid)
VALUES ([monikerInput], [firstNameInput], [lastNameInput], [powersInput], [pidInput], [sidInput])

-- Creates a new villain
INSERT INTO villain (villain_moniker, first_name, last_name, powers, pid, sid)
VALUES ([villainMonikerInput], [firstNameInput], [lastNameInput], [powersInput], [pidInput], [sidInput])

-- Creates a new many to many relationship with last added hero to a villain
INSERT INTO hero_villain_nemesis (hid, vid)
VALUES ((SELECT MAX(id) FROM hero), [villainIDinput])

-- Creates a new many to many relationship with last added villain to a hero
INSERT INTO hero_villain_nemesis (vid, hid)
VALUES ((SELECT MAX(id) FROM villain), [heroIDinput])

-- Creates a new many to many relationship with last added hero to a team
INSERT INTO hero_team (hid, tid)
VALUES ((SELECT MAX(id) FROM hero), [teamIDinput])

-- Creates a new many to many relationship with last added villain to a team
INSERT INTO hero_team (vid, tid)
VALUES ((SELECT MAX(id) FROM villain), [teamIDinput])

-- Create a new relationship between hero and team
INSERT INTO hero_team (hid,tid)
VALUES ([heroIdInput, teamIdInput]])

-- Create a new relationship between villain and team
INSERT INTO villain_team (vid,tid)
VALUES ([villainIdInput], [teamIdInput]])

-- Delete a relationship between a hero and team
DELETE FROM hero_team
WHERE tid=[teamIdInput] AND hid =[hidInput]

-- Delete a relationship between a hero and team
DELETE FROM villain_team
WHERE tid=[teamIdInput] AND vid =[vidInput]

-- Create a new nemesis relationship
INSERT INTO hero_villain_nemesis (hid, vid)
VALUES ([hidInput], [vidInput])

-- Remove a nemesis relationship
DELETE FROM hero_villain_nemesis
WHERE hid=[hidInput] AND vid=[vidInput]

-- Update a hero or villain
UPDATE [hero/vilain]
SET [moniker/villain_moniker] = [monikerInput] , first_name=[fnameInput], last_name=[lnameInput], powers=[powersInput], pid=[pidInput], sid=[sidInput]
WHERE id=[hero.id/villain.id Input]

-- Delete a villain or hero
DELETE FROM [hero/villain] WHERE id = [idInput]

------------------------------------------------------------------
-------------- Queries used for the planet route -----------------
------------------------------------------------------------------

-- Create a new planet
INSERT INTO planet (planet_name, description, level_of_technology)
VALUES ([planetNameInput],[descriptionInput],[technologyInput])

-- Delete a planet
DELETE FROM planet WHERE id = [planetIdInput]

------------------------------------------------------------------
------------ Queries used for the series route -------------------
------------------------------------------------------------------

-- Create a Series
INSERT INTO series (series_name, year)
VALUES ([seriesNameInput],[yearInput])

-- Delete a Series
DELETE FROM series WHERE id = [idInput]


------------------------------------------------------------------
-------------- Queries used for the team route -------------------
------------------------------------------------------------------

-- add a team
INSERT INTO team (team_name)
VALUES ([teamNameInput])

-- Insert a hero or villain into the team
INSERT INTO [hero_team/villain_team] ([hid/vid], tid)
VALUES ([hid/vid input],[tidInput])

-- delete a team
DELETE FROM team WHERE id = [teamIdInput]
