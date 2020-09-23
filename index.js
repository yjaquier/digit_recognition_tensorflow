var mousePressed = false;
var lastX, lastY;
var ctx;
var canvas01;
var chart1;

// Max value of an array function
function myArrayMax(arr) {
	var len = arr.length
	var max = -Infinity;
	while (len--) {
			if (arr[len] > max) {
					max = arr[len];
			}
	}
	return max;
}

// ApexChart options
var options1 = {
  chart: {
    type: 'bar',
    width: 900,
    height: 300,
    background: '#D3D3D3',
    zoom: {
      enabled: true,
      type: 'xy'
    }
  },
  //legend: { show: true, position: 'right' },
  tooltip: { theme: 'dark' },
  colors: ['#FF8C00'], // series color
  //markers: { colors: '#000000' }, // Markers
	dataLabels: { enabled: false },
  series: [{ name: 'Prediction probability', data: [] }],
  xaxis: { categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
  yaxis: { show: false }
}

window.addEventListener("load", function(event) {	
	canvas01 = document.getElementById('canvas01');
	ctx = canvas01.getContext("2d");

	canvas01.addEventListener('mousedown', function(event) {
		mousePressed = true;
		Draw(event.pageX - this.getBoundingClientRect().left -  window.pageXOffset, event.pageY - this.getBoundingClientRect().top -  window.pageYOffset, false);
	})

	canvas01.addEventListener('mousemove', function (event) {
		if (mousePressed) {
			Draw(event.pageX - this.getBoundingClientRect().left - window.pageXOffset, event.pageY - this.getBoundingClientRect().top - window.pageYOffset, true);
		}
	});

	canvas01.addEventListener('mouseup', function (event) {
		mousePressed = false;
		// I predict when mouse click is released (predict button could be removed)
		predict();
	});

	canvas01.addEventListener('mouseleave', function (event) {
		mousePressed = false;
	});

	// Load TensorFlow pre-trained model
  run_tensorflow();

  chart1 = new ApexCharts(document.querySelector("#chart1"), options1);
  chart1.render();
});

function Draw(x, y, isDown) {
	if (isDown) {
		ctx.beginPath();
		ctx.strokeStyle = document.getElementById('color').value;
		ctx.lineWidth = document.getElementById('width').value;
		ctx.lineJoin = "round";
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(x, y);
		ctx.closePath();
		ctx.stroke();
	}
	lastX = x;
	lastY = y;
}
	
function clearArea() {
	// Use the identity matrix while clearing the canvas
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	chart1.updateSeries([{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }]);
}

async function loadModel() {
	this.model = await tf.loadLayersModel('./assets/model.json');
	console.log('TensorFlow model loaded !');
}

function run_tensorflow() {
	const model = loadModel();
}

async function predict2(imageData) {
  await tf.tidy(() => {
    // Convert the canvas pixels to a Tensor of the matching shape
    let img = tf.browser.fromPixels(imageData, 1);
    img = img.reshape([1, 28, 28, 1]);
    img = tf.cast(img, 'float32');

    // Make and format the predications
    const output = this.model.predict(img);

    // Save predictions on the component
		this.predictions = Array.from(output.dataSync());

		//Display predicted number on console
		console.log('Predicted number is: ' + this.predictions.indexOf(myArrayMax(this.predictions)));

		//Update chart values
		chart1.updateSeries([{ data: this.predictions }]);
  });
}

function predict() {
	var oc = document.createElement('canvas'), octx = oc.getContext('2d');
	var imageObj = new Image();

	//Get image data as URL
	imageObj.src = canvas01.toDataURL()

	//Convert initial canvas image to a 28x28 image through a canvas and predict from it
	imageObj.onload = function() {
		octx.drawImage(imageObj, 0, 0, 28, 28);
		predict2(octx.getImageData(0,0,28,28));
	}
}