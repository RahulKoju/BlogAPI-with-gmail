const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const {
  handleAddBlog,
  handleGetBlog,
  handleBlogPage,
  handleComment,
  handleUpdateBlog,
  handleDeleteBlog,
  handleGetEditBlog,
} = require("../controller/blog");
const router = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get("/add-blog", handleGetBlog);
router.post("/", upload.single("coverImage"), handleAddBlog);
router.get("/:id", handleBlogPage);
router.post("/comment/:blogId", handleComment);
router.get("/edit/:blogId", handleGetEditBlog);
router.post("/edit/:blogId",upload.single("coverImage"),handleUpdateBlog);
router.post("/delete/:blogId", handleDeleteBlog);

module.exports = router;
