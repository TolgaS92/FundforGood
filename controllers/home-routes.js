const router = require('express').Router();

const { Project } = require('../models');

const withAuth = require('../utils/auth');


router.get('/', async (req, res) => {
    try {
        const projectData = await Project.findAll();
        const projects = projectData.map((project) => 
            project.get({ plain:true })
        );
        res.render('homepage', {
            projects,
            logged_in: req.session.logged_in,
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
        const projectData = await Project.findOne({
            where: {
                user_id: req.session.user_id
            }
        });
        const project = projectData.get({ plain: true });
        res.render('project', { project, logged_in: req.session.logged_in });
    } catch (error) {
        console.log(err);
        res.status(500).json(err);
}
});

module.exports = router;
