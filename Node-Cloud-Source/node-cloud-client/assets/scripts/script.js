let httpNodesUri = 'http://127.0.0.1:1880/node-cloud/nodes';
let httpSensorsUri = 'http://127.0.0.1:1880/node-cloud/sensors';
let httpSamplesUri = 'http://127.0.0.1:1880/node-cloud/samples';
let wsUri = 'ws://127.0.0.1:1880/ws/node-cloud';
let nodesPayload;
let sensorsPayload;
let nodes;
let sensors;
let samplesPayload;
let ws;
let coreFrame = document.getElementsByClassName('app-main__outer')[0];
let manageNodesFrame = document.getElementById('manage-nodes-frame');
let manageSensorsFrame = document.getElementById('manage-sensors-frame');
let charts = {
	dashboard: {},
};
let sensorKeyProp = {
	_id: '',
	code: '',
	nodeId: '',
	sampleTime: '',
	precision: '',
	isAvailable: '',
	context: '',
	samples: '',
};

let nodeFormVm;
let nodeFormProp;

const colorArray = [
	'#a4e43f',
	'#d298e2',
	'#6119d0',
	'#d2737d',
	'#c0a43c',
	'#f2510e',
	'#651be6',
	'#79806e',
	'#61da5e',
	'#cd2f00',
	'#9348af',
	'#01ac53',
	'#c5a4fb',
	'#996635',
	'#b11573',
	'#4bb473',
	'#75d89e',
	'#63b598',
	'#ce7d78',
	'#ea9e70',
	'#a48a9e',
	'#2f3f94',
	'#2f7b99',
	'#da967d',
	'#34891f',
	'#b0d87b',
	'#ca4751',
	'#7e50a8',
	'#c4d647',
	'#e0eeb8',
	'#11dec1',
	'#289812',
	'#566ca0',
	'#ffdbe1',
	'#2f1179',
	'#935b6d',
	'#916988',
	'#513d98',
	'#aead3a',
	'#9e6d71',
	'#4b5bdc',
	'#0cd36d',
	'#250662',
	'#cb5bea',
	'#228916',
	'#ac3e1b',
	'#df514a',
	'#539397',
	'#880977',
	'#f697c1',
	'#ba96ce',
	'#679c9d',
	'#c6c42c',
	'#5d2c52',
	'#48b41b',
	'#e1cf3b',
	'#5be4f0',
	'#57c4d8',
	'#a4d17a',
	'#225b8',
	'#be608b',
	'#96b00c',
	'#088baf',
	'#f158bf',
	'#e145ba',
	'#ee91e3',
	'#05d371',
	'#5426e0',
	'#4834d0',
	'#802234',
	'#6749e8',
	'#0971f0',
	'#8fb413',
	'#b2b4f0',
	'#c3c89d',
	'#c9a941',
	'#41d158',
	'#fb21a3',
	'#51aed9',
	'#5bb32d',
	'#807fb',
	'#21538e',
	'#89d534',
	'#d36647',
	'#7fb411',
	'#0023b8',
	'#3b8c2a',
	'#986b53',
	'#f50422',
	'#983f7a',
	'#ea24a3',
	'#79352c',
	'#521250',
	'#c79ed2',
	'#d6dd92',
	'#e33e52',
	'#b2be57',
	'#fa06ec',
	'#1bb699',
	'#6b2e5f',
	'#64820f',
	'#1c271',
	'#21538e',
	'#89d534',
	'#d36647',
	'#7fb411',
	'#0023b8',
	'#3b8c2a',
	'#986b53',
	'#f50422',
	'#983f7a',
	'#ea24a3',
	'#79352c',
	'#521250',
	'#c79ed2',
	'#d6dd92',
	'#e33e52',
	'#b2be57',
	'#fa06ec',
	'#1bb699',
	'#6b2e5f',
	'#64820f',
	'#1c271',
	'#9cb64a',
	'#996c48',
	'#9ab9b7',
	'#06e052',
	'#e3a481',
	'#0eb621',
	'#fc458e',
	'#b2db15',
	'#aa226d',
	'#792ed8',
	'#73872a',
	'#520d3a',
	'#cefcb8',
	'#a5b3d9',
	'#7d1d85',
	'#c4fd57',
	'#f1ae16',
	'#8fe22a',
	'#ef6e3c',
	'#243eeb',
	'#1dc18',
	'#dd93fd',
	'#3f8473',
	'#e7dbce',
	'#421f79',
	'#7a3d93',
	'#635f6d',
	'#93f2d7',
	'#9b5c2a',
	'#15b9ee',
	'#0f5997',
	'#409188',
	'#911e20',
	'#1350ce',
	'#10e5b1',
	'#fff4d7',
	'#cb2582',
	'#ce00be',
	'#32d5d6',
	'#17232',
	'#608572',
	'#c79bc2',
	'#00f87c',
	'#77772a',
	'#6995ba',
	'#fc6b57',
	'#f07815',
	'#8fd883',
	'#060e27',
	'#96e591',
	'#21d52e',
	'#d00043',
	'#b47162',
	'#1ec227',
	'#4f0f6f',
	'#1d1d58',
	'#947002',
	'#bde052',
	'#e08c56',
	'#28fcfd',
	'#bb09b',
	'#36486a',
	'#d02e29',
	'#1ae6db',
	'#3e464c',
	'#a84a8f',
	'#911e7e',
	'#3f16d9',
	'#0f525f',
	'#ac7c0a',
	'#b4c086',
	'#c9d730',
	'#30cc49',
	'#3d6751',
	'#fb4c03',
	'#640fc1',
	'#62c03e',
	'#d3493a',
	'#88aa0b',
	'#406df9',
	'#615af0',
	'#4be47',
	'#2a3434',
	'#4a543f',
	'#79bca0',
	'#a8b8d4',
	'#00efd4',
	'#7ad236',
	'#7260d8',
	'#1deaa7',
	'#06f43a',
	'#823c59',
	'#e3d94c',
	'#dc1c06',
	'#f53b2a',
	'#b46238',
	'#2dfff6',
	'#a82b89',
	'#1a8011',
	'#436a9f',
	'#1a806a',
	'#4cf09d',
	'#c188a2',
	'#67eb4b',
	'#b308d3',
	'#fc7e41',
	'#af3101',
	'#ff065',
	'#71b1f4',
	'#a2f8a5',
	'#e23dd0',
	'#d3486d',
	'#00f7f9',
	'#474893',
	'#3cec35',
	'#1c65cb',
	'#5d1d0c',
	'#2d7d2a',
	'#ff3420',
	'#5cdd87',
	'#a259a4',
	'#e4ac44',
	'#1bede6',
	'#8798a4',
	'#d7790f',
	'#b2c24f',
	'#de73c2',
	'#d70a9c',
	'#25b67',
	'#88e9b8',
	'#c2b0e2',
	'#86e98f',
	'#ae90e2',
	'#1a806b',
	'#436a9e',
	'#0ec0ff',
	'#f812b3',
	'#b17fc9',
	'#8d6c2f',
	'#d3277a',
	'#2ca1ae',
	'#9685eb',
	'#8a96c6',
	'#dba2e6',
	'#76fc1b',
	'#608fa4',
	'#20f6ba',
	'#07d7f6',
	'#dce77a',
	'#77ecca',
	'#c6e1e8',
	'#648177',
	'#0d5ac1',
	'#f205e6',
	'#1c0365',
	'#14a9ad',
	'#4ca2f9',
];

//***** HTTP REQUESTS *****
/**
 * Request to the http end-point implemented with Node-Red to retrieve
 * all nodes from the database.
 */
function doGetNodes() {
	var req = new XMLHttpRequest();
	req.open('GET', httpNodesUri, true);
	req.setRequestHeader('Cache-Control', 'no-cache');

	req.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			nodesPayload = JSON.parse(req.responseText);
			mapNodes();
			doGetSensors();
		}
	};
	req.send();
}

/**
 * Request to the http end-point implemented with Node-Red to retrieve
 * all sensors from the database.
 */
