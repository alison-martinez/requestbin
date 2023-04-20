const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    minlength: 5
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  headers: String,
  body: String,
});

requestSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('Request', requestSchema);