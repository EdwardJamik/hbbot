const { getStats, banTgUser, telegramUserData, fillingData, updatedFilling, getCategory, getUserLanguage,
    webAppTranslate, createCatName, getCatName, sendReviewUser, sendBookTable, getBookTable, getReviews, getReserves,
    getChats, getUserChat, getInstruction, savedInstruction
} = require("../Controllers/AdminController");
const router = require("express").Router();

router.post("/banTgUser", banTgUser);
router.get("/getStats", getStats);
router.get("/tgUsers", telegramUserData);
router.get("/getReserves", getReserves);
router.post("/fillingData", fillingData);
router.post("/updatedFilling", updatedFilling);
router.get("/getReviews", getReviews);

router.get("/getChats", getChats);
router.post("/getUserChat", getUserChat);


router.post("/getUserLanguage", getUserLanguage);
router.post("/webAppTranslate", webAppTranslate);

router.post("/createCatName", createCatName);
router.post("/getCatName", getCatName);

router.post("/sendReviewUser", sendReviewUser);
router.post("/sendBookTable", sendBookTable);
router.post("/getBookTable", getBookTable);

router.get("/getInstruction", getInstruction);
router.post("/savedInstruction", savedInstruction);

router.get("/getCategory", getCategory);

module.exports = router;