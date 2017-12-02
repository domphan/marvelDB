---series seeding
INSERT INTO planet (planet_name, description, level_of_technology)
VALUES  ("Earth", "habitable with land and oceans", "average"),
        ("Halfworld", "half industrial wasteland, half paradise", "high");

INSERT INTO series (series_name, year)
VALUES  ("Guardians of the Galaxy", 2014),
        ("Iron Man", 2008);

INSERT INTO team (team_name)
VALUES  ("Guardians of the Galaxy"),
        ("Avengers");

INSERT INTO hero (first_name, last_name, moniker, powers, pid, sid)
VALUES  ("89P13", null, "Rocket Raccoon", "Intelligence, Strength, Durability, Agility, Acute Senses",
          (SELECT id FROM planet WHERE planet_name = "Halfworld"),
          (SELECT id FROM series WHERE series_name = "Guardians of the Galaxy")
        ),
        ("Tony", "Stark", "Iron Man", "Intelligence, Armored Suit",
          (SELECT id FROM planet WHERE planet_name = "Earth"),
          (SELECT id FROM series WHERE series_name = "Iron Man")
        );

INSERT INTO villain (first_name, last_name, villain_moniker, powers, pid, sid)
VALUES  (null, null, "Mandarin", "Intelligence", (
          SELECT id FROM planet WHERE planet_name = "Earth"), (
            SELECT id FROM series WHERE series_name = "Iron Man"
          )
        ),
        (null, null, "Thanos", "supergenius, mysticism, bionic amplification", (
          SELECT id FROM planet WHERE planet_name = "Halfworld"
        ), (SELECT id FROM series WHERE series_name = "Guardians of the Galaxy"));

INSERT INTO hero_villain_nemesis(hid, vid)
VALUES  ((SELECT id FROM hero WHERE moniker = "Iron Man"), (SELECT id FROM villain WHERE villain_moniker = "Mandarin")),
        ((SELECT id FROM hero WHERE moniker = "Rocket Raccoon"), (SELECT id FROM villain WHERE villain_moniker ="Thanos"));


INSERT INTO hero_team(hid, tid)
VALUES  ((SELECT id FROM hero WHERE moniker = "Iron Man"), (SELECT id FROM team WHERE team_name = "Avengers")),
        ((SELECT id FROM hero WHERE moniker = "Rocket Raccoon"), (SELECT id FROM team WHERE team_name = "Guardians of the Galaxy"));
