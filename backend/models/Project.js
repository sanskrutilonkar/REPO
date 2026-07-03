const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Residential', 'Commercial', 'Cultural', 'Multi-Family', 'Sustainable', 'BIM', 'Urban Planning', 'Interior'],
    default: 'Residential'
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: 1990,
    max: new Date().getFullYear() + 5
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  fullDescription: {
    type: String,
    maxlength: [5000, 'Full description cannot exceed 5000 characters']
  },
  imageUrl: {
    type: String,
    default: '/images/placeholder.jpg'
  },
  location: {
    type: String,
    trim: true
  },
  area: {
    type: String,
    trim: true
  },
  client: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  bimEnabled: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Upcoming'],
    default: 'Completed'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
