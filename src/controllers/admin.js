/**
 * Modules used in this controller:
 *
 * Filesystem module (fs).
 * Path module (path) - find more https://nodejs.org/api/path.html
 * Delete file inside folder (del), skip tedious recursive things, permissions and so on,
 * and just go to the file, and delete it - find more https://www.npmjs.com/package/del
 * Modify file permision with chmodr (chmodr)
 */

const fs = require("fs"),
  path = require("path"),
  del = require("del"),
  chmodr = require("chmodr");

// Import mongoose models!
const Catalog = require("../models/catalog");
const Partner = require("../models/partner");

/** Get all Catalogs that belong to the partner with the email from the body from the MongoDB,
 * respond to /admin/getCatalogs => POST REST API endpoint
 *
 * @returns {json} JSON representation from the Catalogs list
 */
exports.getCatalogs = (req, res, next) => {
  const partnerEmail = req.body.partnerEmail;

  Catalog.find({ partnerEmail: partnerEmail })
    .then((catalogs) => {
      res.json(catalogs);
    })
    .catch((err) => {
      console.log(err);
    });
};

/** Create Catalog entry in the MongoDB,
 *  respond to /admin/saveCatalog => POST REST API endpoint
 *
 * @returns {json} JSON representation from the Catalog entry
 */
