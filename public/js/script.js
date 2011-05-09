$(function(){

    window.Tweet = Backbone.Model.extend({});

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
            _.bindAll(this, "render", "setContent");
            this.model.bind('change', this.render);
            this.model.view = this;
        },

        render: function () {
            $(this.el).html(this.template.tmpl(this.model.toJSON()));
            return this;
        },

        setContent: function () {
            var content = this.model.attributes.text;
            this.$('.tweet-content').text(content);
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
        Tweets.add(_.map(tweets, function (tweet) {
            return new Tweet(tweet);
        }));

    };

    now.ready(function(){
        now.initiate(function (clientId) {
            $.getJSON('/data/tweets', {user: clientId}, function () {});
        });
    });
});
