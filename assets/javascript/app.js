// link to firebase
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

// on click effect for submit button
$("#submit").on("click", function(event) {
  event.preventDefault();
  
  // saves form values as variables
  var trainName = $("#train-name").val().trim();
  var trainDestination = $("#destination").val().trim();
  var trainFirstTime = moment($("#first-time").val().trim(), 'HH:mm').format('HH:mm');
  var trainFrequency = $("#frequency").val().trim();

  // saves variable in an object
  var newTrain = {
    train: trainName,
    destination: trainDestination,
    initialtime: trainFirstTime,
    frequency: trainFrequency,
  };

  // pushes object to database
  database.ref().push(newTrain);

  // clears out form
  $("#train-name").val("");
  $("#destination").val("");
  $("#first-time").val("");
  $("#frequency").val("");

});

// when database changes
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // saves snapshots of database as variables
  var ctrainName = childSnapshot.val().train;
  var ctrainDestination = childSnapshot.val().destination;
  var ctrainFirstTime = childSnapshot.val().initialtime;
  var ctrainFrequency = childSnapshot.val().frequency;
  var updatedTime = ctrainFirstTime;
  
  // if the difference between the current time and updatedTime is negative
  if (Math.sign(parseInt(moment().diff(moment(updatedTime, 'HH:mm'), 'm'))) === -1) {
    // adds 24 hours to the updatedTime to keep it positve
    var updatedTime = (moment(updatedTime, 'HH:mm').add(24, 'h'));
  };

  // while the difference of the current time and updated time in minutes is greater than the frequency
  while (parseInt(moment().diff(moment(updatedTime, 'HH:mm'), 'm')) > parseInt(ctrainFrequency)) {
    // add the frequency in minutes to the updatedTime until the the difference is less than the frequence
    var updatedTime = moment(updatedTime, 'HH:mm').add(ctrainFrequency, 'm');
  };
  // variable for the next arrival. adding the frequency to the updatedTime
  var cnextArrival = moment(updatedTime, 'HH:mm').add(ctrainFrequency, 'm').format('HH:mm');
  //variable for the minutes away. difference between the next arrival and the current time
  var cminutesAway = moment(cnextArrival, 'HH:mm').diff(moment(), "minutes");
  
  // if the minutes away is negative, add 24 hours to the next arrival to keep the time positive
  if (Math.sign(cminutesAway) === -1) {
    var cminutesAway = (moment(cnextArrival, 'HH:mm').add(24, 'h')).diff(moment(), "minutes");
  };
  
  // appends the table with train information
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