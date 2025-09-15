# Mevo API

<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" />
  </a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank">
    <img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" />
  </a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank">
    <img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/>
  </a>
</p>

## Descrição

Projeto para Mevo. API voltada para o upload e consulta de arquivos CSV. O sistema trata e valida os dados seguindo as regras definidas em: https://github.com/brunolobo-mevo/dGVzdGU6bWV2b2JhY2tlbmQ

## Configuração do Projeto

### Instalação

```bash
npm install
```

### Executando a aplicação

```bash
# Desenvolvimento
npm run start

# Modo watch (desenvolvimento)
npm run start:dev

# Modo produção
npm run start:prod
```

## Arquivos de Teste

Foram criados alguns arquivos para testar as validações, incluindo diferentes tipos de erros como:

- CSV corrompido
- CSV vazio  
- CSV sem headers completos

**Localização:** Diretório `/data` do projeto

## Collections

Foi disponibilizado no diretório `/collections` um arquivo JSON para importar no Postman ou ferramentas similares e testar a API.

### Principais endpoints
  - `api/prescriptions/upload` (POST)
  - `api/prescriptions/upload/:id` (GET)

## Decisões Técnicas

Os principais pontos considerados para construir esta solução foram:

### Arquitetura

- **Service:** Orquestra todos os processos e workflows que organizam as regras de validação
- **Validators:** Responsável por organizar e validar as informações pós-parse para garantir validação correta
- **Utils:** Centraliza as lógicas com REGEX, mantendo bem definido o que cada regex faz (reutilizáveis quando possível)

### Adaptações

O documento disponibilizado possuía um header chamado **frequency**, mas como não estava na documentação do teste, foi entendido que seria um substituto de *days*. As validações foram adaptadas para `frequency`.

### Validação de CRM e CPF

A estratégia adotada para validação foi:

> **Regra:** Caso exista uma letra no conjunto de números, o código invalidará o registro.

Meu pensamento foi que: não podemos permitir que dados incorretos cheguem ao backend. Flexibilizar essas validações poderia causar problemas críticos futuramente ao aceitar dados inválidos.

### Processamento Assíncrono

Implementei o processamento assíncrono utilizando `setImmediate`. A abordagem funciona da seguinte forma:

- **Resposta imediata:** A API retorna instantaneamente o status inicial (`processing`) e progresso `0`
- **Processamento em lotes:** Os dados são processados em batches de 10 registros por vez, com um delay intencional de 2 segundos entre cada lote
- **Monitoramento de progresso:** O status e progresso atualizados podem ser consultados a qualquer momento através do endpoint `GET /api/prescriptions/upload/{uuid}`