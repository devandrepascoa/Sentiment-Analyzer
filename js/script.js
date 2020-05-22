
window.onload = () => {
    var languageList = document.getElementById("sel_snt")

    for (language of SUP_LANGS) {
        languageList.options.add(new Option(language.value, language.sent, null))
    }
}

var fillGoogleNews = async () => {
    let doc = document.getElementById("doc_snt")
    //names have to be exactly this because setOnLoadCallback does not accept parameters
    topic = doc.value
    plot_data = [["TOP-5", "Sentimental Analysis Score"], ["", 0]];
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    var date = new Date()
    var google_news_html = await getGoogleNewsHTML(topic, "pt-PT", date)
    var headlines = scrape_headlines(google_news_html)
    var t_body = document.getElementById("top5-table-body")
    clearTable(t_body)

    for (var i = 0; i < headlines.length; i++) {
        if(headlines[i] == null) break;
        var response = await analyze_sentiment(headlines[i])
        var sentiment = getReadableSentiment(response)
        plot_data.push([i, response.documentSentiment.score])
        drawChart()
        addRowToHeadlinesTable(t_body,i+1,headlines[i],sentiment)
    }
}

var fillDocument = async () => {
    //DOM Objects
    let doc = document.getElementById("doc_snt")
    let lg_selector = document.getElementById("sel_snt")
    let doc_res = document.getElementById("doc_res")
    if (!doc.value) return false

    let selected_language = lg_selector.options[lg_selector.options.selectedIndex]
    let analyze_language = ""
    if (selected_language.value != "auto") analyze_language = selected_language.value

    let json_response = await analyze_sentiment(doc.value, analyze_language)
    console.log(json_response)
    doc_res.innerText = "Your document, which is in " + getLanguageValue(json_response.language, "sent") + ", " + getReadableSentiment(json_response)
}

/**
 * Function that will be called when form is submitted
 * 
 */
async function onFormSubmitted() {
    //DOM Objects
    fillDocument()
    fillGoogleNews()
}
