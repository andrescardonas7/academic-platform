-- Seed data for oferta_academica table
-- Migrated from SQLite data

-- Constants to avoid literal duplication (SonarQube compliance)
DO $$
DECLARE
    UNIVERSIDAD_DEL_VALLE CONSTANT TEXT := 'Universidad del Valle';
    UNIVERSIDAD_COOPERATIVA CONSTANT TEXT := 'Universidad Cooperativa de Colombia';
    COTECNOVA CONSTANT TEXT := 'Corporación de Estudios Tecnológicos del Norte del Valle';
    UNIVERSIDAD_ANTONIO_NARINO CONSTANT TEXT := 'Universidad Antonio Nariño';
    ESAP CONSTANT TEXT := 'Escuela Superior de Administración Pública ESAP';
    UNIVERSIDAD_TIPO CONSTANT TEXT := 'Universidad';
    PREGRADO_NIVEL CONSTANT TEXT := 'Pregrado';
    TECNOLOGIA_NIVEL CONSTANT TEXT := 'Tecnología';
    TECNOLOGICO_NIVEL CONSTANT TEXT := 'Tecnologico';
    TECNICO_PROFESIONAL_NIVEL CONSTANT TEXT := 'Técnico Profesional';
    PRESENCIAL_MODALIDAD CONSTANT TEXT := 'Presencial';
    VIRTUAL_MODALIDAD CONSTANT TEXT := 'Virtual';
    HIBRIDA_MODALIDAD CONSTANT TEXT := 'Híbrida';
    MIXTA_MODALIDAD CONSTANT TEXT := 'Mixta';
    MIXTA_JORNADA CONSTANT TEXT := 'Mixta';
    DIURNA_JORNADA CONSTANT TEXT := 'Diurna';
    NOCTURNA_JORNADA CONSTANT TEXT := 'Nocturna';
    VIRTUAL_JORNADA CONSTANT TEXT := 'Virtual';
    SABATINA_JORNADA CONSTANT TEXT := 'Sabatina';
BEGIN

INSERT INTO oferta_academica (
    "Id",
    institucion,
    clasificacion,
    nivel_programa,
    carrera,
    duracion_semestres,
    modalidad,
    jornada,
    enlace,
    valor_semestre
  )
