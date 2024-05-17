USE sae;

CREATE TABLE IF NOT EXISTS InscriptionSeance (
  idInscription INT,
  idSeance INT,
  PRIMARY KEY (idInscription, idSeance),
  FOREIGN KEY (idInscription) REFERENCES Inscription(idInscription),
  FOREIGN KEY (idSeance) REFERENCES Seance(idSeance)
);

