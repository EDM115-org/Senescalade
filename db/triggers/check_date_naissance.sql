USE sae;

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

