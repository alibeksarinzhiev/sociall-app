import { Router } from "express";
import {getMe, login, register} from '../controllers/auth.js'
import { check } from "../utils/check.js";

const router = new Router()

router.post('/register',register)

router.post('/login',login)

router.get('/getMe',check,getMe)


export default router