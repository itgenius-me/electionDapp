const Admin = require('../models/admin');
const Voters = require('../models/voters');
const PasswordManager = require('../../services/password');

exports.checkCredentials = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  Admin.findOne({ email }).exec(async (error, adminData) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (adminData) {
      const match = password === adminData.password
      if (match) {
        req.adminID = adminData._id;
        next();
      } else {
        return res.status(400).json({
          msg: 'Invalid email/password combination yyy',
        });
      }
    } else {
      return res.status(404).json({
        msg: 'Invalid email/password combination !!!!',
      });
    }
  });
};

exports.verifyVoter = async (req, res, next) => {
  let query;
  if (req.query.voterID) {
    query = {
      voterID: req.query.voterID,
    };
  } else {
    query = {
      phone: req.body.phone,
    };
  }
  console.log(query);
  Voters.findOne(query).exec(async (error, voterData) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (voterData) {
      if (voterData.hasRegistered === true) {
        return res.status(400).json({
          msg: 'Voter already registered',
        });
      } else {
        req.phone = voterData.phone;
        req.district = voterData.pinCode;
        req._id = voterData._id;
        next();
      }
    } else {
      return res.status(400).json({
        msg: 'Invalid VoterID',
      });
    }
  });
};
