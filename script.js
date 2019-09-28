// REPLACE <...> BY YOUR FIREBASE PROJECT CONFIGURATION:
const config = {
    apiKey: "AIzaSyCkGJ1jCDger21OP5JF56x7YQSBvWXrrks",
    authDomain: "solar-trackin-panel.firebaseapp.com",
    databaseURL: "https://solar-trackin-panel.firebaseio.com",
    projectId: "solar-trackin-panel",
    storageBucket: "solar-trackin-panel.appspot.com",
    messagingSenderId: "503888852695",
    appId: "1:503888852695:web:6a6269479be243574fe292",
    measurementId: "G-PKMDQSHPED"
};

firebase.initializeApp(config);
var database = firebase.database();
var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var zeros = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var chart = []
var ctx = document.getElementById('myChart');
var lineChartData = {
    labels: zeros,
    datasets: [{
        label: "Temperature",
        borderColor: 'rgb(255, 0, 9)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        yAxisID: 'y-axis-1'
    }, {
        label: "Voltage",
        borderColor: 'rgb(0, 99, 132)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        yAxisID: 'y-axis-2'
    }]
}

chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: lineChartData,
    // Configuration options go here
    options: {
        title: {
            display: true,
            text: 'ESP32 - Undefine'
        },
        scales: {
            yAxes: [{
                id: 'y-axis-1',
                type: 'linear',
                position: 'left',
            }, {
                id: 'y-axis-2',
                type: 'linear',
                position: 'right'
            }]
        }
    }
})


var devices = database.ref('devices/')

firstData = []
devices.on('value', function (snapshot) {
    devices = snapshot.val();
    size = chart.data.datasets[0].data.length

    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    hour = h + ":" + m + ":" + s;
    for (const device in devices) {
        chart.options.title.text = 'Device ' + device
        data = devices[device].data.split('-')
        data = { 'Temperature': data[0], 'Voltage': data[1] }

        lineChartData.datasets.forEach(function (dataset) {
            dataset.data.push(data[dataset.label])
            dataset.data.shift()
        });
        console.log(chart.data.datasets);
        // chart.data.labels.push(hour);
        chart.update();
        }
    console.log("length", chart.data.datasets[0].data.length)
    console.log()
});
