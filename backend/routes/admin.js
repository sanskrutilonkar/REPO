const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const { requireAuth, redirectIfAuth } = require('../middleware/auth');

// ─── AUTH ────────────────────────────────────────────────────────────────────

// Login page
router.get('/login', redirectIfAuth, (req, res) => {
  res.render('admin/login', {
    layout: 'layouts/admin',
    title: 'Admin Login — StudioNest',
    error: null
  });
});

// Login POST
router.post('/login', redirectIfAuth, async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) {
      return res.render('admin/login', {
        layout: 'layouts/admin',
        title: 'Admin Login',
        error: 'Invalid username or password'
      });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.render('admin/login', {
        layout: 'layouts/admin',
        title: 'Admin Login',
        error: 'Invalid username or password'
      });
    }
    req.session.isAuthenticated = true;
    req.session.adminId = admin._id;
    req.session.adminUsername = admin.username;
    admin.lastLogin = new Date();
    await admin.save();

    const returnTo = req.session.returnTo || '/admin/dashboard';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (err) {
    console.error(err);
    res.render('admin/login', {
      layout: 'layouts/admin',
      title: 'Admin Login',
      error: 'Server error. Please try again.'
    });
  }
});

// Logout
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const [projectCount, blogCount, publishedBlogs, featuredProjects] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Blog.countDocuments({ published: true }),
      Project.countDocuments({ featured: true })
    ]);
    const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(5);
    const recentBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5);

    res.render('admin/dashboard', {
      layout: 'layouts/admin',
      title: 'Dashboard — StudioNest Admin',
      stats: { projectCount, blogCount, publishedBlogs, featuredProjects },
      recentProjects,
      recentBlogs,
      adminUsername: req.session.adminUsername
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/login');
  }
});

// ─── PROJECTS CRUD ───────────────────────────────────────────────────────────

// List all projects
router.get('/projects', requireAuth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.render('admin/projects', {
      layout: 'layouts/admin',
      title: 'Manage Projects — StudioNest Admin',
      projects,
      success: req.query.success,
      error: req.query.error
    });
  } catch (err) {
    res.redirect('/admin/dashboard');
  }
});

// New project form
router.get('/projects/new', requireAuth, (req, res) => {
  res.render('admin/project-form', {
    layout: 'layouts/admin',
    title: 'New Project — StudioNest Admin',
    project: null,
    action: '/admin/projects',
    method: 'POST',
    error: null
  });
});

// Create project
router.post('/projects', requireAuth, async (req, res) => {
  try {
    const { title, category, year, description, fullDescription, imageUrl, location, area, client, tags, featured, bimEnabled, status } = req.body;
    const project = new Project({
      title, category, year: parseInt(year), description, fullDescription,
      imageUrl: imageUrl || '/images/placeholder.jpg',
      location, area, client,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      featured: featured === 'on',
      bimEnabled: bimEnabled === 'on',
      status
    });
    await project.save();
    res.redirect('/admin/projects?success=Project created successfully');
  } catch (err) {
    console.error(err);
    res.render('admin/project-form', {
      layout: 'layouts/admin',
      title: 'New Project — StudioNest Admin',
      project: req.body,
      action: '/admin/projects',
      method: 'POST',
      error: err.message
    });
  }
});

// Edit project form
router.get('/projects/:id/edit', requireAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.redirect('/admin/projects');
    res.render('admin/project-form', {
      layout: 'layouts/admin',
      title: 'Edit Project — StudioNest Admin',
      project,
      action: `/admin/projects/${project._id}?_method=PUT`,
      method: 'POST',
      error: null
    });
  } catch (err) {
    res.redirect('/admin/projects');
  }
});

// Update project
router.put('/projects/:id', requireAuth, async (req, res) => {
  try {
    const { title, category, year, description, fullDescription, imageUrl, location, area, client, tags, featured, bimEnabled, status } = req.body;
    await Project.findByIdAndUpdate(req.params.id, {
      title, category, year: parseInt(year), description, fullDescription,
      imageUrl: imageUrl || '/images/placeholder.jpg',
      location, area, client,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      featured: featured === 'on',
      bimEnabled: bimEnabled === 'on',
      status
    });
    res.redirect('/admin/projects?success=Project updated successfully');
  } catch (err) {
    console.error(err);
    res.redirect(`/admin/projects/${req.params.id}/edit?error=${err.message}`);
  }
});

// Delete project
router.delete('/projects/:id', requireAuth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect('/admin/projects?success=Project deleted successfully');
  } catch (err) {
    res.redirect('/admin/projects?error=Could not delete project');
  }
});

// ─── BLOG CRUD ───────────────────────────────────────────────────────────────

// List all blogs
router.get('/blogs', requireAuth, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render('admin/blogs', {
      layout: 'layouts/admin',
      title: 'Manage Blogs — StudioNest Admin',
      blogs,
      success: req.query.success,
      error: req.query.error
    });
  } catch (err) {
    res.redirect('/admin/dashboard');
  }
});

// New blog form
router.get('/blogs/new', requireAuth, (req, res) => {
  res.render('admin/blog-form', {
    layout: 'layouts/admin',
    title: 'New Blog Post — StudioNest Admin',
    blog: null,
    action: '/admin/blogs',
    method: 'POST',
    error: null
  });
});

// Create blog
router.post('/blogs', requireAuth, async (req, res) => {
  try {
    const { title, excerpt, content, author, category, tags, imageUrl, published, featured } = req.body;
    const blog = new Blog({
      title, excerpt, content, author,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      imageUrl: imageUrl || '/images/placeholder.jpg',
      published: published === 'on',
      featured: featured === 'on'
    });
    await blog.save();
    res.redirect('/admin/blogs?success=Blog post created successfully');
  } catch (err) {
    console.error(err);
    res.render('admin/blog-form', {
      layout: 'layouts/admin',
      title: 'New Blog Post',
      blog: req.body,
      action: '/admin/blogs',
      method: 'POST',
      error: err.message
    });
  }
});

// Edit blog form
router.get('/blogs/:id/edit', requireAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.redirect('/admin/blogs');
    res.render('admin/blog-form', {
      layout: 'layouts/admin',
      title: 'Edit Blog — StudioNest Admin',
      blog,
      action: `/admin/blogs/${blog._id}?_method=PUT`,
      method: 'POST',
      error: null
    });
  } catch (err) {
    res.redirect('/admin/blogs');
  }
});

// Update blog
router.put('/blogs/:id', requireAuth, async (req, res) => {
  try {
    const { title, excerpt, content, author, category, tags, imageUrl, published, featured } = req.body;
    const blog = await Blog.findById(req.params.id);
    blog.title = title;
    blog.excerpt = excerpt;
    blog.content = content;
    blog.author = author;
    blog.category = category;
    blog.tags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    blog.imageUrl = imageUrl || '/images/placeholder.jpg';
    blog.published = published === 'on';
    blog.featured = featured === 'on';
    await blog.save();
    res.redirect('/admin/blogs?success=Blog updated successfully');
  } catch (err) {
    res.redirect(`/admin/blogs/${req.params.id}/edit?error=${err.message}`);
  }
});

// Delete blog
router.delete('/blogs/:id', requireAuth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/admin/blogs?success=Blog deleted successfully');
  } catch (err) {
    res.redirect('/admin/blogs?error=Could not delete blog');
  }
});

// Toggle blog publish
router.post('/blogs/:id/toggle-publish', requireAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog.published = !blog.published;
    await blog.save();
    res.json({ success: true, published: blog.published });
  } catch (err) {
    res.json({ success: false });
  }
});

module.exports = router;
