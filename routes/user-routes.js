const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validate-request.js');
const User = require('../models/user-model.js');
const generateToken = require('../utils/generate-token.js');
const BadRequestError = require('../errors/bad-request-error.js');
const { authUser }= require('../middlewares/validate-auth.js');

router.post('/api/signup',
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('You must supply Name'),
        body('mobileNumber')
            .trim()
            .isMobilePhone()
            .isLength({ min: 10, max: 10 })
            .withMessage('Mobile number must be valid'),
        body('email')
            .trim()
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply password')
    ], validateRequest, async (req, res, next) => {
        try {
            const { name, mobileNumber, email, password } = req.body;
            const isExistingUser = await User.findOne({ email });

            if (isExistingUser) {
                return next(new BadRequestError('Email is already registered'));
            }

            const user = new User({ name, mobileNumber, email, password });
            const result = await user.save();

            req.session = { token: generateToken({ id: result._id }) };
            res.status(201).send(result);

        } catch (error) {
            console.error(error);
            res.status(500).send('Something went wrong :(');
        }

    });


router.post('/api/signin',
    [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    validateRequest,
    async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Check if the user exists
            const user = await User.findOne({ email });
            if (!user) {
                return next(new BadRequestError('Invalid credentials'));
            }

            // Compare the provided password with the hashed password in the database
            const passwordMatch = password === user.password;
            if (!passwordMatch) {
                return next(new BadRequestError('Invalid credentials'));
            }

            // If successful, generate a JWT token

            const { password: _, __v, ...userWithoutPassword } = user.toObject();

            req.session = { token: generateToken({ id: user._id }) };

            res.send(userWithoutPassword);

        } catch (error) {
            console.error(error);
            res.status(500).send('Something went wrong :(');
        }
    }
);

router.get('/api/users',authUser, async (req, res, next) => {
    try {
        const id= req.userId;
        const user = await User.findById(id);
        if (!user) {
            res.status(404).send('User not found');
        }
        res.send(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong :(');
    }
})

module.exports = router;