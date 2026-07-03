const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Blog = require('../models/Blog');

// Home page
router.get('/', async (req, res) => {
  try {
    const featuredProjects = await Project.find({ featured: true }).sort({ order: 1 }).limit(6);
    const allProjects = featuredProjects.length >= 6
      ? featuredProjects
      : await Project.find().sort({ createdAt: -1 }).limit(6);
    const recentBlogs = await Blog.find({ published: true }).sort({ createdAt: -1 }).limit(3);

    res.render('index', {
      layout: 'layouts/main',
      title: 'StudioNest Architects — BIM & Architectural Design',
      projects: allProjects,
      blogs: recentBlogs,
      stats: {
        projects: await Project.countDocuments(),
        years: new Date().getFullYear() - 2010,
        awards: 24
      }
    });
  } catch (err) {
    console.error(err);
    res.render('index', {
      layout: 'layouts/main',
      title: 'StudioNest Architects',
      projects: [],
      blogs: [],
      stats: { projects: 120, years: 15, awards: 24 }
    });
  }
});

// About page
router.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main',
    title: 'About Us — StudioNest Architects'
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', {
    layout: 'layouts/main',
    title: 'Contact — StudioNest Architects'
  });
});

// Contact form POST
router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  // In production: send email, save to DB, etc.
  res.render('contact', {
    layout: 'layouts/main',
    title: 'Contact — StudioNest Architects',
    success: 'Thank you! We will get back to you shortly.',
    formData: {}
  });
});

module.exports = router;
