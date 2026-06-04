const mongoose = require('mongoose');

if (process.argv.length < 3 || process.argv.length == 4) {
    console.log('Usage: node mongo.js <password> [<name> <number>]');
} 

let mongoPassword = process.argv[2];
if (mongoPassword === '-') {
    mongoPassword = process.env.MONGO_ATLAS_PASSWORD;
}
const connectionUrl = `mongodb+srv://aniemela_db_user:${mongoPassword}@fullstack-c.7rpffbo.mongodb.net/phonebookApp?appName=fullstack-c`;
mongoose.connect(connectionUrl, { family: 4 });
mongoose.set('strictQuery', false);

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,  
});
const Entry = mongoose.model('Entry', phonebookSchema);
if (process.argv.length >= 5) {
    const entryName = process.argv[3];
    const entryNumber = process.argv[4];
    const newEntry = new Entry({
        name: entryName,
        number: entryNumber,
    });
    newEntry.save().then(result => {
        console.log(`Added ${entryName} number ${entryNumber} to phonebook.`);
    }).catch(error => {
        console.log('Error saving new phonebook entry: ',error);
    }).finally(() => mongoose.connection.close());
} else {
    // fetch all entries
    Entry.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(entry => {
            console.log(`${entry.name} ${entry.number}`);
        })
    }).catch(error => {
        console.log('Error fetching phonebook entries: ',error);
    }).finally(() => mongoose.connection.close());

}