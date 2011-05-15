$(function(){

    window.Tweet = Backbone.Model.extend({
        initialize: function () {
            _.bindAll(this, "get_image");
            this.get_image();
        },

        get_image: function () {
            var self = this;
            now.extract_pic(this.attributes.image_link, function (url) {
                self.set({image_url: url});
            });
        }
    });

    window.TweetList = Backbone.Collection.extend({
        model: Tweet,

        localStorage: new Store("tweets")
    });

    var Tweets = new TweetList;

    window.TweetView = Backbone.View.extend({
        tagName: "li",

        template: $("#tweet-template"),

        events: {},

        initialize: function () {
            _.bindAll(this, "render");
            this.model.bind('change', this.render);
            this.model.view = this;
        },

        render: function () {
            console.log("rendering!");
            $(this.el).html(this.template.tmpl(this.model.toJSON()));
            return this;
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

        }

    });

    window.App = new AppView;

    now.show_tweets = function (tweets) {
        Tweets.add(_.map(tweets, function (tweet) {;
            return new Tweet(tweet);
        }));

    };

    now.ready(function(){
        now.initiate(function (clientId) {
            $.getJSON('/data/tweets', {user: clientId}, function () {});
        });
    });
});
