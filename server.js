const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : 'Mryo48dra',
        database : 'face-recognition-brain'
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res)=> {
    res.json('Success');
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(login => {
            if (bcrypt.compareSync(req.body.password, login[0].hash)) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('Unable to get user'));
            } else {
                res.status(400).json('Wrong credentials');
            }
        })
        .catch(err => res.status(400).json('Wrong credentials'));
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        db.transaction(trx => {
            trx('login').insert({
                hash: hash,
                email: email
            })
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .insert({
                    name: name,
                    email: loginEmail[0],
                    joined: new Date()
                })
                .returning('*')
                .then(users => {
                    res.json(users[0]);
                })
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .catch(err => res.status(400).json('Unable to register'));
    });
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(404).json('User not found');
        }
    })
    .catch(err => res.status(400).json('Error getting user'));
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where({id})
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        if (entries[0]) {
            res.json(entries[0]);
        } else {
            res.status(404).json('User not found');
        }
    })
    .catch(err => res.status(404).json('User not found'));
})

app.listen(3000, () => {
    console.log('App is running on port 3000');
})
 
/*
/ --> res = Root endpoint is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user
*/