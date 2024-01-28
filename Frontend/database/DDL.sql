CREATE DATABASE softjobs;

\c softjobs;

CREATE TABLE usuarios (
  id        SERIAL        NOT NULL,
  email     VARCHAR(50)   NOT NULL  UNIQUE,
  password  VARCHAR(100)   NOT NULL,
  rol       VARCHAR(25)   NOT NULL,
  lenguage  VARCHAR(20)   NOT NULL,
  PRIMARY KEY (id)
);
