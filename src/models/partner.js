/**
 * Partner mongoose model for CRUD operations on MongoDB database
 * 
 * Collection --> Partners
 * Document --> Partner
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PartnerSchema = new Schema({
  name: String,
  avatar: String,
  prefferedName: String,
  email: String,
  bussinessType: String,
  description: String,
  fb: String,
  twitter: String,
  website: String,
  customAvatar: String,
  catalogs: [{ type: Schema.Types.ObjectId, ref: 'Catalog' }]
});

module.exports = mongoose.model('Partner', PartnerSchema);
