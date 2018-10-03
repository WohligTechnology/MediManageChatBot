var schema = new Schema({
  CLAIMID: Number,
  ROOM_FEES_REQ: Number,
  PROFESSIONALFEES_REQ: Number,
  INVESTIGATION_CHARGES_REQ: Number,
  PHARMACY_CHARGES_REQ: Number,
  OT_CHARGES_REQ: Number,
  OTHER_CHARGES_REQ: Number,
  ROOM_FEES_PAID: Number,
  PROFESSIONALFEES_PAID: Number,
  INVESTIGATION_CHARGES_PAID: Number,
  PHARMACY_CHARGES_PAID: Number,
  OT_CHARGES_PAID: Number,
  OTHER_CHARGES_PAID: Number,
  ROOMRENT_DED_REMARKS: String,
  PFEES_DED_REMARKS: String,
  INV_DED_REMARKS: String,
  PHARMACY_DED_REMARKS: String,
  OT_DED_REMARKS: String,
  OTHERS_DED_REMARKS: String
});
var Breakup = mongoose.model("Breakup", schema);

var model = {
  getAll: function(data, callback) {
    Breakup.find().exec(function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },
  getOneBreakup: function(data, callback) {
    var CLAIMID = parseInt(data.queryResult.parameters.CLAIMID);
    console.log("Claim Id", CLAIMID);
    Breakup.findOne({
      CLAIMID: CLAIMID
    })
      .lean()
      .exec(function(err, resData) {
        if (err) {
          callback(err, null);
        } else if (_.isEmpty(resData)) {
          callback("Please provide valid Claim ID", null);
        } else {
          resData.session = data.session;
          callback(null, resData);
        }
      });
  }
};
module.exports = _.assign(model);
