$(function(){
 
    now.show_tweets = function (tweets) {
        _.map(tweets, function (tweet) {
            $("#tweets").append("<li>"+tweet.user.screen_name+' :: '+tweet.text+"</li>");
        });
    };

    now.ready(function(){
       
    });
});
