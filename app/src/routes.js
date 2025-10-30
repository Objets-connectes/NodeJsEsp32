import express from "express";
import { getLastGps } from "./repository/gps.repository.js";
import { getMapsCoord } from "./repository/gps.repository.js";
import { getLastEsp } from "./repository/esp.repository.js";
import { getLastGateway } from "./repository/gateway.repository.js";

const router = express.Router();

router.get("/gps", async (req, res) => {
  try {
    const docs = await getLastGps(20);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/mapsCoord", async (req, res) => {
  try {
    const docs = await getMapsCoord(20);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/espinfo", async (req, res) => {
  try {
    const docs = await getLastEsp(20);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/gateway", async (req, res) => {
  try {
    const docs = await getLastGateway(50);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
