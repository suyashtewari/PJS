$(document).ready(function(){
    $('.header').height($(window).height());
  })

var db = firebase.firestore();
const displayName = window.localStorage.getItem("displayName")
const roomId = window.localStorage.getItem("roomId")
const isAdmin = window.localStorage.getItem("isAdmin")
const selection = window.localStorage.getItem("selection")

var inGamePlayers = []
var isPlayersReady = []
var goBack = false

document.getElementById("copyLink").addEventListener("click", function(){
     
    var copyText = document.getElementById("myInput");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  alert("Copied the text: " + copyText.value);
})


document.getElementById("startGame").style.visibility='hidden'




//check to see if all players are ready
db.collection("rooms").doc(roomId).collection("players").onSnapshot(function(players) {

    console.log("someone hath entered")

    inGamePlayers = []
    isPlayersReady = []

     players.forEach(function(player) {
        inGamePlayers.push(player.id)
        isPlayersReady.push(player.data().isReady)
     })


    db.collection("rooms").doc(roomId).get().then(function() {

        console.log("well, this is awkward innit")
        var numPlayersReady = 0
        for(i = 0; i < isPlayersReady.length; i++){
            if(isPlayersReady[i] == true)
                numPlayersReady++
        }

        if(inGamePlayers.length < 2){
            document.getElementById("startGame").style.visibility='hidden'
        }

        if(numPlayersReady == inGamePlayers.length){
            if(inGamePlayers.length > 1){
                console.log("everyone is ready")
                if(isAdmin == 'true'){
                    document.getElementById("startGame").style.visibility='visible'
                } 
            } 
        }
        
    })
})





//shows list of players
db.collection("rooms").doc(roomId).collection("players").onSnapshot(function(players){
    inGamePlayers = []
    isPlayersReady = []
    players.forEach(function(player) {
        inGamePlayers.push(player.id)
        isPlayersReady.push(player.data().isReady)
  })
        db.collection("rooms").doc(roomId).get().then(function(player){
            if(player.data().goBack){
                console.log("went inside if")
                for (var i = 1; i < 9; i++) {
                    console.log(inGamePlayers.length)
                    // console.log(document.getElementById("player-table").rows[i+1].cells[0].value)
                    document.getElementById("player-table").rows[i].cells[0].innerHTML = "-"
                    //document.getElementById("player-table").rows[i+1].cells[1].innerHTML = ""
                }
                db.collection("rooms").doc(roomId).set({
                    goBack: false
                }, {merge: true})   
            }
                    
        }).then(function(){
            for (var i = 0; i < inGamePlayers.length + 1; i++) {
            //console.log("hihasdfoauweohfwuefhoasdfuhoawfuehwoefuh")
            document.getElementById("player-table").rows[i+1].cells[0].innerHTML = inGamePlayers[i]
            // if(isPlayersReady[i] == true){
            //     document.getElementById("player-table").rows[i+1].cells[1].innerHTML = "Ready"
            // }
            // else{
            //     document.getElementById("player-table").rows[i+1].cells[1].innerHTML = "Not Ready"
            // }
        }
        })
    
})



// // button listener for ready
// document.getElementById("ready").addEventListener("click", function() {
//     var index = inGamePlayers.indexOf(displayName)
//     if(isPlayersReady[index] == false){
//         if(document.getElementById("identity").value != ""){
//             db.collection("rooms").doc(roomId).collection("players").doc(displayName).set({
//             isReady: true
//             }, {merge:true})
//             document.getElementById("ready").innerHTML = "Unready"
//         }
//         else{
//             alert("Please enter and identity.")
//         }
//     }
//     else{
//         db.collection("rooms").doc(roomId).collection("players").doc(displayName).set({
//         isReady: false
//         }, {merge:true})
//         document.getElementById("ready").innerHTML = "Ready"
//     }
// })


// button listener for start game
document.getElementById("startGame").addEventListener("click", function() {

    //window.location.href = "index.html"

    var numPlayersReady = 0
    for(i = 0; i < isPlayersReady.length; i++){
        if(isPlayersReady[i] == true)
            numPlayersReady++
    }
    if(numPlayersReady == inGamePlayers.length){
        db.collection("rooms").doc(roomId).set({
        numPlayersRemaining: inGamePlayers.length,
        hasBegun: true,
        }, {merge: true})
    }
    else{
        alert("Everyone is not ready.")
    }
})

//lets player go back to starting page
document.getElementById("back").addEventListener("click", function(){
    db.collection("rooms").doc(roomId).set({
        goBack: true,
    }, {merge: true})

    db.collection("rooms").doc(roomId).collection("players").doc(displayName).set({
        leaveRoom: true,
    }, {merge: true})


    db.collection("rooms").doc(roomId).collection("players").doc(displayName).delete().then(function(){
        window.location.href = "index.html"
        db.collection("rooms").doc(roomId).get().then(function(player){
            if(player.data().leaveRoom && player.data().isAdmin){
                console.log("the admin has left the game")
                console.log(inGamePlayers[1])
            }
        })
    })
})



// start game listener
var startGameListener = db.collection("rooms").doc(roomId).onSnapshot({
    includeMetadataChanges: false
}, function(room_document) {
        if (room_document.exists) {
            //const selection = document.getElementById("identity").value
            if (room_document.data().hasBegun) {
                db.collection("rooms").doc(roomId).collection("players").doc(displayName).set({
                    isEliminated: false,
                }, {merge: true})
                    //selection: selection
                .then(function() {
                    //window.localStorage.setItem("selection", selection)
                    window.location.href = 'gaming.html'
                    startGameListener()
                })
            }
            else {
                return false
            }
        }
        else {
            alert("Please enter a valid room name.")
        }
})