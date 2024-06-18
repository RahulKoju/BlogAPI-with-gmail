const Blog = require("../models/blog");
const Comment = require("../models/comment");
async function handleAddBlog(req, res) {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageUrl: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
}
function handleGetBlog(req, res) {
  return res.render("addBlog", {
    user: req.user,
  });
}
async function handleBlogPage(req, res) {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comment = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  return res.render("blog", {
    user: req.user,
    blog,
    comment,
  });
}
async function handleComment(req, res) {
  await Comment.create({
    content: req.body.content,
    createdBy: req.user._id,
    blogId: req.params.blogId,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
}
async function handleGetEditBlog(req, res) {
  const blog = await Blog.findById(req.params.blogId);
  return res.render("editblog", {
    user:req.user,
    blog,
  });
}
async function handleUpdateBlog(req, res) {
  const { title, body } = req.body;
  const blog = await Blog.findById(req.params.blogId);
  blog.title = title;
  blog.body = body;
  if (req.file) {
    blog.coverImageUrl = `/uploads/${req.file.filename}`;
  }
  await blog.save();
  return res.redirect(`/blog/${blog._id}`);
}
async function handleDeleteBlog(req, res) {
  await Blog.findByIdAndDelete(req.params.blogId);
  return res.redirect("/");
}
module.exports = {
  handleAddBlog,
  handleGetBlog,
  handleBlogPage,
  handleComment,
  handleDeleteBlog,
  handleUpdateBlog,
  handleGetEditBlog,
};
