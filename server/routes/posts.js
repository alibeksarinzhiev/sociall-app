import { Router } from "express";
import { check } from "../utils/check.js";
import { createPost,getAll,getById,getMyPosts, removePost,getPostComments } from "../controllers/posts.js";

const router = new Router()

router.post('/',check,createPost)
router.get('/',getAll)
router.get('/:id', getById)
router.get('/user/me',check,getMyPosts )
router.delete('/:id',check,removePost)
router.get('/comment/:id',getPostComments)

// router.get('/:id')




export default router