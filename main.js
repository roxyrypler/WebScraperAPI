const PORT = 8080;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();


// api usage:
/*
    /vg?&inquiry=searchword eks bitcoin 
    This will return all articles on bitcoin
*/
app.get("/vg", (req, res) => {
    let param = req.query.inquiry;
    let paramCap = param.charAt(0).toUpperCase() + param.slice(1);
    axios.get("https://www.vg.no")
        .then((response) => {
            const html = response.data;
            let $ = cheerio.load(html);
            let responseArr = [];

            let items = $(".article-container");
            items.each((i, el) => {
                let base = $(el).children("a").children("div").children("h3").attr("aria-label");
                if (base !== undefined) {
                    if (base.includes(paramCap) || base.includes(param.toLowerCase())) {
                        let url = $(el).children("a").attr("href");
                        responseArr.push({
                            Title: base,
                            Link: url
                        });
                    }
                }
            });
            res.json(responseArr);
        }).catch((error) => {
            console.log(error);
        })
});

app.listen(PORT, () => {
    console.log(`server started at port: ${PORT}`)
});