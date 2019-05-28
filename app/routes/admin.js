// get rid of the CORS policy confinement for testing
const cors = require('cors')

const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/catalogues => GET
router.get('/catalogues', cors(), adminController.getCatalogues);

// /admin/add-catalogue => POST
router.post('/add-catalogue', cors(), adminController.postAddCatalogue);

// /admin/edit-catalogue => GET
router.get('/edit-catalogue/:catalogueId', cors(), adminController.getEditCatalogue);

// /admin/edit-catalogue => POST
router.post('/edit-catalogue', cors(), adminController.postEditCatalogue);

// /admin/delete-catalogue => POST
router.post('/delete-catalogue', cors(), adminController.postDeleteCatalogue);

module.exports = router;
