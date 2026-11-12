const fs = require('node:fs');
const path = require('node:path');
const { MongoClient, ObjectId } = require('mongodb');
const { initializeFashionIds } = require('./fashion-identity');

(async () => {
  const client = await new MongoClient(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017').connect();
  try {
    const database = client.db(process.env.MONGODB_DB || 'Fashiondata');
    const rows = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/fashions.json'), 'utf8'));
    for (const row of rows) {
      row._id = ObjectId.isValid(row._id) ? new ObjectId(row._id) : row._id;
      await database.collection('Fashion').updateOne({ IdF: row.IdF }, { $setOnInsert: row }, { upsert: true });
    }
    await initializeFashionIds(database);
    console.log('Fashion data ready. Existing records preserved.');
  } finally {
    await client.close();
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
