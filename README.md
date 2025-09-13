<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Projeto para Mevo. API voltada para o upload e consulta de arquivos .csv. Iremos tratar e validar os dados seguindo as regras escritas em https://github.com/brunolobo-mevo/dGVzdGU6bWV2b2JhY2tlbmQ.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## files to use in test
Eu criei alguns arquivos para testarem as validações, assim como criei alguns .csv para simular diferentes tipos de erros como:
  - .csv corrompido
  - .csv vazio
  - .csv sem os headers completos
Os arquivos se encontram no diretorio <i>/data</i> do projeto

## technical decisions
Os principais pontos levados em consideração para construir essa solução foram:
  - usar o .service para orquestrar todos os processos e workflows que iriam organizar as regras de validação
  - .validators fica responsável por organizar e validar as informações pós parse para que elas sejam validadas corretamente.
  - .utils centralizou boa parte das logicas que usei com REGEX, assim consegui deixar bem definido o que cada regex faz (sou péssimo em regex e lembrar oq cada um faz). Alguns inclusive são reutilizáveis (por isso em utils)
  - O documento disponibilizado possuia uma header chamada <strong>frequency</strong>, mas como ela não estava na documentação do teste, entendi que ela foi uma substituta de <i>days</i>. Seguindo essa linha, eu adaptei as validações para frequency.
  - Sobre a validação do CRM e CPF, a linha de pensamento que decidi seguir com essas tabelas foi a seguinte: Caso exista uma letra no conjunto de numeros, o código vai invalidar. Não podemos deixar que exista a possibilidade de que o CRM ou CPF cheguem com valores errados no backend. Se flexibilizarmos para isso, podemos ter problemas críticos futuramente em aceitar dados errados e deixar para nós tratarmos eles.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
# mevo-test
