
const GOOGLE_API_KEY = null //Google cloud API Key
//Supported Languages
const SUP_LANGS_SNT = {
    "en": "English",
    "pt": "Portuguese",
    "es": "Spanish",
    "ko": "Korean",
    "ja": "Japanese",
    "it": "Italian",
    "de": "German",
    "fr": "French",
    "zh": "Chinese(Simplified)",
    "zh-Hant": "Chinese(Traditional)"
}

/**
 *  Uses the google cloud sentiment analysis API
 *  for analysing a plain text document
 *
 *  @param document The plain text string document
 *  @param language Selected language, "" or null for automatic selection
 *  @returns Json object with response
 */
async function analyze_sentiment(document,language) {
    var URL = "https://language.googleapis.com/v1/documents:analyzeSentiment?key=" + GOOGLE_API_KEY; //URL for the API

    //Language support
    if (language && !SUP_LANGS_SNT.hasOwnProperty(language))
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

