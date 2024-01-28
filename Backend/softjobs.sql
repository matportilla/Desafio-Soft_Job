// Intrucciones de creación de base de datos:

CREATE DATABASE softjobs;

// Conectar con base

\c softjobs;

CREATE TABLE usuarios ( id SERIAL, email VARCHAR(50) NOT NULL, password
VARCHAR(100) NOT NULL, rol VARCHAR(25), lenguage VARCHAR(20) );

// Revisar usuarios creados: 

SELECT * FROM usuarios;