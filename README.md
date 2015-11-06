How to use


Run `node server.js` to start the server
Then access http://127.0.0.1:3000/ to access the index and navigate through the buttons, or 
access directly through the REST API:


The REST API handles the following cases, returning a formatted JSON to all of them.

- getting all tweets:
Acessing http://127.0.0.1/tweets will return ALL TWEETS, with the following fields:
["id", "text", "screen_name", "created_at", "retweet_count", "user.name"];

- getting all users:
Acessing http://127.0.0.1/tweets will return ALL USERS, with the following fields:
["id", "name", "screen_name", "location", "description", "url", "followers_count"];

- getting all external links:
Acessing http://127.0.0.1/tweets?field=external_link will return ONLY the external links from all tweets

- getting a specific tweet:
Acessing http://127.0.0.1/tweets/{id} will return a specific tweet identified by the ID provided. 
Eg. http://127.0.0.1/tweets/1254345234

- getting a specific user:
Acessing http://127.0.0.1/users/{username} will return a specific user identified by the username provided. 
Eg. http://127.0.0.1/users/timoreilly

- getting all tweets from a specific user:
Acessing http://127.0.0.1/users/{username}/tweets will return all tweets frmo a specific user identified by the username provided. 
Eg. http://127.0.0.1/users/timoreilly/tweets


(I am providing a custom favs.json with duplicated tweets from a user (SarahPrevette), just to
show te "Get All Tweets from a Specific User Funcionality").