function doGetSensors() {
	var req = new XMLHttpRequest();
	req.open('GET', httpSensorsUri, true);
	req.setRequestHeader('Cache-Control', 'no-cache');

	req.onreadystatechange = async function () {
		if (this.readyState == 4 && this.status == 200) {
			sensorsPayload = JSON.parse(req.responseText);
			mapSensors();
			await addSensorsToNodes();
			createNodeScrollBar();
			doGetSamples();
		}
	};
	req.send();
}

/**
 * Request to the http end-point implemented with Node-Red to retrieve
 * all samples from the database.
 */
function doGetSamples() {
	var req = new XMLHttpRequest();
	req.open('GET', httpSamplesUri, true);
	req.setRequestHeader('Cache-Control', 'no-cache');

	req.onreadystatechange = async function () {
		if (this.readyState == 4 && this.status == 200) {
			samplesPayload = JSON.parse(req.responseText);
			updateDashboardInfo();
			await createDashboardPlot();
			createVM();
			await wsConnect();
		}
	};
	req.send();
}
/*******************************************************************************************************************/

//***** Web socket *****

/**
 * Connect to the websocket endpoint implemented in Node-Red.
 */
function wsConnect() {
	console.log('connecting: ', wsUri);
	ws = new WebSocket(wsUri);

	ws.onmessage = async function (msg) {
		var msg = JSON.parse(msg.data);
		console.log(msg);
		await topicsDispatch(msg);
	};

	ws.onopen = function () {
		console.log('connected');
	};

	ws.onclose = function () {
		setTimeout(wsConnect, 3000);
	};
}

/**
 * Send message to the websocket endpoint.
 * @param {*} msg the message to be sent.
 */
function sendMessage(msg) {
	if (ws && ws.readyState == WebSocket.OPEN) {
		ws.send(JSON.stringify(msg));
	} else {
		console.log('Waiting for ws connection on:' + wsUri);
	}
}

/**
 * Prepare a message, before sending it.
 * @param {*} body the payload of the message.
 * @param {*} topic the topic on which the message will be sent by Node-Red using MQTT.
 */
function prepareMessage(body, topic) {
	var string = JSON.stringify(body);
	var message = JSON.parse(string);
	if (message.samples) {
		delete message.samples;
	}
	if (message.sensors) {
		delete message.sensors;
	}
	message.topic = topic;
	sendMessage(message);
}

/**
 * Dispatch a received message, according to the topic.
 * @param {*} msg the received message.
 */
async function topicsDispatch(msg) {
	switch (msg.topic) {
		case 'nodes/sensors/samples':
			delete msg.topic;
			await sampleReceived(msg);
			break;
		default:
			console.log('Invalid topic info: ' + msg.topic);
	}
}

/**
 * Update all statistics and graphs upon receiving a new sample.
 * @param {*} sample the sample that has been received.
 */
async function sampleReceived(sample) {
	console.log('Sample received');
	await addSample(sample);
	await updateTotalSamples();
	await updateDashboardPlots();
	var sensor = getSensorByCode(sample.sensorCode);
	var id = sensor.code + 'total-samples';
	var box = document.getElementById(id);
	if (
		sensor.samples &&
		sensor.samples.length == 1 &&
		(box != null || box != undefined)
	) {
		swapToSensor(sensor);
	} else {
		await updateSensorInfo(sensor);
	}
}

/*******************************************************************************************************************/

//***** Settings *****

/**
 * Implementation of the Settings page using Vuejs.
 * Several vue object are defined.
 */
function createVM() {
	nodeFormVm = new Vue({
		el: '#manage-nodes-container',
		data: {
			nodes: [],
		},
		methods: {
			removeNodeForm(index) {
				this.nodes.splice(index, 1);
			},
			addNodeForm(node) {
				this.nodes.push(node);
			},
			contains(nodeId) {
				var len = this.nodes.length;
				var found = false;
				var i = 0;
				while (!found && i < len) {
					if (this.nodes[i].nodeId == nodeId) found = true;
					else i++;
				}
				return found;
			},
			nameChanged(index) {
				let node = this.nodes[index];
				if (node.name.length > 3) {
					node.isNotValid = false;
					node.disableButton = false;
					return true;
				} else {
					node.disableButton = true;
					node.isNotValid = true;
					return false;
				}
			},
			availabilityChanged(index) {
				let node = this.nodes[index];
				node.disableButton = !this.nameChanged(index);
			},
			changeNode(index) {
				if (this.nameChanged(index)) {
					var formNode = this.nodes[index];
					var node = nodes[formNode.nodeId];
					node.isAvailable = JSON.parse(formNode.isAvailable);
					node.name = formNode.name;
					updateNode(node);
					console.log(node);
					window.alert('Node: ' + node.nodeId + ' has been updated!');
					formNode.disableButton = true;
					removeNodeScrollBar();
				}
			},
			emptyNodes() {
				this.nodes = [];
			},
		},
	});

	sensorFormVm = new Vue({
		el: '#manage-sensors-container',
		data: {
			sensors: [],
		},
		methods: {
			addSensorForm(sensor) {
				this.sensors.push(sensor);
			},
			contains(code) {
				var len = this.sensors.length;
				var found = false;
				var i = 0;
				while (!found && i < len) {
					if (this.sensors[i].code == code) found = true;
					else i++;
				}
				return found;
			},
			emptySensors() {
				this.sensors = [];
			},
			availabilityChanged(index) {
				let sensor = this.sensors[index];
				sensor.disableButton = !this.sampleTimeChanged(index);
			},
			precisionChanged(index) {
				let sensor = this.sensors[index];
				sensor.disableButton = !this.sampleTimeChanged(index);
			},
			sampleTimeChanged(index) {
				let sensor = this.sensors[index];
				let sampleTime = parseInt(sensor.sampleTime);
				let enabled = false;
				if (sampleTime < 1000) {
					sensor.isNotValid =
						'Invalid sample time. Min = 1000. Up arrow to fix';
				} else if (sampleTime > 86400000) {
					sensor.isNotValid =
						'Invalid sample time. Max = 86400000. Down arrow to fix.';
				} else if (sampleTime % 1000 != 0) {
					sensor.isNotValid =
						'Invalid sample time. Step = 1000. Any arrow to fix.';
				} else {
					sensor.isNotValid = '';
					enabled = true;
				}
				sensor.disableButton = !enabled;
				return enabled;
			},
			changeSensor(index) {
				if (this.sampleTimeChanged(index)) {
					var formSensor = this.sensors[index];
					var sensor = sensors[formSensor.code];
					sensor.isAvailable = JSON.parse(formSensor.isAvailable);
					sensor.sampleTime = parseInt(formSensor.sampleTime);
					sensor.precision =
						'+/-' +
						formSensor.precision +
						evaluateContext(sensor.context);
					updateSensor(sensor);
					window.alert(
						'Sensor: ' + sensor.code + ' has been updated!'
					);
					formSensor.disableButton = true;
					removeNodeScrollBar();
				}
			},
		},
	});
}
/**
 * Auxiliary function to swap to the Node management page.
 */
function swapToManageNodes() {
	nodeFormVm.emptyNodes();
	var node;
	for (var i = 0; i < nodesPayload.length; i++) {
		node = JSON.stringify(nodesPayload[i]);
		node = JSON.parse(node);
		delete node._id;
		delete node.sensors;
		node.disableButton = true;
		if (!nodeFormVm.contains(node.nodeId)) nodeFormVm.addNodeForm(node);
	}

	clearCoreFrame();
	coreFrame.append(manageNodesFrame);
	manageNodesFrame.style.display = 'block';
}

/**
 * Auxiliary function to generate a valid Id.
 * @returns a valid id.
 */
function generateId() {
	var date = new Date();
	return (
		date.getFullYear() +
		(date.getMonth() + 1 < 9
			? '0' + (date.getMonth() + 1)
			: date.getMonth() + 1) +
		(date.getDate() < 9 ? '0' + date.getDate() : date.getDate()) +
		(date.getHours() < 9 ? '0' + date.getHours() : date.getHours()) +
		(date.getMinutes() < 9
			? '0' + date.getMinutes()
			: date.getMinutes() +
			  (date.getSeconds() < 9
					? '0' + date.getSeconds()
					: date.getSeconds()))
	);
}

