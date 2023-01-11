import Parser from "rss-parser"
let parser = new Parser();

export default defineEventHandler(async (event) => {
    let feed = await parser.parseURL("https://rss.aelf.org/evangile");
    let evangile: any = "";
    let title: any = ""
    if (feed.items.length == 1 || feed.items.length == 2) {
        evangile = feed.items[0].content;
        title = feed.items[0].title;

    } else {
        evangile = feed.items[3].content;
        title = feed.items[3].title;
    }

    return {
        title: title.substring(11),
        evangile
    }
    // return {
    //     api: 'works'
    // }
})