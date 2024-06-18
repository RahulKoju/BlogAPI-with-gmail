const Blog = require("../models/blog");
async function renderHomePage(req, res) {
  const allBlogs = await Blog.find({});
  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
}
module.exports = {
  renderHomePage,
};
