const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    maxId: 2,
    users: [
        {
            id: '1',
            name: 'John',
            email: 'john@gmail.com',
            // password: 'apples'
            password: '$2a$10$EZd3mJF0mq4qiUFgIExgHOSKjm3HfvfQbp4zqBvr0R5S7bjyUMg0m',
            entries: 0,
            joined: new Date()
        },
        {
            id: '2',
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
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                entries: user.entries,
                joined: user.joined
            });
        }
    });
    res.status(400).json('Error logging in'); 
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        database.maxId++;
        const maxIdString = database.maxId.toString();
        database.users.push ({
            id: maxIdString,
            name: name,
            email: email,
            password: hash,
            entries: 0,
            joined: new Date()
         })
        const registeredUser = database.users.find(user => user.id === maxIdString);
        res.json({
            id: registeredUser.id,
            name: registeredUser.name,
            email: registeredUser.email,
            entries: registeredUser.entries,
            joined: registeredUser.joined
        });
    });
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

app.put('/image', (req, res) => {
    const { id } = req.body;
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