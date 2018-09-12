$(document).ready(function () {


    //------------------------------------------//
    //           Firebase Configuration         //
    //------------------------------------------//
    // This is where we setup our connection to //
    // our Google Firebase Database using our   //
    // unique API Key and project ID to access. //
    // We then initialize the connection and    //
    // create a variable to store the info from //
    // our database.                            //
    //------------------------------------------//

    var config = {
        apiKey: "AIzaSyCF1LD8ItLy1VMpgSy4qft4r85AohXzXN0",
        authDomain: "train-schedule-89c26.firebaseapp.com",
        databaseURL: "https://train-schedule-89c26.firebaseio.com/",
        projectId: "train-schedule-89c26",
        storageBucket: "recent-user-with-push.appspot.com",
        messagingSenderId: "172711614454"
    };

    firebase.initializeApp(config);

    var database = firebase.database();


    //------------------------------------------//
    //            Database Actions              //
    //------------------------------------------//
    // We create our "train" by capture the     //
    // user inputs then push our new train to   //
    // Firebase.                                //
    //------------------------------------------//

    function train(number, destination, time, frequency) {
        this.number = number;
        this.destination = destination;
        this.time = time;
        this.frequency = frequency;
    }

    $("#addTrain").on("click", function () {
        event.preventDefault();

        var newTrain = new train(
            $("#trainNumber").val().trim(),
            $("#trainDestination").val().trim(),
            $("#trainTime").val().trim(),
            $("#trainFrequency").val().trim()
        );

        database.ref().push(newTrain);
    });


    //------------------------------------------//
    //           Schedule Population            //
    //------------------------------------------//
    // We pull all of our data from Firebase    //  
    // and append it to a #trainList <div> on   //
    // the frontend.                            //
    //------------------------------------------//

    database.ref().on("child_added", function (data) {
        var train = data.val();
        var trainNumber = train.number;
        var trainDestination = train.destination;
        var trainTime = train.time;
        var trainFrequency = train.frequency;
        var arrivals = getArrival(trainFrequency, trainTime);


        $("#trainList").append(
            "<tr><td>" + trainNumber +
            "</td><td>" + trainDestination +
            "</td><td>" + trainFrequency +
            "</td><td>" + arrivals.nextTrain +
            "</td><td>" + arrivals.minutesAway +
            "</td></tr>");
    });


    //------------------------------------------//
    //         Moment.js Time Conversion        //
    //------------------------------------------//
    // Here we utilize the moment.js library to //
    // to capture and convert the time          //
    // attributes for our trains and display in //
    // the EST timezone.                        //
    //------------------------------------------//

    function getArrival(trainFrequency, trainTime) {
        var timestamp = moment();
        var firstTrain = moment(trainTime, "hh:mm");
        var diffTime = moment().diff(moment(firstTrain), "minutes");
        var timeGap = diffTime % trainFrequency;
        var minutesAway = trainFrequency - timeGap;
        var nextTrain = moment(moment().add(minutesAway, "minutes")).utcOffset('-0400').format("hh:mm A");

        return object = {
            minutesAway: minutesAway,
            nextTrain: nextTrain
        }
    }

    
    //------------------------------------------//
    //           Current Time Function          //
    //------------------------------------------//
    // Simple function that uses moment.js and  //
    // an interval to set and update current    //
    // time.
    //------------------------------------------//    

    function displayCurrentTime() {
        setInterval(function () {
            $('#currentTime').html(moment().format('hh:mm A'))
        }, 1000);
    }
    displayCurrentTime();

});