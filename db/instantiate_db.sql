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

-- ---------------------------------------------------------
--                SCRIPT D'INSTANCIATION DE TABLE         --
-- ---------------------------------------------------------

USE sae;

CREATE TABLE Seance (
    idSeance INT AUTO_INCREMENT PRIMARY KEY,
    jour CHAR(50) NOT NULL,
    heureSeance TIME NOT NULL,
    dureeSeance TIME NOT NULL,
    typeSeance CHAR(100) NOT NULL,
    niveau CHAR(100),
    nbPlaces INT NOT NULL,
    nbPlacesRestantes INT NOT NULL,
    professeur CHAR(100)
);

CREATE TABLE Inscription (
    idInscription INT AUTO_INCREMENT PRIMARY KEY,
    mail VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    confirm_password VARCHAR(100) NOT NULL,
    dateNaissance DATE NOT NULL,
    isAdmin BOOLEAN NOT NULL
);

CREATE TABLE Personne (
    idPersonne INT AUTO_INCREMENT PRIMARY KEY,
    action CHAR(1) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    sexe CHAR(1) NOT NULL,
    nationalite CHAR(2) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    complementAdresse VARCHAR(255),
    codePostal VARCHAR(5) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    pays CHAR(2) NOT NULL,
    telephone VARCHAR(10),
    mobile VARCHAR(10),
    courriel2 VARCHAR(100),
    personneNom VARCHAR(100),
    personnePrenom VARCHAR(100),
    personneTelephone VARCHAR(15),
    personneCourriel VARCHAR(100),
    numLicence VARCHAR(6) NOT NULL,
    typeLicence CHAR(1) NOT NULL,
    assurance CHAR(2) NOT NULL,
    optionSki BOOLEAN NOT NULL,
    optionSlackline BOOLEAN NOT NULL,
    optionTrail BOOLEAN NOT NULL,
    optionVTT BOOLEAN NOT NULL,
    optionAssurance BOOLEAN NOT NULL,
    seance INT,
    FOREIGN KEY (Seance) REFERENCES Seance(idSeance),
    lInscription INT NOT NULL,
    FOREIGN KEY (lInscription) REFERENCES Inscription(idInscription),
    CONSTRAINT check_action CHECK (Action IN ('C', 'R')),
    CONSTRAINT check_sexe CHECK (Sexe IN ('H', 'F')),
    CONSTRAINT check_pays CHECK (Pays IN ('FR', 'US', 'CA')),
    CONSTRAINT check_type_licence CHECK (TypeLicence IN ('J', 'A', 'F')),
    CONSTRAINT check_assurance CHECK (Assurance IN ('RC', 'B', 'B+', 'B++'))
);

CREATE TABLE Admin (
    idAdmin INT PRIMARY KEY,
    droit CHAR(5) NOT NULL,
    FOREIGN KEY (idAdmin) REFERENCES Inscription(idInscription)
);

DELIMITER //
CREATE TRIGGER check_date_naissance
BEFORE INSERT ON Inscription
FOR EACH ROW
BEGIN
    IF NEW.dateNaissance > NOW() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La date de naissance ne peut pas être ultérieure à la date actuelle.';
    END IF;  -- skipcq: SQL-L003
END;  -- skipcq: SQL-L003
//
DELIMITER ;  -- skipcq: SQL-L052, SQL-L039
