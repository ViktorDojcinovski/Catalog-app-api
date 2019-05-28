// get rid of the CORS policy confinement for testing
const cors = require('cors')

const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/pages => GET
router.get('/pages', cors(), adminController.getPages);

// /admin/add-page => POST
router.post('/add-page', cors(), adminController.postAddPage);

// /admin/edit-page => GET
router.get('/edit-page/:pageId', cors(), adminController.getEditPage);

// /admin/edit-page => POST
router.post('/edit-page', cors(), adminController.postEditPage);

// /admin/delete-page => POST
router.post('/delete-page', cors(), adminController.postDeletePage);

module.exports = router;