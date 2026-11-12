// Keep existing valid IDs. Assign missing/duplicate IDs before enabling uniqueness.
async function initializeFashionIds(database) {
  const fashions = database.collection('Fashion');
  const rows = await fashions.find({}, { projection: { IdF: 1 } }).sort({ _id: 1 }).toArray();
  const used = new Set();
  const pending = [];
  let maximum = 0;
  for (const row of rows) {
    if (Number.isSafeInteger(row.IdF) && row.IdF > 0 && !used.has(row.IdF)) {
      used.add(row.IdF);
      maximum = Math.max(maximum, row.IdF);
    } else {
      pending.push(row);
    }
  }
  for (const row of pending) {
    await fashions.updateOne({ _id: row._id }, { $set: { IdF: ++maximum } });
  }
  await fashions.createIndex({ IdF: 1 }, { unique: true });
  await database.collection('Counters').updateOne(
    { _id: 'Fashion.IdF' }, { $max: { value: maximum } }, { upsert: true },
  );
}

async function nextFashionId(database) {
  const counter = await database.collection('Counters').findOneAndUpdate(
    { _id: 'Fashion.IdF' }, { $inc: { value: 1 } },
    { upsert: true, returnDocument: 'after' },
  );
  if (!Number.isSafeInteger(counter.value)) throw new Error('Fashion ID limit reached');
  return counter.value;
}

module.exports = { initializeFashionIds, nextFashionId };
