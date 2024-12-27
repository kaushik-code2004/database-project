CREATE TABLE user1(
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAr(50) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE,
    password VARCHAR(50) UNIQUE
);

