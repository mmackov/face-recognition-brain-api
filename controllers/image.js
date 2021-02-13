const handleImage = (db) => (req, res) => {
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
}

module.exports = {
    handleImage: handleImage
}