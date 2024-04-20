const User = require('../models/user');

const crypto = require('crypto');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

//sendgrid returns a config. that nodemailer can use 
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg
        });
    }
    User.findOne({email: email})
    .then(user => {
        if(!user){
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password)
        .then(match => {
            if(match){
                req.session.isLoggedIn = true;
                req.session.user = user;
                //Need to save in case it redirects too quickly
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                });
            }
            req.flash('error', 'Invalid email or password');
            res.redirect('/login');
        })
        .catch(err => {
            res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    }else{
        message = null;
    }

    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        //422 = validation failed
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg
        });
    }
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: {items: []}
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
            /*
            return transporter.sendMail({
                to: email,
                //Need a valid email sender
                from: 'test@test.com',
                subject: 'Signup suceeded!',
                html: '<h1>You sucessfully signed up!</h1>'
            });*/
        })
        .catch(err => {
            console.log(err)
        });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset password',
        errorMessage: message
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err){
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
        .then(user => {
            if (!user){
                req.flash('error', 'No account with that email found');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 36000000;
            return user.save();
        })
        .then(result => {
            if(result){
                return res.redirect('/');
                /*
                return transporter.sendMail({
                    to: req.body.email,
                    //Need a valid email sender
                    from: 'test@test.com',
                    subject: 'Password reset',
                    html: `
                        <p>You requested a password reset </p>
                        <p>Click this <a href="/http://http://localhost:6006/reset/${token}">link</a> to set a new password </p>
                    `
                });*/
            }
        })
        .catch(err => {
            console.log(err);
        });
    })
}

exports.getNewPassword = (req, res, next) => {
    //Check for token
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
        let message = req.flash('error');
        if(message.length > 0) {
            message = message[0];
        }else{
            message = null;
        }
        res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            errorMessage: message,
            //For the POST req where we update the pass
            userId: user._id,
            passwordToken: token
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => {
        console.log(err);
    })

}
  