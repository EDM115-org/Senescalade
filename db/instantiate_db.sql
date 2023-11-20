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
    ID INT AUTO_INCREMENT PRIMARY KEY,
    DateSeance DATE NOT NULL,
    HeureSeance TIME NOT NULL,
    TypeSeance CHAR(50) NOT NULL,
    Niveau CHAR(10) NOT NULL,
    NbPlaces INT NOT NULL,
    NbPlacesRestantes INT NOT NULL
);

CREATE TABLE Inscription (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Action CHAR(1) NOT NULL,
    Nom VARCHAR(100) NOT NULL,
    Prenom VARCHAR(100) NOT NULL,
    DateNaissance DATE NOT NULL,
    Sexe CHAR(1) NOT NULL,
    Nationalite CHAR(2) NOT NULL,
    Adresse VARCHAR(255) NOT NULL,
    ComplementAdresse VARCHAR(255),
    CodePostal VARCHAR(5) NOT NULL,
    Ville VARCHAR(100) NOT NULL,
    Pays CHAR(2) NOT NULL,
    Telephone VARCHAR(10),
    Mobile VARCHAR(10),
    Courriel VARCHAR(100) NOT NULL,
    Courriel2 VARCHAR(100),
    PersonneNom VARCHAR(100),
    PersonnePrenom VARCHAR(100),
    PersonneTelephone VARCHAR(15),
    PersonneCourriel VARCHAR(100),
    NumLicence VARCHAR(6) NOT NULL,
    TypeLicence CHAR(1) NOT NULL,
    Assurance CHAR(2) NOT NULL,
    OptionSki BOOLEAN NOT NULL,
    OptionSlackline BOOLEAN NOT NULL,
    OptionTrail BOOLEAN NOT NULL,
    OptionVTT BOOLEAN NOT NULL,
    OptionAssurance BOOLEAN NOT NULL,
    Seance INT,
    FOREIGN KEY (Seance) REFERENCES Seance(ID),
    CONSTRAINT check_action CHECK (Action IN ('C', 'R')),
    CONSTRAINT check_sexe CHECK (Sexe IN ('H', 'F')),
    CONSTRAINT check_pays CHECK (Pays IN ('FR', 'US', 'CA')),
    CONSTRAINT check_type_licence CHECK (TypeLicence IN ('J', 'A', 'F')),
    CONSTRAINT check_assurance CHECK (Assurance IN ('RC', 'B', 'B+', 'B++'))
);

DELIMITER //
CREATE TRIGGER check_date_naissance
BEFORE INSERT ON Inscription
FOR EACH ROW
BEGIN
    IF NEW.DateNaissance > NOW() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La date de naissance ne peut pas être ultérieure à la date actuelle.';
    END IF;  -- skipcq: SQL-L003
END;  -- skipcq: SQL-L003
//
DELIMITER ;  -- skipcq: SQL-L052, SQL-L039
