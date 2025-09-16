import mqtt from "mqtt";
import pino from "pino";
import { saveGpsData } from "./gpsService.js";
import { saveEspInfo } from "./espService.js";
import { saveGatewayStatus } from "./gatewayService.js";

const log = pino({ level: process.env.LOG_LEVEL || "info" });

export function startMqtt() {
  const url = `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`;
  const client = mqtt.connect(url);

  client.on("connect", () => {
    log.info(`Connected to MQTT broker at ${url}`);
    client.subscribe(["gpsCoord", "espInfo", "gateway"], (err) => {
      if (err) log.error({ err }, "Failed to subscribe topics");
      else log.info("Subscribed to gpsCoord, espInfo, gateway");
    });
  });

  client.on("message", async (topic, message) => {
    try {
      const payloadStr = message.toString();
      if (topic === "gpsCoord") {
        const json = JSON.parse(payloadStr);
        const saved = await saveGpsData(json);
        log.info({ saved }, "GPS data saved");
      } else if (topic === "espInfo") {
        const json = JSON.parse(payloadStr);
        const saved = await saveEspInfo(json);
        log.info({ saved }, "ESP info saved");
      } else if (topic === "gateway") {
        const saved = await saveGatewayStatus(payloadStr);
        log.info({ saved }, "Gateway status saved");
      }
    } catch (err) {
      log.error({ err, topic }, "Failed to process MQTT message");
    }
  });

  return client;
}
