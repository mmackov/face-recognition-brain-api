const handleSignin = (db, bcrypt) => (req, res) => {
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
}

module.exports = {
    handleSignin: handleSignin
}