/**
 * Check whether or not the property is a key property for the sensor.
 * The management of nodes and sensor is schema-less, however there is a
 * basic set of properties which must be implemented, then other properties can be added or removed.
 * @param {*} property the property to be check.
 * @returns whether or not the input property is a key one.
 */
function isSensorKeyProperty(property) {
	return Object.prototype.hasOwnProperty.call(sensorKeyProp, prop);
}

/**
 * Auxiliary function to swap to the Sensor management page.
 */
function swapToManageSensors() {
	sensorFormVm.emptySensors();
	var sensor;
	for (let i = 0; i < sensorsPayload.length; i++) {
		sensor = JSON.stringify(sensorsPayload[i]);
		sensor = JSON.parse(sensor);
		delete sensor._id;
		delete sensor.samples;
		var precision = sensor.precision;
		sensor.measure = evaluateContext(sensor.context);
		precision = precision.substring(3);
		sensor.disableButton = true;
		sensor.nodeName = nodes[sensor.nodeId].name;
		sensor.precision = parseFloat(precision);
		if (!sensorFormVm.contains(sensor.code))
			sensorFormVm.addSensorForm(sensor);
	}
	clearCoreFrame();
	coreFrame.append(manageSensorsFrame);
	manageSensorsFrame.style.display = 'block';
}

/**
 * Auxiliary function to convert milliseconds into a date
 * @param {*} duration timestamp to be converted.
 * @returns the date convertion of the input timestamp.
 */
function msToTime(duration) {
	var milliseconds = parseInt((duration % 1000) / 100),
		seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;

	return hours + ':' + minutes + ':' + seconds;
}

/*******************************************************************************************************************/

//***** Logic Variables management *****

/**
 * Set, for each node the collection of sensors which are logically associated
 * to it.
 */
function addSensorsToNodes() {
	var node;
	for (let i = 0; i < sensorsPayload.length; i++) {
		node = nodes[sensorsPayload[i].nodeId];
		node.sensors = getNodeSensors(sensorsPayload[i].nodeId);
	}
}

/**
 * Get all sensors which are associated to the node with the given nodeId.
 * @param {*} nodeId the node identifier.
 * @returns the collection of sensors associated to that nodeId.
 */
function getNodeSensors(nodeId) {
	var sensors = [];
	for (let i = 0; i < sensorsPayload.length; i++) {
		if (sensorsPayload[i].nodeId == nodeId) {
			sensors.push(sensorsPayload[i]);
		}
	}
	return sensors;
}

/**
 * Set, for each sensor the collection of sample which are associated
 * to it.
 */
function addSamplesToSensor() {
	for (var i = 0; i < nodesPayload.length; i++) {
		if (nodesPayload[i].sensors) {
			for (let j = 0; j < nodesPayload[i].sensors.length; j++) {
				var samples = getSensorSamples(nodesPayload[i].sensors[j].code);
				nodesPayload[i].sensors[j].samples = samples;
			}
		}
	}
}

/**
 * Get all samples which are associated to the sensor with the given code.
 * @param {*} code the sensor identifier.
 * @returns the collection of samples gathered by the sensor with the given code.
 */
function getSensorSamples(code) {
	var samples = [];
	var j = 0;
	for (let i = 0; i < samplesPayload.length; i++) {
		if (samplesPayload[i].sensorCode == code) {
			samples[j] = samplesPayload[i];
			j++;
		}
	}
	return samples;
}

/**
 * Add nodes to a Javascript dictionary.
 */
function mapNodes() {
	nodes = {};
	var node;
	for (let i = 0; i < nodesPayload.length; i++) {
		node = nodesPayload[i];
		if (node.nodeId) nodes[node.nodeId] = node;
	}
}

/**
 * Add sensors to a Javascript dictionary.
 */
function mapSensors() {
	sensors = {};
	var sensor;
	for (let i = 0; i < sensorsPayload.length; i++) {
		sensor = sensorsPayload[i];
		if (sensor.code) sensors[sensor.code] = sensor;
	}
}

/**
 * Get the sensor associated to the given code.
 * @param {*} code the sensor identifier.
 * @returns the sensor with the given code.
 */
function getSensorByCode(code) {
	return sensors[code];
}

/**
 * Add the imput sample to the local collection and to the sensor which gathered it.
 * @param {*} sample the sample to be added.
 */
function addSample(sample) {
	samplesPayload.push(sample);
	let sensor = getSensorByCode(sample.sensorCode);
	console.log(sensor);
	if (sensor) sensor.samples.push(sample);
}

/*Dynamic contents
 *******************************************************************************************************************/
function createNodeScrollBar() {
	for (let i = 0; i < nodesPayload.length; i++) {
		createNodeElement(nodesPayload[i]);
	}
}

function removeNodeScrollBar() {
	const ul = document.getElementById('index-scrollbar-ul');
	if (document.getElementById('nodes-label-sidebar'))
		ul.removeChild(document.getElementById('nodes-label-sidebar'));
	for (let i = 0; i < nodesPayload.length; i++) {
		if (document.getElementById(nodesPayload[i].nodeId + 'li'))
			ul.removeChild(
				document.getElementById(nodesPayload[i].nodeId + 'li')
			);
	}
}

function createNodeElement(node) {
	var ul = document.getElementById('index-scrollbar-ul');
	var listElement = document.createElement('li');
	listElement.id = node.nodeId + 'li';
	var nodeName = document.createElement('span');
	if (node.name) nodeName.innerHTML = node.name;
	else nodeName.innerHTML = 'Unknown';
	var link = document.createElement('a');
	link.href = '#';
	var i1 = document.createElement('i');
	var i2 = document.createElement('i');
	i1.className = node.isAvailable
		? 'metismenu-icon pe-7s-check'
		: 'metismenu-icon pe-7s-close-circle';
	i2.className = 'metismenu-state-icon pe-7s-angle-down caret-left';
	link.append(i1);
	link.append(nodeName);
	link.append(i2);
	listElement.append(link);
	ul.append(listElement);
	if (node.sensors) {
		for (let i = 0; i < node.sensors.length; i++) {
			createSensorElement(node.sensors[i], listElement);
		}
	}
}

function createSensorElement(sensor, listElement) {
	var ul = document.createElement('ul');
	var li = document.createElement('li');
	var link = document.createElement('a');

	var i1 = document.createElement('i');
	i1.className = 'metismenu-icon';

	var sensorCode = document.createElement('span');
	if (sensor.code) sensorCode.innerHTML = sensor.code;
	else sensorCode.innerHTML = 'Unknown';

	link.append(i1);
	link.append(sensorCode);
	li.append(link);
	link.onclick = function () {
		swapToSensor(sensor);
	};
	link.href = '#';
	ul.append(li);
	listElement.append(ul);
}

/*******************************************************************************************************************/

/*Sensor info
 ********************************************************************************************************************/
function swapToSensor(sensor) {
	if (sensor) {
		clearCoreFrame();
		var sensorFrame = document.createElement('div');
		sensorFrame.className = 'app-main__inner';
		var row1 = document.createElement('div');
		row1.className = 'row';
		var row2 = document.createElement('div');
		row2.className = 'row';

		coreFrame.append(sensorFrame);
		if (sensor.nodeId) {
			if (nodes[sensor.nodeId].name)
				createNodeNameBox(nodes[sensor.nodeId].name, row1);
			createNodeIdBox(sensor.nodeId, row1);
		}

		if (sensor.code) createSensorCodeBox(sensor.code, row1);

		if (sensor.context) createContextBox(sensor.context, row1);

		createAvailableBox(sensor, row1);

		if (sensor.sampleTime) createSampleTimeBox(sensor, row1);

		if (sensor.samples) {
			createLastSampleBox(sensor, row1);
			createLastSampleTimeBox(sensor, row1);
			createSamplesAverageBox(sensor, row1);
			createTotalSamplesBox(sensor, row1);
		}

		if (sensor.precision) createPrecisionBox(sensor.precision, row1);

		for (prop in sensor) {
			if (Object.prototype.hasOwnProperty.call(sensor, prop)) {
				if (!isSensorKeyProperty(prop)) {
					createPropertyBox(prop, sensor[prop], row1);
				}
			}
		}
	}

	sensorFrame.append(row1);

	if (sensor.samples != null && sensor.samples.length > 0) {
		sensorFrame.append(row2);
		createSamplesLinePlotBox(sensor, row2);
	}
}

