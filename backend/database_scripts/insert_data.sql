USE explora;

# Before running, regenerate the create_schema script as this data has hard-coded data IDs
# that assume this is the first insert on the database

-- INSERT SCRIPTS --
INSERT INTO explora.user(username, password, email)
	VALUES ("admin1", "password", "admin1@gmail.com"),
		   ("admin2", "password", "admin2@gmail.com"),
		   ("admin3", "password", "admin3@gmail.com"),
           ("admin4", "password", "admin4@gmail.com"),
           ("admin5", "password", "admin5@gmail.com");

INSERT INTO explora.device
	VALUES ("2390474187332", "rocket", "main rocket"),
		   ("8346928392689", "rocket", "small rocket"),
		   ("3294024396423", "other", "Mod 1"),
           ("4144329723342", "other", "Mod 2"),
           ("7473209709243", "car", NULL),
           ("4234038404299", "car", NULL),
           ("3410699323129", "drone", NULL);
           
INSERT INTO explora.user_device
	VALUES (1, "2390474187332"),
		   (1, "8346928392689"),
		   (2, "3410699323129"),
           (4, "4234038404299"),
           (4, "3294024396423"),
           (4, "4144329723342"),
           (5, "4234038404299"),
           (5, "7473209709243");
           
-- SELECT SCRIPTS --
SELECT * FROM explora.user;
SELECT * FROM explora.device;
SELECT * FROM explora.user_device;
    
    
    
    
