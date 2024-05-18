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
