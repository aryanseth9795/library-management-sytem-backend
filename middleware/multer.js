const multer=require("multer")
const storage=multer.memoryStorage();
exports.singleupload= multer({ storage,limits:{fieldSize: 25 * 1024 * 1024} }).single('avatar');
exports.Multipleupload= multer({storage,limits:{fieldSize: 75 * 1024 * 1024}}).array('images',5);

