const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

//Groups tests
describe('Auth middleware', function(){
    it('should throw error if no auth header', function (){
        const req = {
            get: function(){
                return null;
            }
        };
        
        //bind calls the middleware itself
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated.');
    });
    
    it('should throw error if auth header is one string', function (){
        const req = {
            get: function(){
                return 'abc';
            }
        };
        //It thorws any error
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });

    it('userId after decoding token', function(){
        const req = {
            get: function(headerName){
                return 'Bearer qwerty'
            }
        };

        //By default replace it with an empty function
        //object that has the method, actual method
        sinon.stub(jwt, 'verify');
        //What it should return
        jwt.verify.returns({userId: 'abc'});

        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        //Restore original function
        jwt.verify.restore();
    });
})

