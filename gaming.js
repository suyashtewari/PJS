var db = firebase.firestore();
const displayName = window.localStorage.getItem("displayName")
const roomId = window.localStorage.getItem("roomId")
const selection = window.localStorage.getItem("selection")
const aliasArr = window.localStorage.getItem("aliases")

console.log(selection)
var usernameOfCurrentGuess = ""


var inGamePlayers = []


document.getElementById("personal-id").innerHTML = "Your Identity: " + selection


// replace the button values with the names of the players other than user
db.collection("rooms").doc(roomId).collection("players").get()
    .then(function(players) {
         players.forEach(function(player) {
            inGamePlayers.push(player.id)
         })
     })
    .then(function() {
        var otherPlayers = inGamePlayers.splice(inGamePlayers.indexOf(displayName), 1)
        for (var i = 0; i < inGamePlayers.length; i++) {
            document.getElementById("player" + (i + 1)).parentNode.style.display = "block"
            //document.getElementById("player" + (i + 1)).style.visibility = "visible"
            document.getElementById("player" + (i + 1)).innerHTML = inGamePlayers[i]
            document.getElementById("guess-person").innerHTML = "Press a button in the bottom to guess a person's identity."
        }
    })


// player listeners
document.getElementById("player1").addEventListener("click", function() {
    usernameOfCurrentGuess = document.getElementById("player1").innerHTML
    document.getElementById("guess-person").innerHTML = "You are guessing " + usernameOfCurrentGuess + "'s identity." 
    document.getElementById("input-container").style.visibility = "visible"
    document.getElementById("guessButton").style.visibility = "visible"
});
document.getElementById("player2").addEventListener("click", function() {
    usernameOfCurrentGuess = document.getElementById("player2").innerHTML
    document.getElementById("guess-person").innerHTML = "You are guessing " + usernameOfCurrentGuess + "'s identity."
    document.getElementById("input-container").style.visibility = "visible"
    document.getElementById("guessButton").style.visibility = "visible"
});
document.getElementById("player3").addEventListener("click", function() {
    usernameOfCurrentGuess = document.getElementById("player3").innerHTML
    document.getElementById("guess-person").innerHTML = "You are guessing " + usernameOfCurrentGuess + "'s identity."
    document.getElementById("input-container").style.visibility = "visible"
    document.getElementById("guessButton").style.visibility = "visible"
});

document.getElementById("player4").addEventListener("click", function() {
    usernameOfCurrentGuess = document.getElementById("player4").innerHTML
    document.getElementById("guess-person").innerHTML = "You are guessing " + usernameOfCurrentGuess + "'s identity."
    document.getElementById("input-container").style.visibility = "visible"
    document.getElementById("guessButton").style.visibility = "visible"
});

document.getElementById("player5").addEventListener("click", function() {
    usernameOfCurrentGuess = document.getElementById("player5").innerHTML
    document.getElementById("guess-person").innerHTML = "You are guessing " + usernameOfCurrentGuess + "'s identity."
    document.getElementById("input-container").style.visibility = "visible"
    document.getElementById("guessButton").style.visibility = "visible"
});

document.getElementById("player6").addEventListener("click", function() {
    usernameOfCurrentGuess = document.getElementById("player6").innerHTML
    document.getElementById("guess-person").innerHTML = "You are guessing " + usernameOfCurrentGuess + "'s identity."
    document.getElementById("input-container").style.visibility = "visible"
    document.getElementById("guessButton").style.visibility = "visible"
});
document.getElementById("player7").addEventListener("click", function() {
    usernameOfCurrentGuess = document.getElementById("player7").innerHTML
    document.getElementById("guess-person").innerHTML = "You are guessing " + usernameOfCurrentGuess + "'s identity."
    document.getElementById("input-container").style.visibility = "visible"
    document.getElementById("guessButton").style.visibility = "visible"
});

//guess button listener
document.getElementById("guessButton").addEventListener("click", function() {
    var guess = document.getElementById("guessIdentity").value
    console.log(guess)
    guessAndCheckPlayer(usernameOfCurrentGuess, guess)
});



