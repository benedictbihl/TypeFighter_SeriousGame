package models.db;

import controllers.UserController;

import java.sql.*;
import java.util.LinkedList;
import java.util.List;

/**
 * models a message containing informations about the text, the sender and the receiver
 * Created by Lena on 22.03.2017.
 */
public class Message {
    public int idMessages;
    public String text;
    public int receiver;
    public int sender;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    /**
     *creates a new message instance with the given properties.
     */
    public Message(int idMessages, String text, int receiver, int sender) {
        this.idMessages = idMessages;
        this.text = text;
        this.receiver = receiver;
        this.sender = sender;
    }

    /**
     *Creates a new message, inserts it into the Message table, and returns a corresponding (proxy) Message instance.
     */
    public static Message create(String text, int receiver, int sender) throws SQLException {
        Connection con = UserController.db.getConnection();
        PreparedStatement statement = con.prepareStatement(
                "INSERT INTO Messages (`text`, `sender`, `receiver`) VALUES (?,?,?);",
                Statement.RETURN_GENERATED_KEYS);

        statement.setString(1, text);
        statement.setInt(2, sender);
        statement.setInt(3, receiver);

        statement.executeUpdate();

        ResultSet generatedKeys = statement.getGeneratedKeys();
        if (generatedKeys.next()) {
            Message res = new Message(generatedKeys.getInt(1), text, sender, receiver);
            con.close();
            return res;
        } else {
            con.close();
            throw new SQLException("Creating Message failed, no ID obtained.");
        }
    }

    /**
     * Returns all messages that meet a given condition.
     *
     * @param where An SQL where condition for Message.
     * @return All database entries that meet the condition.
     * @throws SQLException
     */
    private static List<Message> fromDBWhere(String where) throws SQLException {
        Connection con = UserController.db.getConnection();
        String query = "SELECT * FROM Messages";

        if (where == null) query += ";";
        else query += " WHERE " + where + ";";

        Statement stmt = con.createStatement();

        ResultSet rs = stmt.executeQuery(query);
        LinkedList<Message> res = new LinkedList<Message>();

        while (rs.next()) {
            res.add(new Message(rs.getInt("idMessages"), rs.getString("text"), rs.getInt("sender"), rs.getInt("receiver")));
        }

        con.close();
        return res;
    }

    /**
     *Returns all messages from the Message table.
     */
    public static List<Message> MessageHistory(String sender, String receiver ) throws SQLException {
        return fromDBWhere("sender='" + sender + "' and receiver='" + receiver + "' OR sender='" + receiver + "' and receiver='" + sender +"' ORDER BY timestamp");
    }



}
