$(document).ready(function(){
    $('.header').height($(window).height());
  })


var db = firebase.firestore();
const displayName = window.localStorage.getItem("displayName")
const roomId = window.localStorage.getItem("roomId")


const isAdmin = window.localStorage.getItem("isAdmin")

//var inGamePlayers = []
//var isPlayersReady = []
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

const getTitle = async page => {
  const title = await page.evaluate(() => {
    const h1 = document.querySelector("h1").innerHTML;
    if (h1 != null && h1.length > 0) {
      return h1;
    }
    return null;
  });
  return title;
};

const getDescription = async page => {
  const description = await page.evaluate(() => {
    
    paragraphs = document.querySelectorAll("p");
    let fstVisibleParagraph = null;
    for (let i = 0; i < paragraphs.length; i++) {
      if (
        // if object is visible in dom
        paragraphs[i].offsetParent !== null &&
        !paragraphs[i].childElementCount != 0
      ) {
        fstVisibleParagraph = paragraphs[i].textContent;
        break;
      }
    }
    return fstVisibleParagraph;
  });
  return description;
};

const getDomainName = async (page, uri) => {
  const domainName = await page.evaluate(() => {
    // const canonicalLink = document.querySelector("link[rel=canonical]");
    // if (canonicalLink != null && canonicalLink.href.length > 0) {
    //   return canonicalLink.href;
    // }
    // const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    // if (ogUrlMeta != null && ogUrlMeta.content.length > 0) {
    //   return ogUrlMeta.content;
    // }
  });
  return domainName != null
    ? new URL(domainName).hostname.replace("www.", "")
    : new URL(uri).hostname.replace("www.", "");
};



//add a thing for actually getting the identity
// button listener for ready
//console.log("goes before on click")
document.getElementById("submit").addEventListener("click", function() {
    //console.log("is in on click")
    var names = document.getElementById("alias").value;
    const aliasArr = names.split(',');
    console.log(aliasArr);

    const selection = document.getElementById("identity").value


    db.collection("rooms").doc(roomId).collection("players").doc(displayName).set({
        isEliminated: false,
        isReady: true,
        selection: selection,
        aliases: aliasArr
        }, {merge: true}).then(function(){
            window.localStorage.setItem("selection", selection)
            window.location.href = "waiting.html"
    })
})


// // button listener for start game
// document.getElementById("start").addEventListener("click", function() {
//     var numPlayersReady = 0
//     for(i = 0; i < isPlayersReady.length; i++){
//         if(isPlayersReady[i] == true)
//             numPlayersReady++
//     }
//     if(numPlayersReady == inGamePlayers.length){
//         db.collection("rooms").doc(roomId).set({
//         numPlayersRemaining: inGamePlayers.length,
//         hasBegun: true,
//         }, {merge: true})
//     }
//     else{
//         alert("Everyone is not ready.")
//     }
// })

//lets player go back to starting page
// document.getElementById("back").addEventListener("click", function(){
//     db.collection("rooms").doc(roomId).set({
//         goBack: true,
//     }, {merge: true})

//     db.collection("rooms").doc(roomId).collection("players").doc(displayName).delete().then(function(){
        
//         window.location.href = "index.html"
//         })
// })



// //start game listener
// var startGameListener = db.collection("rooms").doc(roomId).onSnapshot({
//     includeMetadataChanges: false
// }, function(room_document) {

//             const selection = document.getElementById("identity").value
//             //if (room_document.data().hasBegun) {
//             db.collection("rooms").doc(roomId).collection("players").doc(displayName).set({
//                 selection: selection
//             }).then(function() {
//                 window.localStorage.setItem("selection", selection)
//                 //window.location.href = 'waiting.html'
//                 startGameListener()
//             })
            
//             //}
//             // else {
//             //     return false
//             // }
        
// })