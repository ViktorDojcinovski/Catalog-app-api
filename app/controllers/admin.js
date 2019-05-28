const Catalogue = require('../models/catalogue');

exports.postAddCatalogue = (req, res, next) => {
  const name = req.body.catalogue.name;
  const type = req.body.catalogue.type;
  const images = req.body.catalogue.images;
  const catalogue = new Catalogue({
    name: name,
    type: type,
    images: images
  });
  catalogue
    .save()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditCatalogue = (req, res, next) => {
  const catalogueId = req.params.catalogueId;
  Catalogue.findById(catalogueId)
    .then(catalogue => {
      res.json(catalogue);
    })
    .catch(err => console.log(err));
};

exports.postEditCatalogue = (req, res, next) => {
  const catalogueId = req.body.catalogue.catalogueId;
  const updatedName = req.body.catalogue.name;
  const updatedType = req.body.catalogue.type;
  const updatedImages = req.body.catalogue.images;

  Catalogue.findById(catalogueId)
    .then(catalogue => {
      catalogue.name = updatedName;
      catalogue.type = updatedType;
      catalogue.images = updatedImages;
      return catalogue.save();
    })
    .then(result => {
      console.log('UPDATED CATALOGUE!');
      res.json(result);
    })
    .catch(err => console.log(err));
};

exports.getCatalogues = (req, res, next) => {
  Catalogue.find()
    .then(catalogues => {
      res.json(catalogues);
    })
    .catch(err => {
      console.log(err)
    });
};

exports.postDeleteCatalogue = (req, res, next) => {
  const catalogueId = req.body.catalogueId;
  Catalogue.findByIdAndRemove(catalogueId)
    .then(() => {
      Catalogue.find()
        .then(catalogues => {
          res.json(catalogues);
        })
    })
    .catch(err => console.log(err));
};
