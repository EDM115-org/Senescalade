-- ---------------------------------------------------------
--                SCRIPT D'INSTANCIATION DE TABLE         --
-- ---------------------------------------------------------

USE sae;

CREATE TABLE IF NOT EXISTS Seance (
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

CREATE TABLE IF NOT EXISTS Inscription (
  idInscription INT AUTO_INCREMENT PRIMARY KEY,
  mail VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  isAdmin BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS Personne (
  idPersonne INT AUTO_INCREMENT PRIMARY KEY,
  action CHAR(1) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  dateNaissance DATE NOT NULL,
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

CREATE TABLE IF NOT EXISTS Admin (
  idAdmin INT PRIMARY KEY,
  droit CHAR(5) NOT NULL,
  FOREIGN KEY (idAdmin) REFERENCES Inscription(idInscription)
);

DELIMITER //
CREATE TRIGGER IF NOT EXISTS check_date_naissance
BEFORE INSERT ON Personne
FOR EACH ROW
BEGIN
  IF NEW.dateNaissance > NOW() THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'La date de naissance ne peut pas être ultérieure à la date actuelle.';
  END IF;  -- skipcq: SQL-L003
END;  -- skipcq: SQL-L003
//
DELIMITER ;  -- skipcq: SQL-L052, SQL-L039
