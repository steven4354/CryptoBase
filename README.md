# CryptoBase Source Code

A Dashboard for All Your Cryptocurrencies.

Features: 
- Allows you to see news articles from around the web on specifically all the coins you have invested in. 
- Also tracks the prices of cryptocurrencies 
- Constantly updates a list of all the available cryptocurrencies available for purchase.


### Key Technologies Used and Technical Challenges 

Technologies used: 
- Google OAuth 
- MongoDB database and PassportJS for user authentification and keeping a list of user's coins
- REST APIS from CryptoMarket and News APIs
- HandlebarsJS for the view (utitlized an MVC model)

Challenges:
- News API limited amount of articles shown when search parameters where too restrictive, (i.e. having bitcoin, ethereum, ripple... all in one search) -> resolved by pulling one API request for each coin 
- User authentification issues (unable to sign Users in) -> resolution: created a mongo.js file and config file to make sure database was reconnnected to correctly on application startup and resolved a few syntax issues on setting up the scheme

### Testing/Running on Local Machine Prerequisites

What things you need to install the software and how to install them

* node
* npm
* mongodb 

How to deploy this on your local machine

```
git clone <project-folder-on-github>
cd <cloned-project-folder-on-your-local-machine>
npm install
nodemon app.js
```

Additionally, to use the google oauth, create a .env file and add these items to
it:

```
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available,
see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Steven Li** - _Initial work_ -
