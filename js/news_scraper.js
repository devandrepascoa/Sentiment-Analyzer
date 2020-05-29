/**
 * Function for fetching the HTML for a google news webpage based on certain parameters
 * 
 * @param {String} query Query for searching, includes the topic and other things like limiting the date
 * @param {String} language The language which the query will be searched on, check SUP_LANGS_NEWS for languages
 */
var getGoogleNewsHTML = async (query, language, date) => {
    if (!languageExists(language, "news")) throw new Error("Language not supported for google news")

    //Date logic for requesting a specific day(+- some hours due tue before after accuracy)
    var before = new Date(date.getTime())
    var after = new Date(date.getTime())
    after.setDate(after.getDate() - 1)
    query += " after:" + getYMDFormat(after)
    query += " before:" + getYMDFormat(before)
    
    //Used to enable cors anywhere using a proxy, required due to cors in google server
    //not enabling a request from any domain, and since origin header is unmodifiable by the browsers
    //due to the CORS Policy, the request must be sent to a proxy where the
    // Access-Control-Allow-Origin will be set to * (all domains)
    let proxy_url = "https://cors-anywhere.herokuapp.com/"
    let url = proxy_url + "https://news.google.com/search?q=" + query + "&hl=" + language;
    
    let response = await fetch(url, {
        method: "GET"
    })
    return await response.text()
}

/**
 * Scraps from a google news html page it's headlines
 * 
 * @param {String} response_html HTML Page in plain text
 * @param {Number} num_headlines Integer with number of headlines (max=100)
 * @returns {Array<String>} An Array of headlines(Strings)
 */
var scrape_headlines = (response_html, num_headlines = 5) => {
    if (num_headlines > 100) throw Error("Num Headlines Exceeded")
    let domparser = new DOMParser() //Initializes a dom for understanding the google news data
    let gogpar = domparser.parseFromString(response_html, "text/html") //Google news HTML DOM parser
    let articles = gogpar.getElementsByClassName("NiLAwe y6IFtc R7GTQ keNKEd j7vNaf nID9nc") //HTML Collection
    
    var headlines = []
    for (var i = 0; i < num_headlines; i++) {
        headlines[headlines.length] = articles[i].getElementsByTagName("h3")[0].innerText
    }

    return headlines
}