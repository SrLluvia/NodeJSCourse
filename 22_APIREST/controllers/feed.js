const {validationResult} = require('express-validator');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: '111',
            title: 'First post', 
            content: 'This is the first post!', 
            imageUrl: 'images/pato.jpg',
            creator: {
                name:'Laaann'
            },
            createdAt: new Date()
        }]
    });
};

exports.postPost = (req, res, next) => {
    //Extracts errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        //422 = validation failed
        return res.status(422).json({
            message: 'Validation failed, entered failes is incorrect.', 
            errros: errors
        });
    }
    const title = req.body.title;
    const content = req.body.content;
    //Create post in db
    //201 = succes creating a resource
    res.status(201).json({
        message: 'Post created succesfully!',
        post: {
            _id: new Date().toISOString(), 
            title: title, 
            content: content, 
            creator: {name: 'Landeracio'},
            createdAt: new Date()
        }
    });
}