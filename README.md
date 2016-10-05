#Noob Board API

###Setup

`npm install`

###Starting the API running

`npm start`

###Putting it on Heroku

Ensure you have (heroku installed)[https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up]

Create the app on Heroku. You can specify a region here too.

'heroku create'

Specify your port (in your code) like this to allow Heroku to use it's port and you to use your port locally

`const port = process.env.PORT || 3002;`

Specify the mongo add on

`heroku addons:create mongolab:sandbox`

Check the config to see your mongo uri

`heroku config`

Specify your url to connect to mongo (in your code) like this to allow Heroku to use the mongo we just setup and you to use your local mongo

`var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/noob-board';`

Deploy to Heroku

`git push heroku master`

The first time you deploy you should ensure that at least one instance is running

`heroku ps:scale web=1`

See if it worked! 

`heroku open`
