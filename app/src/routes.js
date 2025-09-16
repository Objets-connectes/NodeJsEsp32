import express from "express";
import { getLastGps } from "./gpsService.js";
import { getLastEsp } from "./espService.js";
import { getLastGateway } from "./gatewayService.js";

const router = express.Router();

router.get("/gps", async (req, res) => {
  try {
    const docs = await getLastGps(20);
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
