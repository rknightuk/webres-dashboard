var broker = 'ws://test.mosquitto.org:8080';

$(function() {
	var subs = [
		{
			description: 'AirPi, Home',
			url: '/622197/weather'
		},
		{
			description: 'Philips HomeCooker Coffee',
			url: '/622197/coffee'
		},
		{
			description: 'Nest Thermostat',
			url: '/622197/nest'
		}
	];

	$.each(subs, function(index, sub) {
		block = $($('#block-template').text());
		topic = sub.url.replace('/622197/', '');
		block.addClass(topic);
		block.find('.x-title').html(sub.description);
		block.find('.x-url').text(sub.url);
		$('.mqtt-messages').append(block);
	});

	// GoSquared data
	
	$.getJSON( "inc/js/gs.json", function(data) {
		visitors = data.visitors;
		max = data.summary.max;
		avg = data.summary.avg;
		avg = avg.toFixed(2);
		active = data.active;
		meta = active + ' active \navg: ' + avg + ' max: ' + max;

		$('#stats-current').text(visitors);
		$('#stats-high').text(max);
		$('#stats-average').text(avg);
	});

	// MacStories RSS
	
	$(function(){
	url = 'http://www.macstories.net/feed/';
	$.ajax({
		type: "GET",
		url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=?&q=' + encodeURIComponent(url),
		dataType: 'json',
		error: function(){
		    alert('Unable to load feed, Incorrect path or invalid feed');
		},
		success: function(xml){
		    values = xml.responseData.feed.entries;
		    for (var i = 5; i >= 0; i--) {
		    	post = values[i];
		    	title = post.title;
		    	date = post.publishedDate.substr(0, 16);
		    	link = post.link;
		    	
		    	sub = $($('#sub-template').text());
		    	sub.attr('href', link);
		    	sub.find('.x-title').html(title);
		    	sub.find('.x-time').text(date);
		    	$('#rss-items').append(sub);
		    };
		}
	});
	});

});

var mows = require('mows')
	, client = mows.createClient(broker);

client.subscribe('/622197/weather')
	.subscribe('/622197/coffee')
	.subscribe('/622197/nest');

client.publish('/622197/weather', 'T: 15&deg;, H: 24.6%, L: 71.82 lux');
client.publish('/622197/coffee', 'Coffee is ready');
client.publish('/622197/nest', 'Temperature adjusted to 18&deg;c');

client.on('message', function (topic, message) {
	console.log("Message received");
	var time, sub;

	topic = topic.replace('/622197/', '');

	time = new Date();
	time = time.getHours() + ':' + (time.getMinutes()<10?'0':'') + time.getMinutes();
	
	sub = $($('#sub-template').text());
	sub.addClass('msg-'+topic);
	sub.find('.x-title').html(message);
	sub.find('.x-time').text(time);
	$('.'+ topic + ' .sub-list').prepend(sub);

	var messages = $('.msg-'+topic);

	if (messages.length > 5) {
		console.log('Hi');
		$('.msg-'+topic).last().fadeOut();
		setTimeout(function() {
			$('.msg-'+topic).last().remove();
		}, 500);
	}
});