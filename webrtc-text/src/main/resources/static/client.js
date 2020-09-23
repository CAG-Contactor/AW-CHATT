//connecting to our signaling server 
var conn = new WebSocket('ws://localhost:8080/socket');

conn.onopen = function() {
    console.log("Connected to the signaling server");
    // HEHU Initialize later by a button press
    // initialize();
};

conn.onmessage = function(msg) {
    console.log("Got message", msg.data);
    var content = JSON.parse(msg.data);
    var data = content.data;
    var fromName = content.fromName;
    var toName = content.toName;
    console.log("DATA", data);
    console.log("fromName", fromName);
    console.log("toName", toName);
    console.log("nameInput.value", nameInput.value);

    switch (content.event) {
    // when somebody wants to call us
    case "offer":
        handleOffer(data, fromName, nameInput.value);
        break;
    case "answer":
        handleAnswer(data, fromName, toName);
        break;
    // when a remote peer sends an ice candidate to us
    case "candidate":
        handleCandidate(data, fromName, nameInput.value);
        break;
    default:
        break;
    }
};

function send(message) {
    conn.send(JSON.stringify(message));
}

var peerConnection = new Array();
var dataChannel = new Array();
var input = document.getElementById("messageInput");
// HEHU New input to be able to tell the clients from each other
var nameInput = document.getElementById("clientNameInput");
var peerInput = document.getElementById("peerNamesInput");
var peerArray = peerInput.value.split(',');

function initialize() {
    var configuration = null;

    console.log(" ==== nameInput: " + nameInput.value);

    console.log(" ==== peerArray: " + peerArray);
    console.log(" ==== peerArray.length: " + peerArray.length);
    console.log(" ==== peerArray[0]: " + peerArray[0]);

    // Send a Ping to register to WebSocket handler
    send({
        event : "ping",
        fromName: nameInput.value
    });

    for (index = 0; index < peerArray.length; index++) {
        let myIndex=index;

        peerConnection[index] = new RTCPeerConnection(configuration, {
            optional : [ {
                RtpDataChannels : true
            } ]
        });

        // Setup ice handling
        peerConnection[index].onicecandidate = function(event) {
            if (event.candidate) {
                send({
                    event : "candidate",
                    data : event.candidate,
                    fromName: nameInput.value,
                    toName: peerArray[myIndex]
                });
            }
        };

        // BEGIN: Added to the Baeldung example to make it work
        // https://github.com/eugenp/tutorials/tree/master/webrtc
        peerConnection[index].ondatachannel = function(event) {
            var receiveChannel = event.channel;
            receiveChannel.onmessage = function(event) {
                console.log("peerConnection message:", event.data);
            };
        };
        // END: Added to the Baeldung example to make it work

        // creating data channel
        dataChannel[index] = peerConnection[index].createDataChannel("dataChannel", {
            reliable : true
        });

        dataChannel[index].onerror = function(error) {
            console.log("Error occured on datachannel:", error);
        };

        // BEGIN: This can be removed as is has been replaced by the code above
        // when we receive a message from the other peer, printing it on the console
        // dataChannel.onmessage = function(event) {
        //     console.log("message:", event.data);
        // };
        // END: This can be removed as is has been replaced by the code above

        dataChannel[index].onclose = function() {
            console.log("data channel is closed");
        };
    }
}

function createOffer() {
    for (index = 0; index < peerArray.length; index++) {
        var status = peerConnection[index].iceConnectionState;
        console.log("peerConnection[" + index + "] status: " + status);

        if (status === "new") {
            // We need to declare these before being used in the
            // function below.
            let myToName = peerArray[index];
            let myIndex = index;
            peerConnection[index].createOffer(function(offer) {
                send({
                    event : "offer",
                    data : offer,
                    fromName: nameInput.value,
                    toName: myToName
                });
                peerConnection[myIndex].setLocalDescription(offer);
            }, function(error) {
                alert("Error creating an offer");
            });
        }
    }
}

function handleOffer(offer, fromName, toName) {
    console.log("offer fromName: " + fromName);
    console.log("offer toName: " + toName);

    // Only answer offer if it's to you
    if (toName === nameInput.value) {

        peerIndex = peerArray.indexOf(fromName);
        peerConnection[peerIndex].setRemoteDescription(new RTCSessionDescription(offer));
        let myIndex = peerIndex;

        // create and send an answer to an offer
        peerConnection[peerIndex].createAnswer(function (answer) {
            peerConnection[peerIndex].setLocalDescription(answer);
            send({
                event: "answer",
                data: answer,
                fromName: nameInput.value,
                toName: peerArray[myIndex]
            });
        }, function (error) {
            alert("Error creating an answer");
        });
    }
};


function handleCandidate(candidate, fromName, toName) {
    console.log("candidate fromName: " + fromName);
    console.log("candidate toName: " + toName);

    // FIXME problem
    // Only answer candidate message if it's to you
    if (toName === nameInput.value) {
        peerIndex = peerArray.indexOf(fromName);
        peerConnection[peerIndex].addIceCandidate(new RTCIceCandidate(candidate));
    }
};

function handleAnswer(answer, fromName, toName) {
    console.log("answer fromName: " + fromName);
    console.log("answer toName: " + toName);

    peerIndex = peerArray.indexOf(fromName);
    peerConnection[peerIndex].setRemoteDescription(new RTCSessionDescription(answer));
    console.log("connection established successfully!!");

};

function sendMessage() {
    console.log("dataChannel list.length:", dataChannel.length);
    console.log("dataChannel list:", dataChannel);

    for (index = 0; index < dataChannel.length; index++) {
        dataChannel[index].send(input.value);
    }
    input.value = "";
}
