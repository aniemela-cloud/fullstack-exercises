const mongoose = require('mongoose');

const connectionUrl = process.env.MONGODB_URI;

console.log('connecting to', connectionUrl);

mongoose.connect(connectionUrl, { family: 4 })
.then(result => {
    console.log('connected to MongoDB');
}).catch(error => {
    console.log('error connecting to MongoDB:', error.message);
});

mongoose.set('strictQuery', false);

const phonebookSchema = new mongoose.Schema({
    name: { 
        type: String,
        minLength: 5,
        required: true,
    },
    number: String,  
});

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', phonebookSchema);
/*
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
    */