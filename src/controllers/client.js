const Catalog = require('../models/catalog');
const Partner = require('../models/partner');

/** Get single Catalog entry from the MongoDB, 
 * respond to /catalog/:catalogId => GET REST API endpoint
 *
 * @returns {json} JSON representation from the Catalog entry
 */
exports.getCatalog = (req, res, next) => {
  const catalogId = req.params.catalogId;
  Catalog.findOne({ _id: catalogId })
    .then(catalog => {
      res.json(catalog);
    })
    .catch(err => console.log(err));
};

/** Get all Catalogs from the MongoDB, 
 * respond to /catalogs => GET REST API endpoint
 *
 * @returns {json} JSON representation from the Catalogs list
 */
exports.getCatalogs = (req, res, next) => {
  Catalog.find().sort({ updatedAt: 'desc' })
    .then(catalogs => {
      res.json(catalogs);
    })
    .catch(err => {
      console.log(err)
    });
};

/** Get all Catalogs where email is the requested email from the MongoDB, 
 * respond to /catalogs/:email => POST REST API endpoint
 *
 * @returns {json} JSON representation from the Catalogs list
 */
exports.getCatalogsByPartnersEmail = (req, res, next) => {
  const email = req.body.email;

  Catalog.find({ partnerEmail: email })
    .then(catalogs => {
      res.json(catalogs);
    })
    .catch(err => {
      console.log(err)
    });
};

/** Get all Catalogs where id is the requested id from the MongoDB, 
 * respond to /catalogs/:email => POST REST API endpoint
 *
 * @returns {json} JSON representation from the Catalogs list
 */
exports.getCatalogsByPartnersId = (req, res, next) => {
  const id = req.body.id;

  Partner.findById(id).then(partner => {
    const partnerEmail = partner.email;

    Catalog.find({ partnerEmail: partnerEmail })
      .then(catalogs => {
        res.json(catalogs);
      })
      .catch(err => {
        console.log(err)
      });

  })

};

/** Get all Catalogs where ctaegory is the requested category from the MongoDB, 
 * respond to /catalogs/category/:category => POST REST API endpoint
 *
 * @returns {json} JSON representation from the Catalogs list
 */
exports.getCatalogsByCategory = (req, res, next) => {
  const category = req.body.category;

  console.log(category);

  Catalog.find({ type: category })
    .then(catalogs => {
      res.json(catalogs);
    })
    .catch(err => {
      console.log(err)
    });
};

/** Get single Partner entry from the MongoDB, 
 * respond to /partner/:id => GET REST API endpoint
 *
 * @returns {json} JSON representation from the Partner entry
 */
exports.getPartner = (req, res, next) => {
  const id = req.params.id;
  Partner.findById(id)
    .then(partner => {
      res.json(partner);
    })
    .catch(err => console.log(err));
};

/** Get all Partners from the MongoDB, 
 * respond to /partners => GET REST API endpoint
 *
 * @returns {json} JSON representation from the Partners list
 */
exports.getPartners = (req, res, next) => {
  Partner.find()
    .then(partners => {
      res.json(partners);
    })
    .catch(err => {
      console.log(err)
    });
};
