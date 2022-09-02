$(document).ready(function(){
    $('.header').height($(window).height());
  })

var db = firebase.firestore();



//know who is creating and who is joining
document.getElementById("submitButton").addEventListener("click", function() {
    const rbs = document.querySelectorAll('input[class="create"]');
    let isCreating = true;
            for (const rb of rbs) {
                if (rb.checked) {
                    isCreating = true;
                    break;
                }
                else{
                    isCreating = false;
                }
            }

    if(document.getElementById("room-code").value != "" && document.getElementById("name").value !=  ""){
        const roomId = document.getElementById("room-code").value
        const displayName = document.getElementById("name").value
        window.localStorage.setItem("roomId", roomId)
        window.localStorage.setItem("displayName", displayName)

        if(isCreating){
        window.localStorage.setItem("isAdmin", true)
        createRoom(roomId, displayName)

        }

        else{
            window.localStorage.setItem("isAdmin", false)
            joinRoom(roomId, displayName)

        }
    }

    else{
        alert("Please enter a display name and room code")
    }
    
    
    

});

function createRoom(roomId, displayName) {

    var isStop = false;

    db.collection("rooms").get()
    .then(function(rooms) {
         rooms.forEach(function(room) {
            if(roomId == room.id){
                alert("This room code has already been chosen")
                isStop = true;
                }


})
         if(isStop){
            return false;
         }

        db.collection("rooms").doc(roomId).set({
            hasBegun: false,
            goBack: false
            }).then(function() {
                db.collection("rooms").doc(roomId).collection("players").doc(displayName).set({
                selection: "TBD",
                isEliminated: false,
                isAdmin: true,
                isReady: false,
                leaveRoom: false,
                aliases: "TBD"
                })
                }).then(function() {
                        window.location.href = 'identity.html'
                })
     })
    
}

function joinRoom(roomId, displayName) {
    isStop = true;
    db.collection("rooms").get()
    .then(function(rooms) {
         rooms.forEach(function(room) {
            if(roomId == room.id){
                isStop = false;
                db.collection("rooms").doc(roomId).set({
                    hasBegun: false,
                    goBack: false
                }).then(function() {
                    db.collection("rooms").doc(roomId).collection("players").doc(displayName).set({
                    selection: "TBD",
                    isEliminated: false,
                    isAdmin: false,
                    isReady: false,
                    leaveRoom: false,
                    aliases: "TBD"
                    })
                }).then(function() {
                      
                    
                window.location.href = 'identity.html'
                    
                })
    
            }

        })

         if(isStop){
            alert("hehehehehe")
         }
     })
         

    
    }



    
