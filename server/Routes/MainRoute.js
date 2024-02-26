const { getStats, banTgUser, telegramUserData, fillingData, updatedFilling, getCategory, getUserLanguage,
    webAppTranslate, createCatName, getCatName, sendReviewUser, sendBookTable, getBookTable, getReviews
} = require("../Controllers/AdminController");
const router = require("express").Router();

router.post("/banTgUser", banTgUser);
router.get("/getStats", getStats);
router.get("/tgUsers", telegramUserData);
router.post("/fillingData", fillingData);
router.post("/updatedFilling", updatedFilling);
router.get("/getReviews", getReviews);

router.post("/getUserLanguage", getUserLanguage);
router.post("/webAppTranslate", webAppTranslate);

router.post("/createCatName", createCatName);
router.post("/getCatName", getCatName);

router.post("/sendReviewUser", sendReviewUser);
router.post("/sendBookTable", sendBookTable);
router.post("/getBookTable", getBookTable);



router.get("/getCategory", getCategory);

module.exports = router;