var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactSchema = new Schema({
    subject: {type: String, required: true},
    body: {type: String, required: true},
});
module.exports = mongoose.model('contact', ContactSchema);