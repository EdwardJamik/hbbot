const { getStats, banTgUser, telegramUserData, fillingData, updatedFilling, getCategory, getUserLanguage,
    webAppTranslate, createCatName, getCatName, sendReviewUser, sendBookTable, getBookTable, getReviews, getReserves,
    getChats, getUserChat, getInstruction, savedInstruction, getReservInfo, acceptedReserved, sendingList,
    sendingsListLoad, createSending, sendingsDelete, createProduct, deletedProduct,
    getProductField, getProduct, deletedCategory, savedInstructionforProduct, userManagerList, RemoveUser, CreateUser,
    UpdatedUser, rootMenu, botChannels, changeAccess, changeAccessLanguage
} = require("../Controllers/AdminController");
const router = require("express").Router();


router.post("/rootMenu", rootMenu);

router.get("/botChannels", botChannels);
router.post("/changeAccess", changeAccess);
router.post("/changeAccessLanguage", changeAccessLanguage);

router.post("/banTgUser", banTgUser);
router.get("/getStats", getStats);
router.get("/tgUsers", telegramUserData);
router.get("/getReserves", getReserves);
router.post("/fillingData", fillingData);
router.post("/updatedFilling", updatedFilling);
router.get("/getReviews", getReviews);
router.get("/getChats", getChats);
router.post("/getUserChat", getUserChat);

router.get("/userList", userManagerList);
router.post("/createUser", CreateUser);
router.post("/removeUser", RemoveUser);
router.post("/updateUser", UpdatedUser);

router.post("/getUserLanguage", getUserLanguage);
router.post("/webAppTranslate", webAppTranslate);

router.post("/createCatName", createCatName);
router.post("/getCatName", getCatName);

router.post("/getReservInfo", getReservInfo);
router.post("/acceptedReserved", acceptedReserved);

router.post("/sendReviewUser", sendReviewUser);
router.post("/sendBookTable", sendBookTable);
router.post("/getBookTable", getBookTable);

router.get("/getInstruction", getInstruction);
router.post("/savedInstruction", savedInstruction);

router.get("/getCategory", getCategory);

router.get("/updateKnowledge", savedInstructionforProduct);

router.get("/sendingList", sendingList);
router.get("/sendingsListLoad", sendingsListLoad);
router.post("/createSending", createSending);
router.post("/sendingsDelete", sendingsDelete);

router.post("/getProductField", getProductField);
router.post("/createProduct", createProduct);
router.post("/deletedProduct", deletedProduct);
router.post("/deletedCategory", deletedCategory);

router.post("/getProduct", getProduct);

module.exports = router;