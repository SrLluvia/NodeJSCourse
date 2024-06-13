const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/user');

module.exports = {
    //This syntax is necessary for async/await
    createUser: async function(args, req){
        const errors = [];
        if(!validator.isEmail(args.userInput.email)){
            errors.push({message: 'Email is invalid'});
        }
        
        if(validator.isEmpty(args.userInput.password) || !validator.isLength(args.userInput.password, {min: 5})){
            errors.push({message: 'Password too short'});
        }
        if(errors.length > 0){
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const exisitngUser = await User.findOne({email: args.userInput.email});
        if(exisitngUser){
            const error = new Error('User exists already');
            throw error;
        }
        //We dont have a user with that email
        const hashedPw = await bcrypt.hash(args.userInput.password, 12);
        const user = new User({
            email: args.userInput.email,
            name: args.userInput.name,
            password: hashedPw
        });
        const createdUser = await user.save();
        return {...createdUser._doc, _id: createdUser._id.toString()};
    }
};