//guess identity of a player and check if its correct or not
function guessAndCheckPlayer(usernameOfCurrentGuess, guess) {
    var guessed = false;

    db.collection("rooms").doc(roomId).collection("players").doc(usernameOfCurrentGuess).get().then(function(guessRecipient) {

        console.log(guessRecipient.data().aliases);

        var aliasarray = guessRecipient.data().aliases;
        console.log(aliasarray);

        aliasarray.splice(0, 0, guessRecipient.data().selection)

        console.log(aliasarray)

        var index = 0;
        var isCorrect = false;

        while(index < aliasarray.length && !isCorrect){
            console.log(aliasarray[index])

            //var arr = aliasarray[i];

            //db.collection("rooms").doc(roomId).get().then(function(roomDocument){
                console.log(aliasarray[index]);
                console.log(guess);
                if (aliasarray[index].toLowerCase() == guess.toLowerCase()) {

                console.log("checked to see if equal")

                // db.collection("rooms").doc(roomId).collection("players").doc(usernameOfCurrentGuess).set({
                //     selection: guessRecipient.data().selection,
                //     aliases: guessRecipient.data().aliases
                // }, {merge: true})
                // .then(function() {
                    // once we've eliminated a player, we want to display a "Eliminated player"
                    // dialog unless this is the last of two players.
                    db.collection("rooms").doc(roomId).get().then(function(roomDocument) {
                        if (roomDocument.data().numPlayersRemaining > 2) {

                            console.log("getting into if statement")
                            //modal stuff
                            var modal = document.getElementById("myModal");
                            var span = document.getElementsByClassName("close")[0];
                            document.getElementById("modal-content").style.backgroundColor = "#00DC0A"
                            document.getElementById("modal-image").innerHTML = "&#10003"
                            document.getElementById("header-text").innerHTML = "Correct"
                            document.getElementById("personEliminated").innerHTML = "You have eliminated " + usernameOfCurrentGuess + "!"
                            modal.style.display = "block";

                            span.onclick = function(){
                                modal.style.display = "none"
                            }

                            //allows person to click anywhere other than modal to close modal
                            window.onclick = function(event) {
                              if (event.target == modal) {
                                modal.style.display = "none";
                              }
                            }

                            //decrement numPlayersRemaining and make player eliminated
                            db.collection("rooms").doc(roomId).collection("players").doc(usernameOfCurrentGuess).get().then(function(playerDocument){
                                if(!playerDocument.data().isEliminated){
                                    db.collection("rooms").doc(roomId).set({
                                        numPlayersRemaining: roomDocument.data().numPlayersRemaining - 1,
                                    }, {merge:true})
                                    .then(function() {
                                        db.collection("rooms").doc(roomId).collection("players").doc(usernameOfCurrentGuess).set({
                                            isEliminated: true,
                                        }, {merge:true})
                                    })
                                }
                            })
                            
                        }
                        else {

                            console.log("getting into else statement")
                            //this is for if two players who haven't been eliminated, yet there are still more than two players playing
                            allPlayers = inGamePlayers.length + 1
                            if(allPlayers > 2){

                                console.log("eliminated")
                                document.getElementById("modal-image").innerHTML = "&#10003"
                                var modal = document.getElementById("myModal");
                                var span = document.getElementsByClassName("close")[0];
                                document.getElementById("modal-content").style.backgroundColor = "#00DC0A"
                                document.getElementById("personEliminated").innerHTML = "You have eliminated " + usernameOfCurrentGuess

                                modal.style.display = "block";

                                span.onclick = function(){
                                    modal.style.display = "none"
                                }

                                window.onclick = function(event) {
                                  if (event.target == modal) {
                                    modal.style.display = "none";
                                  }
                                }

                                //decrement numPlayersRemaining and make player eliminated
                                db.collection("rooms").doc(roomId).collection("players").doc(usernameOfCurrentGuess).get().then(function(playerDocument){
                                    if(!playerDocument.data().isEliminated){
                                        db.collection("rooms").doc(roomId).set({
                                            numPlayersRemaining: roomDocument.data().numPlayersRemaining - 1,
                                        }, {merge:true})
                                        .then(function() {
                                            db.collection("rooms").doc(roomId).collection("players").doc(usernameOfCurrentGuess).set({
                                                isEliminated: true,
                                            }, {merge:true})
                                            return true;
                                        })
                                    }
                                })
                                return true;
                            }

                            //make two players remaining to one if a one of the last two players gets guessed
                            db.collection("rooms").doc(roomId).set({
                                numPlayersRemaining: roomDocument.data().numPlayersRemaining - 1,
                            }, {merge:true}).then(function() {
                                db.collection("rooms").doc(roomId).collection("players").doc(usernameOfCurrentGuess).set({
                                isEliminated: true, 
                            }, {merge: true})
                            })
                            console.log("does return (204)")
                            return true;
                        } 
                    })
					isCorrect = true;
					
                }

            //}).then(function(){

                else if(index == aliasarray.length - 1){
                    console.log("in the else if")

                     //wrong guess modal

                     console.log("Incorrect")
                    var modal = document.getElementById("myModal");
                    var span = document.getElementsByClassName("close")[0];
                    document.getElementById("modal-content").style.backgroundColor = "#FF0000"
                    document.getElementById("personEliminated").innerHTML = "Guess Again!"
                    document.getElementById("modal-image").innerHTML = "&#10008"
                    document.getElementById("header-text").innerHTML = "Incorrect"
                    modal.style.display = "block";

                    span.onclick = function(){
                    modal.style.display = "none"
                        }

                    window.onclick = function(event) {
                      if (event.target == modal) {
                        modal.style.display = "none";
                      }
                    }
                    console.log("return 4")
                    index++;
                    
                }
                else{
                	index++;
                }

            //})

            
            
             
        }
     
    })
}

