USE sae;

CREATE TABLE IF NOT EXISTS Seance (
  idSeance INT AUTO_INCREMENT PRIMARY KEY,
  jour CHAR(50) NOT NULL,
  heureDebutSeance TIME NOT NULL,
  heureFinSeance TIME NOT NULL,
  typeSeance CHAR(100) NOT NULL,
  niveau CHAR(100),
  nbPlaces INT NOT NULL,
  nbPlacesRestantes INT NOT NULL,
  professeur CHAR(100)
);

CREATE TABLE IF NOT EXISTS Inscription (
  idInscription INT AUTO_INCREMENT PRIMARY KEY,
  mail VARCHAR(100) UNIQUE NOT NULL,
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
  numLicence VARCHAR(6),
  typeLicence CHAR(1),
  assurance CHAR(3) NOT NULL,
  optionSki BOOLEAN NOT NULL,
  optionSlackline BOOLEAN NOT NULL,
  optionTrail BOOLEAN NOT NULL,
  optionVTT BOOLEAN NOT NULL,
  optionAssurance BOOLEAN NOT NULL,
  lInscription INT NOT NULL,
  isPaye BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (lInscription) REFERENCES Inscription(idInscription)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT check_action CHECK (action IN ('C', 'R')),
  CONSTRAINT check_sexe CHECK (sexe IN ('H', 'F')),
  CONSTRAINT check_type_licence CHECK (typeLicence IN ('', 'J', 'A', 'F')),
  CONSTRAINT check_assurance CHECK (assurance IN ('RC', 'B', 'B+', 'B++'))
);

CREATE TABLE IF NOT EXISTS InscriptionSeance (
  idInscription INT,
  idSeance INT,
  PRIMARY KEY (idInscription, idSeance),
  FOREIGN KEY (idInscription) REFERENCES Inscription(idInscription)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (idSeance) REFERENCES Seance(idSeance)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Admin (
  idAdmin INT PRIMARY KEY,
  ReadListGrimpeur BOOLEAN NOT NULL,
  ReadListSeance BOOLEAN NOT NULL,
  ReadListAdmin BOOLEAN NOT NULL,
  ReadListUtilisateur BOOLEAN NOT NULL,
  UpdateListGrimpeur BOOLEAN NOT NULL,
  UpdateListSeance BOOLEAN NOT NULL,
  UpdateListAdmin BOOLEAN NOT NULL,
  UpdateListUtilisateur BOOLEAN NOT NULL,
  DeleteListGrimpeur BOOLEAN NOT NULL,
  DeleteListSeance BOOLEAN NOT NULL,
  DeleteListAdmin BOOLEAN NOT NULL,
  DeleteListUtilisateur BOOLEAN NOT NULL,
  FOREIGN KEY (idAdmin) REFERENCES Inscription(idInscription)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

DELIMITER //
CREATE TRIGGER IF NOT EXISTS check_date_naissance
BEFORE INSERT ON Personne
FOR EACH ROW
BEGIN
  IF NEW.dateNaissance > NOW() THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'La date de naissance ne peut pas être ultérieure à la date actuelle.';
  END IF;
END;
//
DELIMITER ;
