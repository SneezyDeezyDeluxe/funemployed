const router = require('express').Router();
const { Engineer } = require('../db/models');
module.exports = router;

router.get('/', async (req, res, next) => {
    try {
        const engineers = await Engineer.findAll({
            attributes: ['id', 'email']
        });
        res.json(engineers);
    } catch(err) {
        next(err)
    }
});