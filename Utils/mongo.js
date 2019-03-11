const mongodb = require('mongodb');

const client = mongodb.MongoClient;

let _db;

let connect = () => {
    client.connect('mongodb://localhost:27017', (error, database) => {
        if (error) {
            console.log(error)
            process.exit(1)
        }
        console.log('Mongodb Connected!')
        _db = database.db('travelex_db');
    })
}

let read = () => {
    return _db.collection('users')
}

let create = (messages) => {
    return _db.collection('messages').insertMany(messages)
}

let update = () => {

}
let remove = () => {

}
module.exports = {
    connect,
    read,
    remove,
    create,
    update
}