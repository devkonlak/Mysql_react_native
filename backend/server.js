const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
const port = 3000;
const SECRET_KEY = 'konlak';

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Kong@rasu07',
  database: 'React_n',
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

app.post('/signup', (req, res) => {
  const {email, password} = req.body;

  db.query(
    'SELECT email FROM users WHERE email = ?',
    [email],
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        return res.status(400).send('Email already exists.');
      }

      const hashedPassword = bcrypt.hashSync(password, 8);

      db.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        (err, result) => {
          if (err) throw err;
          res.status(201).send('User registered successfully.');
        },
      );
    },
  );
});

app.post('/login', (req, res) => {
  const {email, password} = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(400).send('Email or password is incorrect.');
    }

    const user = result[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(400).send('Email or password is incorrect.');
    }

    const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: 86400});

    res.status(200).send({auth: true, token: token});
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
