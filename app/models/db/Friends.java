package models.db;

import controllers.UserController;

import java.sql.*;
import java.util.LinkedList;
import java.util.List;

/**
 * models a friendship between two users
 * with its and the users id
 * Created by Lena on 20.03.2017.
 */
public class Friends {
    public int idFriends;
    public int user1;
    public int user2;

    public int getUser1() {
        return user1;
    }

    public int getUser2() {
        return user2;
    }

    /**
     * Creates a new friends instance with the given properties.
     */
    public Friends(int idFriends, int user1, int user2) {
        this.idFriends = idFriends;
        this.user1 = user1;
        this.user2 = user2;
    }

    /**
     * creates a new friendship, inserts it into the friends table and returns a corresponding (proxy) friends instance.
     */
    public static Friends create(int user1, int user2) throws SQLException {
        Connection con = UserController.db.getConnection();
        PreparedStatement statement = con.prepareStatement(
                "INSERT INTO Friends (`user1`, `user2`) VALUES (?,?);",
                Statement.RETURN_GENERATED_KEYS);

        statement.setInt(1, user1);
        statement.setInt(2, user2);

        statement.executeUpdate();

        ResultSet generatedKeys = statement.getGeneratedKeys();
        if (generatedKeys.next()) {
            Friends res = new Friends(generatedKeys.getInt(1), user1, user2);
            con.close();
            return res;
        } else {
            con.close();
            throw new SQLException("Creating friends failed, no ID obtained.");
        }
    }

    /**
     * returns all friends from the friends table that have the given id`s
     */
    public static List<Friends> allFriendsofLoggedInUser(String loggedInUser) throws SQLException {
        return fromDBWhere("user1='" + loggedInUser + "' OR user2='" + loggedInUser + "'");
    }

    /**
     * Returns all friends that meet a given condition.
     * @param where An SQL where condition for friends.
     * @return All database entries that meet the condition.
     * @throws SQLException
     */

    private static List<Friends> fromDBWhere(String where) throws SQLException {
        Connection con = UserController.db.getConnection();
        String query = "SELECT * FROM Friends";

        if (where == null) query += ";";
        else query += " WHERE " + where + ";";

        Statement stmt = con.createStatement();

        ResultSet rs = stmt.executeQuery(query);
        LinkedList<Friends> res = new LinkedList<Friends>();

        while (rs.next()) {
            res.add(new Friends(rs.getInt("idFriends"),rs.getInt("user1"),rs.getInt("user2")));
        }

        con.close();
        return res;
    }
}
