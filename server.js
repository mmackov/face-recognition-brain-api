const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');

const app = express();
app.use(bodyParser.json());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            // password: 'apples'
            password: '$2a$10$EZd3mJF0mq4qiUFgIExgHOSKjm3HfvfQbp4zqBvr0R5S7bjyUMg0m',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            // password: 'bananas'
            password: '$2a$10$VDdX90inqOG644.VEVx8VOp/agvrM0p4bg/tfhyk.Lo/UqAka3r8G',
            entries: 0,
            joined: new Date()
        },
    ]
}

app.get('/', (req, res)=> {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    database.users.forEach(user => {
        if (req.body.email === user.email &&
                bcrypt.compareSync(req.body.password, user.password)) {
            res.json('Success');
        }
    });
    res.status(400).json('Error logging in'); 
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
        database.users.push ({
            id: '125',
            name: name,
            email: email,
            password: hash,
            entries: 0,
            joined: new Date()
         })
    });
    res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    database.users.forEach(user => {
        if (user.id === id) {
            return res.json(user);
        }
    })
    res.status(404).json('User not found');
})

app.put('/image/:id', (req, res) => {
    const { id } = req.params;
    database.users.forEach(user => {
        if (user.id === id) {
            return res.json(++user.entries);
        }
    })
    res.status(404).json('User not found');
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