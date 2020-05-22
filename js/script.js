/**
 * Runs when HTML is loaded, will update the language selector
 */
window.onload = () => {
    var languageList = document.getElementById("sel_snt")

    for (language of SUP_LANGS) {
        languageList.options.add(new Option(language.value, language.sent, null))
    }
}


/**
 * Function that will fill the the Google News Tab with content
 */
var fillGoogleNews = async () => {
    let doc = document.getElementById("doc_snt")
    //names have to be exactly this because setOnLoadCallback does not accept parameters
    topic = doc.value

    //Loads Plot
    plot_data = [["TOP-5", "Sentimental Analysis Score"], ["", 0]];
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    var date = new Date() //Gets current date
    //Scrapes the google news website for data
    var google_news_html = await getGoogleNewsHTML(topic, "pt-PT", date)
    var headlines = scrape_headlines(google_news_html)
    var t_body = document.getElementById("top5-table-body")
    clearTable(t_body) //Clears the headlines table

    //Fills the Google News Tab with the data from scraping
    for (var i = 0; i < headlines.length; i++) {
        if(headlines[i] == null) break; //If there's no headline stop the loop
        var response = await analyze_sentiment(headlines[i]) //Analyses the sentiment of a certain headline
        var sentiment = getReadableSentiment(response) //Transforms the score and magnitude value into readable sentiments(ex:is Positive)
        plot_data.push([i, response.documentSentiment.score])//Adds the score data to the plot
        drawChart() //Updates the plot
        addRowToHeadlinesTable(t_body,i+1,headlines[i],sentiment) //Adds row to the table
    }
}

/**
 * Fills the document tab with data, basically analyzes the document and 
 * says if the document is positive or not
 */
var fillDocument = async () => {
    //DOM Objects
    let doc = document.getElementById("doc_snt")
    let lg_selector = document.getElementById("sel_snt")
    let doc_res = document.getElementById("doc_res")
    if (!doc.value) return false

    let selected_language = lg_selector.options[lg_selector.options.selectedIndex]
    let analyze_language = ""
    if (selected_language.value != "auto") analyze_language = selected_language.value

    let json_response = await analyze_sentiment(doc.value, analyze_language) //Analyzing document sentiment
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
