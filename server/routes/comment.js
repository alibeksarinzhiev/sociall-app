import { Router } from "express";
import { check } from "../utils/check.js";
import { createComment } from "../controllers/comment.js";


const router = new Router()

router.post('/:id',check,createComment)

export default router
