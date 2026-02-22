# Telemetry Project

Projeto com dois microserviços em NestJS para ingestão e processamento de telemetria.

## Serviços
- gateway-service — expõe API HTTP para receber telemetria e publica no Kafka (topic `telemetry.raw`).
  - Endpoint: POST /v1/telemetry — implementado em [gateway-service/src/api/controllers/v1/telemetry.controller.ts](gateway-service/src/api/controllers/v1/telemetry.controller.ts)  
  - Use case: [`PostTelemetryUseCase`](gateway-service/src/application/use-cases/post-telemetry.usecase.ts)  
  - Adapter Kafka: [gateway-service/src/infra/messaging/kafka-producer.adapter.ts](gateway-service/src/infra/messaging/kafka-producer.adapter.ts)  
  - Entidade Telemetry: [`Telemetry`](gateway-service/src/domain/entities/telemetry.entity.ts)  
  - Config: [gateway-service/package.json](gateway-service/package.json)

- processing-service — consome mensagens Kafka, processa e salva estado corrente, histórico e metadados; publica stream em Redis.
  - Kafka consumer: [processing-service/src/infra/messaging/telemetry.consumer.ts](processing-service/src/infra/messaging/telemetry.consumer.ts)  
  - Use case principal: [`ProcessTelemetryUseCase`](processing-service/src/application/usecases/process-telemetry.usecase.ts)  
  - Endpoints HTTP:
    - GET /status/:machine_id — [processing-service/src/api/telemetry.controller.ts](processing-service/src/api/telemetry.controller.ts) -> [`GetStatusUseCase`](processing-service/src/application/usecases/get-status.usecase.ts)
    - GET /history/:machine_id — [processing-service/src/api/telemetry.controller.ts](processing-service/src/api/telemetry.controller.ts) -> [`GetHistoryUseCase`](processing-service/src/application/usecases/get-history.usecase.ts)
  - Adapters:
    - Redis current status: [processing-service/src/infra/adapters/redis.current-status.adapter.ts](processing-service/src/infra/adapters/redis.current-status.adapter.ts) — provê [`CURRENT_STATUS_REPO`](processing-service/src/application/ports/current-status.repository.ts)
    - InfluxDB history: [processing-service/src/infra/adapters/influx.history.adapter.ts](processing-service/src/infra/adapters/influx.history.adapter.ts) — provê [`HISTORY_REPO`](processing-service/src/application/ports/history.repository.ts)
    - MongoDB metadata: [processing-service/src/infra/adapters/mongodb.metadata.adapter.ts](processing-service/src/infra/adapters/mongodb.metadata.adapter.ts) — provê [`METADATA_REPO`](processing-service/src/application/ports/metadata.repository.ts)
    - Redis stream (real-time): [processing-service/src/infra/adapters/redis-stream.adapter.ts](processing-service/src/infra/adapters/redis-stream.adapter.ts) — provê [`REAL_TIME_STREAM`](processing-service/src/application/ports/real-time-stream.port.ts)
  - Entidade Telemetry: [`Telemetry`](processing-service/src/domain/entities/telemetry.entity.ts)  
  - Config: [processing-service/package.json](processing-service/package.json)

## Tecnologias
- Node.js + TypeScript
- NestJS
- Kafka (Confluent images via Docker) + Zookeeper
- Redis
- MongoDB
- InfluxDB (v2)
- Docker & Docker Compose
- Bibliotecas principais: kafkajs/@nestjs/microservices, ioredis, mongodb, @influxdata/influxdb-client, class-validator, class-transformer

## Arquivos importantes
- Orquestração Docker: [docker-compose.yml](docker-compose.yml)  
- Exemplo de variáveis de ambiente: [.env.example](.env.example)  
- Entrypoints: [gateway-service/src/main.ts](gateway-service/src/main.ts), [processing-service/src/main.ts](processing-service/src/main.ts)  
- Constantes/ports (ex.: mensagens/repos):  
  - [`MESSAGING_EVENT_BUS`](gateway-service/src/application/ports/messaging-event-bus.port.ts)  
  - [`CURRENT_STATUS_REPO`](processing-service/src/application/ports/current-status.repository.ts)  
  - [`HISTORY_REPO`](processing-service/src/application/ports/history.repository.ts)  
  - [`METADATA_REPO`](processing-service/src/application/ports/metadata.repository.ts)  
  - [`REAL_TIME_STREAM`](processing-service/src/application/ports/real-time-stream.port.ts)

## Instalação e uso via Docker (recomendado)
1. Copie variáveis de ambiente:
   - cp .env.example .env
   - Ajuste se necessário: [`.env.example`](.env.example)
2. Levantar toda a stack:
   - docker-compose up -d
3. Verificar logs/health:
   - docker-compose ps
   - docker-compose logs -f gateway-service
4. Testes rápidos:
   - Publicar telemetria (Gateway):  
     curl -X POST http://localhost:3000/v1/telemetry -H "Content-Type: application/json" -d '{"lat":0,"lng":0,"speed":50,"fuel":70,"machine_id":"m1","timestamp":"2026-01-01T00:00:00Z"}'
   - Status/processamento (Processing):  
     curl http://localhost:4000/status/m1  
     curl http://localhost:4000/history/m1

Ports configuradas em [docker-compose.yml](docker-compose.yml): gateway 3000, processing 4000, Kafka 9092, Zookeeper 2181, Redis 6379, Mongo 27017, InfluxDB 8086.

## Dependências externas (onde baixar)
- Node.js (runtime de desenvolvimento): https://nodejs.org/
- Docker: https://docs.docker.com/get-docker/
- Docker Compose: https://docs.docker.com/compose/install/
- As outras dependências (Kafka, Zookeeper, Redis, MongoDB, InfluxDB) são fornecidas via imagens Docker listadas em [docker-compose.yml](docker-compose.yml).

Observações:
- Para executar localmente sem Docker: npm install && npm run start:dev em cada serviço (`gateway-service` e `processing-service`). Veja [gateway-service/package.json](gateway-service/package.json) e [processing-service/package.json](processing-service/package.json).
- Topic Kafka usado: `telemetry.raw` (publicado por [KafkaProducerAdapter](gateway-service/src/infra/messaging/kafka-producer.adapter.ts) e consumido por [TelemetryConsumer](processing-service/src/infra/messaging/telemetry.consumer.ts)).
