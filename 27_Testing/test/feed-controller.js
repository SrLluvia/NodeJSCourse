const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post');
const FeedController = require('../controllers/feed');

describe('Feed Controller', function() {
    //Connect to test db before all tests, only once
    before(function(done){
        mongoose.connect('mongodb+srv://admin:admin@cluster0.j8rsx4b.mongodb.net/test-backendjscourse')
        .then(result => {
            const user = new User({
                email: 'teest@test.com',
                password: 'test',
                name: 'Test',
                posts: [],
                _id: '5c0f66b979af55031b34728a'
            });
            return user.save();
        })
        .then(() => {
            done();
        });
    });

    //Deletes user after all tests, only once
    after(function(done){
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            }).then(() => {
                done();
            });
    });

    it('add post to the creator', function(done){
        const req = {
            body: {
                title: 'Test post',
                content: 'Tesstt'
            },
            file: {
                path: 'abc'
            },
            userId: '5c0f66b979af55031b34728a'
        };

        const res = {
            status: function(){
                return this;
            }, 
            json: function() {}
        };
        FeedController.createPost(req, res, () => {})
        .then((savedUser) => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done();
        });
    });
});