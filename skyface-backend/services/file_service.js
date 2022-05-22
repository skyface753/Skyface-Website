const FileModel = require("../models/file_model");
const UserModel = require("../models/user_model");

let FileService = {
  uploadFile: async (req, res) => {
    console.log("uploadFile");
    console.log(req.body);
    console.log(req.file);
    if (!req.file) {
      res.status(400).json({
        message: "No file provided",
      });
      return;
    }
    let file = new FileModel({
      original_name: req.file.originalname,
      generated_name: req.file.filename,
      type: req.file.mimetype,
      uploaded_by: req.user._id,
    });
    await file.save();
    res.status(200).json({
      success: true,
      message: "File uploaded",
      file: file,
    });
  },
  getAllFiles: async (req, res) => {
    console.log("getAllFiles");
    let files = await FileModel.find({});
    res.status(200).json({
      success: true,
      message: "Files fetched",
      files: files,
    });
  },
  getAllFilesByType: async (req, res) => {
    console.log("getAllFilesByType");
    let files = await FileModel.find({
      type: { $regex: req.params.type + "*" },
    });
    res.status(200).json({
      success: true,
      message: "Files fetched",
      files: files,
    });
  },
};

module.exports = FileService;
