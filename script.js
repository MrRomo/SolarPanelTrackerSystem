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
var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var zeros = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var chart = []
var angle = 0
var refVoltage = 0
var check = false;
var ctx = document.getElementById('myChart');
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var lineChartData = {
    labels: zeros,
    datasets: [{
        label: "Temperature",
        borderColor: 'rgb(255, 0, 9)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        yAxisID: 'y-axis-1'
    }, {
        label: "Voltage",
        borderColor: 'rgb(0, 99, 132)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
                ticks: {
                    beginAtZero: true
                }
            }, {
                id: 'y-axis-2',
                type: 'linear',
                position: 'right',
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
})


var devices = database.ref('devices/')
var checker
firstData = []
devices.on('value', function (snapshot) {
    devices = snapshot.val();
    size = chart.data.datasets[0].data.length
    clearInterval(checker)
    $("#stateConnection").removeClass("badge-danger")
    $("#stateConnection").text("Online")
    $('#exampleModal').modal('hide')
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    hour = h + ":" + m + ":" + s;
    for (const device in devices) {
        chart.options.title.text = 'Device ' + device
        data = devices[device].data.split('-')
        angle = parseInt(devices[device].angle)
        console.log(data);
        $("#currentTemp").text(`Temperatura actual: ${data[0]} °C`)
        $("#currentVoltage").text(`Voltaje actual: ${data[1]} V`)
        $("#refTemp").text(`Temperatura de referencia: ${data[2]} °C`)
        
        data = { 'Temperature': data[0], 'Voltage': data[1] }
        

        checker = setTimeout(() => {
            $("#stateConnection").addClass("badge-danger")
            $("#stateConnection").text("Offline")
            $('#exampleModal').modal('show')
        }, 3000);
        lineChartData.datasets.forEach(function (dataset) {
            dataset.data.push(data[dataset.label])
            dataset.data.shift()
        });
        // console.log(chart.data.datasets);
        chart.data.labels.push(hour);
        chart.data.labels.shift();
        chart.update();
    }
    // console.log("length", chart.data.datasets[0].data.length)
});


// setInterval(() => {
//     exectRoll(angle)
//     // console.log("angulo: " + angle);
//     $("#rollTitle").text(`Yaw Angle: ${angle}°`)
//     // console.log($("rollTitle").text());

// }, 100)

function rollPanel() {
    angle = this.event.target.value
    exectRoll(angle)
}

function exectRoll(angle) {
    width = 300
    height = 300
    var image = new Image();
    image.src = 'panel.png';
    drawRotated(image, context, angle)
}

function drawRotated(img, ctx, degrees) {
    canvas.width = this.width; //double the canvas width
    canvas.height = this.height; //double the canvas height
    var cache = this; //cache the local copy of image element for future reference
    ctx.save(); //saves the state of canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas
    ctx.translate(cache.width / 2, cache.height / 2); //let's translate
    ctx.rotate(Math.PI / 180 * (degrees)); //increment the angle and rotate the image 
    ctx.drawImage(img, -cache.width / 2, -cache.height / 2, cache.width, cache.height); //draw the image ;)
    ctx.restore(); //restore the state of canvas
}

var checker = setInterval(() => {
}, 6);
