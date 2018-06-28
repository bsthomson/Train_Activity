var config = {
  apiKey: "AIzaSyAszfGZSOd6z-3vEEEJ3oD_PkM7gYaEobk",
  authDomain: "dog-pit.firebaseapp.com",
  databaseURL: "https://dog-pit.firebaseio.com",
  projectId: "dog-pit",
  storageBucket: "dog-pit.appspot.com",
  messagingSenderId: "560316186785"
};
firebase.initializeApp(config);
  
var database = firebase.database();

$("#submit").on("click", function(event) {
  event.preventDefault();
  
  var trainName = $("#train-name").val().trim();
  var trainDestination = $("#destination").val().trim();
  var trainFirstTime = moment($("#first-time").val().trim(), 'HH:mm').format('HH:mm');
  var trainFrequency = $("#frequency").val().trim();

  console.log(trainName);
  console.log(trainDestination);
  console.log(trainFirstTime);
  console.log(trainFrequency);

  var newTrain = {
    train: trainName,
    destination: trainDestination,
    initialtime: trainFirstTime,
    frequency: trainFrequency,
  };

  database.ref().push(newTrain);

  console.log(newTrain.train);
  console.log(newTrain.destination);
  console.log(newTrain.initialtime);
  console.log(newTrain.frequency);

  $("#train-name").val("");
  $("#destination").val("");
  $("#first-time").val("");
  $("#frequency").val("");

});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());

  var ctrainName = childSnapshot.val().train;
  var ctrainDestination = childSnapshot.val().destination;
  var ctrainFirstTime = childSnapshot.val().initialtime;
  var ctrainFrequency = childSnapshot.val().frequency;

  console.log(ctrainName);
  console.log(ctrainDestination);
  console.log(ctrainFirstTime);
  console.log(ctrainFrequency);


  var cnextArrival = moment(ctrainFirstTime, 'HH:mm').add(ctrainFrequency, 'm').format('HH:mm');
  console.log(cnextArrival);


  var cminutesAway = moment(cnextArrival, 'HH:mm').diff(moment(), "minutes");
  
  if (Math.sign(cminutesAway) === -1) {
    var cminutesAway = (moment(cnextArrival, 'HH:mm').add(24, 'h')).diff(moment(), "minutes");
  };

  console.log(cminutesAway);
  

  $("#tablebody").append(`
    <tr>
      <th scope='row'>${ctrainName}</th>
      <td>${ctrainDestination}</td>
      <td>${ctrainFrequency}</td>
      <td>${cnextArrival}</td>
      <td>${cminutesAway}</td>
    </tr>
    `);

});