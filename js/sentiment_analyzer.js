const GOOGLE_API_KEY = "AIzaSyDhXemqeJ-BmRtevnZADMNLe_wxPTsYtOA" //Google cloud API Key, in the future this would be replaced with OAuth2 authentication

//Supported Languages for google news and google cloud sentimental analyzer
const SUP_LANGS = [
    { sent: "en", news: "en-US", value: "English" },
    { sent: "pt-PT", news: "pt-PT", value: "Portuguese" },
    { sent: "es", news: "es-ES", value: "Spanish" },
    { sent: "ko", news: "ko", value: "Korean" },
    { sent: "ja", news: "ja", value: "Japanese" },
    { sent: "it", news: "it", value: "Italian" },
    { sent: "de", news: "de", value: "German" },
    { sent: "fr", news: "fr-FR", value: "French" },
    { sent: "zh", news: "zh-CN", value: "Chinese" },
    { sent: "auto", news: "auto", value: "Automatic" }
]
/**
 * Function for checking if language exists in SUP_LANGS based on a mode
 * 
 * @param {String} lang_input The language to check for
 * @param {String} mode The selected attribute to check : "news","sent","value" 
 * @returns {boolean}
 */
var languageExists = (lang_input, mode = "news") => {
    if (mode != "news" && mode != "sent" && mode != "value") throw new Error("Invalid mode")
    for (lang of SUP_LANGS) {
        if (mode == "news" && lang.news == lang_input) return true
        else if (mode == "sent" && lang.sent == lang_input) return true
        else if (mode == "value" && lang.value == lang_input) return true
    }
    return false
}

/**
 * Function for extracting value from a sent or news attribute 
 * 
 * @param {String} lang_input either a sent or news attribute
 * @param {String} mode respective mode, "sent" or "news"
 * @returns {String} respective value ex:("ko","sent")->("Korean")
 */
var getLanguageValue = (lang_input, mode = "sent") => {
    if (mode != "news" && mode != "sent" && mode != "value") throw new Error("Invalid mode")
    for (lang of SUP_LANGS) {
        if (mode == "news" && lang.news == lang_input) return lang.value
        else if (mode == "sent" && lang.sent == lang_input) return lang.value
    }
    return null
}

/**
 *  Uses the google cloud sentiment analysis API
 *  for analysing a plain text document
 *
 *  @param {String} document The plain text string document
 *  @param {String} language Selected language, "" or null for automatic selection
 *  @returns {String} Json object with response
 */
var analyze_sentiment = async (document, language) => {
    var URL = "https://language.googleapis.com/v1/documents:analyzeSentiment?key=" + GOOGLE_API_KEY; //URL for the API

    //Language support
    if (language && !languageExists(language, "sent"))
        throw new Error("Language not supported for google sentiment analysis");

    //Fetches the data from the google sentiment analysis API
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "appplication/json"
        },
        body: JSON.stringify({
            "encodingType": "UTF8",
            "document": {
                "type": "PLAIN_TEXT",
                "language": language,
                "content": document
            }
        })
    });

    let data = await response.json();
    if (response.ok)
        return data; //If HTTP Request returns 200 OK, return a json object of the response
    //if it's not 200 OK, print data and throw error with HTTP status
    console.error(data);
    throw new Error(response.status);
}


/**
 * Converts unreadable data from the google sentiment analysis API into
 * readable data
 * 
 * @param {JSON} JSON response from the analyze_sentiment function
 * @returns {String} positive, negative, mixed or neutral
 */
var getReadableSentiment = (response) => {
    let score = response.documentSentiment.score
    let magnitude = response.documentSentiment.magnitude
    if (score > 0.25) { //Positive post
        return "is positive"
    } else if (score < -0.25) { //Negative post
        return "is negative"
    } else { //Neutral or Mixed
        if (magnitude > 1) { //Mixed, may have negative and positive content
            return "is mixed(negative/positive)"
        } else {//Neutral, has no emotional 
            return "is neutral"
        }
    }
}