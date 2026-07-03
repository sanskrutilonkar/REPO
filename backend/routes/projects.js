const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// All projects
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    let filter = {};
    if (category && category !== 'All') filter.category = category;
    if (status) filter.status = status;

    const projects = await Project.find(filter).sort({ year: -1, createdAt: -1 });
    const categories = ['All', 'Residential', 'Commercial', 'Cultural', 'Multi-Family', 'Sustainable', 'BIM', 'Urban Planning', 'Interior'];

    res.render('projects', {
      layout: 'layouts/main',
      title: 'Projects — StudioNest Architects',
      projects,
      categories,
      selectedCategory: category || 'All'
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.redirect('/projects');

    const related = await Project.find({
      category: project.category,
      _id: { $ne: project._id }
    }).limit(3);

    res.render('project-single', {
      layout: 'layouts/main',
      title: `${project.title} — StudioNest Architects`,
      project,
      related
    });
  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
});

module.exports = router;
