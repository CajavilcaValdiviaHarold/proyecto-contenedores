const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let pool;

async function conectar() {
  pool = mysql.createPool(config);
  await pool.query(
    'CREATE TABLE IF NOT EXISTS tareas (id INT AUTO_INCREMENT PRIMARY KEY, titulo VARCHAR(255) NOT NULL)'
  );
}

app.get('/health', (req, res) => res.json({ estado: 'ok' }));

app.get('/tareas', async (req, res) => {
  const [filas] = await pool.query('SELECT * FROM tareas');
  res.json(filas);
});

app.post('/tareas', async (req, res) => {
  const [resultado] = await pool.query('INSERT INTO tareas (titulo) VALUES (?)', [req.body.titulo]);
  res.status(201).json({ id: resultado.insertId, titulo: req.body.titulo });
});

const intentar = async () => {
  try {
    await conectar();
    app.listen(3000, () => console.log('API lista en el puerto 3000'));
  } catch (e) {
    console.log('Esperando a la base de datos...');
    setTimeout(intentar, 3000);
  }
};

intentar();