# IoT Receiver (3 topics)

Receives MQTT topics `gpsCoord`, `espInfo`, `gateway` and stores structured docs in MongoDB.
API exposes `/api/gps`, `/api/espinfo`, `/api/gateway`.

## Run
1) Edit `.env` if needed (broker IP).
2) `docker compose up -d --build`
3) API: http://localhost:3000/api/gps
   API: http://localhost:3000/api/espinfo
   API: http://localhost:3000/api/gateway
4) Mongo Express: http://localhost:8081
