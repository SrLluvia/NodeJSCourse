const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller', function() {
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
        })
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

    it('error 500 if db access fails', function(done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'email@email.com',
                password: 'test'
            }
        };

        AuthController.login(req, {}, () => {}).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            //Wait for code to execute bc is async
            done();
        });

        User.findOne.restore();
    });

    it('valid user status for existing user', function(done){
        const req = {userId: '5c0f66b979af55031b34728a'}
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function(code){
                this.statusCode = code;
                return this;
            },
            json: function(data){
                this.userStatus = data.status;
            }
        };

        AuthController.getUserStatus(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am new!');
            done();
        });
    });
});