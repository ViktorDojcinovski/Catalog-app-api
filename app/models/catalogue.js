/**
 * Catlogue model for CRUD operations on MongoDB database
 * 
 * Collection --> Catalogues
 * Document --> Catalogue
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CatalogueSchema = new Schema({
  id: Number,
  name: String,
  type: String,
  images: Array
});

module.exports = mongoose.model('Catalogue', CatalogueSchema);
