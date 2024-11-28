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

## Tipologia download applicativo

Di seguito sono elencati i file eseguibili di PA Website Validator, suddivisi per sistema operativo e architettura supportata

| Sistema operativo              | Nome applicativo                        |
| ------------------- | --------------------------------- |
| MacOS (arm64)                 | DTD-AppDiValutazione-XYZ-arm64-mac.zip |
| MacOS Intel                | DTD-AppDiValutazione-XYZ-mac.zip |
| Windows                 | DTD-AppDiValutazione-XYZ-win.zip |
| Linux                 | DTD-AppDiValutazione-XYZ.AppImage |

## Abilitazione app su MacOS

Potresti ricevere un avviso da MacOS che indica che l’app proviene da uno sviluppatore non riconosciuto. Per abilitare l’app, segui questi passaggi dopo aver scaricato il file ZIP:

1. Apri il Terminale.
2. Esegui il seguente comando:

```sh
xattr -rd com.apple.quarantine DTD-AppDiValutazione-XYZ-mac.zip
```

Questo comando rimuove le restrizioni impostate dal sistema per consentire l’apertura del file.

## Abilitazione app su Windows

Potresti ricevere un avviso da Windows che indica che l’app proviene da uno sviluppatore non riconosciuto. Per procedere con l’installazione, segui questi passaggi dopo aver scaricato il file ZIP:

1. Fai clic sul file .exe.
2. Nella finestra di avviso, clicca su “Ulteriori informazioni”.
3. Seleziona il pulsante “Esegui comunque” per avviare l’app.

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
