USE sae;

CREATE TABLE IF NOT EXISTS Admin (
  idAdmin INT PRIMARY KEY,
  ReadListGrimpeur BOOLEAN NOT NULL,
  ReadListSeance BOOLEAN NOT NULL,
  ReadListAdmin BOOLEAN NOT NULL,
  UpdateListGrimpeur BOOLEAN NOT NULL,
  UpdateListSeance BOOLEAN NOT NULL,
  UpdateListAdmin BOOLEAN NOT NULL,
  DeleteListGrimpeur BOOLEAN NOT NULL,
  DeleteListSeance BOOLEAN NOT NULL,
  DeleteListAdmin BOOLEAN NOT NULL,
  FOREIGN KEY (idAdmin) REFERENCES Inscription(idInscription)
);
