import { getDB } from "../database/db.js";

const COLLECTION = process.env.COLLECTION_ESP || "espInfo";

/**
 * Expected JSON from ESP (LoRa TX):
 * {
 *   "type":"espinfo","id":"gps-node-01","temp":32.5,"seq":11,
 *   "uptime":3600,"wifi_ssid":"Sk-y","wifi_ip":"192.168.1.20"
 * }
 * or when disconnected:
 * {
 *   "type":"espinfo","id":"...","temp":...,"seq":...,"uptime":...,
 *   "wifi_rssi":0,"wifi_ip":"0.0.0.0"
 * }
 */
export async function saveEspInfo(data) {
  const db = getDB();
  const doc = {
    type: "espinfo",
    id: data.id,
    temp: data.temp !== undefined ? Number(data.temp) : null,
    seq: data.seq !== undefined ? Number(data.seq) : null,
    uptime: data.uptime !== undefined ? Number(data.uptime) : null,
    wifi_ssid: typeof data.wifi_ssid === "string" ? data.wifi_ssid : null,
    wifi_ip: typeof data.wifi_ip === "string" ? data.wifi_ip : null,
    wifi_rssi: data.wifi_rssi !== undefined ? Number(data.wifi_rssi) : null,
    ts_insert: new Date(),
  };
  await db.collection(COLLECTION).insertOne(doc);
  return doc;
}

export async function getLastEsp(limit = 20) {
  const db = getDB();
  return db
    .collection(COLLECTION)
    .find()
    .sort({ ts_insert: -1 })
    .limit(limit)
    .toArray();
}
