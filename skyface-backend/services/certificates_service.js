const CertificatesModel = require("../models/certificates_model");

let CertificatesService = {
  getCertificates: async (req, res) => {
    try {
      let certificates = await CertificatesModel.find();
      return res.status(200).json({
        success: true,
        certificates: certificates,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
  createCertificate: async (req, res) => {
    let { title, description, file_path } = req.body;
    console.log(req.body);
    if (!title || !description || !file_path) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }
    try {
      let certificate = await CertificatesModel.create({
        title: title,
        description: description,
        file_path: file_path,
      });
      return res.status(200).json({
        success: true,
        certificate: certificate,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
  deleteCertificate: async (req, res) => {
    let { certificateID } = req.params;
    if (!certificateID) {
      return res.status(400).json({
        success: false,
        message: "No certificate ID provided",
      });
    }
    try {
      let certificate = await CertificatesModel.findById(certificateID);
      if (!certificate) {
        return res.status(400).json({
          success: false,
          message: "Certificate not found",
        });
      }
      await CertificatesModel.deleteOne({ _id: certificateID });
      var remainingCertificates = await CertificatesModel.find();
      return res.status(200).json({
        success: true,
        message: "Certificate deleted",
        remainingCertificates: remainingCertificates,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
};

module.exports = CertificatesService;
