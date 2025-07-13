BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "oferta_academica" (
	"Id"	TEXT,
	"institucion"	TEXT,
	"clasificacion"	TEXT,
	"nivel_programa"	TEXT,
	"carrera"	TEXT,
	"duracion_semestres"	INTEGER,
	"modalidad"	TEXT,
	"jornada"	TEXT,
	"enlace"	TEXT,
	"valor_semestre"	INTEGER
);
INSERT INTO "oferta_academica" VALUES ('E_01','Universidad del Valle','Universidad','Pregrado','Administración de Empresas',10,'Presencial','Mixta','https://cartago.univalle.edu.co/estudia-en-univalle/pregrado.html',0);
INSERT INTO "oferta_academica" VALUES ('E_02','Universidad del Valle','Universidad','Pregrado','Contaduría Pública',10,'Presencial','Mixta','https://cartago.univalle.edu.co/estudia-en-univalle/pregrado/contaduria.html',0);
INSERT INTO "oferta_academica" VALUES ('E_03','Universidad del Valle','Universidad','Pregrado','Trabajo Social',10,'Presencial','Mixta','https://cartago.univalle.edu.co/estudia-en-univalle/pregrado/trabajo-social.html',0);
INSERT INTO "oferta_academica" VALUES ('E_04','Universidad del Valle','Universidad','Pregrado','Ingeniería Electrónica',10,'Presencial','Mixta','https://eiee.univalle.edu.co/ingenieria-electronica',0);
INSERT INTO "oferta_academica" VALUES ('E_05','Universidad del Valle','Universidad','Tecnología','Tecnología en Electrónica Industrial',7,'Presencial','Nocturna','https://cartago.univalle.edu.co/estudia-en-univalle/pregrado/tecnologia-en-electronica.html',0);
INSERT INTO "oferta_academica" VALUES ('E_06','Universidad del Valle','Universidad','Tecnología','Tecnología En Producción Agroambiental',6,'Presencial','Diurna','https://cartago.univalle.edu.co/estudia-en-univalle/pregrado/tecnologia-en-produccion-agroambiental.html',0);
INSERT INTO "oferta_academica" VALUES ('E_07','Universidad del Valle','Universidad','Tecnología','Tecnología en Gestión de Organizaciones Turísticas',6,'Presencial','Mixta','https://cartago.univalle.edu.co/estudia-en-univalle/pregrado/tecnologia-deth.html',0);
INSERT INTO "oferta_academica" VALUES ('E_08','Universidad del Valle','Universidad','Pregrado','Profesional En Agroindustria',8,'Presencial','Diurna','https://cartago.univalle.edu.co/estudia-en-univalle/pregrado/profesional-en-agroindustria.html',0);
INSERT INTO "oferta_academica" VALUES ('E_09','Universidad Cooperativa de Colombia','Universidad','Pregrado','Derecho',9,'Presencial','Mixta','https://ucc.edu.co/programas/pregrados/Paginas/pereira-cartago/derecho-cartago.aspx',3969720);
INSERT INTO "oferta_academica" VALUES ('E_10','Universidad Cooperativa de Colombia','Universidad','Pregrado','Licenciatura en Español e Inglés',8,'Híbrida','Mixta','https://ucc.edu.co/programas/pregrados/Paginas/pereira-cartago/licenciatura-en-espanol-e-ingles-pereira-cartago.aspx',3003883);
INSERT INTO "oferta_academica" VALUES ('E_11','Universidad Cooperativa de Colombia','Universidad','Pregrado','Ingeniería de Software',8,'Híbrida','Diurna','https://ucc.edu.co/programas/pregrados/Paginas/pereira-cartago/ingenieria-de-software-en-cartago.aspx',3782959);
INSERT INTO "oferta_academica" VALUES ('E_12','Universidad Cooperativa de Colombia','Universidad','Pregrado','Psicologia',8,'Presencial','Mixta','https://ucc.edu.co/programas/pregrados/Paginas/pereira-cartago/psicologia-cartago.aspx',3560432);
INSERT INTO "oferta_academica" VALUES ('E_13','Corporación de Estudios Tecnológicos del Norte del Valle','Universidad','Pregrado','Administración de Empresas.',9,'Presencial','Mixta','https://cotecnova.edu.co/index.php/administracion-de-empresas/',2678510);
INSERT INTO "oferta_academica" VALUES ('E_14','Corporación de Estudios Tecnológicos del Norte del Valle','Universidad','Pregrado','Contaduría Pública',9,'Presencial','Mixta','https://cotecnova.edu.co/index.php/contaduria-publica/',2678510);
INSERT INTO "oferta_academica" VALUES ('E_15','Corporación de Estudios Tecnológicos del Norte del Valle','Universidad','Pregrado','Ingeniería en Sistemas',10,'Presencial','Mixta','https://cotecnova.edu.co/index.php/ingenieria-de-sistemas-por-ciclos-propedeuticos/',2678510);
INSERT INTO "oferta_academica" VALUES ('E_16','Corporación de Estudios Tecnológicos del Norte del Valle','Universidad','Pregrado','Administración Agropecuaria',9,'Presencial','Diurna','https://cotecnova.edu.co/index.php/administracion-agropecuaria/',2678510);
INSERT INTO "oferta_academica" VALUES ('E_17','Corporación de Estudios Tecnológicos del Norte del Valle','Universidad','Técnico Profesional','Profesional en Programación de Aplicaciones Informáticas',4,'Presencial','Mixta','https://cotecnova.edu.co/index.php/tecnico-profesional-en-programacion-de-aplicaciones-informaticas/',0);
INSERT INTO "oferta_academica" VALUES ('E_18','Corporación de Estudios Tecnológicos del Norte del Valle','Universidad','Tecnologico','Producción de Contenidos Digitales',6,'Presencial','Mixta','https://cotecnova.edu.co/index.php/tecnologia-en-produccion-de-contenidos-digitales/',2500000);
INSERT INTO "oferta_academica" VALUES ('E_19','Corporación de Estudios Tecnológicos del Norte del Valle','Universidad','Tecnologico','Gestión Empresarial',5,'Presencial','Mixta','https://cotecnova.edu.co/index.php/gestion-empresarial-nuevo/',2209771);
INSERT INTO "oferta_academica" VALUES ('E_20','Corporación de Estudios Tecnológicos del Norte del Valle','Universidad','Tecnologico','Gestión Contable',5,'Presencial','Mixta','https://cotecnova.edu.co/index.php/gestion_contable/',2209771);
INSERT INTO "oferta_academica" VALUES ('E_21','Corporación de Estudios Tecnológicos del Norte del Valle','Universidad','Tecnologico','Gestión de Sistemas de Información',7,'Presencial','Mixta','https://cotecnova.edu.co/index.php/tecnologia-en-gestion-de-sistemas-de-informacion/',0);
INSERT INTO "oferta_academica" VALUES ('E_22','Corporación de Estudios Tecnológicos del Norte del Valle','Universidad','Tecnologico','Gestión de Empresas de Salud',6,'Presencial','Sabatina','https://cotecnova.edu.co/index.php/tecnologia-en-gestion-de-empresas-de-salud/',0);
INSERT INTO "oferta_academica" VALUES ('E_23','Universidad Antonio Nariño','Universidad','Pregrado','Administración de Empresas',8,'Mixta','Mixta','https://www.uan.edu.co/administracion-de-empresas',0);
INSERT INTO "oferta_academica" VALUES ('E_24','Universidad Antonio Nariño','Universidad','Pregrado','Licenciatura en Educación Infantil',9,'Virtual','Virtual','https://www.uan.edu.co/licenciatura-en-educacion-infantil',0);
INSERT INTO "oferta_academica" VALUES ('E_25','Universidad Antonio Nariño','Universidad','Pregrado','Licenciatura en Tecnología e Informatica',9,'Virtual','Virtual','https://www.uan.edu.co/licenciatura-en-tecnologia-e-informatica',0);
INSERT INTO "oferta_academica" VALUES ('E_26','Universidad Antonio Nariño','Universidad','Pregrado','Trabajo Social',8,'Virtual','Virtual','https://www.uan.edu.co/trabajo-social',0);
INSERT INTO "oferta_academica" VALUES ('E_27','Escuela Superior de Administración Pública ESAP','Universidad','Pregrado','Administración Publica Territorial',9,'Presencial','Mixta','https://www.esap.edu.co/la-esap-valle-abre-sus-inscripciones-de-pregrado-y-posgrado-para-el-periodo-2025-2/',0);
COMMIT;
