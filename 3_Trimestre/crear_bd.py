import sqlite3

conn = sqlite3.connect("3_Trimestre/crm.db")
c = conn.cursor()

c.execute("""CREATE TABLE IF NOT EXISTS comerciales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    zona TEXT,
    fecha_alta TEXT
)""")

c.execute("""CREATE TABLE IF NOT EXISTS clientes_potenciales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    empresa TEXT,
    telefono TEXT,
    email TEXT,
    fuente TEXT,
    estado TEXT,
    fecha_contacto TEXT,
    id_comercial INTEGER REFERENCES comerciales(id)
)""")

c.execute("""CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT,
    razon_social TEXT NOT NULL,
    nif TEXT,
    direccion TEXT,
    contacto TEXT,
    telefono TEXT,
    email TEXT,
    condiciones_pago TEXT,
    descuento REAL DEFAULT 0,
    estado TEXT DEFAULT 'activo'
)""")

c.execute("""CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    id_cliente INTEGER REFERENCES clientes(id),
    id_comercial INTEGER REFERENCES comerciales(id),
    estado TEXT,
    base_imponible REAL,
    iva REAL DEFAULT 21,
    total REAL
)""")

c.execute("""CREATE TABLE IF NOT EXISTS facturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT,
    fecha_emision TEXT,
    fecha_vencimiento TEXT,
    id_cliente INTEGER REFERENCES clientes(id),
    id_pedido INTEGER REFERENCES pedidos(id),
    base_imponible REAL,
    iva REAL DEFAULT 21,
    total REAL,
    estado TEXT
)""")

comerciales_data = [
    ("Ana","García López","ana.garcia@crmxtart.es","600111001","Madrid","2024-01-10"),
    ("Carlos","Martínez Ruiz","carlos.martinez@crmxtart.es","600111002","Barcelona","2024-02-15"),
    ("Lucía","Fernández Mora","lucia.fernandez@crmxtart.es","600111003","Valencia","2024-03-01"),
    ("Javier","López Sanz","javier.lopez@crmxtart.es","600111004","Sevilla","2024-04-20"),
    ("Marta","Sánchez Gil","marta.sanchez@crmxtart.es","600111005","Bilbao","2024-05-05"),
]
c.executemany("INSERT INTO comerciales (nombre,apellidos,email,telefono,zona,fecha_alta) VALUES (?,?,?,?,?,?)", comerciales_data)

potenciales_data = [
    ("Pedro Alonso","TechSoluciones SL","620001001","pedro@techsol.es","Web","nuevo","2025-01-05",1),
    ("María Vega","DataCore SA","620001002","mvega@datacore.es","Referido","en seguimiento","2025-01-20",1),
    ("Roberto Díaz","InnoTech SL","620001003","rdiaz@innotech.es","Feria","nuevo","2025-02-10",2),
    ("Elena Ruiz","CloudBase SL","620001004","eruiz@cloudbase.es","Web","convertido","2025-02-15",2),
    ("Francisco Mora","NetPro SA","620001005","fmora@netpro.es","Llamada","perdido","2025-03-01",3),
    ("Silvia Torres","DataVision SL","620001006","storres@datavision.es","Web","nuevo","2025-03-10",3),
    ("Andrés Castro","CiberTech SL","620001007","acastro@cibertech.es","Referido","en seguimiento","2025-03-20",4),
    ("Carmen Navarro","Soluciones IT SA","620001008","cnavarro@solit.es","Feria","nuevo","2025-04-01",4),
    ("Diego Herrera","TechHub SL","620001009","dherrera@techhub.es","Web","en seguimiento","2025-04-15",5),
    ("Laura Serrano","CodeBase SL","620001010","lserrano@codebase.es","Referido","convertido","2025-04-20",5),
]
c.executemany("INSERT INTO clientes_potenciales (nombre,empresa,telefono,email,fuente,estado,fecha_contacto,id_comercial) VALUES (?,?,?,?,?,?,?,?)", potenciales_data)

