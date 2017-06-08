// Initialize Firebase
var config = {
	apiKey: "AIzaSyBepjghQosuCjOtfeIZjVV6Adf2ymdQAh0",
	authDomain: "train-scheduler-13185.firebaseapp.com",
	databaseURL: "https://train-scheduler-13185.firebaseio.com",
	projectId: "train-scheduler-13185",
	storageBucket: "train-scheduler-13185.appspot.com",
	messagingSenderId: "822286112386"
};
firebase.initializeApp(config);

var database = firebase.database();


// define variables
var trainName = "";
var destination = "";
var firstTrain = "";
var frequency = 0;
var firstTrainConverted = 0;
var timeDifference = 0;
var remainder = 0;
var minutesAway = 0;
var nextTrain= "";


// nextArrival Function
function nextArrival() {

	
	firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
	// console.log(firstTrainConverted);

	timeDifference = moment().diff(moment(firstTrainConverted), "minutes");
	console.log(timeDifference);

	remainder = timeDifference % frequency;
	console.log(remainder);

	minutesAway = frequency - remainder;
	console.log("minutes away: " + minutesAway);

	nextTrain = moment().add(minutesAway, "minutes");
	nextTrain = moment(nextTrain).format("hh:mm");
	console.log("arrival time " + nextTrain);
	// console.log ("arrival time : " + moment(nextTrain).format("hh:mm"));


} //End of nextArrival Function


// Submit Button on click event
$("#add-train").on("click", function (event) {
	event.preventDefault();

	trainName = $("#train-input").val().trim();
	destination = $("#destination-input").val().trim();
	firstTrain = $("#time-input").val().trim();
	frequency = $("#frequency-input").val();
	console.log(trainName);
	console.log(destination);
	console.log(firstTrain);
	console.log(frequency);

	nextArrival();
	// debugger
	// console.log(nextTrain);
	// console.log(minutesAway);

	database.ref().push({
		name: trainName,
		destination: destination,
		frequency: frequency,
		first: firstTrain
		// nextArrival: nextTrain,
		// minutes: minutesAway
		// dateAdded: firebase.database.ServerValue.TIMESTAMP

	});

});  //End of Submit Button


//Initial Load  and on child added
database.ref().on("child_added", function(snap){

	firstTrain = snap.val().first;
	frequency = snap.val().frequency;
	nextArrival();

	$("#train-schedule").append("<tr><td>" + snap.val().name + 
		"</td><td>" + snap.val().destination +
		"</td><td>" + snap.val().frequency + 
		"</td><td>" + nextTrain +
		"</td><td>" + minutesAway + "</td></tr>");

// Handle the errors
}, function(errorObject){
	console.log("Errors handled: " + errorObject.code);
}); // end of on child added
