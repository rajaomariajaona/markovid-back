import express from "express"
import FokontanyController from './FokontanyController';
var router = express.Router()
router.use("/fokontany",new FokontanyController().mainRouter)
export default router;