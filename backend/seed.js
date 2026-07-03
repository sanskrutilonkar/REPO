require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const Project = require('./models/Project');
const Blog = require('./models/Blog');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await Promise.all([Admin.deleteMany(), Project.deleteMany(), Blog.deleteMany()]);
  console.log('Cleared existing data');

  // Create admin
  const admin = new Admin({
    username: 'admin',
    password: 'StudioNest@2024',
    email: 'admin@studionest.com',
    role: 'super-admin'
  });
  await admin.save();
  console.log('✅ Admin created — username: admin | password: StudioNest@2024');

  // Create projects
  const projects = [
    {
      title: 'Luminary Tower',
      category: 'Commercial',
      year: 2024,
      description: 'A 42-story mixed-use tower with parametric facade and integrated BIM coordination across all disciplines.',
      fullDescription: 'Luminary Tower redefines the city skyline with its innovative parametric facade system, designed through extensive BIM modeling. The building integrates retail, office, and residential spaces in a seamless vertical community. Full BIM coordination was delivered across structural, MEP, and architectural disciplines, achieving zero clash detection on completion.',
      imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
      location: 'Mumbai, Maharashtra',
      area: '85,000 sqm',
      client: 'Horizon Developers Ltd.',
      tags: ['BIM', 'High-Rise', 'Parametric', 'Mixed-Use'],
      featured: true,
      bimEnabled: true,
      status: 'Completed',
      order: 1
    },
    {
      title: 'Verdana Residences',
      category: 'Residential',
      year: 2024,
      description: 'A sustainable residential complex with biophilic design, green roofs, and passive energy strategies achieving net-zero certification.',
      fullDescription: 'Verdana Residences is a groundbreaking residential development that places sustainability at its core. Through careful BIM coordination, the project achieved LEED Platinum certification. The design integrates cascading green walls, rooftop gardens, and passive solar strategies that reduce energy consumption by 60%.',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      location: 'Pune, Maharashtra',
      area: '32,000 sqm',
      client: 'GreenLiving Corp.',
      tags: ['Sustainable', 'LEED', 'Biophilic', 'Net-Zero'],
      featured: true,
      bimEnabled: true,
      status: 'Completed',
      order: 2
    },
    {
      title: 'Heritage Cultural Center',
      category: 'Cultural',
      year: 2023,
      description: 'A bold civic institution celebrating regional heritage through bold geometric forms and dramatic light choreography.',
      imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80',
      location: 'Nagpur, Maharashtra',
      area: '18,500 sqm',
      client: 'Maharashtra Cultural Trust',
      tags: ['Cultural', 'Civic', 'Geometric', 'Heritage'],
      featured: true,
      bimEnabled: false,
      status: 'Completed',
      order: 3
    },
    {
      title: 'Skyline Lofts',
      category: 'Multi-Family',
      year: 2023,
      description: 'A 24-story residential tower with staggered balconies and panoramic views, fully coordinated through advanced BIM workflows.',
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      location: 'Bangalore, Karnataka',
      area: '28,000 sqm',
      client: 'Urban Nest Developers',
      tags: ['High-Rise', 'Residential', 'BIM', 'Urban'],
      featured: true,
      bimEnabled: true,
      status: 'Completed',
      order: 4
    },
    {
      title: 'Atrium Business Park',
      category: 'Commercial',
      year: 2023,
      description: 'An adaptive reuse of a former industrial building transformed into a light-filled collaborative workspace with exposed concrete.',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      location: 'Hyderabad, Telangana',
      area: '12,000 sqm',
      client: 'WorkSpace Global',
      tags: ['Adaptive Reuse', 'Commercial', 'Industrial', 'Workspace'],
      featured: true,
      bimEnabled: false,
      status: 'Completed',
      order: 5
    },
    {
      title: 'Zen Garden Villa',
      category: 'Residential',
      year: 2022,
      description: 'A Japanese-inspired luxury retreat organized around a central courtyard, blending natural timber, stone, and water elements.',
      imageUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
      location: 'Goa',
      area: '850 sqm',
      client: 'Private Client',
      tags: ['Luxury', 'Residential', 'Japanese', 'Courtyard'],
      featured: true,
      bimEnabled: false,
      status: 'Completed',
      order: 6
    }
  ];

  await Project.insertMany(projects);
  console.log('✅ Projects seeded');

  // Create blogs
  const blogs = [
    {
      title: 'The Future of BIM: How Building Information Modeling is Reshaping Architecture',
      slug: 'future-of-bim-reshaping-architecture-' + Date.now(),
      excerpt: 'Building Information Modeling is no longer just a drafting tool — it\'s become the central nervous system of modern architectural practice.',
      content: `<p>Building Information Modeling has fundamentally transformed how we design, document, and deliver buildings. At StudioNest, BIM is not just a software workflow — it's our design philosophy.</p>
<h2>From Drawings to Data</h2>
<p>Traditional architectural practice relied on 2D drawings that represented a building abstractly. BIM changes this by creating a rich, data-embedded 3D model where every element carries information about its material, cost, performance, and maintenance requirements.</p>
<p>This shift from drawing to data has profound implications for how buildings are designed and constructed. Clashes that would have been discovered on site — costing time and money — are now detected in the model before a single foundation is poured.</p>
<h2>Collaboration at Scale</h2>
<p>One of BIM's greatest strengths is enabling true multi-disciplinary collaboration. Architects, structural engineers, MEP consultants, and contractors all work within a shared model. At StudioNest, we've seen project delivery timelines reduce by up to 30% through BIM-coordinated workflows.</p>
<h2>The Future: Digital Twins</h2>
<p>The evolution of BIM is leading us toward digital twins — living models that update in real-time as buildings are occupied and operated. This represents a fundamental shift from buildings as finished products to buildings as dynamic, data-rich organisms.</p>`,
      author: 'Ar. Priya Sharma',
      category: 'BIM',
      tags: ['BIM', 'Technology', 'Future', 'Architecture'],
      imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
      published: true,
      featured: true
    },
    {
      title: 'Biophilic Design: Reconnecting Architecture with Nature',
      slug: 'biophilic-design-architecture-nature-' + Date.now(),
      excerpt: 'As cities grow denser, the need for nature-integrated architecture has never been more urgent. Biophilic design offers a path forward.',
      content: `<p>Biophilic design is grounded in the innate human need to connect with natural systems and processes. As our environments become increasingly urban, this connection becomes both more elusive and more essential.</p>
<h2>The Science Behind Biophilia</h2>
<p>Research consistently shows that exposure to natural elements — plants, water, natural light, and organic forms — reduces stress, improves cognitive function, and enhances overall wellbeing. Buildings designed with biophilic principles in mind create healthier, more productive environments.</p>
<h2>Beyond Green Walls</h2>
<p>True biophilic architecture goes beyond simply adding plants to a facade. It involves understanding how light moves through a space, how ventilation patterns can mimic natural breezes, and how materials can evoke the textures of the natural world.</p>
<p>At StudioNest, our Verdana Residences project exemplifies this approach — every design decision was filtered through the lens of human connection to nature.</p>`,
      author: 'Ar. Rahul Mehta',
      category: 'Design',
      tags: ['Biophilic', 'Sustainability', 'Nature', 'Wellbeing'],
      imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80',
      published: true,
      featured: false
    },
    {
      title: 'Net-Zero Buildings: The Architecture of Tomorrow, Built Today',
      slug: 'net-zero-buildings-architecture-tomorrow-' + Date.now(),
      excerpt: 'Net-zero energy buildings are no longer aspirational — they are achievable with today\'s technology and design intelligence.',
      content: `<p>The architecture profession faces its most significant responsibility in history: designing buildings that don't destroy the planet. Net-zero buildings — those that produce as much energy as they consume — are now technically and economically viable.</p>
<h2>Passive First, Active Second</h2>
<p>The most efficient path to net-zero begins with passive design strategies: orientation, insulation, thermal mass, and natural ventilation. By reducing energy demand at the design stage, the burden on active systems like solar panels and heat pumps is dramatically reduced.</p>
<h2>BIM's Role in Sustainability</h2>
<p>BIM plays a critical role in achieving net-zero targets. Energy modeling integrated within the BIM workflow allows designers to test performance before construction begins. At StudioNest, every project with sustainability targets undergoes comprehensive energy simulation in the design phase.</p>`,
      author: 'Ar. Ananya Singh',
      category: 'Sustainability',
      tags: ['Net-Zero', 'Sustainability', 'Energy', 'Green'],
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      published: true,
      featured: false
    }
  ];

  for (const blogData of blogs) {
    const blog = new Blog(blogData);
    // Manually set slug since pre-save won't match
    blog.slug = blogData.slug;
    await blog.save();
  }
  console.log('✅ Blogs seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log('Admin credentials: admin / StudioNest@2024');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
