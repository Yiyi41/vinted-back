const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dps4zteie",
  api_key: "685578328815986",
  api_secret: "856pzHBktfERyvMFWa6GidYPaIM",
});

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    const newSalt = uid2(16);
    const newHash = SHA256(req.fields.password + newSalt).toString(encBase64);
    const newToken = uid2(16);

    const userToCheck = await User.findOne({ email: req.fields.email });

    if (userToCheck) {
      res.status(400).json("ce mail existe déjà");
      //   il vaut mieux checker d'abord les condition moins couteuse
    } else if (!req.fields.username) {
      res.status(400).json("username est obligatoire");
    } else {
      const newUser = new User({
        email: req.fields.email,
        account: {
          username: req.fields.username,
          phone: req.fields.phone,
        },
        token: newToken,
        hash: newHash,
        salt: newSalt,
      });
      await newUser.save();
      res.status(200).json({
        id: newUser.id,
        account: newUser.account,
        token: newUser.token,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const userToSignIn = await User.findOne({ email: req.fields.email });
    const hash = SHA256(req.fields.password + userToSignIn.salt).toString(
      encBase64
    );
    console.log(hash);
    if (hash === userToSignIn.hash) {
      res.status(200).json({
        id: userToSignIn.id,
        token: userToSignIn.token,
        account: userToSignIn.account,
      });
    } else {
      res.status(400).json("Unauthorized !");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// const isAuthenticated = async (req, res, next) => {
//   if (req.headers.authorization) {
//     const user = await User.findOne({
//       token: req.headers.authorization.replace("Bearer ", ""),
//     });

//     if (user) {
//       req.user = user;
//       return next();
//     } else {
//       return res.status(401).json({ error: "Unauthorized" });
//     }
//   } else {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
// };

// router.post("/user/avatar", isAuthenticated, async (req, res) => {
//   try {
//     let imageToUpload = req.files.picture.path;
//     const avatar = await cloudinary.uploader.upload(imageToUpload);
//     const user = await User.findOne({
//       token: req.headers.authorization.replace("Bearer ", "");
//     req.user.account.avatar = avatar;
//     req.user.save();
//     return res.json(avatar);
//   } catch (error) {
//     res.status(400).json({
//       message: error.message,
//     });
//   }
// });

module.exports = router;
