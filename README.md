## Start node server
#### (Optoin 1). Run app from console
1.  Set the following environment variables
```
export DOMINO_HOST=<Host name of your server>
export DOMINO_DB_FILE_PATH=<File path for your database>
export DOMINO_PROTON_PORT=<Proton port on your server>
```

2. Copy the domino-db archive to the root directory

3.  Build
```
npm install
npm run build
```

4.  Run
```
npm run start
```

#### (Optoin 2). Run app using Docker

1. Copy the domino-db archive to the root directory

2.  Build a Docker image
```
npm install
npm run build
docker build -f Dockerfile -t proton-dql-playground:latest .
```

3.  Run
```
docker run -it -p 3000:3000 \
-e DOMINO_HOST=<Host name of your server> \
-e DOMINO_DB_FILE_PATH=<File path for your database> \
-e DOMINO_PROTON_PORT=<Proton port on your server> \
proton-dql-playground:latest
```

#### (Option 3). Run app from Visual Studio Code
1. Open your local repository with Visual Studio Code
2. Set the following envitonment variables in [.vscode/launch.json](.vscode/launch.json)
```
"env": {
  "DOMINO_HOST": "<Host name of your server>",
  "DOMINO_DB_FILE_PATH": "<File path for your database>",
  "DOMINO_PROTON_PORT": "<Proton port on your server>",
},
```
3. Select **Debug** -> **Start Debugging**

## Play with app
1. Open http://localhost:3000/dql
1. Input a query for reading documents (e.g. `Form = 'Contact' and LastName = 'Parsons'`)
1. Click **execute**

Then, matched documents will be listed in JSON format
