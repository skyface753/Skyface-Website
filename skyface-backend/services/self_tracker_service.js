const SelfTrackerModel = require("../models/self_tracker_model");

let SelfTrackerService = {
  receiveSelfTrackerData: async (req, res) => {
    try {
      const TOKEN = req.body.TOKEN;
      const LOCATION = req.body.LOCATION;
      const URL = LOCATION.URL;
      const HOST = LOCATION.HOST;
      const PATH = LOCATION.PATH;
      const stateUserId = req.body.USER;
      const SIGNATURE = req.body.SIGNATURE;
      if (TOKEN !== process.env.SELF_TRACKING_TOKEN) {
        res.status(401).send("Unauthorized");
        return;
      }
      if (!SIGNATURE || !URL || !HOST || !PATH) {
        res.status(400).send("Bad Request");
        return;
      }
      SelfTrackerModel.create({
        HOST: HOST,
        PATH: PATH,
        URL: URL,
        SIGNATURE: SIGNATURE,
        stateUserId: stateUserId,
        cookieUserId: req.user ? req.user._id : null,
      });
      res.status(200).send("OK");
    } catch (e) {
      console.log(e);
    }
  },
  getSelfTrackerData: async (req, res) => {
    try {
      // Get all and group by SIGNATURE
      const selfTrackerBySignature = await SelfTrackerModel.aggregate([
        { $group: { _id: "$SIGNATURE", count: { $sum: 1 } } },
      ]);
      const selfTrackerByPath = await SelfTrackerModel.aggregate([
        { $group: { _id: "$PATH", count: { $sum: 1 } } },
      ]);

      res.status(200).json({
        selfTrackerBySignature: selfTrackerBySignature,
        selfTrackerByPath: selfTrackerByPath,
      });
    } catch (e) {
      console.log(e);
    }
  },
};

module.exports = SelfTrackerService;
