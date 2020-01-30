/**
 * Catalog mongoose model for CRUD operations on MongoDB database
 * 
 * Collection --> Catalogs
 * Document --> Catalog
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CatalogSchema = new Schema({
  name: String,
  type: String,
  startDate: Date,
  endDate: Date,
  image_folder: String,
  partnerEmail: String,
  filesNames: Array
}, {
  timestamps: true
});

module.exports = mongoose.model('Catalog', CatalogSchema);
