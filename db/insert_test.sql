/*
SAE Salle d'escalade -- Partie BDD
BATARD Corentin - LEDERREY Lussandre - MACCREZ Allan
INFO 2A2


Version MySQL
*/

--  .oooooo..o       .o.       oooooooooooo           oooooooooooo  .oooooo..o   .oooooo.         .o.       ooooo              .o.       oooooooooo.   oooooooooooo
-- d8P'    `Y8      .888.      `888'     `8           `888'     `8 d8P'    `Y8  d8P'  `Y8b       .888.      `888'             .888.      `888'   `Y8b  `888'     `8
-- Y88bo.          .8"888.      888                    888         Y88bo.      888              .8"888.      888             .8"888.      888      888  888
--  `"Y8888o.     .8' `888.     888oooo8               888oooo8     `"Y8888o.  888             .8' `888.     888            .8' `888.     888      888  888oooo8
--      `"Y88b   .88ooo8888.    888    "               888    "         `"Y88b 888            .88ooo8888.    888           .88ooo8888.    888      888  888    "
-- oo     .d8P  .8'     `888.   888       o            888       o oo     .d8P `88b    ooo   .8'     `888.   888       o  .8'     `888.   888     d88'  888       o
-- 8""88888P'  o88o     o8888o o888ooooood8           o888ooooood8 8""88888P'   `Y8bood8P'  o88o     o8888o o888ooooood8 o88o     o8888o o888bood8P'   o888ooooood8

-- -------------------------------------------------------
--               SCRIPT DE TEST D'INSERTION             --
-- -------------------------------------------------------

USE sae;

/*
Seance(idSeance (INT, PK), jour (CHAR(50)), heureSeance (TIME), dureeSeance (TIME), typeSeance (CHAR(100)), niveau (CHAR(100)), nbPlaces (INT), nbPlacesRestantes (INT), professeur (CHAR(100)))
Inscription(idInscription (INT, PK), mail (VARCHAR(100)), password (VARCHAR(100)), dateNaissance (DATE))
Personne(idPersonne (INT, PK), action (CHAR(1)), nom (VARCHAR(100)), prenom (VARCHAR(100)), sexe (CHAR(1)), nationalite (CHAR(2)), adresse (VARCHAR(255)), complementAdresse (VARCHAR(255)), codePostal (VARCHAR(5)), ville (VARCHAR(100)), pays (CHAR(2)), telephone (VARCHAR(10)), mobile (VARCHAR(10)), courriel2 (VARCHAR(100)), personneNom (VARCHAR(100)), personnePrenom (VARCHAR(100)), personneTelephone (VARCHAR(15)), personneCourriel (VARCHAR(100)), numLicence (VARCHAR(6)), typeLicence (CHAR(1)), assurance (CHAR(2)), optionSki (BOOLEAN), optionSlackline (BOOLEAN), optionTrail (BOOLEAN), optionVTT (BOOLEAN), optionAssurance (BOOLEAN), seance = @Seance.idSeance (NN), lInscription = @Inscription.idInscription (NN))
Admin(idAdmin (INT, PK), droit (CHAR(5)), laPersonne = @Personne.idPersonne (NN))
*/

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Lundi', '17:30:00', '19:00:00', 'Jeunes', 'U14', 10, 10, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Lundi', '19:00:00', '21:00:00', 'Adultes', '', 20, 1, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Mardi', '17:30:00', '19:00:00', 'Jeunes', 'U12', 10, 10, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Mardi', '19:00:00', '20:30:00', 'Jeunes', 'Perf', 20, 20, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Mardi', '20:00:00', '22:00:00', 'Adultes', '', 20, 20, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Mercredi', '15:30:00', '17:00:00', 'Jeunes', 'U10', 10, 10, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Mercredi', '17:00:00', '19:30:00', 'Jeunes', 'Compétition', 10, 10, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Mercredi', '19:30:00', '21:30:00', 'Adultes', '', 20, 20, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Jeudi', '17:30:00', '19:00:00', 'Jeunes', 'U16', 10, 10, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Jeudi', '17:30:00', '19:00:00', 'Jeunes', 'U18', 10, 10, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Jeudi', '19:00:00', '21:00:00', 'Adultes', 'Autonomie', 20, 20, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Vendredi', '17:00:00', '19:30:00', 'Jeunes', 'Compétition', 10, 10, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Vendredi', '19:30:00', '21:30:00', 'Adultes', '', 20, 20, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Samedi', '09:30:00', '11:00:00', 'Jeunes', 'U10', 10, 10, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Samedi', '11:00:00', '12:30:00', 'Jeunes', 'U12', 10, 10, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Samedi', '13:30:00', '15:00:00', 'Jeunes', 'U12', 10, 10, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Samedi', '15:00:00', '16:30:00', 'Jeunes', 'U14', 10, 10, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Samedi', '16:30:00', '18:00:00', 'Jeunes', 'U16', 10, 0, 'Pierre');
INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Dimanche', '10:00:00', '12:00:00', 'Babygrimpe', '', 10, 10, 'Pierre');
