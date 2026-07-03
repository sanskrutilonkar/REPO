const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// All blogs
router.get('/', async (req, res) => {
  try {
    const { category, page = 1 } = req.query;
    const limit = 9;
    const skip = (page - 1) * limit;

    let filter = { published: true };
    if (category && category !== 'All') filter.category = category;

    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(filter)
    ]);

    const categories = ['All', 'Architecture', 'BIM', 'Design', 'Sustainability', 'Technology', 'Urbanism', 'Interior', 'News'];
    const featured = await Blog.findOne({ published: true, featured: true }).sort({ createdAt: -1 });

    res.render('blog', {
      layout: 'layouts/main',
      title: 'Blog — StudioNest Architects',
      blogs,
      featured,
      categories,
      selectedCategory: category || 'All',
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Single blog post
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) return res.redirect('/blog');

    const related = await Blog.find({
      category: blog.category,
      published: true,
      _id: { $ne: blog._id }
    }).limit(3);

    res.render('blog-single', {
      layout: 'layouts/main',
      title: `${blog.title} — StudioNest Architects`,
      blog,
      related
    });
  } catch (err) {
    console.error(err);
    res.redirect('/blog');
  }
});

module.exports = router;
