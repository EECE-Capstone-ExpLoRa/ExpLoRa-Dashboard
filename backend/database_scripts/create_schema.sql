DROP DATABASE IF EXISTS explora;
CREATE DATABASE IF NOT EXISTS explora;
USE explora;

CREATE TABLE explora.user (
	user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(64) NOT NULL
);

CREATE table explora.device (
	device_eui VARCHAR(64) PRIMARY KEY,
    type ENUM('rocket', 'drone', 'car', 'other'),
    nickname VARCHAR(100)
);

CREATE TABLE explora.user_device (
	user_id INT NOT NULL,
    device_eui VARCHAR(64) NOT NULL,

	CONSTRAINT user_device_pk PRIMARY KEY (user_id, device_eui),
    CONSTRAINT user_fk FOREIGN KEY (user_id) 
		REFERENCES user(user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT device_fk FOREIGN KEY (device_eui) 
		REFERENCES device(device_eui)
        ON UPDATE CASCADE ON DELETE CASCADE
);