function createSensorCodeBox(code, element) {
	var div = document.createElement('div');
	div.className = 'col-md-6 col-xl-4';
	var cardDiv = document.createElement('div');
	cardDiv.className = 'card mb-3 widget-content bg-night-fade';

	var widgetDivWrapper = document.createElement('div');
	widgetDivWrapper.className = 'widget-content-wrapper text-white';

	var widgetDivContentLeft = document.createElement('div');
	widgetDivContentLeft.className = 'widget-content-left';
	var widgetDivHeading = document.createElement('div');
	widgetDivHeading.className = 'widget-heading';
	widgetDivHeading.innerText = 'Code';
	var widgetDivSubHeading = document.createElement('div');
	widgetDivSubHeading.className = 'widget-subheading';
	widgetDivSubHeading.innerText = 'Sensor code';

	widgetDivContentLeft.append(widgetDivHeading);
	widgetDivContentLeft.append(widgetDivSubHeading);

	var widgetDivContentRight = document.createElement('div');
	widgetDivContentRight.className = 'widget-content-right';
	var widgetDivValue = document.createElement('div');
	widgetDivValue.className = 'widget-numbers text-white';
	widgetDivValue.id = 'very-long-text';
	widgetDivValue.innerText = code;

	widgetDivContentRight.append(widgetDivValue);

	widgetDivWrapper.append(widgetDivContentLeft);
	widgetDivWrapper.append(widgetDivContentRight);

	cardDiv.append(widgetDivWrapper);
	div.append(cardDiv);
	element.append(div);
}

function createNodeNameBox(nodeName, element) {
	var div = document.createElement('div');
	div.className = 'col-md-6 col-xl-4';
	var cardDiv = document.createElement('div');
	cardDiv.className = 'card mb-3 widget-content bg-warm-flame';

	var widgetDivWrapper = document.createElement('div');
	widgetDivWrapper.className = 'widget-content-wrapper text-white';

	var widgetDivContentLeft = document.createElement('div');
	widgetDivContentLeft.className = 'widget-content-left';
	var widgetDivHeading = document.createElement('div');
	widgetDivHeading.className = 'widget-heading';
	widgetDivHeading.innerText = 'Name';

	var widgetDivSubHeading = document.createElement('div');
	widgetDivSubHeading.className = 'widget-subheading';
	widgetDivSubHeading.innerText = 'Node Name';

	widgetDivContentLeft.append(widgetDivHeading);
	widgetDivContentLeft.append(widgetDivSubHeading);

	var widgetDivContentRight = document.createElement('div');
	widgetDivContentRight.className = 'widget-content-right';
	var widgetDivValue = document.createElement('div');
	widgetDivValue.className = 'widget-numbers text-dark';

	widgetDivValue.innerText = nodeName;
	widgetDivContentRight.append(widgetDivValue);

	widgetDivWrapper.append(widgetDivContentLeft);
	widgetDivWrapper.append(widgetDivContentRight);

	cardDiv.append(widgetDivWrapper);
	div.append(cardDiv);
	element.append(div);
}

function createNodeIdBox(nodeId, element) {
	var div = document.createElement('div');
	div.className = 'col-md-6 col-xl-4';
	var cardDiv = document.createElement('div');
	cardDiv.className = 'card mb-3 widget-content bg-happy-green';

	var widgetDivWrapper = document.createElement('div');
	widgetDivWrapper.className = 'widget-content-wrapper text-white';

	var widgetDivContentLeft = document.createElement('div');
	widgetDivContentLeft.className = 'widget-content-left';
	var widgetDivHeading = document.createElement('div');
	widgetDivHeading.className = 'widget-heading';
	widgetDivHeading.innerText = 'Node ID';
	var widgetDivSubHeading = document.createElement('div');
	widgetDivSubHeading.className = 'widget-subheading';
	widgetDivSubHeading.innerText = 'Node identifier';

	widgetDivContentLeft.append(widgetDivHeading);
	widgetDivContentLeft.append(widgetDivSubHeading);

	var widgetDivContentRight = document.createElement('div');
	widgetDivContentRight.className = 'widget-content-right';
	var widgetDivValue = document.createElement('div');
	widgetDivValue.className = 'widget-numbers text-dark';
	widgetDivValue.id = 'long-text';
	widgetDivValue.innerText = nodeId;

	widgetDivContentRight.append(widgetDivValue);

	widgetDivWrapper.append(widgetDivContentLeft);
	widgetDivWrapper.append(widgetDivContentRight);

	cardDiv.append(widgetDivWrapper);
	div.append(cardDiv);
	element.append(div);
}

function createSampleTimeBox(sensor, element) {
	var div = document.createElement('div');
	div.className = 'col-md-6 col-xl-4';
	var cardDiv = document.createElement('div');
	cardDiv.className = 'card mb-3 widget-content bg-midnight-bloom';

	var widgetDivWrapper = document.createElement('div');
	widgetDivWrapper.className = 'widget-content-wrapper text-white';

	var widgetDivContentLeft = document.createElement('div');
	widgetDivContentLeft.className = 'widget-content-left';
	var widgetDivHeading = document.createElement('div');
	widgetDivHeading.className = 'widget-heading';
	widgetDivHeading.innerText = 'Sample Time';

	var widgetDivSubHeading = document.createElement('div');
	widgetDivSubHeading.className = 'widget-subheading';
	widgetDivSubHeading.innerText = 'hh : mm : ss';

	widgetDivContentLeft.append(widgetDivHeading);
	widgetDivContentLeft.append(widgetDivSubHeading);

	var widgetDivContentRight = document.createElement('div');
	widgetDivContentRight.className = 'widget-content-right';
	var widgetDivValue = document.createElement('div');
	widgetDivValue.className = 'widget-numbers text-white';

	var time = msToTime(sensor.sampleTime);
	widgetDivValue.innerText = time;
	widgetDivValue.id = sensor.code + 'sample-time';

	widgetDivContentRight.append(widgetDivValue);

	widgetDivWrapper.append(widgetDivContentLeft);
	widgetDivWrapper.append(widgetDivContentRight);

	cardDiv.append(widgetDivWrapper);
	div.append(cardDiv);
	element.append(div);
}

function updateSampleTimeBox(sensor) {
	var id = sensor.code + 'sample-time';
	var box = document.getElementById(id);
	if (!box == null) {
		box.innerText = sensor.sampleTime;
	}
}

function createPrecisionBox(precision, element) {
	var div = document.createElement('div');
	div.className = 'col-md-6 col-xl-4';
	var cardDiv = document.createElement('div');
	cardDiv.className = 'card mb-3 widget-content bg-premium-dark';

	var widgetDivWrapper = document.createElement('div');
	widgetDivWrapper.className = 'widget-content-wrapper text-white';

	var widgetDivContentLeft = document.createElement('div');
	widgetDivContentLeft.className = 'widget-content-left';
	var widgetDivHeading = document.createElement('div');
	widgetDivHeading.className = 'widget-heading';
	widgetDivHeading.innerText = 'Precision';

	var widgetDivSubHeading = document.createElement('div');
	widgetDivSubHeading.className = 'widget-subheading';
	widgetDivSubHeading.innerText = 'Sensor precision';

	widgetDivContentLeft.append(widgetDivHeading);
	widgetDivContentLeft.append(widgetDivSubHeading);

	var widgetDivContentRight = document.createElement('div');
	widgetDivContentRight.className = 'widget-content-right';
	var widgetDivValue = document.createElement('div');
	widgetDivValue.className = 'widget-numbers text-warning';

	widgetDivValue.innerText = precision;

	widgetDivContentRight.append(widgetDivValue);

	widgetDivWrapper.append(widgetDivContentLeft);
	widgetDivWrapper.append(widgetDivContentRight);

	cardDiv.append(widgetDivWrapper);
	div.append(cardDiv);
	element.append(div);
}

