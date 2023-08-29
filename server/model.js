const mongoose = require('mongoose');

const MONGO_URI =
    'DB_URI';

mongoose
    .connect(MONGO_URI, {
        // options for the connect method to parse the URI
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // sets the name of the DB that our collections are part of
        dbName: 'quil_app'
    })
    .then(() => console.log('Connected to Mongo DB.'))
    .catch((err) => console.log(err));

const Schema = mongoose.Schema;

const entrySchema = new Schema({
    date: Date,
    body: String
});

const Entry = mongoose.model('entry', entrySchema);

module.exports = { Entry };
