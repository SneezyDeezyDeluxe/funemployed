const router = require('express').Router()
const {Recruiter} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const recruiters = await Recruiter.findAll()
    res.json(recruiters)
  } catch (err) {
    next(err)
  }
})
