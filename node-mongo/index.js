const MongoClient = require('mongoDB').MongoClient;
const assert =  require('assert');

const url = 'mongoDB://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url , (err,client)=>{

    assert.equal(err,null);

    console.log('Connected corrently to server!');

    const db=client.db(dbname);
    
});
