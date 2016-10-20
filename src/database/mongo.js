import mongodb from 'mongodb';
import assert from 'assert';

const MongoClient = mongodb.MongoClient;

var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/noob-board';

const fetchNoobs = (id, callback) => {
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    console.log(`params: id: ${id}`);
    let noobs = db.collection('noobs');
    let search = id ? {_id: mongodb.ObjectId(id)} : {};
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
    console.log(`params: name: ${name}`);

    let noobs = db.collection('noobs');
    noobs.insertOne({
      name,
      noobPoints: 0,
      assassinPoints: 0,
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

const deleteNoob = (id, callback) => {
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    let noobs = db.collection('noobs');
    noobs.deleteOne({_id: mongodb.ObjectId(id)}, (error, result) => {
      assert.equal(error, null);
      callback();
    });

    db.close();
  });
};

const incrementNoobPoints = (id, callback) => {
  changePoints(id, {'noobPoints': 1}, callback);
};

const incrementAssassinPoints = (id, callback) => {
  changePoints(id, {'assassinPoints': 1}, callback);
};

const changePoints = (id, query, callback) => {
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    let noobs = db.collection('noobs');
    noobs.updateOne(
      { _id: mongodb.ObjectId(id) },
      { $inc: query },
      (error, result) => {
        assert.equal(error, null);
        callback(result);
      });

    db.close();
  });
};

const decrementNoobPoints = (id, callback) => {
  changePoints(id, {'noobPoints': -1}, callback);
};

const decrementAssassinPoints = (id, callback) => {
  changePoints(id, {'assassinPoints': -1}, callback);
};

export default {
  fetchNoobs,
  insertNoob,
  deleteNoob,
  incrementNoobPoints,
  incrementAssassinPoints,
  decrementNoobPoints,
  decrementAssassinPoints
};
