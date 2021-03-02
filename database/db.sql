CREATE DATABASE database_neural;

USE database_neural;

CREATE TABLE users(
    id INT(15) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(150) NOT NULL,
    fullname VARCHAR (200) NOT NULL
);
DESCRIBE users;

CREATE TABLE nn(
    id INT NOT NULL PRIMARY KEY,
    tipo VARCHAR(50),
    user_id INT(15),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

DESCRIBE nn;