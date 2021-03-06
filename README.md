## Register an app
If you would like to play with IAM and Domino Access Services, register this app using the IAM Admin Service (The callback URL is `{app_origin}/iam/callback`).

https://doc.cwpcollaboration.com/appdevpack/docs/en/iam_admin_ui_guide.html#register-application

## Start node server
#### (Optoin 1). Run app from console
1. Copy the domino-db and domino-node-iam-client archives to the root directory

2. Copy [.env.sample](.env.sample) as `.env` and edit the environment variables in the 

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

1. Copy the domino-db domino-node-iam-client archives to the root directory

2. Copy [.env.sample](.env.sample) as `.env` and edit the environment variables in the 

3.  Build a Docker image
```
docker build -f Dockerfile -t domino-appdev-playground:latest .
```

3.  Run
```
docker run -it -p 3000:3000 domino-appdev-playground:latest
```

#### (Option 3). Run app from Visual Studio Code
1. Open your local repository with Visual Studio Code
1. Copy the domino-db domino-node-iam-client archives to the root directory
1. Copy [.env.sample](.env.sample) as `.env` and edit the environment variables in the 
1. Select **Debug** -> **Start Debugging**

## Play with app
1. Open `{app_origin}/playground`
1. Input a query for reading documents (e.g. `LastName = 'Parsons'`), or an endpoint for domino access servies (e.g. `{domino_origin}/{mail_db}/api/calendar/events`).
1. Click **Execute**

Then, matched documents will be listed in JSON format

![](screenrecording.gif)
