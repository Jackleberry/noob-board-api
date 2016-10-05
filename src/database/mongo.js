import mongodb from 'mongodb';
import assert from 'assert';

const MongoClient = mongodb.MongoClient;

var url = process.env.DATABASE_URL || 'mongodb://localhost:27017/noob-board';

const fetchNoobs = (noob, callback) => {
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    let noobs = db.collection('noobs');
    let search = noob ? {'name': noob} : {};
    noobs.find(search).toArray((error, docs) => {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(docs);
      callback(docs);
    });

    db.close();
  });
};

const insertNoob = (name, callback) => {
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    let noobs = db.collection('noobs');
    noobs.insertOne({
      name,
      noobPoints: 0,
      assassinPoints: 1,
      outOfAction: false
    }, (error, result) => {
      assert.equal(error, null);
      assert.equal(1, result.result.n);
      assert.equal(1, result.ops.length);
      callback();
    });

    db.close();
  });
};

export default {
  fetchNoobs,
  insertNoob
};
