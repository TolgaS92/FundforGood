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
            loggedIn: req.session.loggedIn,
        });
    } catch (error) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/project/:id', async (req, res) => {
    try {
        const projectData = await Project.findByPk(req.params.id);
        const project = projectData.get({ plain: true });
        res.render('project', { project });
    } catch (error) {
        console.log(err);
        res.status(500).json(err);
}
});

module.exports = router;