function createPropertyBox(propertyName, property, element) {
	var div = document.createElement('div');
	div.className = 'col-md-6 col-xl-4';
	var cardDiv = document.createElement('div');
	cardDiv.className = 'card mb-3 widget-content bg-premium-dark';

	var widgetDivWrapper = document.createElement('div');
	widgetDivWrapper.className = 'widget-content-wrapper text-white';

	var widgetDivContentLeft = document.createElement('div');
	widgetDivContentLeft.className = 'widget-content-left';
	var widgetDivHeading = document.createElement('div');
	widgetDivHeading.className = 'widget-heading';
	widgetDivHeading.innerText =
		propertyName.charAt(0).toUpperCase() + propertyName.slice(1);

	widgetDivContentLeft.append(widgetDivHeading);

	var widgetDivContentRight = document.createElement('div');
	widgetDivContentRight.className = 'widget-content-right';
	var widgetDivValue = document.createElement('div');
	widgetDivValue.className = 'widget-numbers text-warning';

	widgetDivValue.innerText = property;

	widgetDivContentRight.append(widgetDivValue);

	widgetDivWrapper.append(widgetDivContentLeft);
	widgetDivWrapper.append(widgetDivContentRight);

	cardDiv.append(widgetDivWrapper);
	div.append(cardDiv);
	element.append(div);
}

function changeAvailability(sensor) {
	if (sensor) {
		sensor.isAvailable = !sensor.isAvailable;
		var topic = 'nodes/sensors/availability';
		prepareMessage(sensor, topic);
		updateAvailableBox(sensor);
	}
}

function updateNode(node) {
	if (node) {
		const topic = 'nodes/update';
		prepareMessage(node, topic);
	}
}

function updateSensor(sensor) {
	if (sensor) {
		const topic = 'nodes/sensors/update';
		prepareMessage(sensor, topic);
	}
}

function createAvailableBox(sensor, element) {
	var div = document.createElement('div');
	div.className = 'col-md-6 col-xl-4';
	var cardDiv = document.createElement('div');
	cardDiv.className = 'card mb-3 widget-content bg-arielle-smile';

	var widgetDivWrapper = document.createElement('div');
	widgetDivWrapper.className = 'widget-content-wrapper text-white';

	var widgetDivContentLeft = document.createElement('div');
	widgetDivContentLeft.className = 'widget-content-left';
	var widgetDivHeading = document.createElement('div');
	widgetDivHeading.className = 'widget-heading';
	widgetDivHeading.innerText = 'Available';
	widgetDivHeading.id = sensor.code + 'available-text';

	var widgetDivSubHeading = document.createElement('div');
	widgetDivSubHeading.className = 'widget-subheading';
	widgetDivSubHeading.innerText = 'Sensor availability';

	widgetDivContentLeft.append(widgetDivHeading);
	widgetDivContentLeft.append(widgetDivSubHeading);

	var widgetDivContentRight = document.createElement('div');
	widgetDivContentRight.className = 'widget-content-right';
	var widgetDivValue = document.createElement('div');
	widgetDivValue.className = 'widget-numbers text-white';

	var span = document.createElement('span');
	if (sensor.isAvailable) {
		span.className = 'metismenu-icon pe-7s-check icon-span1';
	} else {
		span.className = 'metismenu-icon pe-7s-close-circle icon-span2';
	}
	widgetDivWrapper.onclick = function () {
		changeAvailability(sensor);
	};
	widgetDivWrapper.href = '#';
	widgetDivWrapper.id = 'cursor-pointer';

	widgetDivContentRight.append(widgetDivValue);
	widgetDivContentRight.append(span);
	widgetDivContentRight.id = sensor.code + 'available-box';

	widgetDivWrapper.append(widgetDivContentLeft);
	widgetDivWrapper.append(widgetDivContentRight);
	cardDiv.append(widgetDivWrapper);
	div.append(cardDiv);
	element.append(div);
}

/**
 * Update the availability box
 * @param {*} sensor the sensor on which updating the availability box
 */
function updateAvailableBox(sensor) {
	var id = sensor.code + 'available-box';
	var idText = sensor.code + 'available-text';
	var textBox = document.getElementById(idText);
	var box = document.getElementById(id);
	if (box && textBox) {
		box.removeChild(box.childNodes[1]);
		var span = document.createElement('span');
		if (sensor.isAvailable) {
			span.className = 'metismenu-icon pe-7s-check icon-span1';
			textBox.innerHTML = 'Available';
		} else {
			span.className = 'metismenu-icon pe-7s-close-circle icon-span2';
			textBox.innerHTML = 'Not Available';
		}
		box.append(span);
	}
}

/**
 * Create the context box
 * @param {*} context the element to be inserted in the box.
 * @param {*} element the father element on which append the box.
 */
function createContextBox(context, element) {
	var div = document.createElement('div');
	div.className = 'col-md-6 col-xl-4';
	var cardDiv = document.createElement('div');
	cardDiv.className = 'card mb-3 widget-content bg-grow-early';

	var widgetDivWrapper = document.createElement('div');
	widgetDivWrapper.className = 'widget-content-wrapper text-white';

	var widgetDivContentLeft = document.createElement('div');
	widgetDivContentLeft.className = 'widget-content-left';
	var widgetDivHeading = document.createElement('div');
	widgetDivHeading.className = 'widget-heading';
	widgetDivHeading.innerText = 'Context';

	var widgetDivSubHeading = document.createElement('div');
	widgetDivSubHeading.className = 'widget-subheading';
	widgetDivSubHeading.innerText = 'Sensor context';

	widgetDivContentLeft.append(widgetDivHeading);
	widgetDivContentLeft.append(widgetDivSubHeading);

	var widgetDivContentRight = document.createElement('div');
	widgetDivContentRight.className = 'widget-content-right';
	var widgetDivValue = document.createElement('div');
	widgetDivValue.className = 'widget-numbers text-dark';

	widgetDivValue.innerText = context;
	widgetDivContentRight.append(widgetDivValue);

	widgetDivWrapper.append(widgetDivContentLeft);
	widgetDivWrapper.append(widgetDivContentRight);

	cardDiv.append(widgetDivWrapper);
	div.append(cardDiv);
	element.append(div);
}

/**
 * Create the last sample box
 * @param {*} sensor the sensor on which creating the last sample box.
 * @param {*} element the father element on which append the box.
 */
function createLastSampleBox(sensor, element) {
	var sample = findLastSample(sensor.samples);
	if (sample != null) {
		var div = document.createElement('div');
		div.className = 'col-md-6 col-xl-4';
		var cardDiv = document.createElement('div');
		cardDiv.className = 'card mb-3 widget-content';

		var widgetDivWrapper = document.createElement('div');
		widgetDivWrapper.className = 'widget-content-wrapper text-black';

		var widgetDivContentLeft = document.createElement('div');
		widgetDivContentLeft.className = 'widget-content-left';
		var widgetDivHeading = document.createElement('div');
		widgetDivHeading.className = 'widget-heading';
		widgetDivHeading.innerText = 'Last sample';

		var widgetDivSubHeading = document.createElement('div');
		widgetDivSubHeading.className = 'widget-subheading';
		widgetDivSubHeading.innerText = 'Last sample value';

		widgetDivContentLeft.append(widgetDivHeading);
		widgetDivContentLeft.append(widgetDivSubHeading);

		var widgetDivContentRight = document.createElement('div');
		widgetDivContentRight.className = 'widget-content-right';
		var widgetDivValue = document.createElement('div');
		widgetDivValue.className = 'widget-numbers text-primary';
		var value = Math.round(sample.value * 100) / 100;
		value += evaluateContext(sensor.context);
		widgetDivValue.innerText = value;
		widgetDivValue.id = sensor.code + 'sample-value';
		widgetDivContentRight.append(widgetDivValue);

		widgetDivWrapper.append(widgetDivContentLeft);
		widgetDivWrapper.append(widgetDivContentRight);

		cardDiv.append(widgetDivWrapper);
		div.append(cardDiv);
		element.append(div);
	}
}

