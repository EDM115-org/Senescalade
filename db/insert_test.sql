USE sae;

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Lundi', '17:30:00', '19:00:00', 'Jeunes', 'U14', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Lundi', '19:00:00', '21:00:00', 'Adultes', '', 20, 1, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Mardi', '17:30:00', '19:00:00', 'Jeunes', 'U12', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Mardi', '19:00:00', '20:30:00', 'Jeunes', 'Perf', 20, 20, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Mardi', '20:00:00', '22:00:00', 'Adultes', '', 20, 20, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Mercredi', '15:30:00', '17:00:00', 'Jeunes', 'U10', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Mercredi', '17:00:00', '19:30:00', 'Jeunes', 'Compétition', 10, 0, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Mercredi', '19:30:00', '21:30:00', 'Adultes', '', 20, 20, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Jeudi', '17:30:00', '19:00:00', 'Jeunes', 'U16', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Jeudi', '17:30:00', '19:00:00', 'Jeunes', 'U18', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Jeudi', '19:00:00', '21:00:00', 'Adultes', 'Autonomie', 20, 20, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Vendredi', '17:00:00', '19:30:00', 'Jeunes', 'Compétition', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Vendredi', '19:30:00', '21:30:00', 'Adultes', '', 20, 20, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Samedi', '09:30:00', '11:00:00', 'Jeunes', 'U10', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Samedi', '11:00:00', '12:30:00', 'Jeunes', 'U12', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Samedi', '13:30:00', '15:00:00', 'Jeunes', 'U12', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Samedi', '15:00:00', '16:30:00', 'Jeunes', 'U14', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Samedi', '16:30:00', '18:00:00', 'Jeunes', 'U16', 10, 5, 'Pierre');

INSERT INTO Seance(jour, heureSeance, dureeSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Dimanche', '10:00:00', '12:00:00', 'Babygrimpe', '', 10, 0, 'Pierre');


INSERT INTO Inscription(idInscription, mail, password, isAdmin)
VALUES (1, 'admin@gmail.com', '$2a$10$BQArTCdsWHp/jkbIx4O/A.nWh.zPg0rFPfn9Z3GnTynGj.0qCPayS', 1);
-- admintestadmin

INSERT INTO Inscription(idInscription, mail, password, isAdmin)
VALUES (2, 'user@gmail.com', '$2a$10$PEU8uPfXaQ1rAqTvEFyeY./c5bn6fQjrU8dX7opt8goIiEthhjEMC', 0);
-- usertestuser

INSERT INTO Personne(action, nom, prenom, dateNaissance, sexe, nationalite, adresse, complementAdresse, codePostal, ville, pays, telephone, mobile, courriel2, personneNom, personnePrenom, personneTelephone, personneCourriel, numLicence, typeLicence, assurance, optionSki, optionSlackline, optionTrail, optionVTT, optionAssurance, lInscription)
VALUES ('C', 'DUPONT', 'Jean', '1999-01-01', 'H', 'FR', '1 rue de la Paix', '', '75000', 'Paris', 'FR', '0123456789', '0123456789', '', '', '', '', '', '', 'J', 'RC', 0, 0, 0, 0, 0, 2);

INSERT INTO Admin(idAdmin, ReadListGrimpeur, ReadListSeance, ReadListAdmin, UpdateListGrimpeur, UpdateListSeance, UpdateListAdmin, DeleteListGrimpeur, DeleteListSeance, DeleteListAdmin)
VALUES (1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
