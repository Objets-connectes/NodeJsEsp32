import mqtt from 'mqtt';
import pino from "pino";

import { saveGpsData } from '../repository/gps.repository.js';
import { saveEspInfo } from '../repository/esp.repository.js';
import { saveGatewayStatus } from '../repository/gateway.repository.js';

const log = pino({ level: process.env.LOG_LEVEL });

const TOPIC_GPS = process.env.TOPIC_GPS ;
const TOPIC_ESP = process.env.TOPIC_ESP ;
const TOPIC_GATEWAY = process.env.TOPIC_GATEWAY;


export function startMqtt() {
  const brokerUrl = process.env.MQTT_BROKER_URL ;
  const client = mqtt.connect(brokerUrl);

  client.on('connect', () => {
    log.info(`Client MQTT connecté à ${brokerUrl}`);
    
    const topics = [TOPIC_GPS, TOPIC_ESP, TOPIC_GATEWAY];
    client.subscribe(topics, (err) => {
      if (!err) {
        log.info(`Abonné aux topics: ${topics.join(', ')}`);
      } else {
        log.error(err, "Échec de l'abonnement MQTT");
      }
    });
  });

  client.on('message', async (topic, message) => {
    log.info('---------------------------------');
    log.info(`Message reçu du topic ${topic}:`);
    const messageString = message.toString();
    log.info(messageString);

    try {
      let doc;
      switch (topic) {
        case TOPIC_GPS:
          doc = await saveGpsData(JSON.parse(messageString));
          log.info({ data: doc }, 'Données (GPS) sauvegardées.');
          break;
          
        case TOPIC_ESP:
          doc = await saveEspInfo(JSON.parse(messageString));
          log.info({ data: doc }, 'Données (ESP) sauvegardées.');
          break;
          
        case TOPIC_GATEWAY:
          doc = await saveGatewayStatus(messageString);
          log.info({ data: doc }, 'Données (Gateway) sauvegardées.');
          break;
          
        default:
          log.warn(`Aucun gestionnaire pour le topic ${topic}`);
      }
    } catch (err) {
      log.error(err, 'ERREUR LORS DU TRAITEMENT DU MESSAGE');
    }
    log.info('---------------------------------');
  });

  client.on('error', (err) => {
    log.error(err, 'Erreur client MQTT:');
  });
}