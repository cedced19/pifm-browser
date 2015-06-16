#pifm-browser

A Node.js software to play musics on a __FM radio__.
Only on Raspberry Pi.

[![Build Status](https://travis-ci.org/cedced19/pifm-browser.svg)](https://travis-ci.org/cedced19/pifm-browser)

 ![](https://raw.githubusercontent.com/cedced19/pifm-browser/master/demo.png)

##What say laws ?
You do not have the right to broadcast radio in most countries.
I am __not__ at all responsible for your actions.

##Installation

```bash
$ git clone --depth=1 --branch=master https://github.com/cedced19/pifm-browser
$ cd ./pifm-browser/dist/
$ npm install --production
$ chmod 777 lib/pifm
$ node pifm-browser.js
```

You can place your musics anywhere in the folder.

##Configuration

You can change the frequency, rate or port on `config.json`

See default options:

```json
{
    "port": 7775,
    "audio": {
        "freq": 108.5,
        "rate": 22050
    }
}
```
