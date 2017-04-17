package models.db;

import controllers.UserController;

import java.sql.*;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * Models a play game containing info about who played which level
 * and how they performed.
 * Created by Benedict on 10.03.2017.
 */
public class PlayedGame {

    private int idPlayedGames;
    private int errors;
    private int score;
    private int idLevel;
    private int idUser;
    private String username;

    public int getErrors() {
        return errors;
    }

    public int getScore() {
        return score;
    }


    /**
     * Creates a new PlayedGame instance with the given properties.
     */
    public PlayedGame(int idPlayedGames, int errors, int score, int idLevel, int idUser) throws SQLException{
        this.idPlayedGames = idPlayedGames;
        this.errors = errors;
        this.score = score;
        this.idLevel = idLevel;
        this.idUser = idUser;
        this.username = User.fromDBWithID(idUser).getName();
    }

    /**
     * Creates a new played game , inserts it into the PlayedGames table, and returns a corresponding (proxy) PlayedGame instance.
     */
    public static PlayedGame create(int errors, int score, int idLevel, int idUser) throws SQLException {
        Connection con = UserController.db.getConnection();
        PreparedStatement statement = con.prepareStatement(
                "INSERT INTO PlayedGames (`errors`,`score`,`idLevel`,`idUser`) VALUES (?,?,?,?);",
                Statement.RETURN_GENERATED_KEYS);


        statement.setInt(1, errors);
        statement.setInt(2, score);
        statement.setInt(3, idLevel);
        statement.setInt(4, idUser);


        statement.executeUpdate();

        ResultSet generatedKeys = statement.getGeneratedKeys();

        if (generatedKeys.next()) {
            PlayedGame res = new PlayedGame(generatedKeys.getInt(1),errors, score, idLevel, idUser);
            con.close();
            return res;
        } else {
            con.close();
            throw new SQLException("Creating User failed, no ID obtained.");
        }
    }

    /**
     * Returns all users from the PlayedGames table, that have the given idLevel.
     */
    public static List<PlayedGame> fromDBWithidLevel(String idLevel) throws SQLException {
        return fromDBWhere("idLevel='" + idLevel + "'");
    }

    /**
     * Returns a list with the 3 PlayedGame Object with the highest score for each level in db.
     */
    public static List<PlayedGame> top3ForEachLevel() throws SQLException {
        List<Level> levels = Level.fromDB();
        List<PlayedGame> top3s = new ArrayList<PlayedGame>();
        for (Level l: levels) {
            int idLevel= l.getIdLevel();
            top3s.addAll(fromDBWhere("idLevel='" + idLevel + "' ORDER BY score DESC LIMIT 3"));
        }
        return top3s;
    }

    public static List<PlayedGame> fromDBWithId (int idUser) throws SQLException {
        return fromDBWhere("idUser=" + idUser);
    }

    /**
     * Returns all played games that meet a given condition.
     *
     * @param where An SQL where condition for PlayedGames.
     * @return All database entries that meet the condition.
     * @throws SQLException
     */
    public static List<PlayedGame> fromDBWhere(String where) throws SQLException {
        Connection con = UserController.db.getConnection();
        String query = "SELECT * FROM PlayedGames";

        if (where == null) query += ";";
        else query += " WHERE " + where + ";";

        Statement stmt = con.createStatement();

        ResultSet rs = stmt.executeQuery(query);
        LinkedList<PlayedGame> res = new LinkedList<PlayedGame>();

        while (rs.next()) {
            res.add(new PlayedGame(rs.getInt("idPlayedGames"), rs.getInt("errors"), rs.getInt("score"), rs.getInt("idLevel"), rs.getInt("idUser")));
        }

        con.close();
        return res;
    }
}


