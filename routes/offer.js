const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const Offer = require("../models/Offer");
const User = require("../models/User");

const isAuthenticated = require("./isAuthenticated");

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    console.log(req.user);

    let pictureToUpload = req.files.picture.path;
    const picture = await cloudinary.uploader.upload(pictureToUpload);
    console.log(picture);

    const newOffer = new Offer({
      product_name: req.fields.title,
      product_description: req.fields.description,
      product_price: req.fields.price,
      product_details: [
        {
          marque: req.fields.brand,
        },
        {
          size: req.fields.size,
        },
        {
          état: req.fields.condition,
        },
        {
          couleur: req.fields.color,
        },
        {
          emplacement: req.fields.city,
        },
      ],
      product_image: picture,
      owner: req.user,
    });
    await newOffer.save();
    res.status(200).json({
      id: newOffer.id,
      product_name: newOffer.product_name,
      product_description: newOffer.product_description,
      product_price: newOffer.product_price,
      product_details: newOffer.product_details,
      owner: {
        account: newOffer.owner.account.username,
        phone: newOffer.owner.account.phone,
        id: newOffer.owner.id,
      },
      product_image: newOffer.product_image.secure_url,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
