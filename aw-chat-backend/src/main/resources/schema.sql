DROP TABLE IF EXISTS messages, user, user_poition;

CREATE TABLE messages
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    receiver VARCHAR(250) NOT NULL,
    sender   VARCHAR(250) NOT NULL,
    message  VARCHAR(250) DEFAULT NULL
);

CREATE TABLE user_position
(
    id      INT AUTO_INCREMENT PRIMARY KEY,
    x_pos   INT,
    y_pos   INT,
    updated TIMESTAMP
);

CREATE TABLE user
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(256) NOT NULL UNIQUE,
    color       VARCHAR(20),
    position_id INT,
    create_time TIMESTAMP,
    FOREIGN KEY (position_id) REFERENCES user_position (id)
);
