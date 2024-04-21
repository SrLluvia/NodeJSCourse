const express = require('express');
//Subpackage
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .normalizeEmail(),
        body('password')
            .isLength({min: 3})
            .isAlphanumeric()
            .trim()
    ],
     authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post('/signup', 
    [
        check('email').
            isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, {req}) => {
                return User.findOne({email: value})
                .then(userDoc => {
                    if(userDoc){
                        return new Promise.reject('Email exists already, please pick a different one');
                    }
                });
            })
            .normalizeEmail(),
        body('password')
            .isLength({min: 5})
            .isAlphanumeric()
            .trim(),
        body('confirmPassword').custom((value, {req}) => {
            if (value !== req.body.password){
                throw new Error('Passwords have to match');
            }
            return true;
        })
    ],
    authController.postSignup);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/new-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;