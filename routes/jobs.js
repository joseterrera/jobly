
const express = require('express');
const ExpressError = require('../helpers/ExpressError');
const { adminRequired, authRequired } = require('../middleware/auth');
const Job = require('../models/Job');
const { validate } = require('jsonschema');
const { jobNewSchema, jobUpdateSchema } = require('../schemas');

const router = express.Router({ mergeParams: true });


/** GET / => {jobs: [job, ...]} */

router.get('/', authRequired, async function(req, res, next) {
  try {
    const jobs = await Job.findAll(req.query);
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});


/** POST / {jobData}  => { jobs: job }*/

router.post('/', adminRequired, async function(req, res, next) {
  try {
    const validation = validate(req.body, jobNewSchema);

    if (!validation.valid) {
      throw new ExpressError(validation.errors.map(e => e.stack), 400);
    }

    const job = await Job.create(req.body);
    return res.status(201).json( { job });
  } catch(err) {
    return next(err);
  }
});


/** PATCH /[jobid]   {jobData } => { job: updatedJob } */
router.patch('/:id', adminRequired, async function(req, res, next) {
  try {
    if('id' in req.body) {
      throw new ExpressError('You are not allowed to change the ID', 400);
    }
    const validation = validate(req.body, jobUpdateSchema);
    if(!validation.valid) {
      throw new ExpressError(validation.errors.map(e => e.stack), 400);
    }
    const job = await Job.update(req.params.id, req.body);
    return res.json( { job });
  } catch(err) {
    return next(err);
  }
});

/** DELETE /[handle]  => { message: "User deleted" } */

router.delete('/:id', adminRequired, async function(req, res, next) {
  try {
    await Job.remove(req.params.id);
    return res.json( { message: 'Job Deleted' });
  } catch(err) {
    return next(err)
  }
});


/** POST /[id]/apply  {state} => {message: state} 
 * 
 * when we send a POST request to the job apply route, we can pass in a string of text about the state of the application, and if we don't pass anything specifically then it's going to be set to "applied" initially
 * 
 * 
*/

router.post('/:id/apply', authRequired, async function(req, res, next) {
  try {
    const state = req.body.state || 'applied';
    // Job.apply() method from models/job.js is called to find and check if the job exists, and then create an application and associate it with the job in the database.
    await Job.apply(req.params.id, res.locals.username.state);
    return res.json( { message: state })
  } catch(err) {
    return next(err);
  }
});

module.exports = router;