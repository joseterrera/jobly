/** Routes for users. */

const express = require('express');
const ExpressError = require('../helpers/ExpressError');
const { ensureCorrectUser, authRequired } = require('../middleware/auth');
const User = require('../models/User');
const { validate } = require('jsonschema');
const { userNewSchema, userUpdateSchema } = require('../schemas');
const createToken = require('../helpers/createToken');

const router = express.Router();



/**
 * @swagger
 *
 * /users:
 *   get:
 *     description: View a list of users, use the token you got when you successfuly registered (adjust token to _token).  Add token to the header /users?_token=token_here
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _token
 *         description: token that user gets when loggin in
 *         required: true
 *         type: string
 * 
 *     responses:
 *       200:
 *         description: list of users
 *         examples:
 * 
 *          application/json:  {
    "users": [
        {
            "username": "cocacola",
            "first_name": "cocacola",
            "last_name": "Lane",
            "email": "cocacola@yaghoo.com"
        },
        {
            "username": "test",
            "first_name": null,
            "last_name": null,
            "email": null
        },
        {
            "username": "whiskey",
            "first_name": "Whiskey",
            "last_name": "Lane",
            "email": "whiskey@rithmschool.com"
        },
        {
            "username": "whiskey1",
            "first_name": "Whiskey1",
            "last_name": "Lane1",
            "email": "whiskey1@rithmschool.com"
        },
        {
            "username": "whiskey2",
            "first_name": "Whiskey2",
            "last_name": "Lane1",
            "email": "whiskey2@rithmschool.com"
        }
    ]
}
 */


router.get('/', authRequired, async function(req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
 *
 * /users/{username}:
 *   get:
 *     description: View a list of users, use the token you got when you successfuly registered (adjust token to _token).  Add token to the header /users/username?_token=token_here
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _token
 *         description: token that user gets when loggin in
 *         required: true
 *         type: string
 * 
 *     responses:
 *       200:
 *         description: list of users
 *         examples:
 * 
 *          application/json:  {
  "user": {
    "username": "whiskey2",
    "first_name": "Whiskey2",
    "last_name": "Lane1",
    "photo_url": null,
    "jobs": []
  }
}
 */

router.get('/:username', authRequired, async function(req, res, next) {
  try {
    const user = await User.findOne(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
 *
 * /login:
 *   post:
 *     description: Post a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: User's email.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: first_name
 *         description: User's first name
 *         in: formData
 *         required: false
 *         type: string
 *       - name: last_name
 *         description: User's last name.
 *         in: formData
 *         required: false
 *         type: string 
 *     responses:
 *       200:
 *         description: login
 *         examples:
 * 
 *          application/json:  {
            "user": {
              "username": "whiskey2",
              "first_name": "Whiskey2",
              "last_name": "Lane1",
              "photo_url": null,
              "jobs": []
            }
        }
 */

router.post('/', async function(req, res, next) {
  try {
    const validation = validate(req.body, userNewSchema);

    if (!validation.valid) {
      throw new ExpressError(validation.errors.map(e => e.stack), 400);
    }

    const newUser = await User.register(req.body);
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[handle] {userData} => {user: updatedUser} */

router.patch('/:username', ensureCorrectUser, async function(req, res, next) {
  try {
    if ('username' in req.body || 'is_admin' in req.body) {
        throw new ExpressError(
          'You are not allowed to change username or is_admin properties.',
          400);
    }

    const validation = validate(req.body, userUpdateSchema);
    if (!validation.valid) {
      throw new ExpressError(validation.errors.map(e => e.stack), 400);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  {message: "User deleted"}  */

router.delete('/:username', ensureCorrectUser, async function(req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ message: 'User deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
