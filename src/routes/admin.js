// get rid of the CORS policy confinement for testing
const cors = require('cors');
const multer = require('multer')
const express = require('express');

const adminController = require('../controllers/admin');

const upload = multer();
const adminRouter = express.Router();

//** CATALOG ENDPOINTS */

// /admin/getCatalogs => POST
adminRouter.post('/getCatalogs', adminController.getCatalogs);

// /admin/saveCatalog => POST
adminRouter.post('/saveCatalog', upload.array('files'), adminController.saveCatalog);

// /admin/updateCatalog => PUT
adminRouter.put('/updateCatalog', upload.array('files'), adminController.updateCatalog);

// /admin/deleteCatalog => POST
adminRouter.post('/deleteCatalog', adminController.deleteCatalog);

// /catalog/:catalogId => GET
//adminRouter.get('/catalog/:catalogId', cors(), adminController.getCatalog);

//** PARTNER ENDPOINTS */

// /admin/getpartner => POST
adminRouter.post('/getPartner/:email', upload.single('customAvatar'), adminController.getPartner);

// /admin/updatePartner => PUT
adminRouter.put('/updatePartner', upload.single('customAvatar'), adminController.updatePartner);

module.exports = adminRouter;