/**
 * Update last sample box
 * @param {*} sensor the sensor on which updating the last sample.
 */
function updateLastSampleBox(sensor) {
	var id = sensor.code + 'sample-value';
	var sample = findLastSample(sensor.samples);
	var box = document.getElementById(id);
	if (
		(box != null || box != undefined) &&
		(sample != null || sample != undefined)
	) {
		var value = Math.round(sample.value * 100) / 100;
		value += evaluateContext(sensor.context);
		box.innerText = value;
	}
}

/**
 * Update all sensor informarmation.
 * @param {*} sensor the sensor on which updating the info.
 */
function updateSensorInfo(sensor) {
	updateLastSampleBox(sensor);
	updateLastSampleTimeBox(sensor);
	updateTotalSamplesBox(sensor);
	updateSamplesAverageBox(sensor);
	updateSamplesLinePlotBox(sensor);
}

/**
 * Evaluate the context unit of measurement.
 * @param {*} context the context to be analized.
 * @returns the unit of measurement
 */
function evaluateContext(context) {
	var measure = '';
	switch (context) {
		case 'Humidity':
			measure = '%';
			break;
		case 'Temperature':
			measure = '°C';
			break;
		default:
			break;
	}
	return measure;
}

/**
 * Find the last sample from the samples collection
 * @param {*} samples the collection from which extracting the last sample.
 * @returns the last collected sample.
 */
function findLastSample(samples) {
	var sample = null;
	if (samples != null && samples.length > 0) {
		sample = samples[0];
		for (var i = 1; i < samples.length; i++) {
			if (new Date(samples[i].date) > new Date(sample.date)) {
				sample = samples[i];
			}
		}
	}
	return sample;
}

/**
 * Create the box which contains the last sample time.
 * @param {*} sensor the sensor on which showing the last sample time.
 * @param {*} element the father element on which append the box.
 */
function createLastSampleTimeBox(sensor, element) {
	var sample = findLastSample(sensor.samples);
	if (sample != null) {
		var div = document.createElement('div');
		div.className = 'col-md-6 col-xl-4';
		var cardDiv = document.createElement('div');
		cardDiv.className = 'card mb-3 widget-content bg-night-sky';

		var widgetDivWrapper = document.createElement('div');
		widgetDivWrapper.className = 'widget-content-wrapper text-white';

		var widgetDivContentLeft = document.createElement('div');
		widgetDivContentLeft.className = 'widget-content-left';
		var widgetDivHeading = document.createElement('div');
		widgetDivHeading.className = 'widget-heading';
		widgetDivHeading.innerText = 'Sample date';

		//var widgetDivSubHeading = document.createElement('div');
		//widgetDivSubHeading.className = "widget-subheading";
		//widgetDivSubHeading.innerText = "Last sample time";

		widgetDivContentLeft.append(widgetDivHeading);
		//widgetDivContentLeft.append(widgetDivSubHeading);

		var widgetDivContentRight = document.createElement('div');
		widgetDivContentRight.className = 'widget-content-right';
		var widgetDivValue = document.createElement('div');
		widgetDivValue.className = 'widget-numbers text-warning long-text';
		widgetDivValue.innerText = sample.date;
		widgetDivValue.id = sensor.code + 'last-sample-time';
		widgetDivContentRight.append(widgetDivValue);

		widgetDivWrapper.append(widgetDivContentLeft);
		widgetDivWrapper.append(widgetDivContentRight);

		cardDiv.append(widgetDivWrapper);
		div.append(cardDiv);
		element.append(div);
	}
}

/**
 * Update the last sample time of the given sensor.
 * @param {*} sensor the sensor on which updating the last sample time.
 */
function updateLastSampleTimeBox(sensor) {
	var id = sensor.code + 'last-sample-time';
	var sample = findLastSample(sensor.samples);
	var box = document.getElementById(id);
	if (
		(box != null || box != undefined) &&
		(sample != null || sample != undefined)
	) {
		box.innerText = sample.date;
	}
}

/**
 * Create the box which contains the total number of samples
 * @param {*} sensor the sensor on which showing the total number of samples
 * @param {*} element the father element on which append the box.
 */
function createTotalSamplesBox(sensor, element) {
	var div = document.createElement('div');
	div.className = 'col-md-6 col-xl-4';
	var cardDiv = document.createElement('div');
	cardDiv.className = 'card mb-3 widget-content bg-mean-fruit';

	var widgetDivWrapper = document.createElement('div');
	widgetDivWrapper.className = 'widget-content-wrapper text-black';

	var widgetDivContentLeft = document.createElement('div');
	widgetDivContentLeft.className = 'widget-content-left';
	var widgetDivHeading = document.createElement('div');
	widgetDivHeading.className = 'widget-heading';
	widgetDivHeading.innerText = 'Total Samples';

	var widgetDivSubHeading = document.createElement('div');
	widgetDivSubHeading.className = 'widget-subheading';
	widgetDivSubHeading.innerText = 'Number of samples';

	widgetDivContentLeft.append(widgetDivHeading);
	widgetDivContentLeft.append(widgetDivSubHeading);

	var widgetDivContentRight = document.createElement('div');
	widgetDivContentRight.className = 'widget-content-right';
	var widgetDivValue = document.createElement('div');
	widgetDivValue.className = 'widget-numbers text-primary';
	widgetDivValue.innerText =
		sensor.samples != null ? sensor.samples.length : 0;
	widgetDivValue.id = sensor.code + 'total-samples';
	widgetDivContentRight.append(widgetDivValue);

	widgetDivWrapper.append(widgetDivContentLeft);
	widgetDivWrapper.append(widgetDivContentRight);

	cardDiv.append(widgetDivWrapper);
	div.append(cardDiv);
	element.append(div);
}

/**
 * Update the number of samples
 * @param {*} sensor the sensor on which update the number of samples
 */
function updateTotalSamplesBox(sensor) {
	var id = sensor.code + 'total-samples';
	var box = document.getElementById(id);
	if (box != null || box != undefined) {
		box.innerText = sensor.samples != null ? sensor.samples.length : 0;
	}
}

/**
 * Create the box which contains the average of sensor's samples
 * @param {*} sensor the sensor on which calculate the average of samples
 * @param {*} element the father element on which append the box.
 */
function createSamplesAverageBox(sensor, element) {
	var div = document.createElement('div');
	div.className = 'col-md-6 col-xl-4';
	var cardDiv = document.createElement('div');
	cardDiv.className = 'card mb-3 widget-content bg-happy-itmeo';

	var widgetDivWrapper = document.createElement('div');
	widgetDivWrapper.className = 'widget-content-wrapper text-white';

	var widgetDivContentLeft = document.createElement('div');
	widgetDivContentLeft.className = 'widget-content-left';
	var widgetDivHeading = document.createElement('div');
	widgetDivHeading.className = 'widget-heading';
	widgetDivHeading.innerText = 'Samples average';

	var widgetDivSubHeading = document.createElement('div');
	widgetDivSubHeading.className = 'widget-subheading';
	widgetDivSubHeading.innerText = 'Weighted average';

	widgetDivContentLeft.append(widgetDivHeading);
	widgetDivContentLeft.append(widgetDivSubHeading);

	var widgetDivContentRight = document.createElement('div');
	widgetDivContentRight.className = 'widget-content-right';
	var widgetDivValue = document.createElement('div');
	widgetDivValue.className = 'widget-numbers text-warning';
	var average =
		sensor.samples != null
			? calculateSamplesAverage(sensor.samples, 0.125)
			: 0;
	average += evaluateContext(sensor.context);
	widgetDivValue.innerText = average;
	widgetDivValue.id = sensor.code + 'samples-average';
	widgetDivContentRight.append(widgetDivValue);

	widgetDivWrapper.append(widgetDivContentLeft);
	widgetDivWrapper.append(widgetDivContentRight);

	cardDiv.append(widgetDivWrapper);
	div.append(cardDiv);
	element.append(div);
}

