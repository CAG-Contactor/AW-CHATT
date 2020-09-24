package com.baeldung.webrtc;


import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;


@Component
public class SocketHandler extends TextWebSocketHandler {

    List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    HashMap<String, String> sessionIdHashMap = new HashMap<String, String>();

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws InterruptedException, IOException {

        String event = "";
        String fromName = "";
        String toName = "";

        try {
            JSONParser parser = new JSONParser();
            JSONObject jsonObject = (JSONObject) parser.parse(message.getPayload());
            event = (String) jsonObject.get("event");
            fromName = (String) jsonObject.get("fromName");
            toName = (String) jsonObject.get("toName");
        }
        catch (Exception e) {
            System.out.println("Reading failed: " + e);
        }
        System.out.println("event: [" + event + "]");
        System.out.println("fromName: " + fromName);
        System.out.println("toName: " + toName);

        if ("ping".equals(event)) {
            sessionIdHashMap.put(fromName, session.getId());
            return;
        }

        for (WebSocketSession webSocketSession : sessions) {

            System.out.println("webSocketSession: " + webSocketSession);
            System.out.println("sessionIdHashMap.get(toName): " + sessionIdHashMap.get(toName));

            if (webSocketSession.isOpen() && webSocketSession.getId().equals(sessionIdHashMap.get(toName))) {
                webSocketSession.sendMessage(message);
                System.out.println("SEND MESSAGE: " + message.getPayload());
                System.out.println("session.getId(): " + session.getId());
            }
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("sessions.size(): " + sessions.size());
        System.out.println("session.getId(): " + session.getId());
    }

}