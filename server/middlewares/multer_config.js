const multer = require("multer");
// const moment = require("moment");

function multerConf(type) {
//   console.log('came to multer',type)
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        // console.log(req.body.folderName,'sdsdfs')
        cb(null, "public/uploads/");
      },
      
      
      filename: function (req, file, cb) {
        console.log('rfile,',file);

        cb(null, `l_${file.originalname}`);
      },
    });

    const upload = multer({
      storage: storage,
    
    });
    return upload;
  } 


module.exports = multerConf;
