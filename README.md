# HoopDB-API
HoopDB's (https://github.com/nowlow/HoopDB) API

## Getting started
```bash
$ git clone git@github.com:nowlow/HoopDB-API.git
$ cd HoopDB-API
$ npm install
$ npm start
```

## How to use it
Look in the code to get all routes, it's basically the function names that can be found [here](http://naoufel.space/hoop).

You have to start by POST `/hoop/api/connect` with in body database where you want to connect and token to this database.
This will send you a token that you have to put in your HTTP Header with key : "user-token" and an "encryption-token" that you should keep to decrypt routes `/hoop/api/getData/:table` and `/hoop/api/listTables` only if you are logged-in, in other case it will send you a non-encrypted JSON

## License
[MIT](LICENSE)