VALUES (
    'E_01',
    UNIVERSIDAD_DEL_VALLE,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Administración de Empresas',
    10,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://cartago.univalle.edu.co/estudia-en-univalle/pregrado.html',
    0
  ),
  (
    'E_02',
    UNIVERSIDAD_DEL_VALLE,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Contaduría Pública',
    10,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://cartago.univalle.edu.co/estudia-en-univalle/pregrado/contaduria.html',
    0
  ),
  (
    'E_03',
    UNIVERSIDAD_DEL_VALLE,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Trabajo Social',
    10,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://cartago.univalle.edu.co/estudia-en-univalle/pregrado/trabajo-social.html',
    0
  ),
  (
    'E_04',
    UNIVERSIDAD_DEL_VALLE,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Ingeniería Electrónica',
    10,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://eiee.univalle.edu.co/ingenieria-electronica',
    0
  ),
  (
    'E_05',
    UNIVERSIDAD_DEL_VALLE,
    UNIVERSIDAD_TIPO,
    TECNOLOGIA_NIVEL,
    'Tecnología en Electrónica Industrial',
    7,
    PRESENCIAL_MODALIDAD,
    NOCTURNA_JORNADA,
    'https://cartago.univalle.edu.co/estudia-en-univalle/pregrado/tecnologia-en-electronica.html',
    0
  ),
  (
    'E_06',
    UNIVERSIDAD_DEL_VALLE,
    UNIVERSIDAD_TIPO,
    TECNOLOGIA_NIVEL,
    'Tecnología En Producción Agroambiental',
    6,
    PRESENCIAL_MODALIDAD,
    DIURNA_JORNADA,
    'https://cartago.univalle.edu.co/estudia-en-univalle/pregrado/tecnologia-en-produccion-agroambiental.html',
    0
  ),
  (
    'E_07',
    UNIVERSIDAD_DEL_VALLE,
    UNIVERSIDAD_TIPO,
    TECNOLOGIA_NIVEL,
    'Tecnología en Gestión de Organizaciones Turísticas',
    6,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://cartago.univalle.edu.co/estudia-en-univalle/pregrado/tecnologia-deth.html',
    0
  ),
  (
    'E_08',
    UNIVERSIDAD_DEL_VALLE,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Profesional En Agroindustria',
    8,
    PRESENCIAL_MODALIDAD,
    DIURNA_JORNADA,
    'https://cartago.univalle.edu.co/estudia-en-univalle/pregrado/profesional-en-agroindustria.html',
    0
  ),
  (
    'E_09',
    UNIVERSIDAD_COOPERATIVA,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Derecho',
    9,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://ucc.edu.co/programas/pregrados/Paginas/pereira-cartago/derecho-cartago.aspx',
    3969720
  ),
  (
    'E_10',
    UNIVERSIDAD_COOPERATIVA,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Licenciatura en Español e Inglés',
    8,
    HIBRIDA_MODALIDAD,
    MIXTA_JORNADA,
    'https://ucc.edu.co/programas/pregrados/Paginas/pereira-cartago/licenciatura-en-espanol-e-ingles-pereira-cartago.aspx',
    3003883
  ),
  (
    'E_11',
    UNIVERSIDAD_COOPERATIVA,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Ingeniería de Software',
    8,
    HIBRIDA_MODALIDAD,
    DIURNA_JORNADA,
    'https://ucc.edu.co/programas/pregrados/Paginas/pereira-cartago/ingenieria-de-software-en-cartago.aspx',
    3782959
  ),
  (
    'E_12',
    UNIVERSIDAD_COOPERATIVA,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Psicologia',
    8,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://ucc.edu.co/programas/pregrados/Paginas/pereira-cartago/psicologia-cartago.aspx',
    3560432
  ),
  (
    'E_13',
    COTECNOVA,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Administración de Empresas.',
    9,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://cotecnova.edu.co/index.php/administracion-de-empresas/',
    2678510
  ),
  (
    'E_14',
    COTECNOVA,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Contaduría Pública',
    9,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://cotecnova.edu.co/index.php/contaduria-publica/',
    2678510
  ),
  (
    'E_15',
    COTECNOVA,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Ingeniería en Sistemas',
    10,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://cotecnova.edu.co/index.php/ingenieria-de-sistemas-por-ciclos-propedeuticos/',
    2678510
  ),
  (
    'E_16',
    COTECNOVA,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Administración Agropecuaria',
    9,
    PRESENCIAL_MODALIDAD,
    DIURNA_JORNADA,
    'https://cotecnova.edu.co/index.php/administracion-agropecuaria/',
    2678510
  ),
  (
    'E_17',
    COTECNOVA,
    UNIVERSIDAD_TIPO,
    TECNICO_PROFESIONAL_NIVEL,
    'Profesional en Programación de Aplicaciones Informáticas',
    4,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://cotecnova.edu.co/index.php/tecnico-profesional-en-programacion-de-aplicaciones-informaticas/',
    0
  ),
  (
    'E_18',
    COTECNOVA,
    UNIVERSIDAD_TIPO,
    TECNOLOGICO_NIVEL,
    'Producción de Contenidos Digitales',
    6,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://cotecnova.edu.co/index.php/tecnologia-en-produccion-de-contenidos-digitales/',
    2500000
  ),
  (
    'E_19',
    COTECNOVA,
    UNIVERSIDAD_TIPO,
    TECNOLOGICO_NIVEL,
    'Gestión Empresarial',
    5,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://cotecnova.edu.co/index.php/gestion-empresarial-nuevo/',
    2209771
  ),
  (
    'E_20',
    COTECNOVA,
    UNIVERSIDAD_TIPO,
    TECNOLOGICO_NIVEL,
    'Gestión Contable',
    5,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://cotecnova.edu.co/index.php/gestion_contable/',
    2209771
  ),
  (
    'E_21',
    COTECNOVA,
    UNIVERSIDAD_TIPO,
    TECNOLOGICO_NIVEL,
    'Gestión de Sistemas de Información',
    7,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://cotecnova.edu.co/index.php/tecnologia-en-gestion-de-sistemas-de-informacion/',
    0
  ),
  (
    'E_22',
    COTECNOVA,
    UNIVERSIDAD_TIPO,
    TECNOLOGICO_NIVEL,
    'Gestión de Empresas de Salud',
    6,
    PRESENCIAL_MODALIDAD,
    SABATINA_JORNADA,
    'https://cotecnova.edu.co/index.php/tecnologia-en-gestion-de-empresas-de-salud/',
    0
  ),
  (
    'E_23',
    UNIVERSIDAD_ANTONIO_NARINO,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Administración de Empresas',
    8,
    MIXTA_MODALIDAD,
    MIXTA_JORNADA,
    'https://www.uan.edu.co/administracion-de-empresas',
    0
  ),
  (
    'E_24',
    UNIVERSIDAD_ANTONIO_NARINO,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Licenciatura en Educación Infantil',
    9,
    VIRTUAL_MODALIDAD,
    VIRTUAL_JORNADA,
    'https://www.uan.edu.co/licenciatura-en-educacion-infantil',
    0
  ),
  (
    'E_25',
    UNIVERSIDAD_ANTONIO_NARINO,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Licenciatura en Tecnología e Informatica',
    9,
    VIRTUAL_MODALIDAD,
    VIRTUAL_JORNADA,
    'https://www.uan.edu.co/licenciatura-en-tecnologia-e-informatica',
    0
  ),
  (
    'E_26',
    UNIVERSIDAD_ANTONIO_NARINO,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Trabajo Social',
    8,
    VIRTUAL_MODALIDAD,
    VIRTUAL_JORNADA,
    'https://www.uan.edu.co/trabajo-social',
    0
  ),
  (
    'E_27',
    ESAP,
    UNIVERSIDAD_TIPO,
    PREGRADO_NIVEL,
    'Administración Publica Territorial',
    9,
    PRESENCIAL_MODALIDAD,
    MIXTA_JORNADA,
    'https://www.esap.edu.co/la-esap-valle-abre-sus-inscripciones-de-pregrado-y-posgrado-para-el-periodo-2025-2/',
    0
  );

END $$;
