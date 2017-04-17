package models.db;


import controllers.UserController;

import java.sql.*;
import java.util.LinkedList;
import java.util.List;

/**
 * Models a User with all needed attributes to create a profile
 * containing information about scores etc.
 * Created by Benedict on 25.02.2017.
 */
public class User {
    /**
     * Auto incremented primary key of the User table
     */
    private int iduser;
    private String name;
    private String password;

    public String getName() {
        return name;
    }

    public int getIduser() {
        return iduser;
    }

    public int getHighscore() throws SQLException {

        int highscore = 0;
        List<PlayedGame> playedGames = PlayedGame.fromDBWhere("idUser=" + iduser);
        for (PlayedGame playedGame : playedGames) {
            if (playedGame.getScore() > highscore) {
                highscore = playedGame.getScore();
            }
        }

        return highscore;
    }

    public int getAverageScore() throws SQLException {

        int totalScore = 0;
        int numberOfGames = 0;
        List<PlayedGame> playedGames = PlayedGame.fromDBWhere("idUser=" + iduser);
        for (PlayedGame playedGame : playedGames) {
            totalScore += playedGame.getScore();
            numberOfGames++;
        }
        if (!(playedGames.isEmpty())) {
            return (totalScore / numberOfGames);
        }
        return 0;
    }

    /**
     * Creates a new user, inserts it into the User table, and returns a corresponding (proxy) User instance.
     */
    public static User create(String name, String password) throws SQLException {
        Connection con = UserController.db.getConnection();
        PreparedStatement statement = con.prepareStatement(
                "INSERT INTO User (`name`, `password`) VALUES (?,?);",
                Statement.RETURN_GENERATED_KEYS);

        statement.setString(1, name);
        statement.setString(2, password);

        statement.executeUpdate();

        ResultSet generatedKeys = statement.getGeneratedKeys();
        if (generatedKeys.next()) {
            User res = new User(generatedKeys.getInt(1), name, password);
            con.close();
            return res;
        } else {
            con.close();
            throw new SQLException("Creating User failed, no ID obtained.");
        }
    }

    /**
     * Creates a new User instance with the given properties.
     */
    private User(int iduser, String name, String password) {
        this.iduser = iduser;
        this.name = name;
        this.password = password;
    }

    /**
     * Returns all users from the Users table.
     */
    public static List<User> fromDB() throws SQLException {
        return fromDBWhere(null);
    }

    /**
     * Updates the row corresponding to this.iduser with the properties of this user instance.
     */
    public void update() throws SQLException {
        Connection con = UserController.db.getConnection();
        PreparedStatement statement = con.prepareStatement(
                "UPDATE User SET `name`=?, `password`=? WHERE idUser=" + iduser + ";");

        statement.setString(2, name);
        statement.setString(3, password);

        statement.executeUpdate();
        con.close();
    }

    /**
     * Deletes the row corresponding to this.iduser.
     */
    public void delete() throws SQLException {
        Connection con = UserController.db.getConnection();
        PreparedStatement statement = con.prepareStatement(
                "DELETE FROM User WHERE idUser=" + iduser + ";");
        statement.executeUpdate();
        con.close();
    }

    /**
     * Queries the User with idUser from the database and create a corresponding (proxy) User instance.
     */
    public static User fromDBWithID(int iduser) throws SQLException {
        return fromDBWhere("idUser=" + iduser).get(0);
    }

    /**
     * Returns all users from the Users table, that have the given name.
     */
    public static List<User> fromDBWithName(String name) throws SQLException {

        return fromDBWhere("name='" + name + "'");
    }

    /**
     * Returns all users from the Users table, that have the given name.
     */
    public static List<User> fromDBWithCredentials(String name, String password) throws SQLException {
        return fromDBWhere("name='" + name + "' AND password='" + password + "'");
    }


    /**
     * Returns all users that meet a given condition.
     *
     * @param where An SQL where condition for User.
     * @return All database entries that meet the condition.
     * @throws SQLException
     */
    private static List<User> fromDBWhere(String where) throws SQLException {
        Connection con = UserController.db.getConnection();
        String query = "SELECT * FROM User";

        if (where == null) query += ";";
        else query += " WHERE " + where + ";";

        Statement stmt = con.createStatement();

        ResultSet rs = stmt.executeQuery(query);
        LinkedList<User> res = new LinkedList<User>();

        while (rs.next()) {
            res.add(new User(rs.getInt("idUser"), rs.getString("name"), rs.getString("password")));
        }

        con.close();
        return res;
    }

    //|---------------------Achievements-------------------------------|

    public int getHighscorefromDBWithuserID() throws SQLException {

        return fromDBWithID(iduser).getHighscore();
    }

    public int getAverageScorefromDBWithuserID() throws SQLException {

        return fromDBWithID(iduser).getAverageScore();
    }
}
