## WebRTC

This module contains an example on a WebRTC connection 
between two browsers sending/receiving text. 

It is based on an article by Baeldung (see below) and code 
from referred GIT repo. The idea with this is just for 
educational purposes.

Changes from the original by Baeldung are:

**index.html**: Added new fields for name and peer names 
(comma separated). Added new button for "Initialize" 

**client.js**: updated logic to be able to have sessions to 
more than on other clients.

**SocketHandler.java**: added logic to be able to associate 
each clients with a name, and then also route messages.

Compile with:
`mvn clean install`

Run with:
`mvn spring-boot:run`

In the original version, you should open two browsers as 
described in the article and you could then send 
text messages between them.

In this version more browsers can be created. The first 
define its name in the first row and all (known) peers' 
names in the second row. 

The rest of the browsers define each peer name and the name 
of the first as peer on the second row. NOTE currently one
peer can be defined for the rest.

All browser must be initialized with the 
"Initialize" button, and then "Create Offer" should be 
pressed on the first browser.


### Relevant Articles:

- [Guide to WebRTC](https://www.baeldung.com/webrtc)

