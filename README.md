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

### Updating password for Matrix user to authenticate SOAP request
Authentication is require to communcaite with SOAP server see https://matrix.squiz.net/manuals/web-services/chapters/soap-server
for further details.

the password is made up with the username and password decode to base64 there are various tool online to do this, once you have a base64 encoded results replace below

```
"squizSocialUser":{
		"user":"socialtest",
		"base64": "PASTE HERE"
	}
```

### server.js
server.js uses express to handle API request
the project uses cron to handle time schedule to execute scoial api requests and push SOAP requests to Squiz matrix
CRON schedule is setup to run every hour.
The index.js file is used to handle the application end points

# on the server
## Folder structure
The js files are place on the server https://webdev.city.ac.uk/ 
/var/node/social-hub-node/

In the social-api folder contains files that interacts with the social API. twitterApi.js uses a 3rd part package to interact with the twitter API (twitter npm).

# 1. Social media accounts
The Social Media Hub is able to pull data from the following types of account: Twitter, Facebook, YouTube and Instagram.

There exists a City University role account rbgr090 (email: socialhub@city.ac.uk) that has been set up for the Web Team. This email address was used to register an account with each of the 4 social media platforms. The social media platforms require the setup of an app or client (and associated keys and/or access tokens) in order to use their APIs. 

If you ever need to login to the City University role account, go to https://email.city.ac.uk and obtain the password from LastPass. Look for “socialhub - role account”. 

The URLs for managing our apps and clients are listed below. Their dashboards have changed several times since our Social Media Hub was developed, so details given here might differ from how it is in the future. The login details for the 4 accounts are in LastPass.

## 1.1 Twitter
* Dashboard https://apps.twitter.com
* LastPass: "socialhub - twitter account"
* There are 2 twitter apps (“City University Social Hub” and “City University Social Hub 2”). There are rate limits on API usage (per app), thus 2 apps were created to spread the load.
* Click on one of the apps to view its details, then on the "Keys and Access Tokens" tab for the credentials that are required for accessing the API. The 4 pieces of information required to access the API are the Consumer Key, Consumer Secret, Access Token and Access Token Secret.
* Further details on how to use the API are found at https://developer.twitter.com/en/docs/basics/getting-started.

## 1.2 Facebook
* Dashboard https://developers.facebook.com
* LastPass: "socialhub - facebook account"
* The specified App Token is required to access the API.
* Further details on how to use the API are found at https://developers.facebook.com/docs/graph-api

## 1.3 YouTube
* Dashboard https://console.developers.google.com/apis/credentials?project=socialhub-208511
* LastPass: "socialhub - youtube account"
* In the Credentials screen, the API key with name social-media-hub is used to access the YouTube API.
* Further details on how to use the API are found at https://developers.google.com/youtube/v3/docs.

## 1.4 Instagram
* Dashboard https://www.instagram.com/developer/clients/manage
* LastPass: "socialhub - instagram account"
* Currently, our client app is in sandbox mode but this is sufficient for our purposes. If we require greater rate limits in the future, then the client app will need to be submitted to Instagram for approval. The steps for obtaining the access tokens are:
1. In the "Manage Clients" screen, click the MANAGE button, then the Sandbox tab to see the list of Instagram accounts that are listed as sandbox users for our client app. Use this screen to invite additional Instagram accounts to be sandbox users. If the Instagram account is a sandbox user of our client app, the client app is able to access the data of that Instagram account.
2. The Instagram account will receive the invite. Ask Sabrina Francis (City's social Media officer) for the login details. Login to that Instagram account and accept the pending invite.
3. While still logged into that Instagram account, visit this URL in a web browser https://api.instagram.com/oauth/authorize/?client_id=5ec21eadc65d4ac5a82fa7af62d932a9&redirect_uri=https://www.city.ac.uk&response_type=token. The long string specified by the client_id is the identity of our client app.
4. A pop-up box will appear. Authorize it for that Instagram user and client app.
5. The URL in the browser will be redirected to something like  https://www.city.ac.uk/#access_token=xxxxxxx. Note down the value of the access_token parameter from the URL. This will need to be specified in our PHP application in order to access the Instagram API.
* Further details on how to use the API are found at https://www.instagram.com/developer.
