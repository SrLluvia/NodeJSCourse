const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect(
        'mongodb+srv://admin:admin@cluster0.j8rsx4b.mongodb.net/?retryWrites=true&w=majority'
    )
        .then(result => {
            console.log('Connected!');
            callback(result);
        })
        .catch(err =>{
            console.log(err);
        });
}

module.exports = mongoConnect;



