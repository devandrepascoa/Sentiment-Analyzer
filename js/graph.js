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