
window.onload = () => {
    var languageList = document.getElementById("sel_snt")

    for (language in SUP_LANGS_SNT) {
        languageList.options.add(new Option(SUP_LANGS_SNT[language], language, null))
    }
}

/**
 * Function that will be called when form is submitted
 * 
 */
async function onFormSubmitted() {
    //DOM Objects
    let doc = document.getElementById("doc_snt")
    let lg_selector = document.getElementById("sel_snt")

    if (!doc.value) return false

    let selected_language = lg_selector.options[lg_selector.options.selectedIndex].value
    let json_response = await analyze_sentiment(doc.value, selected_language)
    console.log(json_response)
    return false;
}



