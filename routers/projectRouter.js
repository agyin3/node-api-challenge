const express = require('express')
const Projects = require('../data/helpers/projectModel.js')
const Actions = require('../data/helpers/actionModel.js')

const router = express.Router()

router.use('/:id', validateProjectById)

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
        })
})

router.get('/:id', (req, res) => {
    res.status(200).json(req.project)
})

router.get('/:id/actions', (req,res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json({actions})
        })
        .catch(err => {
            res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
        })
})

router.post('/', validateProject, async (req, res) => {
    try {
        const project = await Projects.insert(req.new)
        res.status(201).json({message: 'Project successfully created', project})
    }catch(err) {
        res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
    }
})

router.put('/:id', validateProject, async (req, res) => {
    const {id} = req.project
    try {
        const project = await Projects.update(id, req.new)
        res.status(201).json({message: 'Project successfully updated', project})
    }catch(err) {
        res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
    }
})

router.delete('/:id', (req, res) => {
    const {id} = req.project
    Projects.remove(id)
        .then(() => {
            res.status(200).json({message: 'Project sucessfully deleted', project: {...req.project}})
        })
        .catch(err => {
            res.status(500).json({errorMessage: `THere was an error with your ${req.method} request`})
        })
})

router.post('/:id/actions', validateAction, (req,res) => {
    const {id} = req.project
    const actionInfo = {...req.action, project_id: id}
    Actions.insert(actionInfo) 
        .then(action => {
            res.status(201).json({message: 'Action successfully added', action})
        })
        .catch(err => {
            res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
        })
})

/* custom middleware */

async function validateProjectById(req,res,next) {
    try {
        const project = await Projects.get(req.params.id)
        if(project) {
            req.project = project
            next()
        }else{
            res.status(400).json({message: 'Invalid project id'})
        }
    }catch(err) {
        res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
    }
} 

function validateProject(req, res, next) {
    if(req.project) {
        const {name, description, completed} = req.project
        req.body.name && !req.body.description && !req.body.completed ? project = {...req.body, description, completed} :
        req.body.description && !req.body.name && !req.body.completed ? project = {...req.body, name,completed} :
        req.body.completed && !req.body.name && !req.body.description ? project ={...req.body, name, description} :
        !req.body.description ? project = {...req.body, description, completed} :
        !req.body.name ? project = {...req.body, name, completed} :
        project = {name, description, completed}
    }else{
        project = req.body
    }
    console.log(project)
    if(!project) {
        res.status(400).json({message: 'Missing project data'})
    }else if(!project.name || !project.description) {
        res.status(404).json({message: 'Missing required name or description field'})
    }else {
        req.new = project
        next()
    }
}

function validateAction(req, res, next) {
    console.log(req.body.description)
    if(!req.body) {
        res.status(400).json({message: 'Missing action data'})
    }else if(!req.body.description || !req.body.notes) {
        res.status(404).json({message: 'Missing required notes or description field'})
    }else if(req.body.description.length > 128) {
        res.status(404).json({message: 'Description must be less than 128 characters'})
    }else {
        req.action = req.body
        next()
    }
}


module.exports = router