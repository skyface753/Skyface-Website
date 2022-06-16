const ContactModel = require("../models/contact_model");

let ContactService = {
  sendForm: async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    const reqUser = req.user || null;
    if (!name || !email || !subject || !message) {
      res.json({
        success: false,
        message: "Please fill all fields",
      });
      return;
    }
    var newContact = new ContactModel({
      name: name,
      email: email,
      subject: subject,
      message: message,
      from_user: reqUser,
    });
    await newContact.save();
    res.json({
      success: true,
      message: "Message sent",
      contact: newContact,
    });
  },
  checkIfAMessageIsUnread: async (req, res) => {
    var openContacts = await ContactModel.find({});
    var openContactsCount = openContacts.length;
    res.json({
      success: true,
      openContacts: openContacts,
      openContactsCount: openContactsCount,
    });
  },
};

module.exports = ContactService;
