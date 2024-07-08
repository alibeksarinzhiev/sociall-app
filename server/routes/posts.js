import { Router } from "express";
import { check } from "../utils/check.js";
import { createPost,getAll,getById,getMyPosts } from "../controllers/posts.js";

const router = new Router()

router.post('/',check,createPost)
router.get('/',getAll)
router.get('/:id', getById)
router.get('/user/me',check,getMyPosts )

// router.get('/:id')




export default router