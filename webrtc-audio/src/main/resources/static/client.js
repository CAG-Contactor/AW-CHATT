//connecting to our signaling server 
var conn = new WebSocket('ws://localhost:8080/socket');

conn.onopen = function() {
    console.log("Connected to the signaling server");
    initialize();
};

conn.onmessage = function(msg) {
    console.log("Got message", msg.data);
    var content = JSON.parse(msg.data);
    var data = content.data;
    switch (content.event) {
    // when somebody wants to call us
    case "offer":
        handleOffer(data);
        break;
    case "answer":
        handleAnswer(data);
        break;
    // when a remote peer sends an ice candidate to us
    case "candidate":
        handleCandidate(data);
        break;
    default:
        break;
    }
};

function send(message) {
    conn.send(JSON.stringify(message));
}

var peerConnection;
var dataChannel;
var input = document.getElementById("messageInput");
var audioElement = document.getElementById("audioElement");
var remoteAudioElement = document.getElementById("remoteAudioElement");
var localStream;

const openMediaDevices = async (constraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
}

function initialize() {
    var configuration = null;

    peerConnection = new RTCPeerConnection(configuration);

    // Setup ice handling
    peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
            send({
                event : "candidate",
                data : event.candidate
            });
        }
    };

    console.log("ICE handling has been created");

    peerConnection.ondatachannel = function(event) {
        var receiveChannel = event.channel;
        receiveChannel.onmessage = function(event) {
            console.log("peerConnection message:", event.data);
        };
    };

    // creating data channel
    dataChannel = peerConnection.createDataChannel("dataChannel", {
        reliable : true
    });

    console.log("dataChannel has been created");

    dataChannel.onerror = function(error) {
        console.log("Error occured on datachannel:", error);
    };

    // when we receive a message from the other peer, printing it on the console
    dataChannel.onmessage = function(event) {
        console.log("message:", event.data);
    };

    dataChannel.onclose = function() {
        console.log("data channel is closed");
    };

    // Create the local stream
    try {
        localStream = openMediaDevices({'audio':true});
        console.log('Got MediaStream:', localStream);

    } catch(error) {
        console.error('Error accessing media devices.', error);
    }

}

function createOffer() {
    peerConnection.createOffer(function(offer) {
        send({
            event : "offer",
            data : offer
        });
        peerConnection.setLocalDescription(offer);
    }, function(error) {
        alert("Error creating an offer");
    });
}

function handleOffer(offer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // create and send an answer to an offer
    peerConnection.createAnswer(function(answer) {
        peerConnection.setLocalDescription(answer);
        send({
            event : "answer",
            data : answer
        });
    }, function(error) {
        alert("Error creating an answer");
    });

};

function handleCandidate(candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

function handleAnswer(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("connection established successfully!!");
    console.log("HEHU. Answer = " + answer);

};

function sendMessage() {

    try {
        console.log('Got MediaStream 10:', localStream);

        const remoteStream = new MediaStream();
        remoteAudioElement.srcObject = remoteStream;

        peerConnection.addEventListener('track', async (event) => {
            remoteStream.addTrack(event.track, remoteStream);
        });

        console.log('Got MediaStream 20:', localStream);

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        /* This gives no warning - but does not work either
        const openStream = async (constraints) => {
            await localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
        }
        */

        console.log('Got MediaStream 30');

    } catch(error) {
        console.error('Error accessing media devices.', error);
    }

    ///  OLD STUFF
    console.log("Sending real message " + input.value);
    dataChannel.send(input.value);
    input.value = "";
}

