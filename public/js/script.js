$(function(){
    
    window.Tweet = Backbone.Model.extend({
    });

    window.TweetList = Backbone.Collection.extend({
        model: Tweet,

        localStorage: new Store("tweets")
    });

    var Tweets = new TweetList;

    window.TweetView = Backbone.View.extend({
        tagName: "li",

        template: _.template($("#tweet-template").html()),

        events: {},

        initialize: function () {
            _.bindAll(this, "render");
            this.model.bind('change', this.render);
            this.model.view = this;
        },

        render: function () {
            $(this.el).html(this.template(this.model.toJSON()));
            this.setContent();
            return this;
        },

        setContent: function () {
            var content = this.model.attributes.text;
            this.$('.tweet-content').text(content);
            
        }
    });
 
    window.AppView = Backbone.View.extend({
        el: $("#tweets"),

        initialize: function () {
            _.bindAll(this, 'render');

            Tweets.bind("add", function (tweet) {
                var view = new TweetView({model: tweet});
                App.el.append(view.render().el);
            });
        },

        render: function () {
            
        },

    });
    
    window.App = new AppView;

    now.show_tweets = function (tweets) {
        Tweets.add(_.map(tweets, function (tweet) {
            return new Tweet(tweet);
        }));
        
    };

    now.ready(function(){
        
    });
});