//lets player go back to starting page
document.getElementById("back").addEventListener("click", function(){

    window.location.href = "index.html"
})

// window.onbeforeunload = function(e){
//     console.log('closing shared worker port...');

//     db.collection("rooms").doc(roomId).collection("players").doc(displayName).delete().then(function(){
//         db.collection("rooms").doc(roomId).delete().then(function(){
//             window.location.href = "index.html"
//         })
//     })

//     e.returnValue = 'there we go there we go';
// };

// window.addEventListener('beforeunload', function(e){
//     // console.log('closing shared worker port...');

//     console.log("used addeventlistener")

//     // .then(function(){
//     //     // db.collection("rooms").doc(roomId).delete().then(function(){
//     //     //     window.location.href = "index.html"
//     //     // })
//     // })

//     // db.collection("rooms").doc(roomId).set({
//     //     numPlayersRemaining: roomDocument.data().numPlayersRemaining - 1

        

//     // }, {merge: true})

//     e.preventDefault();

//     e.returnValue = ""

// })

// window.addEventListener('unload', function(e){
//     // console.log('closing shared worker port...');

//     console.log("used things idk  lulw")
    
//     db.collection("rooms").doc(roomId).collection("players").doc(displayName).delete();

// })

//listen for if there is only one player who is remaining and display winner message
var gameEndListener = db.collection("rooms").doc(roomId).collection("players").onSnapshot(function(players) { 
    
     db.collection("rooms").doc(roomId).get().then(function(roomDocument) {

        if (roomDocument.data().numPlayersRemaining == 1) {

            db.collection("rooms").doc(roomId).collection("players").onSnapshot(function(players) {
                players.forEach(function(player) {
                    if (!player.data().isEliminated) {
                        gameEndListener()
                       const winner = player.id

                       document.getElementById("guess-person").innerHTML = "The winner is " + winner + "!"
                       document.getElementById("input-container").style.visibility = "hidden"

                       document.getElementById("guessButton").style.visibility = "visible"

                       document.getElementById("player1").style.visibility = "hidden"
                       document.getElementById("player2").style.visibility = "hidden"
                       document.getElementById("player3").style.visibility = "hidden"

                       document.getElementById("guessButton").innerHTML = "Back to home"

                       document.getElementById("guessButton").addEventListener("click", function() {

                        db.collection("rooms").doc(roomId).collection("players").doc(displayName).delete().then(function(){
                            db.collection("rooms").doc(roomId).delete().then(function(){
                                window.location.href = "index.html"
                            })
                            
                        // db.collection("rooms").doc(roomId).delete().then(function(){
                        //     db.collection("rooms").doc(roomId).collection("players").doc(displayName).delete().then(function(){
                        //         window.location.href = "landing.html"
                        //     })

                        })
                            // console.log("Room successfully deleted")
                        
                        //db.collection("rooms").doc(roomId).collection("players").doc(displayName).delete()
                        
                         
                  
                        
                    })
                }
                })
            })

    }
})
})

window.addEventListener('beforeunload', function(e){
    // console.log('closing shared worker port...');

    console.log("used addeventlistener")

    // .then(function(){
    //     // db.collection("rooms").doc(roomId).delete().then(function(){
    //     //     window.location.href = "index.html"
    //     // })
    // })

    db.collection("rooms").doc(roomId).set({
        numPlayersRemaining: roomDocument.data().numPlayersRemaining - 1})
    
    db.collection("rooms").doc(roomId).collection("players").doc(displayName).delete();

    // }, {merge: true})

    e.preventDefault();

    // e.returnValue = ""

    // return "dingaladong dong dingaladong dong"

})