/**
 * Update the average of samples of the given sensor.
 * @param {*} sensor The sensor on which updating the average.
 */
function updateSamplesAverageBox(sensor) {
	var id = sensor.code + 'samples-average';
	var box = document.getElementById(id);
	if (box != null || box != undefined) {
		var average =
			sensor.samples != null
				? calculateSamplesAverage(sensor.samples, 0.125)
				: 0;
		average += evaluateContext(sensor.context);
		box.innerText = average;
	}
}

/**
 * Calculate an exponential average of samples
 * @param {*} samples the samples on which the average must be calculated
 * @param {*} alpha the learning rate
 * @returns
 */
function calculateSamplesAverage(samples, alpha) {
	var average = 0;

	if (samples != null && samples.length > 0) {
		var len = samples.length;
		var sum = 0;
		if (len > 1 && len < 51) {
			for (var i = 0; i < len - 1; i++) {
				sum = sum * (1 - alpha) + samples[i].value * alpha;
			}
			average = sum + alpha * samples[len - 1].value;
			return Math.round(average * 100) / 100;
		} else if (len > 50) {
			for (var i = len - 50; i < len - 1; i++) {
				sum = sum * (1 - alpha) + samples[i].value * alpha;
			}
			average = sum + alpha * samples[len - 1].value;
			return Math.round(average * 100) / 100;
		} else {
			return Math.round(samples[0].value * 100) / 100;
		}
	} else {
		return 0;
	}
}

/**
 * Create the plot box for the chart of sensor's samples
 * @param {*} sensor the sensor associated to the box
 * @param {*} element the element on which the box must be appended.
 */
async function createSamplesLinePlotBox(sensor, element) {
	var wrapper = document.createElement('div');
	wrapper.className = 'col-md-12';
	var container = document.createElement('div');
	container.className = 'container-scroll';
	var div = document.createElement('div');
	div.className = 'main-card mb-3 card';

	var cardHeader = document.createElement('div');
	cardHeader.className = 'card-header justify-content-center';
	cardHeader.innerHTML = 'Samples Line Plot';

	var cardTitle = document.createElement('div');
	cardTitle.className = 'card-header-title';

	cardHeader.append(cardTitle);

	var rightDiv = document.createElement('div');
	rightDiv.className = 'btn-actions-pane-right';

	var button = document.createElement('button');
	button.className = 'btn-shadow btn btn-info';
	button.toggleClass = 'pause';
	editLinePlotButton(button);

	rightDiv.append(button);
	cardHeader.append(rightDiv);

	var cardDiv = document.createElement('div');
	cardDiv.className = 'card-body';

	var canvas = document.createElement('canvas');
	canvas.height = '400';
	canvas.width = '900';
	canvas.margin = '0 auto';
	canvas.id = sensor.code + 'samples-line';

	cardDiv.append(canvas);
	div.append(cardHeader);
	div.append(cardDiv);
	container.append(div);
	wrapper.append(container);
	element.append(wrapper);
	await createSamplesLinePlot(sensor);

	button.onclick = function () {
		var chart = charts[sensor.code];
		if (button.toggleClass == 'pause') {
			chart.options.scales.xAxes[0].realtime.pause = true;
			chart.update({ duration: 0 });
			chart.update();
			button.toggleClass = 'play';
			editLinePlotButton(button);
		} else if (button.toggleClass == 'play') {
			chart.options.scales.xAxes[0].realtime.pause = false;
			chart.update({ duration: 1300000 });
			chart.update();
			button.toggleClass = 'pause';
			editLinePlotButton(button);
		}
	};
}

/**
 * Edit the chart of sensor's samples.
 * @param {*} button button to be added to the plot.
 */
function editLinePlotButton(button) {
	button.innerText = '';
	var buttonSpan1 = document.createElement('span');
	buttonSpan1.className = 'btn-icon-wrapper pr-2 opacity-7';
	var buttonSpan2 = document.createElement('span');
	var spanIcon = document.createElement('i');
	if (button.toggleClass == 'pause') {
		buttonSpan2.innerHTML = 'Pause';
		spanIcon.className = 'nav-link-icon fa fa-pause';
	} else {
		buttonSpan2.innerHTML = 'Play';
		spanIcon.className = 'nav-link-icon fa fa-play';
	}

	buttonSpan1.append(spanIcon);
	button.append(buttonSpan1);
	button.append(buttonSpan2);
}

/**
 * Create the chart of sensor's samples.
 * @param {*} sensor the sensor associated to the chart.
 */
async function createSamplesLinePlot(sensor) {
	var id = sensor.code + 'samples-line';
	var canvas = document.getElementById(id);
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var xl = await getSamplesTime(sensor.samples);
	var yl = await getSamplesValue(sensor.samples);

	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: xl,
			datasets: [
				{
					label: 'Samples value',
					data: yl,
					fill: false,
					backgroundColor: '#f7b924',
					borderColor: '#2a5298',
					borderWidth: 1,
				},
			],
		},
		options: {
			title: {
				display: true,
			},
			scales: {
				xAxes: [
					{
						type: 'realtime',
						realtime: {
							duration: 999000,
							refresh: 1000,
							delay: 2000,
							ttl: 2628000000,
						},
					},
				],
				yAxes: [
					{
						ticks: {
							callback: function (value, index, values) {
								return value + evaluateContext(sensor.context);
							},
						},
						scaleLabel: {
							display: true,
						},
					},
				],
			},
			tooltips: {
				mode: 'nearest',
				intersect: false,
			},
			hover: {
				mode: 'nearest',
				intersect: false,
			},
			pan: {
				enabled: true,
				mode: 'x',
				rangeMax: {
					x: undefined,
				},
				rangeMin: {
					x: 4000,
				},
			},
			zoom: {
				enabled: true,
				mode: 'x',
			},
		},
	});

	charts[sensor.code] = myChart;
}

/**
 * Update the plot of the given sensor
 * @param {*} sensor the sensor whose chart must be updated
 */
function updateSamplesLinePlotBox(sensor) {
	var id = sensor.code;
	var chart = charts[id];
	if (chart != null || chart != undefined) {
		var samples = sensor.samples;
		var len = samples.length;
		var date = new Date(samples[len - 1].date);
		var value = Math.round(samples[len - 1].value * 100) / 100;

		chart.data.labels.push(date);
		chart.data.datasets[0].data.push(value);
		chart.update();
	}
}

/**
 * Get all sampleTimes from samples.
 * @param {*} samples the samples collection from which extracting the sampleTime.
 * @returns the collection which holds only sampleTimes of samples.
 */
function getSamplesTime(samples) {
	var samplesTime = [];
	if (samples != null && samples.length > 0) {
		var len = samples.length;
		for (var i = 0; i < len; i++) {
			var date = new Date(samples[i].date);
			samplesTime.push(date);
		}
	}
	return samplesTime;
}

/**
 * Get all values from samples.
 * @param {*} samples the samples collection from which extracting values.
 * @returns the collection which holds only values of samples.
 */
function getSamplesValue(samples) {
	var samplesValue = [];
	if (samples != null && samples.length > 0) {
		var len = samples.length;
		for (var i = 0; i < len; i++) {
			samplesValue.push(Math.round(samples[i].value * 100) / 100);
		}
	}
	return samplesValue;
}

function clearCoreFrame() {
	coreFrame.innerText = '';
}
/********************************************************************************************************************/

//***** Update dashboard info *****
function updateDashboardInfo() {
	updateTotalNodes();
	updateAvailableNodes();
	updateTotalSensors();
	updateAvailableSensors();
	updateTotalSamples();
}

/**
 * Update the total number of nodes.
 */
