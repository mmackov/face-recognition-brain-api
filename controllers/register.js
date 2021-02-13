const handleRegister = (db, bcrypt) => (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json('Incorrect form submission');
    }
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
}

module.exports = {
    handleRegister: handleRegister
}