exports.saveCatalog = async (req, res, next) => {
  // Convert request data into variables
  const name = req.body.name,
    type = req.body.type,
    startDate = req.body.startDate,
    endDate = req.body.endDate,
    partnerEmail = req.body.partnerEmail,
    files = req.files;

  // Convert uploaded images folder into web-safe name
  const image_folder = convertToWebSafeName(name);

  // Newly created path that contains the web-safe name of the image folder
  // for the images to be uploaded into
  let newPath = "";

  // Names of the uploaded files go into this array
  // ...important for the sequence of showing the images
  const filesNames = [];

  // Keep the created path into variable for memory optimization and readability
  const dir = `./assets/catalogs/${image_folder}`;

  // In the process of Filesystem manipulation
  // keep up with the synchronious flow of events

  try {
    //It is a good practice to check if already the folder exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    } else {
      res.status(403);
      return res.json({
        message: "A catalog with the same name already exists!",
      });
    }

    if (fs.existsSync(dir)) {
      try {
        // Create images folder inside the newly created folder
        const images_folder = `${dir}/images`;
        fs.mkdirSync(images_folder);

        newPath = images_folder;

        // There will be times when the folder will have some other permissions
        // ...stick to the good practice to always adjust the permissions
        chmodr(dir, 0o777, (err) => {
          if (err) {
            console.log("Failed to execute chmod", err);
          } else {
            console.log("Success");
          }
        });

        // Write uploaded files in the newly created path
        files.forEach((file) => {
          try {
            fs.writeFile(
              `${newPath}/${file.originalname}`,
              file.buffer,
              "binary",
              function (err) {
                if (err) {
                  console.log("Error writing file..." + err);
                }
              }
            );
          } catch (err) {
            console.error(err);
          }
          filesNames.push({ image: file.originalname });
        });

        // Always create new Catalog only after the images
        // are successfully! saved to the resource server
        const catalog = new Catalog({
          name,
          type,
          startDate,
          endDate,
          image_folder,
          partnerEmail,
          filesNames,
        });
        catalog
          .save()
          .then((result) => {
            // Return JSON representation of the newly created Catalog
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

/** Update Caatalogue entry in the MongoDB,
 *  respond to /admin/updateCatalog => PUT REST API endpoint
 *
 * @returns {json} JSON representation from the Catalog entry
 */
exports.updateCatalog = (req, res, next) => {
  // Convert request data into variables
  const updatedName = req.body.name,
    oldName = req.body.oldName,
    updatedType = req.body.type,
    updatedStartDate = req.body.startDate,
    updatedEndDate = req.body.endDate,
    updatedFiles = req.files,
    // ...for the purpose of updating a Catalog, the uid is also needed
    catalogId = req.body.catalogId;

  // Use the Catalog UID to find the Catalog
  Catalog.findById(catalogId).then((catalog) => {
    // Convert uploaded images folder into web-safe name
    const image_folder = convertToWebSafeName(updatedName);
    const old_image_folder = convertToWebSafeName(oldName);

    // Names of the uploaded files go into this array
    // ...important for the sequence of showing the images
    const filesNames = [];

    const dir = `./assets/catalogs/${image_folder}/images`;

    // Delete old catalog folder
    del.sync([`./assets/catalogs/${old_image_folder}`]);

    // In the process of Filesystem manipulation
    // keep up with the synchronious flow of events
    try {
      fs.mkdirSync(`./assets/catalogs/${image_folder}`);
      fs.mkdirSync(`./assets/catalogs/${image_folder}/images`);

      // There will be times when the folder will have some other permissions
      // ...stick to the good practice to always adjust the permissions
      chmodr(dir, 0o777, (err) => {
        if (err) console.log("Failed to execute chmod", err);
        else console.log("Success");
      });

      // Write uploaded files in the newly created path
      updatedFiles.forEach((file) => {
        try {
          fs.writeFile(
            `${dir}/${file.originalname}`,
            file.buffer,
            "binary",
            function (err) {
              if (err) {
                console.log("Error writing file..." + err);
              }
            }
          );
        } catch (err) {
          console.error(err);
        }
        filesNames.push({ image: file.originalname });
      });
    } catch (err) {
      console.log(err);
    }

    // Assign new values to the Catalog instance
    catalog.name = updatedName;
    catalog.type = updatedType;
    catalog.startDate = updatedStartDate;
    catalog.endDate = updatedEndDate;
    catalog.image_folder = image_folder;
    catalog.filesNames = filesNames;

    catalog
      .save()
      .then((result) => {
        // Return JSON representation of the newly created Catalog
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

/** Delete Caatalogue entry in the MongoDB,
 * ...respond to /admin/deleteCatalog => POST REST API endpoint
 *
 * @returns {json} JSON representation from the Catalog entry
 */
exports.deleteCatalog = (req, res, next) => {
  const catalogId = req.body.catalogId;

  Catalog.findByIdAndRemove(catalogId)
    .then((catalog) => {
      del([`./assets/catalogs/${catalog.image_folder}`]);
      Catalog.find().then((catalogs) => res.json(catalogs));
    })
    .catch((err) => console.log(err));
};

/** Get all Users that have signed in from the MongoDB,
 * respond to /admin/getUsers => GET REST API endpoint
 *
 * @returns {json} JSON representation from the Users list
 */
exports.getPartners = (req, res, next) => {
  Partner.find({})
    .then((partners) => {
      console.log(partners);
      res.json(partners);
    })
    .catch((err) => {
      console.log(err);
    });
};

/** Get Partner entry from the MongoDB,
 *  respond to /admin/getPartner => GET REST API endpoint
 *
 * @returns {json} JSON representation from the Partner entry
 */
exports.getPartner = (req, res, next) => {
  const name = req.body.name,
    avatar = req.body.avatar,
    prefferedName = req.body.prefferedName,
    email = req.body.email,
    bussinessType = req.body.bussinessType,
    description = req.body.description,
    fb = req.body.fb,
    twitter = req.body.twitter,
    website = req.body.website,
    customAvatar = "",
    securityCode = "viko1982";

  Partner.findOne({ email: email })
    .then((partner) => {
      if (partner) {
        console.log(partner);
        res.json({
          catalogs: partner.catalogs,
          _id: partner._id,
          name: partner.name,
          avatar: partner.avatar,
          prefferedName: partner.prefferedName,
          bussinessType: partner.bussinessType,
          email: partner.email,
          description: partner.description,
          fb: partner.fb,
          twitter: partner.twitter,
          website: partner.website,
          customAvatar: partner.customAvatar,
        });
      } else {
        // Create new Partner
        const partner = new Partner({
          name,
          avatar,
          prefferedName,
          bussinessType,
          email,
          description,
          fb,
          twitter,
          website,
          customAvatar,
          securityCode,
        });
        partner
          .save()
          .then((result) => {
            console.log(result);
            // Return JSON representation of the newly created Catalog
            res.json({
              name: res.name,
              avatar: res.avatar,
              prefferedName: res.prefferedName,
              bussinessType: res.bussinessType,
              email: res.email,
              description: res.description,
              fb: res.fb,
              twitter: res.twitter,
              website: res.website,
              customAvatar: res.customAvatar,
            });
          })
          .catch((err) => {
            console.log(err);
          });

        res.json(partner);
      }
    })
    .catch((err) => console.log(err));
};

/** Update Partner entry in the MongoDB,
 *  respond to /admin/updatePartner => PUT REST API endpoint
 *
 * @returns {json} JSON representation from the Partner entry
 */
exports.updatePartner = async (req, res, next) => {
  // Convert request data into variables
  const updatedPrefferedName = req.body.prefferedName,
    updatedAvatar = req.body.avatar,
    updatedEmail = req.body.email,
    updatedType = req.body.bussinessType,
    updatedDescription = req.body.description,
    updatedFb = req.body.fb,
    updatedTwitter = req.body.twitter,
    updatedWebsite = req.body.website,
    updatedCustomAvatar = req.file;

  try {
    const dir = `./assets/uploads/avatars`;

    if (updatedCustomAvatar) {
      fs.writeFileSync(
        `${dir}/${updatedCustomAvatar.originalname}`,
        updatedCustomAvatar.buffer,
        "binary",
        function (err) {
          if (err) console.log("Error writing file..." + err);
        }
      );
    }
  } catch (err) {
    console.error(err);
  }

  // Use the Catalog UID to find the Catalog
  Partner.findOne({ email: updatedEmail }).then((partner) => {
    partner.avatar = updatedAvatar;
    partner.prefferedName = updatedPrefferedName;
    partner.bussinessType = updatedType;
    partner.description = updatedDescription;
    partner.fb = updatedFb;
    partner.twitter = updatedTwitter;
    partner.website = updatedWebsite;

    if (updatedCustomAvatar) {
      partner.customAvatar = updatedCustomAvatar.originalname;
    }

    partner
      .save()
      .then((result) => {
        // Return JSON representation of the updated Partner
        res.json({ message: "Profile successfully updated." });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.changePartnerState = (req, res, next) => {
  const id = req.body.id;
  const updatedState = req.body.isEnabled;

  Partner.findById(id).then((partner) => {
    partner.isEnabled = updatedState;

    partner
      .save()
      .then((partner) => {
        res.json(partner);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.checkEnabledUser = (req, res, next) => {
  const email = req.body.email;

  Partner.findOne({ email: email }).then((partner) => {
    if (partner.isEnabled) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
};

exports.checkSuperadmin = (req, res, next) => {
  const email = req.body.email;

  Partner.findOne({ email: email }).then((partner) => {
    console.log(partner.isSuperadmin);
    if (partner.isSuperadmin) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
};

exports.checkSecurityCode = (req, res, next) => {
  // Convert request data into variables
  const securityCode = req.body.securityCode;
  const email = req.body.partner;

  if (securityCode === "viko1982") {
    res.status(200);

    return res.json({ message: "Security code confirmed!" });
  } else {
    // Use the Catalog UID to find the Catalog
    Partner.findOne({ email: email }).then((partner) => {
      if (partner.securityCode === securityCode) {
        res.status(200);

        return res.json({ message: "Security code confirmed!" });
      } else {
        res.status(401);

        return res.json({ message: "Invalid security code!" });
      }
    });
  }
};

// Utils

// Convert uploaded images folder into web-safe name
// ...replace empty space, or any special caracter into underscore
// ...always convert the case into lower case, for consistency
const convertToWebSafeName = (name) =>
  name.replace(/[^A-Z0-9]+/gi, "_").toLowerCase();
