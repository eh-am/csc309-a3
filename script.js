var buttons = [{
	//get all tweets, calls 127.0.0.1/tweets/
	'id' : '#get-all-tweets', 
	'url' : 'tweets',
}, {
	// get all users, calls 127.0.0.1/users
	'id' : '#get-all-users', 
	'url' : 'users',
},{
	// get a specific tweet, calls 127.0.0.1/tweet/{id}
	'id' : '#get-specific-tweet',
	'valueFrom' : '#input-specific-tweet',
	'url': 'tweets/{value}'
},{
	// get all external links, calls 127.0.0.1/tweets?field=external_links
	'id' : '#get-all-external-links',
	'url': 'tweets?field=external_links'
}, {
	// get a specific user, calls 127.0.0.1/{username}
	'id' : '#get-specific-user',
	'valueFrom' : '#input-specific-user',
	'url' : 'users/{value}'
}, {
	// get all tweets from a specific user, calls 127.0.0.1/users/{username}/tweets
	'id' : '#get-specific-user-tweets',
	'valueFrom' : '#input-specific-user-tweets',
	'url' : 'users/{value}/tweets'
}];

buttons.forEach(function (button){
	$(button.id).on('click', function (e){
		if ('valueFrom' in button){ // if it needs to get the value from an input
			var value = $(button.valueFrom).val();
			if (value.length <= 0) return;
			callAjaxAndUpdateContent(button.url.replace('{value}', value));
		}else 
			callAjaxAndUpdateContent(button.url)
	})
});


function callAjaxAndUpdateContent(url){
	$.ajax({
		url: url,
		success: function (data){
			// updates #content with the response
			$("#content").text(data);
		},
		error: function (err){
			// shows on the console
			console.log(err);
		}
	});
}