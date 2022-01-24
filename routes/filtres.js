const express = require("express");
const router = express.Router();

const Offer = require("../models/Offer");

router.get("/offer/filter", async (req, res) => {
  try {
    // console.log(req.query);

    let sortOrder = -1;
    if (req.query.sort === "price-asc") {
      sortOrder = 1;
    }
    let elemPerPage = 3;
    if (req.query.elemPerPage !== undefined) {
      elemPerPage = req.query.elemPerPage;
    }
    // console.log(elemPerPage);
    let page = 1;
    if (req.query.page !== undefined) {
      page = req.query.page;
    }

    // console.log(page);
    let elemToSkip = elemPerPage * (page - 1);
    // console.log(elemToSkip);

    let priceMin = 0;
    if (req.query.priceMin !== undefined) {
      priceMin = req.query.priceMin;
    }

    let priceMax = 9999999999;
    if (req.query.priceMax !== undefined) {
      priceMax = req.query.priceMax;
    }

    const search = await Offer.find({
      product_name: new RegExp(req.query.title, "i"),
      product_price: { $gte: priceMin, $lte: priceMax },
    })
      .sort({ product_price: sortOrder })
      .select("product_name product_price")
      .limit(elemPerPage)
      .skip(elemToSkip);

    res.status(200).json(search);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
