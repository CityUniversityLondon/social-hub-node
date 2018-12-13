# social-hub-node
Social-hub develop using nodejs
## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
### Prerequisites
What things you need to install the software and how to install them
```
nodejs can downloaded from https://nodejs.org/en/
```

### Installing
A step by step series of examples that tell you how to get a development env running
download all necessary packages
```
npm install
```
navigate to the root of the folder social-hub-node to run the express server
you will get errors showing because reference to files are completely different on the server.
```
node server.js
```

### Adding new social account or updating a token
If a token has expire or a new twitter account needs to be added this can be done in the accounts/accounts.json
```
just add a new node to either social accounts
"accounts":{
  "twitter": ....
  "instagram": ....
}
```

### server.js
server.js uses express to handle API request
the project uses cron to handle time schedule to execute scoial api requests and push SOAP requests to Squiz matrix
CRON schedule is setup to run every hour.
The index.js file is used to handle the application end points

