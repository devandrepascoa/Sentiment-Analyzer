const SUP_LANGS_NEWS = {
    "en-US": "English",
    "pt-PT": "Portuguese",
    "es-ES": "Spanish",
    "ko": "Korean",
    "ja": "Japanese",
    "it": "Italian",
    "de": "German",
    "fr-FR": "French",
    "zh-CN": "Chinese"
}

/**
 * Function for fetching the HTML for a google news webpage based on certain parameters
 * 
 * @param {String} query Query for searching, includes the topic and other things like limiting the date
 * @param {String} language The language which the query will be searched on, check SUP_LANGS_NEWS for languages
 */
async function getGoogleNewsHTML(query, language) {
    //Used to enable cors anywhere using a proxy, required due to cors in google server
    //not enabling a request from any domain, and since origin header is unmodifiable by the browsers
    //due to the CORS Policy, the request must be sent to a proxy where the
    // Access-Control-Allow-Origin will be set to * (all domains)
    if (!SUP_LANGS_NEWS.hasOwnProperty(language)) throw new Error("Language not supported for google news")
    let proxy_url = "https://cors-anywhere.herokuapp.com/"
    let response = await fetch(proxy_url + "https://news.google.com/search?q=" + query + "&hl=" + language, {
        method: "GET"
    })
    return await response.text()
}

/**
 * Scraps from a google news html page the headlines
 * 
 * @param {String} response_html HTML Page in plain text
 * @param {Number} num_headlines Integer with number of headlines (max=100)
 * @returns {Array<String>} An Array of headlines(Strings)
 */
function scrape_headlines(response_html, num_headlines=5) {
    if(num_headlines > 100) throw Error("Num Headlines Exceeded")
    let domparser = new DOMParser() //Initializes a dom for understanding the google news data
    let gogpar = domparser.parseFromString(response_html, "text/html") //Google news HTML DOM parser
    let articles = gogpar.getElementsByClassName("NiLAwe y6IFtc R7GTQ keNKEd j7vNaf nID9nc")

    var headlines = []
    for (var i = 0; i < num_headlines; i++) {
        headlines[headlines.length] = articles[i].getElementsByTagName("h3")[0].innerText
    }

    return headlines
}


/**
 * Converts unreadable data from the google sentiment analysis API into
 * readable data
 * 
 * @param {JSON} JSON response from the analyze_sentiment function
 * @returns {String} positive, negative, mixed or neutral
 */
function getReadableSentiment(response) {
    let score = response.documentSentiment.score
    let magnitude = response.documentSentiment.magnitude
    if (score > 0.25) { //Positive post
        return "The topic is positive"
    } else if (score < -0.25) { //Negative post
        return "The topic is negative"
    } else { //Neutral or Mixed
        if (magnitude > 0.25) { //Mixed, may have negative and positive content
            return "The topic is mixed(negative/positive)"
        } else {//Neutral, has no emotional 
            return "The topic is neutral"
        }
    }
}

function drawChart() {
    var data = google.visualization.arrayToDataTable(plot_data);
    data.setRowProperty(0, 'style', 'background-color:magenta;');
    var options = {
        title: "Sentiment Analysis of the past 100 days on -> " + topic + " topic",
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
          }, 
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}

var topic = "COVID-19"
var plot_data = [["TOP-5", "Sentimental Analysis Score"], ["", 0]];

(async () => {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    var google_news_html = await getGoogleNewsHTML(topic, "pt-PT")
    var headlines = scrape_headlines(google_news_html)

    for (var i = 0; i < headlines.length; i++) {
        var response = await analyze_sentiment(headlines[i])
        console.log(headlines[i])
        console.log(getReadableSentiment(response))
        plot_data.push([i, response.documentSentiment.score])
        drawChart()
    }

})()

