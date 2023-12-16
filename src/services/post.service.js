/* import News from '../models/News.js'

export const createService = (body) => News.create(body)

export const findAllService = (limit, offset) => News.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user")

export const countNews = () => News.countDocuments()

export const topNewsService = () => News.findOne().sort({ _id: -1 }).populate("user")

export const findByIdService = (id) => News.findById(id).populate("user")

export const searchByTitleService = (title) => News.find({ title: {$regex: `${title || ""}`, $options: "i"} }).sort({ _id: -1 }).populate("user")

export const byUserService = (id) => News.find({ user: id }).sort({ _id: -1 }).populate("user")

export const updateService = (id, title, text, banner) => News.findOneAndUpdate({ _id: id }, { title, text, banner }, {rawResult: true })

export const eraseService = (id) => News.findByIdAndDelete({ _id: id })

export const likeNewsService = (idNews, userId) => News.findOneAndUpdate(
    { _id: idNews, "likes.userId": { $nin: [userId] } },
    { $push: { likes: { userId, created: new Date() } } }
)

export const deleteLikeNewsService = (idNews, userId) => News.findOneAndUpdate(
    { _id: idNews },
    { $pull: { likes: { userId } } }
)

export const addCommentService = (idNews, comment, userId) => {
    const idComment = Math.floor(Date.now() * Math.random()).toString(36)

    return News.findOneAndUpdate({ _id: idNews }, {$push: {
        comments: {idComment, userId, comment, createdAt: new Date()}
    }})
}

export const deleteCommentService = (idNews, idComment, userId) => News.findOneAndUpdate(
    { _id: idNews },
    { $pull: { comments: { idComment, userId } } }
) */

import postRepositories from "../repositories/post.repositories.js";

async function createPostService({ title, banner, text }, userId) {
  if (!title || !banner || !text)
    throw new Error("Submit all fields for registration");

  const { id } = await postRepositories.createPostRepository(
    title,
    banner,
    text,
    userId
  );

  return {
    message: "Post created successfully!",
    post: { id, title, banner, text },
  };
}

async function findAllPostsService(limit, offset, currentUrl) {
  limit = Number(limit);
  offset = Number(offset);

  if (!limit) {
    limit = 5;
  }

  if (!offset) {
    offset = 0;
  }

  const posts = await postRepositories.findAllPostsRepository(offset, limit);

  const total = await postRepositories.countPosts();

  const next = offset + limit;
  const nextUrl =
    next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

  const previous = offset - limit < 0 ? null : offset - limit;
  const previousUrl =
    previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

  posts.shift();

  return {
    nextUrl,
    previousUrl,
    limit,
    offset,
    total,

    results: posts.map((post) => ({
      id: post._id,
      title: post.title,
      banner: post.banner,
      text: post.text,
      likes: post.likes,
      comments: post.comments,
      name: post.user.name,
      username: post.user.username,
      avatar: post.user.avatar,
    })),
  };
}

async function topNewsService() {
  const post = await postRepositories.topNewsRepository();

  if (!post) throw new Error("There is no registered post");

  return {
    post: {
      id: post._id,
      title: post.title,
      banner: post.banner,
      text: post.text,
      likes: post.likes,
      comments: post.comments,
      name: post.user.name,
      username: post.user.username,
      avatar: post.user.avatar,
    },
  };
}

async function searchPostService(title) {
  const foundPosts = await postRepositories.searchPostRepository(title);

  if (foundPosts.length === 0)
    throw new Error("There are no posts with this title");

  return {
    foundPosts: foundPosts.map((post) => ({
      id: post._id,
      title: post.title,
      banner: post.banner,
      text: post.text,
      likes: post.likes,
      comments: post.comments,
      name: post.user.name,
      username: post.user.username,
      avatar: post.user.avatar,
    })),
  };
}

async function findPostByIdService(id) {
  const post = await postRepositories.findPostByIdRepository(id);

  if (!post) throw new Error("Post not found");

  return {
    id: post._id,
    title: post.title,
    banner: post.banner,
    text: post.text,
    likes: post.likes,
    comments: post.comments,
    name: post.user.name,
    username: post.user.username,
    avatar: post.user.avatar,
  };
}

async function findPostsByUserIdService(id) {
  const posts = await postRepositories.findPostsByUserIdRepository(id);

  return {
    postsByUser: posts.map((post) => ({
      id: post._id,
      title: post.title,
      banner: post.banner,
      text: post.text,
      likes: post.likes,
      comments: post.comments,
      name: post.user.name,
      username: post.user.username,
      avatar: post.user.avatar,
    })),
  };
}

async function updatePostService(id, title, banner, text, userId) {
  if (!title && !banner && !text)
    throw new Error("Submit at least one field to update the post");

  const post = await postRepositories.findPostByIdRepository(id);

  if (!post) throw new Error("Post not found");

  if (post.user._id != userId) throw new Error("You didn't create this post");

  await postRepositories.updatePostRepository(id, title, banner, text);
}

async function deletePostService(id, userId) {
  const post = await postService.findPostByIdService(id);

  if (!post) throw new Error("Post not found");

  if (post.user._id != userId) throw new Error("You didn't create this post");

  await postRepositories.deletePostRepository(id);
}

async function likePostService(id, userId) {
  const postLiked = await postService.likesService(id, userId);

  if (postLiked.lastErrorObject.n === 0) {
    await postService.likesDeleteService(id, userId);
    return { message: "Like successfully removed" };
  }

  return { message: "Like done successfully" };
}

async function commentPostService(postId, message, userId) {
  if (!message) throw new Error("Write a message to comment");

  const post = await postRepositories.findPostByIdRepository(postId);

  if (!post) throw new Error("Post not found");

  await postRepositories.commentsRepository(postId, message, userId);
}

async function commentDeletePostService(postId, userId, idComment) {
  const post = await postRepositories.findPostByIdRepository(postId);

  if (!post) throw new Error("Post not found");

  await postRepositories.commentsDeleteRepository(postId, userId, idComment);
}

export default {
  createPostService,
  findAllPostsService,
  topNewsService,
  searchPostService,
  findPostByIdService,
  findPostsByUserIdService,
  updatePostService,
  deletePostService,
  likePostService,
  commentPostService,
  commentDeletePostService,
};