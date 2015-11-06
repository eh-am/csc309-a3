var http = require('http');
var favs = require('./favs.json');
var url = require('url');
var fs = require('fs');
var path = require('path');


var server = http.createServer(function (req, res){
  var rest = url && url.parse(req.url).pathname; // get the rest parameter, eg. /tweets/
  var query = url.parse(req.url, true).query; // get the query if presented, eg. /tweets?test=123
  var filePath = __dirname + req.url; //the name of the file it is asking, eg. script.js


  if (routeIndex()) return; //if it was used, exit
  
  // creates an array with rest parameters
  // eg. rest[0] = users, rest[1] = timoreilly
  rest = breaksRestArguments(rest);
  routeTweets();
  routeUsers();



  /*********************/
  /****** Routers ******/
  /*********************/
  /**
  * Serve the files required for the index. 
  * Returns true in case it was needed
  */
  function routeIndex(){
    if (rest.length <= 1){ // serve index.html
      serveFile('./index.html', {"Content-Type": "text/html"});
      return true;
    }

    if (path.extname(filePath) === '.js'){ // serve js files
      serveFile(filePath, {"Content-Type": "text/javascript"});
      return true;
    }
    if (path.extname(filePath) === '.css'){ // serve css files
      serveFile(filePath, {"Content-Type": "text/css"});
      return true;
    }
    return false;
  }

  function routeTweets(){

    var relevant_fields = ["id_str", "text", "created_at", "retweet_count", "user.name", "user.screen_name"];
    var tweets;
    var result; // the result that will be returned

    // if it's not asking for tweets, do nothing
    if (rest[0] !== 'tweets') return;


    // prepare data
    tweets = removeDuplicatedObjects(favs, function (a, b){
      return a["id_str"] === b["id_str"];
    });



    /*************/
    /** Routing **/
    /*************/    
    // if it is asking for the index (eg /tweets/)
    if (rest.length < 2 && Object.keys(query).length === 0){
      result = tweets.map(function (tweet) {
        return getObjectWithRelevantFields(tweet, relevant_fields)
      });
      return returnJSON(result);
    }


    // if it is asking for a specific tweets (eg /tweets/1)
    if (Number.isInteger(parseInt(rest[1]))){
      //get only the relevant fields
      result = tweets.map(function (tweet) {
        return getObjectWithRelevantFields(tweet, relevant_fields)
      });
      
      // get the specific tweet specified by "id"
      result = (result.filter(function (tweet){
        if (tweet["id_str"] === rest[1])
          return true;
      })); 

      return returnJSON(result);
    }


    // if it is requesting external_link (eg. /tweets?field=external_link)
    if ('field' in query){
      if (query['field'] === 'external_links'){
        result = tweets.map(function (tweet){
          //if it has the field 'urls'
          if (tweet.entities != 'undefined' && "urls" in tweet.entities){
            // get each url
            urls = tweet.entities.urls.map(function (entity){
              return entity.display_url;
            });

            return urls;
          }
        });
        return returnJSON(result);
      }
    } 
  }
  


  function routeUsers(){
    var relevant_fields = ["id", "name", "screen_name", "location", "description", "url", "followers_count"];
    
    // if it's not asking for users, do nothing
    if (rest[0] !== 'users') return;

    // get the users with the relevant fields
    var users = favs.map(function (tweet){
      return getObjectWithRelevantFields(tweet.user, relevant_fields);
    });

    // remove duplicated objects
    users = removeDuplicatedObjects(users, function (a, b){
      if (a["id"] === b["id"]) return true;
      else return false;
    });
    

    /*************/
    /** Routing **/
    /*************/ 
    // if it is asking for the index (eg /users/)
    if (rest.length < 2 ){
      return returnJSON(users);
    }
    
    // if it is asking for a specific user (eg /users/foobar)
    if (rest[2] === 'tweets'){
      // if it is asking for his/hers tweets
      var users_filtered = favs.filter(function (tweet){
        if ( tweet.user.screen_name === rest[1])
          return true;
      }).map(function (tweet){
        return getObjectWithRelevantFields(tweet, ["text", "created_at"]);
      });
    }else {
      // /users/{username}
      var users_filtered = users.filter(function (user){
        if ( user.screen_name === rest[1])
          return true;
      });

    }

    returnJSON(users_filtered); 
  }


  /*********************/
  /****** HELPERS ******/
  /*********************/

  /**
  * Given a path and the type of the file,
  * serves the file to the client
  */
  function serveFile(path, contentType){
    var file = fs.readFileSync(path, 'utf8');
    res.writeHead(200, contentType);

    res.end(file);
  }


  function returnJSON(json){
    res.writeHead(200);
    // responds with in json format, idented with 5 spaces
    res.end(JSON.stringify(json, null, 5)); 
  }

  function breaksRestArguments(rest){
    return rest.split('/').filter(function(e){
      if (e !== '') return true; // removes unncecessary spaces
    });
  }
});

server.listen(3000);
console.log('listening on port 3000');





/*****************************/
/****** GENERAL HELPERS ******/
/*****************************/
/**
* Given an object and an array of the relevant fields,
* returns the object with only the relevant fields
* It is possible to filter fields such as "user.name"
*/
function getObjectWithRelevantFields(object, relevant_fields){
  var u = {};
  relevant_fields.forEach(function (field){
    if (field.indexOf('.') >= 0 &&  // if the property is in the format X.Y
        field.split('.')[0] in object){ // and X exists
      u[field] = eval("object." + field);
    }else {
      u[field] = object[field];  
    }
    
  });
  return u;
}


/**
* Returns an array of unique elements. The first argument
* is the array with duplicated objects,
* the second argument is the comparation function
*/
function removeDuplicatedObjects(array, cmp){
  var non_duplicates = [];

  array.forEach(function (element){
    // adds to array non_duplicates only non_duplicates values
    if (isElementInArray(non_duplicates, element, cmp) === false) non_duplicates.push(element);
  });

  return non_duplicates;

  function isElementInArray(array, obj, cmp){
    // loops through array comparing obj with element
    // if it encounters, returns true
    // otherwise, returns false
    return array.some(function (element){
         if (cmp(element, obj) === true) return true;
         else return false;
    });
  }
}