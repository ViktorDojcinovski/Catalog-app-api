// get rid of the CORS policy confinement for testing
const cors = require('cors');
const express = require('express');
const clientController = require('../controllers/client');
const router = express.Router();

//** CATALOG ENDPOINTS */

// /catalogs => POST
router.get('/catalogs', cors(), clientController.getCatalogs);

// /catalogs/:email => POST
router.post('/catalogs/:email', cors(), clientController.getCatalogsByPartnersEmail);

// /catalogs/category/:category => POST
router.post('/catalogs/category/:category', cors(), clientController.getCatalogsByCategory);

// /catalogs/partner/:id => POST
router.post('/catalogs/partner/:id', cors(), clientController.getCatalogsByPartnersId);

// /catalog/:catalogId => GET
router.get('/catalog/:catalogId', cors(), clientController.getCatalog);

//** PARTNER ENDPOINTS */
// /partners => GET
router.get('/partners', cors(), clientController.getPartners);

// /partner/:email => GET
router.get('/partner/:id', cors(), clientController.getPartner);

module.exports = router;
