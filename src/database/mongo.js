import mongodb from 'mongodb';
import assert from 'assert';

const MongoClient = mongodb.MongoClient;

var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/noob-board';

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
      callback(docs.map(doc => Object.assign(doc, {id: doc._id})));
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

const deleteNoob = (name, callback) => {
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    let noobs = db.collection('noobs');
    noobs.deleteOne({name}, (error, result) => {
      assert.equal(error, null);
      callback();
    });

    db.close();
  });
};

const incrementPoints = (name, pointsType, callback) => {
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    let noobs = db.collection('noobs');
    let query = {};
    query[pointsType] = 1;
    noobs.updateOne(
      { name },
      { $inc: query },
      (error, result) => {
        assert.equal(error, null);
        callback(result);
    });

    db.close();
  });
};

const incrementNoobPoints = (name, callback) => {
  incrementPoints(name, 'noobPoints', callback);
};

const incrementAssassinPoints = (name, callback) => {
  incrementPoints(name, 'assassinPoints', callback);
};

export default {
  fetchNoobs,
  insertNoob,
  deleteNoob,
  incrementNoobPoints,
  incrementAssassinPoints
};
