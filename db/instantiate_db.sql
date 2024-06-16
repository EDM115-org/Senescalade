USE sae;

CREATE TABLE IF NOT EXISTS Seance (
  idSeance INT AUTO_INCREMENT PRIMARY KEY,
  jour VARCHAR(50) NOT NULL,
  heureDebutSeance TIME NOT NULL,
  heureFinSeance TIME NOT NULL,
  typeSeance VARCHAR(100) NOT NULL,
  niveau VARCHAR(100),
  nbPlaces INT NOT NULL,
  nbPlacesRestantes INT NOT NULL,
  professeur VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Compte (
  idCompte INT AUTO_INCREMENT PRIMARY KEY,
  mail VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Grimpeur (
  idGrimpeur INT AUTO_INCREMENT PRIMARY KEY,
  action CHAR(1) NOT NULL DEFAULT 'C',
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  dateNaissance DATE NOT NULL,
  sexe CHAR(1) NOT NULL,
  nationalite CHAR(2) NOT NULL DEFAULT 'FR',
  adresse VARCHAR(255) NOT NULL,
  complementAdresse VARCHAR(255),
  codePostal VARCHAR(5) NOT NULL,
  ville VARCHAR(100) NOT NULL,
  pays CHAR(2) NOT NULL DEFAULT 'FR',
  telephone VARCHAR(15),
  mobile VARCHAR(15),
  courriel2 VARCHAR(100),
  personneNom VARCHAR(100),
  personnePrenom VARCHAR(100),
  personneTelephone VARCHAR(15),
  personneCourriel VARCHAR(100),
  numLicence VARCHAR(6),
  typeLicence VARCHAR(1),
  assurance VARCHAR(3) NOT NULL DEFAULT 'B',
  optionSki BOOLEAN NOT NULL DEFAULT 0,
  optionSlackline BOOLEAN NOT NULL DEFAULT 0,
  optionTrail BOOLEAN NOT NULL DEFAULT 0,
  optionVTT BOOLEAN NOT NULL DEFAULT 0,
  optionAssurance VARCHAR(3) NOT NULL DEFAULT 'NON',
  optionProtectionAgression BOOLEAN DEFAULT 0,
  fkCompte INT NOT NULL,
  aPaye BOOLEAN NOT NULL DEFAULT 0,
  dateExport DATE,
  isExported BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (fkCompte) REFERENCES Compte(idCompte)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT check_action CHECK (action IN ('C', 'R')),
  CONSTRAINT check_sexe CHECK (sexe IN ('H', 'F')),
  CONSTRAINT check_type_licence CHECK (typeLicence IN ('', 'J', 'A', 'F')),
  CONSTRAINT check_assurance CHECK (assurance IN ('RC', 'B', 'B+', 'B++')),
  CONSTRAINT check_option_assurance CHECK (optionAssurance IN ('NON', 'IJ1', 'IJ2', 'IJ3'))
);

CREATE TABLE IF NOT EXISTS GrimpeurSeance (
  idGrimpeur INT,
  idSeance INT,
  PRIMARY KEY (idGrimpeur, idSeance),
  UNIQUE (idGrimpeur),
  FOREIGN KEY (idGrimpeur) REFERENCES Grimpeur(idGrimpeur)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (idSeance) REFERENCES Seance(idSeance)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Admin (
  idAdmin INT PRIMARY KEY,
  ReadListGrimpeur BOOLEAN NOT NULL DEFAULT 0,
  ReadListSeance BOOLEAN NOT NULL DEFAULT 0,
  ReadListAdmin BOOLEAN NOT NULL DEFAULT 0,
  ReadListUtilisateur BOOLEAN NOT NULL DEFAULT 0,
  UpdateListGrimpeur BOOLEAN NOT NULL DEFAULT 0,
  UpdateListSeance BOOLEAN NOT NULL DEFAULT 0,
  UpdateListAdmin BOOLEAN NOT NULL DEFAULT 0,
  UpdateListUtilisateur BOOLEAN NOT NULL DEFAULT 0,
  DeleteListGrimpeur BOOLEAN NOT NULL DEFAULT 0,
  DeleteListSeance BOOLEAN NOT NULL DEFAULT 0,
  DeleteListAdmin BOOLEAN NOT NULL DEFAULT 0,
  DeleteListUtilisateur BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (idAdmin) REFERENCES Compte(idCompte)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

DELIMITER //
CREATE TRIGGER IF NOT EXISTS check_date_naissance
BEFORE INSERT ON Grimpeur
FOR EACH ROW
BEGIN
  IF NEW.dateNaissance > NOW() THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'La date de naissance ne peut pas être ultérieure à la date actuelle.';
  END IF;  -- skipcq: SQL-L003
END;  -- skipcq: SQL-L003
//
DELIMITER ;  -- skipcq: SQL-L052, SQL-L039
