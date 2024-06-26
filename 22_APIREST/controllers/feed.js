const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Post.find().countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find()
            .skip((currentPage -1) * perPage)
            .limit(perPage);
    })
    .then(posts => {
        res.status(200).json({
            message: 'Fetched posts succesfully', 
            posts: posts, 
            totalItems: totalItems
        });
    })
    .catch(err => {
        if(!err.statusCode){
            //500 = server side error
            err.statusCode = 500;
        }
        next(err);
    });
    
};

exports.postPost = (req, res, next) => {
    //Extracts errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered failes is incorrect.');
        //422 = validation failed
        error.statusCode = 422;
        throw error;
    }

    if(!req.file){
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.path.replace("\\" ,"/");
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    const post = new Post({
        title: title, 
        content: content, 
        imageUrl: imageUrl,
        creator: req.userId
    });
    post.save()
    .then(result => {
        return User.findById(req.userId);
        
    })
    .then(user => {
        creator = user;
        //Link post to the user creator
        user.posts.push(post);
        return user.save();
        //201 = succes creating a resource
        
    })
    .then(result => {
        res.status(201).json({
            message: 'Post created succesfully!',
            post: post,
            creator: {_id: creator._id, name: creator.name}
        });
    })
    .catch(err => {
        if(!err.statusCode){
            //500 = server side error
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if(!post) {
                const error = new Error('Could not find post');
                //404 = not found
                error.status = 404;
                throw error;
            }
            res.status(200).json({message: 'Post fetched', post: post});
        })
        .catch(err => {
            if(!err.statusCode){
                //500 = server side error
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered failes is incorrect.');
        //422 = validation failed
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if(req.file) {
        imageUrl = req.file.path.replace("\\","/");
    }
    if(!imageUrl) {
        const error = new Error('No file picked');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
    .then(post => {
        if(!post) {
            const error = new Error('Could not find post');
            //404 = not found
            error.status = 404;
            throw error;
        }

        if(post.creator.toString() !== req.userId){
            const error = new Error('Not authorized');
            //403 = authorization issues
            error.statusCode = 403;
            throw error;
        }

        if(imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save();
    })
    .then(result => {
        res.status(200).json({message: 'Post updated!', post: result});
    })
    .catch(err => {
        if(!err.statusCode){
            //500 = server side error
            err.statusCode = 500;
        }
        next(err);
    })
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if(!post) {
            const error = new Error('Could not find post');
            //404 = not found
            error.status = 404;
            throw error;
        }
        if(post.creator.toString() !== req.userId){
            const error = new Error('Not authorized');
            //403 = authorization issues
            error.statusCode = 403;
            throw error;
        }
        //Check logged in user
        clearImage(post.imageUrl);
        return Post.findByIdAndDelete(postId);
    })
    .then(result => {
        return User.findById(req.userId);
        
    })
    .then(user => {
        //Removes post deleted from user
        user.posts.pull(postId);
        return user.save();
    })
    .then(result => {
        res.status(200).json({message: 'Deleted post'});
    })
    .catch(err => {
        if(!err.statusCode){
            //500 = server side error
            err.statusCode = 500;
        }
        next(err);
    });
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}