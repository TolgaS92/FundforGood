const router = require('express').Router();

const { Project,User } = require('../models');

const withAuth = require('../utils/auth');


router.get('/', async (req, res) => {
    try {
        // Get all projects and JOIN with user data
        const projectData = await Project.findAll({
          include: [
            {
              model: User,
              attributes: ['name'],
            },
          ],
        });
    
        // Serialize data so the template can read it
        const projects = projectData.map((project) => project.get({ plain: true }));
    
        // Pass serialized data and session flag into template
        res.render('homepage', { 
          projects, 
          logged_in: req.session.logged_in 
        });
    } catch (error) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/project/:id', withAuth, async (req, res) => {
    try {
        const projectData = await Project.findByPk(req.params.id);
        const project = projectData.get({ plain: true });
        res.render('project', { project, logged_in: req.session.logged_in });
    } catch (error) {
        console.log(err);
        res.status(500).json(err);
}
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
      res.redirect('/');
      return;
    }
  
    res.render('login');
  });

router.get('/createproject',  (req,res) => {
        if(req.session.logged_in) {
            res.render('createproject');
        } else {
            res.redirect('/login');
        }
    
});


router.get('/profile', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Project}],
        });
        const user = userData.get({ plain: true });
        res.render('profile', {
            ...user,
            logged_in: true
        });
    } catch (error) {
        res.status(500).json(err);
    }
});

module.exports = router;
