# ![developers.italia](https://avatars1.githubusercontent.com/u/15377824?s=36&v=4 "developers.italia") GUI - App di valutazione dell'adesione ai modelli

#### Un applicativo desktop a supporto degli sviluppatori che aiuta a valutare la qualità dei siti istituzionali dei Comuni e delle scuole e la corrispondenza a molti dei criteri di conformità della misura 1.4.1 del PNRR Esperienza del cittadino nei servizi pubblici digitali.

Le App di valutazione sono strumenti che integrano la libreria [Lighthouse][lighthouse] ed effettuano test per la verifica della corretta adesione al [modello Comuni][modello-comuni] e al [modello scuole][modello-scuole] di Designers Italia.

[Scopri di più sulle App di valutazione][docs-app-valutazione].

## Funzionalità

- Possibilità di eseguire una scasione su un sito web in modo facilitato grazie ad una nuova esperienza utente.
- Possibilità di modificare l'accuratezza della scansione
- Possibilità di verificare specifici criteri
- Storico delle scansioni effettuate.

## Test del modello Scuole

| Test                                      | Descrizione                                                                                                                                                                                                                                     |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Criteri di conformità per la misura 1.4.1 | Vengono mostrati i risultati degli audit relativi ai [criteri di conformità del modello scuole](https://docs.italia.it/italia/designers-italia/design-scuole-docs/it/versione-corrente/conformita-modello-scuola.html).                         |
| Raccomandazioni non abbligatorie          | Vengono mostrati i risultati degli audit relativi alle [raccomandazioni progettuali del modello scuole](https://docs.italia.it/italia/designers-italia/design-scuole-docs/it/versione-corrente/conformita-modello-scuola.html#raccomandazioni). |
| Test aggiuntivi                           | Vengono mostrati i risultati di test standard forniti da lighthouse. Non sono rilevanti in termini di raggiungimento dei criteri di conformità, ma rappresentano comunque indicazioni utili a valutare eventuali miglioramenti del sito.        |

## Test del modello Comuni

| Test                                                         | Descrizione                                                                                                                                                                                                                                               |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Conformità al modello di sito comunale - Cittadino informato | Vengono mostrati i risultati degli audit relativi ai [criteri di conformità per il sito comunale](https://docs.italia.it/italia/designers-italia/design-comuni-docs/it/versione-corrente/conformita/conformita-modello-sito.html).                        |
| Raccomandazioni non abbligatorie                             | Vengono mostrati i risultati degli audit relativi alle [raccomandazioni progettuali per il sito comunale](https://docs.italia.it/italia/designers-italia/design-comuni-docs/it/versione-corrente/conformita/conformita-modello-sito.html#raccomandazioni) |
| Lighthouse                                                   | Vengono mostrati i risultati di test standard forniti da lighthouse. Non sono rilevanti in termini di raggiungimento dei criteri di conformità, ma rappresentano comunque indicazioni utili a valutare eventuali miglioramenti del sito.                  |

## Tecnologie

PA Website Validator utilizza le seguenti tecnologie

- [Node.js] - Javascript runtime
- [npm] - Gestore di pacchetti
- [Lighthouse] - Libreria principale estesa per l'esecuzione degli audit
- [Typescript] - Linguaggio di programmazione fortemente tipizzato che si basa su JavaScript
- [Electron] - Consente lo sviluppo della GUI di applicazioni desktop utilizzando tecnologie Web

## Requisiti

L'applicativo necessita un computer con almeno 16GB di RAM per una corretta esecuzione.

## Plugins

PA Website validator utilizza le seguenti dipendenze esterne principali

| Plugin              | Repository                        |
| ------------------- | --------------------------------- |
| Lighthouse          | [GitHub][lighthouse-url]          |
| Yargs               | [GitHub][yargs-url]               |
| Puppeteer           | [GitHub][puppeteer-url]           |
| Cheerio             | [GitHub][cheerio-url]             |
| JSDOM               | [GitHub][jsdom-url]               |
| Geo Ip              | [GitHub][geoip-url]               |
| Get SSL Certificate | [GitHub][get-ssl-certificate-url] |
| EJS                 | [GitHub][get-ejs]                 |

[lighthouse]: https://www.npmjs.com/package/lighthouse
[node.js]: http://nodejs.org
[npm]: https://www.npmjs.com/
[typescript]: https://www.typescriptlang.org/
[Electron]: https://www.electronjs.org/
[yargs-url]: https://github.com/yargs/yargs
[lighthouse-url]: https://github.com/GoogleChrome/lighthouse
[puppeteer-url]: https://github.com/puppeteer/puppeteer
[cheerio-url]: https://github.com/cheeriojs/cheerio
[jsdom-url]: https://github.com/jsdom/jsdom
[geoip-url]: https://github.com/geoip-lite/node-geoip
[get-ssl-certificate-url]: https://github.com/johncrisostomo/get-ssl-certificate
[modello-comuni]: https://designers.italia.it/modello/comuni
[modello-scuole]: https://designers.italia.it/modello/scuole
[docs-app-valutazione]: https://docs.italia.it/italia/designers-italia/app-valutazione-modelli-docs
[verifica-scuole]: https://docs.italia.it/italia/designers-italia/app-valutazione-modelli-docs/it/versione-attuale/requisiti-e-modalita-verifica-scuole.html
[verifica-comuni]: https://docs.italia.it/italia/designers-italia/app-valutazione-modelli-docs/it/versione-attuale/requisiti-e-modalita-verifica-comuni.html
[codici-http]: https://it.wikipedia.org/wiki/Codici_di_stato_HTTP
[get-ejs]: https://github.com/mde/ejs
