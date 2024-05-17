USE sae;

CREATE TABLE IF NOT EXISTS Admin (
  idAdmin INT PRIMARY KEY,
  droit CHAR(5) NOT NULL,
  FOREIGN KEY (idAdmin) REFERENCES Inscription(idInscription)
);

