import { getDB } from "../database/db.js";

const COLLECTION = process.env.COLLECTION_GATEWAY || "gateway";

/**
 * Typical message (not JSON) published by gateway every 30s:
 * "Connected, IP: 192.168.1.50, RSSI: -70dBm"
 * We'll parse it into structured fields; if JSON is received, we store as-is.
 */
function parseGatewayMessage(str) {
  const t = String(str || "").trim();
  try {
    const j = JSON.parse(t);
    return {
      status: typeof j.status === "string" ? j.status : null,
      ip: typeof j.ip === "string" ? j.ip : null,
      rssi: j.rssi !== undefined ? Number(j.rssi) : null,
      raw: j,
    };
  } catch {
    const m = t.match(
      /^(Connected|Disconnected),\s*IP:\s*([^,]+),\s*RSSI:\s*(-?\d+)dBm$/i
    );
    if (m) {
      return {
        status: m[1][0].toUpperCase() + m[1].slice(1).toLowerCase(),
        ip: m[2].trim(),
        rssi: Number(m[3]),
      };
    }
    return { raw: t };
  }
}

export async function saveGatewayStatus(payload) {
  const db = getDB();
  const parsed = parseGatewayMessage(payload);
  const doc = { ts_insert: new Date(), ...parsed };
  await db.collection(COLLECTION).insertOne(doc);
  return doc;
}

export async function getLastGateway(limit = 20) {
  const db = getDB();
  return db
    .collection(COLLECTION)
    .find()
    .sort({ ts_insert: -1 })
    .limit(limit)
    .toArray();
}
