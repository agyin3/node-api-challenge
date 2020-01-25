const express = require('express')
const Actions = require('../data/helpers/actionModel.js')

const router = express.Router()

router.use('/:id', validateActionId)

router.get('/', (req, res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(err => {
            res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
        })
})

router.get('/:id', (req, res) => {
    res.status(200).json(req.action)
})

router.delete('/:id', (req, res) => {
    const {id} = req.action
    Actions.remove(id)
        .then(() => {
            res.status(200).json({message: 'Action sucessfully deleted', action: {...req.action}})
        })
        .catch(err => {
            res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
        })
})

/* custom middleware */

async function validateActionId(req, res, next) {
    try {
        const action = await Actions.get(req.params.id)
        if(action) {
            req.action = action
            next()
        }else{
            res.status(400).json({message: 'Invalid action id'})
        }
    }catch(err) {
        res.status(500).json({errorMessage: `There was an error with your ${req.method} request`})
    }
}


module.exports = router