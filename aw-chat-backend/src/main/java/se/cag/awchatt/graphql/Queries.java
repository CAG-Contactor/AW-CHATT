package se.cag.awchatt.graphql;

public class Queries {
    public static final String POSITION_QUERY = "" +
            "    subscription PositionSubscription {\n" +
            "        allUsers {\n" +
            "           name\n" +
            "           color\n" +
            "           position {\n" +
            "               xPos\n" +
            "               yPos\n" +
            "           }\n" +
            "       }\n" +
            "    }\n";
}