function updateTotalNodes() {
	var totalNodesSpan = document.getElementById('total-nodes-span');
	if (totalNodesSpan != null || totalNodesSpan != undefined) {
		totalNodesSpan.innerText = countNodes();
	}
}

/**
 * Update the total number of available nodes.
 */
function updateAvailableNodes() {
	var availableNodesSpan = document.getElementById('available-nodes-span');
	if (availableNodesSpan != null || availableNodesSpan != undefined) {
		availableNodesSpan.innerText = countAvailableNodes();
	}
}

/**
 * Update the total number of sensors.
 */
function updateTotalSensors() {
	var totalSensorsSpan = document.getElementById('total-sensors-span');
	if (totalSensorsSpan != null || totalSensorsSpan != undefined) {
		totalSensorsSpan.innerText = countSensors();
	}
}

/**
 * Update the total number of available sensors.
 */
function updateAvailableSensors() {
	var availableSensorsSpan = document.getElementById(
		'available-sensors-span'
	);
	if (availableSensorsSpan != null || availableSensorsSpan != undefined) {
		availableSensorsSpan.innerText = countAvailableSensors();
	}
}

/**
 * Update the total number of samples.
 */
function updateTotalSamples() {
	var totalSamplesSpan = document.getElementById('total-samples-span');
	if (totalSamplesSpan != null || totalSamplesSpan != undefined) {
		totalSamplesSpan.innerText = countSamples();
	}
}

/**
 * Count the total number of nodes.
 * @returns the total number of nodes.
 */
function countNodes() {
	return nodesPayload.length;
}

/**
 * Get the total number of available nodes.
 * @returns the total number of available nodes.
 */
function countAvailableNodes() {
	var availableNodes = 0;
	if (nodesPayload != null) {
		for (var i = 0; i < nodesPayload.length; i++) {
			if (nodesPayload[i].isAvailable) {
				availableNodes++;
			}
		}
	}
	return availableNodes;
}

/**
 * Get the total number of sensors.
 * @returns the total number of sensors.
 */
function countSensors() {
	var totalSensors = 0;
	if (nodesPayload != null) {
		for (var i = 0; i < nodesPayload.length; i++) {
			if (nodesPayload[i].sensors != null) {
				totalSensors += nodesPayload[i].sensors.length;
			}
		}
	}
	return totalSensors;
}

/**
 * Get the total number of available sensors.
 * @returns the total number of available sensors
 */
function countAvailableSensors() {
	var availableSensors = 0;
	if (nodesPayload != null) {
		for (var i = 0; i < nodesPayload.length; i++) {
			if (nodesPayload[i].sensors != null) {
				for (var j = 0; j < nodesPayload[i].sensors.length; j++) {
					if (nodesPayload[i].sensors[j].isAvailable) {
						availableSensors++;
					}
				}
			}
		}
	}
	return availableSensors;
}

/**
 * Count the total number of samples.
 * @returns the total number of samples.
 */
function countSamples() {
	return samplesPayload.length;
}
/*******************************************************************************************************************/

//***** Plotting dashboard data *****
async function createDashboardPlot() {
	await addSamplesToSensor();
	await createDashboardSensorsPlot();
	await createDashboardNodesPlot();
}

/**
 * Create the sensor plot in the dashboard.
 */
async function createDashboardSensorsPlot() {
	var canvas = document.getElementById('dashboard-sensors-plot');
	if (canvas != null || canvas != undefined) {
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		var xl = await getSensorsCode();
		var yl = await getTotalSamplesFromSensors();
		var backgroundColors;

		if (colorArray.length >= nodesPayload.length) {
			backgroundColors = colorArray;
		} else {
			backgroundColors = await getNodesBackgroundColors();
		}

		if (charts.dashboard.sensors != undefined) {
			charts.dashboard.sensors.destroy();
		}

		charts.dashboard.sensors = new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: xl,
				datasets: [
					{
						data: yl,
						backgroundColor: colorArray,
						borderWidth: 1,
						options: {
							animation: true,
						},
					},
				],
			},
		});
	}
}

/**
 * Update dashboard plots upon receiving a new sample.
 */
async function updateDashboardPlots() {
	await createDashboardPlot();
}

/**
 * Create the Node chart in the dashboard.
 */
async function createDashboardNodesPlot() {
	var canvas = document.getElementById('dashboard-nodes-plot');
	if (canvas != null || canvas != undefined) {
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		var xl = await getNodesName();
		var yl = await getTotalSamplesFromNodes();
		var backgroundColors;

		if (colorArray.length >= nodesPayload.length) {
			backgroundColors = colorArray;
		} else {
			backgroundColors = await getNodesBackgroundColors();
		}

		if (charts.dashboard.nodes != undefined) {
			charts.dashboard.nodes.destroy();
		}

		charts.dashboard.nodes = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: xl,
				datasets: [
					{
						label: '# of samples',
						data: yl,
						backgroundColor: backgroundColors,
						options: {
							legendItemClick: function (e) {
								console.log(
									'Clicked an item with text: ' + e.text
								);
								e.preventDefault();
							},
							tooltips: {
								callbacks: {
									label: function (tooltipItem) {
										return tooltipItem.yLabel;
									},
								},
							},
						},
						borderWidth: 1,
					},
				],
			},
		});
	}
}

/**
 * Get a random color. These functions are used when the colorArray has less elements than
 * the required ones.
 * @returns a random color
 */
function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

/**
 * Get random background color for sensor chart.
 * @returns random background colors.
 */
function getSensorsBackgroundColors() {
	var backgroundColors = [];
	for (var i = 0; i < nodesPayload.length; i++) {
		for (var j = 0; j < nodesPayload[i].sensors.length; j++) {
			backgroundColors.push(getRandomColor());
		}
	}
	return backgroundColors;
}

/**
 * Get random background color for node chart.
 * @returns random background colors.
 */
function getNodesBackgroundColors() {
	var backgroundColors = [];
	for (var i = 0; i < nodesPayload.length; i++) {
		backgroundColors.push(getRandomColor());
	}
	return backgroundColors;
}

/**
 * Get the sensor code.
 * @returns the sensor code.
 */
function getSensorsCode() {
	var sensorsCode = [];
	for (var i = 0; i < nodesPayload.length; i++) {
		if (nodesPayload[i].sensors) {
			for (var j = 0; j < nodesPayload[i].sensors.length; j++) {
				sensorsCode.push(nodesPayload[i].sensors[j].code);
			}
		}
	}
	return sensorsCode;
}

/**
 * Get the name of the node.
 * @returns the name of the node.
 */
function getNodesName() {
	var nodesName = [];
	for (var i = 0; i < nodesPayload.length; i++) {
		nodesName.push(nodesPayload[i].name);
	}
	return nodesName;
}

/**
 * Get the total number of samples for each sensor.
 * @returns the total number of samples per sensor.
 */
function getTotalSamplesFromSensors() {
	var totalSamples = [];
	for (var i = 0; i < nodesPayload.length; i++) {
		if (nodesPayload[i].sensors) {
			for (var j = 0; j < nodesPayload[i].sensors.length; j++) {
				totalSamples.push(
					nodesPayload[i].sensors[j].samples != null
						? nodesPayload[i].sensors[j].samples.length
						: 0
				);
			}
		}
	}
	return totalSamples;
}

/**
 * Get the total number of samples for each node.
 * @returns the total number of samples for each node
 */
function getTotalSamplesFromNodes() {
	var totalSamples = [];
	var sum = 0;
	for (var i = 0; i < nodesPayload.length; i++) {
		if (nodesPayload[i].sensors) {
			for (var j = 0; j < nodesPayload[i].sensors.length; j++) {
				sum +=
					nodesPayload[i].sensors[j].samples != null
						? nodesPayload[i].sensors[j].samples.length
						: 0;
			}
			totalSamples.push(sum);
			sum = 0;
		}
	}
	return totalSamples;
}
/********************************************************************************************************************/

/**
 * Start the execution when the page is loaded.
 */
window.onload = function () {
	doGetNodes();
};
