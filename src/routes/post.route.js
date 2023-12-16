/* import { Router } from 'express'

import { create, findAll, topNews, findById, searchByTitle, byUser, update, erase, likeNews, addComment, deleteComment } from '../controllers/news.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.post("/", authMiddleware, create)
router.get("/", findAll)
router.get("/top", topNews)
router.get("/search", searchByTitle)
router.get("/byUser", authMiddleware, byUser)
router.get("/:id", authMiddleware, findById)
router.post("/:id", authMiddleware, update)
router.delete("/:id", authMiddleware, erase)
router.patch("/like/:id", authMiddleware, likeNews)
router.patch("/comment/:id", authMiddleware, addComment)
router.patch("/comment/:idNews/:idComment", authMiddleware, deleteComment)

export default router */

import postController from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validId } from "../middlewares/global.middlewares.js";

import { Router } from "express";

const postRouter = Router();

postRouter.get("/", postController.findAllPostsController);
postRouter.get("/top", postController.topNewsController);
postRouter.get("/search", postController.searchPostController);

postRouter.use(authMiddleware);
postRouter.post("/create", postController.createPostController);

postRouter.use(validId);
postRouter.get("/byIdPost/:id", postController.findPostByIdController);
postRouter.get("/byUserId", postController.findPostsByUserIdController);
postRouter.patch("/update/:id", postController.updatePostController);
postRouter.delete("/delete/:id", postController.deletePostController);
postRouter.patch("/:id/like", postController.likePostController);
postRouter.patch("/:id/comment", postController.commentPostController);
postRouter.patch(
  "/:id/:idComment/comment",
  postController.commentDeletePostController
);

export default postRouter;