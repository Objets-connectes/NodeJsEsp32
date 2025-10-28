import { getDB } from "../database/db.js";

const COLLECTION = process.env.COLLECTION_GPS || "gpsCoord";

export async function saveGpsData(data) {
  const db = getDB();
  const doc = {
    type: "gpscoord",
    id: data.id,
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    sequence: Number(data.sequence),
    satellites: Number(data.satellites),
    hdop: Number(data.hdop),
    datetime: new Date(data.datetime),
    ts_insert: new Date(),
  };
  await db.collection(COLLECTION).insertOne(doc);
  return doc;
}

export async function getLastGps(limit = 10) {
  const db = getDB();
  return db
    .collection(COLLECTION)
    .find()
    .sort({ datetime: -1, ts_insert: -1 })
    .limit(limit)
    .toArray();
}
