/**
 * Page model for CRUD operations on 
 * Page collection of documents
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PageSchema   = new Schema({
    id: Number,
    name: String,
    page_content: Object,
    html_elements: Object
});

module.exports = mongoose.model('Page', PageSchema);