clientes_data = [
    ("CLI001","TechSoluciones SL","B12345678","Calle Mayor 1, Madrid","Pedro Alonso","910001001","pedro@techsol.es","30 días",5,"activo"),
    ("CLI002","DataCore SA","B23456789","Av. Diagonal 200, Barcelona","María Vega","930002002","mvega@datacore.es","60 días",10,"activo"),
    ("CLI003","InnoTech SL","B34567890","Gran Vía 50, Madrid","Roberto Díaz","910003003","rdiaz@innotech.es","contado",0,"activo"),
    ("CLI004","CloudBase SL","B45678901","Calle Colón 10, Valencia","Elena Ruiz","960004004","eruiz@cloudbase.es","90 días",15,"activo"),
    ("CLI005","NetPro SA","B56789012","Calle Sierpes 5, Sevilla","Francisco Mora","954005005","fmora@netpro.es","30 días",5,"inactivo"),
    ("CLI006","DataVision SL","B67890123","Av. Libertad 20, Bilbao","Silvia Torres","944006006","storres@datavision.es","contado",0,"activo"),
    ("CLI007","CiberTech SL","B78901234","Calle Real 100, Zaragoza","Andrés Castro","976007007","acastro@cibertech.es","30 días",8,"activo"),
    ("CLI008","Soluciones IT SA","B89012345","Paseo Gracia 80, Barcelona","Carmen Navarro","932008008","cnavarro@solit.es","60 días",12,"activo"),
    ("CLI009","TechHub SL","B90123456","Calle Luna 15, Madrid","Diego Herrera","915009009","dherrera@techhub.es","contado",0,"activo"),
    ("CLI010","CodeBase SL","B01234567","Av. Norte 30, Málaga","Laura Serrano","952010010","lserrano@codebase.es","30 días",5,"activo"),
    ("CLI011","SoftGroup SA","A11223344","Calle Sur 5, Alicante","Juan Blanco","965011011","jblanco@softgroup.es","60 días",10,"activo"),
    ("CLI012","PixelPro SL","B22334455","Rambla 200, Barcelona","Ana Cortés","933012012","acortes@pixelpro.es","contado",0,"activo"),
    ("CLI013","WebServices SA","A33445566","Calle Este 10, Murcia","Pablo Vidal","968013013","pvidal@webservices.es","90 días",15,"inactivo"),
    ("CLI014","AlphaTech SL","B44556677","Av. Oeste 40, Valladolid","Rosa Méndez","983014014","rmendez@alphatech.es","30 días",5,"activo"),
    ("CLI015","BetaSoft SA","A55667788","Calle Centro 3, Santander","Tomás Prats","942015015","tprats@betasoft.es","contado",0,"activo"),
]
c.executemany("INSERT INTO clientes (codigo,razon_social,nif,direccion,contacto,telefono,email,condiciones_pago,descuento,estado) VALUES (?,?,?,?,?,?,?,?,?,?)", clientes_data)

pedidos_data = [
    ("2025-01-15",1,1,"servido",1200.00,21,1452.00),
    ("2025-01-20",2,1,"servido",800.00,21,968.00),
    ("2025-02-01",3,2,"en curso",2500.00,21,3025.00),
    ("2025-02-10",4,2,"pendiente",600.00,21,726.00),
    ("2025-02-15",5,3,"anulado",300.00,21,363.00),
    ("2025-03-01",6,3,"servido",1800.00,21,2178.00),
    ("2025-03-10",7,4,"en curso",950.00,21,1149.50),
    ("2025-03-20",8,4,"servido",2200.00,21,2662.00),
    ("2025-04-01",9,5,"pendiente",1100.00,21,1331.00),
    ("2025-04-10",10,5,"servido",3000.00,21,3630.00),
    ("2025-04-15",1,1,"servido",500.00,21,605.00),
    ("2025-04-20",2,2,"en curso",1600.00,21,1936.00),
    ("2025-05-01",3,3,"pendiente",750.00,21,907.50),
    ("2025-05-10",4,4,"servido",2800.00,21,3388.00),
    ("2025-05-15",5,5,"servido",1300.00,21,1573.00),
    ("2025-05-20",6,1,"pendiente",900.00,21,1089.00),
    ("2025-06-01",7,2,"en curso",2100.00,21,2541.00),
    ("2025-06-10",8,3,"servido",1700.00,21,2057.00),
    ("2025-06-20",9,4,"pendiente",400.00,21,484.00),
    ("2025-07-01",10,5,"en curso",3500.00,21,4235.00),
]
c.executemany("INSERT INTO pedidos (fecha,id_cliente,id_comercial,estado,base_imponible,iva,total) VALUES (?,?,?,?,?,?,?)", pedidos_data)

facturas_data = [
    ("FAC2025-001","2025-01-16","2025-02-16",1,1,1200.00,21,1452.00,"cobrada"),
    ("FAC2025-002","2025-01-21","2025-02-21",2,2,800.00,21,968.00,"cobrada"),
    ("FAC2025-003","2025-03-02","2025-04-01",6,6,1800.00,21,2178.00,"cobrada"),
    ("FAC2025-004","2025-03-21","2025-04-20",8,8,2200.00,21,2662.00,"cobrada"),
    ("FAC2025-005","2025-04-11","2025-05-11",10,10,3000.00,21,3630.00,"pendiente"),
    ("FAC2025-006","2025-04-16","2025-05-16",1,11,500.00,21,605.00,"pendiente"),
    ("FAC2025-007","2025-05-11","2025-06-10",4,14,2800.00,21,3388.00,"pendiente"),
    ("FAC2025-008","2025-05-16","2025-06-15",5,15,1300.00,21,1573.00,"vencida"),
    ("FAC2025-009","2025-06-11","2025-07-11",8,18,1700.00,21,2057.00,"vencida"),
    ("FAC2025-010","2025-01-15","2025-01-20",1,1,600.00,21,726.00,"anulada"),
]
c.executemany("INSERT INTO facturas (numero,fecha_emision,fecha_vencimiento,id_cliente,id_pedido,base_imponible,iva,total,estado) VALUES (?,?,?,?,?,?,?,?,?)", facturas_data)

conn.commit()
conn.close()
print("Base de datos crm.db creada con todos los datos.")