const multer = require('multer');
const path = require('path');
const filePath = path.join(__dirname, '../public/image');


const fileFilter = (req, file, cb) => {

    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
      return cb(null, true);
    }
    cb(null, false);

    cb(new Error("An error occured"));
  };


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determine the destination folder based on the type of entity
        let destFolder;
        if (req.body.entityType === 'product') {
            destFolder = 'products';
        } else if (req.body.entityType === 'brand') {
            destFolder = 'brands';
        } else if (req.body.entityType === 'product category') {
            destFolder = 'productCategories';
        }else {
            // Default destination folder if entity type is not specified or unrecognized
            destFolder = 'uploads';
        }
        cb(null, path.join(__dirname, `../public/images/${destFolder}`));
    },
    filename: function (req, file, cb) {
        // Extract the file extension
        const ext = path.extname(file.originalname);
        // Generate a unique filename (you can use any method you prefer)
        const filename = Date.now() + Math.floor(Math.random() * 100) + ext;
        // Pass the filename to the callback function
        cb(null, filename);
    },
});


const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;