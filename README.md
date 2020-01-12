
<h3 align="center">Galt•Project Geodesic Libraries (@galtproject/geodesic)</h3>
<div align="center">
</div>

<p align="center"> <img src="https://github.com/galtproject/galtproject-docs/blob/master/whitepaper/images/Artboard2.png" alt="galtproject/geodesic" width="500"/></p>

<div align="center">
<a href="https://travis-ci.org/galtspace/galtproject-geodesic" targe="_blank"><img alt="pipeline status" src="https://travis-ci.org/galtspace/galtproject-geodesic.svg?branch=master" /></a>
<img src="https://img.shields.io/github/issues-raw/galtproject/galtproject-geodesic.svg?color=green&style=flat-square" alt="Opened issues"/>
<img src="https://img.shields.io/github/issues-closed-raw/galtproject/galtproject-geodesic.svg?color=blue&style=flat-square" alt="Closed issues" />
<img src="https://img.shields.io/github/issues-pr-closed/galtproject/galtproject-geodesic.svg?color=green&style=flat-square" alt="Closed PR"/>
<img src="https://img.shields.io/github/issues-pr-raw/galtproject/galtproject-geodesic.svg?color=green&style=flat-square" alt="Opened PR"/>
</div>
<br/>
<br/>
<div align="center">
  <img src="https://img.shields.io/github/contributors/galtproject/galtproject-geodesic?style=flat-square" alt="Сontributors" />
  <img src="https://img.shields.io/badge/contributions-welcome-orange.svg?style=flat-square" alt="Contributions Welcome" />
  <a href="https://t.me/galtproject"><img src="https://img.shields.io/badge/Join%20Us%20On-Telegram-2599D2.svg?style=flat-square" alt="Join Us On Telegram" /></a>
  <a href="https://twitter.com/galtproject"><img src="https://img.shields.io/twitter/follow/galtproject?label=Follow&style=social" alt="Follow us on Twitter" /></a>
</div>
<br/>


**Galt Project is an international decentralized land and real estate property registry governed by DAO (Decentralized autonomous organization) and self-governance protocol for communities of homeowners built on top of Ethereum blockchain.**

[@galtproject-geodesic](https://github.com/galtproject/galtproject-geodesic) repo contains libraries for coordinate transformation operations, as well as various implementations of computational geometry algorithms for operations with polygons.

:page_with_curl: **For more information read the [Whitepaper](https://github.com/galtproject/galtproject-docs/blob/master/whitepaper/en/Whitepaper.md)**

:construction: **@galtproject-core stage: Testnet**

At the moment, [@galtproject-geodesic](https://github.com/galtproject/galtproject-geodesic) contracts are deployed in our private Testnet(RPC: https://https-rpc.testnet-58.galtproject.io/, Explorer: https://explorer.testnet-58.galtproject.io/), we are preparing a deployment of the first version of contracts on the mainnet.

:bomb: **Security review status: Unaudited**

Unfortunately, we do not currently have sufficient resources for a full audit of the created contracts. 

Our team believes that the Galt Project will enable people to transact land and real estate without borders and third parties. As well as creating self-governing communities without corruption and with transparent governance processes. 
You can contribute to this by checking the code and creating an issue, or by making a small donation to the address of the team **0x98064493535B22F6EbDf475341F0A6DaaBb7b538**.

Also you can use our [Galt Project dApp](https://app.galtproject.io/) on mainnet with Private Property Registries functionality to support Galt Project!

:memo:**Get started contributing with a good first [issue](https://github.com/galtproject/galtproject-core/issues)**.

## Usage

* `make cleanup` - remove solidity build artifacts
* `make compile` - compile solidity files, executes `make cleanup` before compilation
* `make test` - run tests
* `make coverage` - run solidity coverage
* `make lint` - run solidity and javascript linters
* `make ganache` - run local pre-configured ganache

For more information check out `Makefile`
