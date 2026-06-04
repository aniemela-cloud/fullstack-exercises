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
    number: { 
        type: String,
        validate: {
            validator: function(val) {
                return /^\d{2,3}-\d+$/.test(val);
            },
            message: props => `${props.value} is not a valid phone number! Only ##-#####... or ###-#####... accepted.`
        }
    }
});

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', phonebookSchema);
