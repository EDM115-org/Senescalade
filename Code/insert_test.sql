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

DELETE FROM Inscription;

-- Cas d'erreur pour la contrainte check_date_naissance (date de naissance postérieure à la date actuelle)
INSERT INTO Inscription (Action, Nom, Prenom, DateNaissance, Sexe, Nationalite, Adresse, ComplementAdresse, CodePostal, Ville, Pays, Telephone, Mobile, Courriel, Courriel2, PersonneNom, PersonnePrenom, PersonneTelephone, PersonneCourriel, NumLicence, TypeLicence, Assurance, OptionSki, OptionSlackline, OptionTrail, OptionVTT, OptionAssurance)
VALUES
('C', 'Batard', 'Corentin', STR_TO_DATE('12/09/2024', '%d/%m/%Y'), 'H', 'FR', '3 allée de l\île meaben', NULL, '56000', 'Vannes', 'FR', '0769366966', NULL, 'corentin.batard2003@gmail.com', NULL, 'Dupont', 'Marie', '9876543210', 'marie.dupont@email.com', '123456', 'A', 'RC', 1, 0, 1, 0, 1);

-- Cas d'erreur pour la contrainte check_action (valeur incorrecte pour Action)					
INSERT INTO Inscription (Action, Nom, Prenom, DateNaissance, Sexe, Nationalite, Adresse, ComplementAdresse, CodePostal, Ville, Pays, Telephone, Mobile, Courriel, Courriel2, PersonneNom, PersonnePrenom, PersonneTelephone, PersonneCourriel, NumLicence, TypeLicence, Assurance, OptionSki, OptionSlackline, OptionTrail, OptionVTT, OptionAssurance)
VALUES
('A', 'Batard', 'Corentin', STR_TO_DATE('12/09/2003', '%d/%m/%Y'), 'H', 'FR', '3 allée de l\île meaben', NULL, '56000', 'Vannes', 'FR', '0769366966', NULL, 'corentin.batard2003@gmail.com', NULL, 'Dupont', 'Marie', '9876543210', 'marie.dupont@email.com', '123456', 'A', 'RC', 1, 0, 1, 0, 1);

-- Cas d'erreur pour la contrainte check_pays (valeur incorrecte pour Pays)
INSERT INTO Inscription (Action, Nom, Prenom, DateNaissance, Sexe, Nationalite, Adresse, ComplementAdresse, CodePostal, Ville, Pays, Telephone, Mobile, Courriel, Courriel2, PersonneNom, PersonnePrenom, PersonneTelephone, PersonneCourriel, NumLicence, TypeLicence, Assurance, OptionSki, OptionSlackline, OptionTrail, OptionVTT, OptionAssurance)
VALUES
('C', 'Batard', 'Corentin', STR_TO_DATE('12/09/2003', '%d/%m/%Y'), 'H', 'FR', '3 allée de l\île meaben', NULL, '56000', 'Vannes', 'GG', '0769366966', NULL, 'corentin.batard2003@gmail.com', NULL, 'Dupont', 'Marie', '9876543210', 'marie.dupont@email.com', '123456', 'A', 'RC', 1, 0, 1, 0, 1);

-- Cas d'erreur pour la contrainte check_type_licence (valeur incorrecte pour TypeLicence)
INSERT INTO Inscription (Action, Nom, Prenom, DateNaissance, Sexe, Nationalite, Adresse, ComplementAdresse, CodePostal, Ville, Pays, Telephone, Mobile, Courriel, Courriel2, PersonneNom, PersonnePrenom, PersonneTelephone, PersonneCourriel, NumLicence, TypeLicence, Assurance, OptionSki, OptionSlackline, OptionTrail, OptionVTT, OptionAssurance)
VALUES
('C', 'Batard', 'Corentin', STR_TO_DATE('12/09/2003', '%d/%m/%Y'), 'H', 'FR', '3 allée de l\île meaben', NULL, '56000', 'Vannes', 'FR', '0769366966', NULL, 'corentin.batard2003@gmail.com', NULL, 'Dupont', 'Marie', '9876543210', 'marie.dupont@email.com', '123456', 'B', 'RC', 1, 0, 1, 0, 1);

-- Cas d'erreur pour la contrainte check_assurance (valeur incorrecte pour Assurance)
INSERT INTO Inscription (Action, Nom, Prenom, DateNaissance, Sexe, Nationalite, Adresse, ComplementAdresse, CodePostal, Ville, Pays, Telephone, Mobile, Courriel, Courriel2, PersonneNom, PersonnePrenom, PersonneTelephone, PersonneCourriel, NumLicence, TypeLicence, Assurance, OptionSki, OptionSlackline, OptionTrail, OptionVTT, OptionAssurance)
VALUES
('C', 'Batard', 'Corentin', STR_TO_DATE('12/09/2003', '%d/%m/%Y'), 'H', 'FR', '3 allée de l\île meaben', NULL, '56000', 'Vannes', 'FR', '0769366966', NULL, 'corentin.batard2003@gmail.com', NULL, 'Dupont', 'Marie', '9876543210', 'marie.dupont@email.com', '123456', 'A', 'R', 1, 0, 1, 0, 1);

-- Cas de succès (données correctes)
INSERT INTO Inscription (Action, Nom, Prenom, DateNaissance, Sexe, Nationalite, Adresse, ComplementAdresse, CodePostal, Ville, Pays, Telephone, Mobile, Courriel, Courriel2, PersonneNom, PersonnePrenom, PersonneTelephone, PersonneCourriel, NumLicence, TypeLicence, Assurance, OptionSki, OptionSlackline, OptionTrail, OptionVTT, OptionAssurance)
VALUES
('C', 'Batard', 'Corentin', STR_TO_DATE('12/09/2003', '%d/%m/%Y'), 'H', 'FR', '3 allée de l\île meaben', NULL, '56000', 'Vannes', 'FR', '0769366966', NULL, 'corentin.batard2003@gmail.com', NULL, 'Dupont', 'Marie', '9876543210', 'marie.dupont@email.com', '123456', 'A', 'RC', 1, 0, 1, 0, 1);
