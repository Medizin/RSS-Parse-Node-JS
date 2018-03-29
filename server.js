const express = require('express'),
      path    = require('path'),
      app     = express(),
      Parser  = require('rss-parser'),
      parser  = new Parser(),
      request = require('request'),
      rp      = require('request-promise'),
      cheerio = require('cheerio');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/news/:count', function (req, res) {
    (async () => {
        let feed   = await parser.parseURL('https://www.057.ua/rss'),
            links  = collectLinks(req.params.count, feed),
            result = [];

        links.forEach((url) => {
            const options = {
                uri: url,
                transform: (body) => {
                    return cheerio.load(body);
                },
                json: true
            };

            rp(options)
                .then(($) => {
                    let tempObj = {};

                    tempObj.title   = $(".title-container").text();
                    tempObj.content = $(".article-text").text();
                    tempObj.link    = url;

                    result.push(tempObj);
                })
                .catch((err) => {
                    console.log("Произошла ошибка: " + err);
                });
        });

        // Пока только начал осваивать promises и async/await поэтому пришлось использовать костыль.
        setTimeout(() => {res.send(result)}, 3000);
    })();
});

function collectLinks(value, rssFeed) {
    let links = [];

    for(let i = 0; i <= value.slice(1) - 1; i++) {
        links.push(rssFeed.items[i].link);
    }

    return links
}

app.listen(8080, () => {
    console.log("Server has started.")
});