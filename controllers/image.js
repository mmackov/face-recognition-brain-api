
const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: process.env.API_CLARIFAI
});

const handleApiCall = (req, res) => {
    if (req.body.imageUrl) {
        app.models
            .predict(Clarifai.FACE_DETECT_MODEL, req.body.imageUrl)
            .then(data => {
                res.json(data);
            })
            .catch(err => res.status(400).json('Unable to work with API - imageUrl'));
    } else if (req.body.base64) {
        let base64ImageData = req.body.base64.substring(req.body.base64.indexOf('base64') + 7);
        app.models
            .predict(Clarifai.FACE_DETECT_MODEL, {base64: base64ImageData})
            .then(data => {
                res.json(data);
            })
            .catch(err => res.status(400).json('Unable to work with API - base64'));
    } else {
        res.status(400).json('Invalid image data');
    }
}

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
    handleImage: handleImage,
    handleApiCall: handleApiCall
}