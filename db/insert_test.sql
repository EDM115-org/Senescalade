USE sae;

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Lundi', '17:30:00', '19:00:00', 'Jeunes', 'U14', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Lundi', '19:00:00', '21:00:00', 'Adultes', '', 20, 1, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Mardi', '17:30:00', '19:00:00', 'Jeunes', 'U12', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Mardi', '19:00:00', '20:30:00', 'Jeunes', 'Perf', 20, 20, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur) VALUES ('Mardi', '20:00:00', '22:00:00', 'Adultes', '', 20, 20, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Mercredi', '15:30:00', '17:00:00', 'Jeunes', 'U10', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Mercredi', '17:00:00', '19:30:00', 'Jeunes', 'Compétition', 10, 0, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Mercredi', '19:30:00', '21:30:00', 'Adultes', '', 20, 1, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Jeudi', '17:30:00', '19:00:00', 'Jeunes', 'U16', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Jeudi', '17:30:00', '19:00:00', 'Jeunes', 'U18', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Jeudi', '19:00:00', '21:00:00', 'Adultes', 'Autonomie', 20, 20, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Vendredi', '17:00:00', '19:30:00', 'Jeunes', 'Compétition', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Vendredi', '19:30:00', '21:30:00', 'Adultes', '', 20, 20, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Samedi', '09:30:00', '11:00:00', 'Jeunes', 'U10', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Samedi', '11:00:00', '12:30:00', 'Jeunes', 'U12', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Samedi', '13:30:00', '15:00:00', 'Jeunes', 'U12', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Samedi', '15:00:00', '16:30:00', 'Jeunes', 'U14', 10, 10, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Samedi', '16:30:00', '18:00:00', 'Jeunes', 'U16', 10, 5, 'Pierre');

INSERT INTO Seance(jour, heureDebutSeance, heureFinSeance, typeSeance, niveau, nbPlaces, nbPlacesRestantes, professeur)
VALUES ('Dimanche', '10:00:00', '12:00:00', 'Babygrimpe', '', 10, 0, 'Pierre');


INSERT INTO Compte(idCompte, mail, mailIsVerified, password)
VALUES (1, 'admin@gmail.com', 1, '$2a$10$BQArTCdsWHp/jkbIx4O/A.nWh.zPg0rFPfn9Z3GnTynGj.0qCPayS');
-- admintestadmin

INSERT INTO Admin(idAdmin, ReadListGrimpeur, ReadListSeance, ReadListAdmin, ReadListUtilisateur, UpdateListGrimpeur, UpdateListSeance, UpdateListAdmin, UpdateListUtilisateur, DeleteListGrimpeur, DeleteListSeance, DeleteListAdmin, DeleteListUtilisateur)
VALUES (1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
