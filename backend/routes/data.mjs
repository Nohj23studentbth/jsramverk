import { Router } from 'express';
const router = Router();

//import { getAllDataForUser, createData, updateData, deleteData } from "../models/data.js";
import dataModels from "../models/data.mjs";
// import { checkToken } from "../models/auth.js";
import auth from "../models/auth.mjs";

router.get('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => dataModels.getAllDataForUser(res, req)
);

router.post('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => dataModels.createData(res, req)
);

router.put('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => dataModels.updateData(res, req)
);

router.delete('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => dataModels.deleteData(res, req)
);

export default router;
