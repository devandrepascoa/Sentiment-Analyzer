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
    let response = await fetch(proxy_url + "https://news.google.com/search?q=" + query + "&hl=" + language, {
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
    let articles = gogpar.getElementsByClassName("NiLAwe y6IFtc R7GTQ keNKEd j7vNaf nID9nc")
    
    var headlines = []
    for (var i = 0; i < num_headlines; i++) {
        headlines[headlines.length] = articles[i].getElementsByTagName("h3")[0].innerText
    }

    return headlines
}

// https://www.google.com/search?q=covid&tbs=cdr:1,cd_min:5/5/2020,cd_max:5/5/2020&tbm=nws

var topic = ""
var plot_data = [["", ""], ["", 0]];

var drawChart = () => {
    var data = google.visualization.arrayToDataTable(plot_data);
    data.setRowProperty(0, 'style', 'background-color:magenta;');
    var options = {
        title: "Sentiment Analysis on " + topic + " Google News headlines for today",
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: {
            maxValue: 1.0,
            minValue: -1.0
        },
        chartArea: {
            backgroundColor: {
                fill: '#FF0000',
                fillOpacity: 0.1
            },
            width: "80%",
            height: "80%"
        },
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}

var addRowToHeadlinesTable = (t_body, counter, headline, sentiment) => {
    var tr = document.createElement('TR');


    var td_counter = document.createElement('TD')
    td_counter.textContent = counter
    tr.appendChild(td_counter)

    var td_headlines = document.createElement('TD')
    td_headlines.textContent = headline
    tr.appendChild(td_headlines)

    var td_sentiment = document.createElement('TD')
    td_sentiment.textContent = sentiment
    tr.appendChild(td_sentiment)

    t_body.appendChild(tr);
}

var clearTable = (t_body) => {
    t_body.innerHTML = null
}