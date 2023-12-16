/* import { createService, findAllService, countNews, topNewsService, findByIdService, searchByTitleService, byUserService, updateService, eraseService, likeNewsService, deleteLikeNewsService, addCommentService, deleteCommentService } from '../services/news.service.js'

export const create = async (req, res) => {
    try {
        const { title, text, banner } = req.body

        if(!title || !text || !banner) res.status(400).send({ message: "Submit all fields for registration" })

        await createService({
            title,
            text, 
            banner,
            user: req.userId
        })

        res.send(201)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const findAll = async (req, res) => {
    try {
        let { limit, offset } = req.query

        limit = Number(limit)
        offset = Number(offset)

        if(!limit) limit = 5
        if(!offset) offset = 0

        const news = await findAllService(limit, offset)
        const total = await countNews()
        const currentUrl = req.baseUrl

        const next = offset + limit
        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null

        const previous = offset - limit < 0 ? null : offset - limit
        const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null

        if(news.length === 0) {
            return res.status(400).send({ message: "There are no registered news" })
        }
        
        res.status(200).send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,

            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                username: item.user.username,
                userAvater: item.user.avatar
            }))
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    } 
}

export const topNews = async (req, res) => {
    try {
        const news = await topNewsService()

        if(!news) return res.status(400).send({ message: "There is no registered post" })

        res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                username: news.user.username,
                userAvater: news.user.avatar
            }
        })
    } catch(err) {
        res.status(500).send({ message: err.message })
    } 
}

export const findById = async (req, res) => {
    const { id } = req.params

    try {
        const news = await findByIdService(id)

        return res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                username: news.user.username,
                userAvater: news.user.avatar
            }
        }) 
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query

        const news = await searchByTitleService(title)

        if(news.length === 0) return res.status(400).send({ message: "There are no news with this title" })

        return res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                username: item.user.username,
                userAvater: item.user.avatar
            }))
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const byUser = async (req, res) => {
    try {
        const id = req.userId
        const news = await byUserService(id)

        return res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                username: item.user.username,
                userAvater: item.user.avatar
            }))
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const update = async (req, res) => {
    const { title, text, banner } = req.body
    const { id } = req.params

    try {
        if(!title && !text && !banner) res.status(400).send({ message: "Submit all fields for registration" })

        const news = await findByIdService(id)

        if(String(news.user._id) !== String(req.userId)) {
            return res.status(400).send({ message: "You didn`t update this news" })
        }

        await updateService(id, title, text, banner)

        return res.send({ message: "News successfully updated" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const erase = async (req, res) => {
    const { id } = req.params

    try {
        const news = await findByIdService(id)

        if(String(news.user._id) !== String(req.userId)) {
            return res.status(400).send({ message: "You didn`t update this news" })
        }

        await eraseService(id)

        return res.send({ message: "News deleted sucessfully" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const likeNews = async (req, res) => {
    const { id } = req.params
    const userId = req.userId

    try {
        const newsLiked = await likeNewsService(id, userId)
        
        if(!newsLiked) {
            await deleteLikeNewsService(id, userId)
            return res.status(200).send({ message: "Like successfully removed" })
        }

        res.send({ message: "Like done successfully" })
    } catch (err) {
        res.status(500).send({ mesage: err.message })
    }  
}

export const addComment = async (req, res) => {
    const { id } = req.params
    const userId = req.userId
    const {comment} = req.body

    try {
        if(!comment) return res.status(400).send({ message: "Write a message to comment" })

        await addCommentService(id, comment, userId)

        res.send({ message: "Comment successfully completed!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const deleteComment = async (req, res) => {
    const { idNews, idComment } = req.params
    const userId = req.userId

    try {
        const commentDeleted = await deleteCommentService(idNews, idComment, userId)

        const commentFinder = commentDeleted.comments.find(comment => comment.idComment === idComment)

        if(!commentFinder) return res.status(404).send({ message: "Comment not found" })

        if(commentFinder.userId !== userId) return res.status(400).send({ message: "You can`t delete this comment" })

        res.send({ message: "Comment successfully removed!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
} */

import postService from "../services/post.service.js";

async function createPostController(req, res) {
  const { title, banner, text } = req.body;
  const userId = req.userId;

  try {
    const post = await postService.createPostService(
      { title, banner, text },
      userId
    );
    return res.status(201).send(post);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function findAllPostsController(req, res) {
  const { limit, offset } = req.query;
  const currentUrl = req.baseUrl;

  try {
    const posts = await postService.findAllPostsService(
      limit,
      offset,
      currentUrl
    );
    return res.send(posts);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function topNewsController(req, res) {
  try {
    const post = await postService.topNewsService();
    return res.send(post);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function searchPostController(req, res) {
  const { title } = req.query;

  try {
    const foundPosts = await postService.searchPostService(title);

    return res.send(foundPosts);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function findPostByIdController(req, res) {
  const { id } = req.params;

  try {
    const post = await postService.findPostByIdService(id);
    return res.send(post);
  } catch (e) {
    res.status(404).send(e.message);
  }
}

async function findPostsByUserIdController(req, res) {
  const id = req.userId;
  try {
    const posts = await postService.findPostsByUserIdService(id);
    return res.send(posts);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function updatePostController(req, res) {
  const { title, banner, text } = req.body;
  const { id } = req.params;
  const userId = req.userId;

  try {
    await postService.updatePostService(id, title, banner, text, userId);

    return res.send({ message: "Post successfully updated!" });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function deletePostController(req, res) {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await postService.deletePostService(id, userId);
    return res.send({ message: "Post deleted successfully" });
  } catch (err) {
    return res.status(500).send(e.message);
  }
}

async function likePostController(req, res) {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const response = await postService.likePostService(id, userId);

    return res.send(response);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function commentPostController(req, res) {
  const { id: postId } = req.params;
  const { message } = req.body;
  const userId = req.userId;

  try {
    await postService.commentPostService(postId, message, userId);

    return res.send({
      message: "Comment successfully completed!",
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function commentDeletePostController(req, res) {
  const { id: postId, idComment } = req.params;
  const userId = req.userId;

  try {
    await postService.commentDeletePostService(postId, userId, idComment);

    return res.send({ message: "Comment successfully removed" });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

export default {
  createPostController,
  findAllPostsController,
  topNewsController,
  searchPostController,
  findPostByIdController,
  findPostsByUserIdController,
  updatePostController,
  deletePostController,
  likePostController,
  commentPostController,
  commentDeletePostController,
};