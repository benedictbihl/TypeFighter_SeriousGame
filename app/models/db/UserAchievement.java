package models.db;

import controllers.UserController;

import java.sql.*;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by Lydia Bartels on 27.03.2017.
 */
public class UserAchievement {

    private int idUserAchievement;
    private int idUser;
    private int idAchievement;

    public int getIdUserAchievement(){return idUserAchievement;}
    public int getIdUser(){return idUser;}
    public int getIdAchievement(){return idAchievement;}


    /**
     * Creates a new UserAchievement, inserts it into the UserAchievement table, and returns a corresponding (proxy) UserAchievement instance.
     *
     * @param idUser
     * @param idAchievement
     * @return
     * @throws SQLException
     */
    public static UserAchievement create(int idUser, int idAchievement) throws SQLException {

        Connection con = UserController.db.getConnection();
        PreparedStatement statement = con.prepareStatement(
                "INSERT INTO UserAchievement (`idUser`, `idAchievement`) VALUES (?,?);",
                Statement.RETURN_GENERATED_KEYS);

        statement.setInt(1, idUser);
        statement.setInt(2, idAchievement);

        statement.executeUpdate();

        ResultSet generatedKeys = statement.getGeneratedKeys();
        if (generatedKeys.next()) {
            UserAchievement res = new UserAchievement(generatedKeys.getInt(1), idUser, idAchievement);

            con.close();
            return res;
        } else {
            con.close();
            throw new SQLException("Updating UserAchievement failed, no ID obtained.");
        }

    }

    /**
     * Creates a new UserAchievement instance with the given properties.
     */
    private UserAchievement(int idUserAchievement, int idUser, int idAchievement){
        this.idUserAchievement = idUserAchievement;
        this.idUser = idUser;
        this.idAchievement = idAchievement;
    }

    public static List<String> lockedAchievements(int idUser) throws SQLException{

        List<String> booleanAchievements = new ArrayList<>();
        List<UserAchievement> achievements;
        for (int i = 1; i < 9; i++) {
            achievements = UserAchievement.fromDBWhere("idUser='" + idUser + "' AND idAchievement='" + i + "'");
            if (!(achievements.isEmpty())) {
                booleanAchievements.add("true");
            } else {
                booleanAchievements.add("false");
            }
            achievements.clear();
        }
        return booleanAchievements;
    }

    /**
     * Returns all UserAchievements from the UserAchievement table.
     */
    public static List<UserAchievement> fromDB() throws SQLException {
        return UserAchievement.fromDBWhere(null);
    }

    /**
     * Returns all UserAchievements that meet a given condition.
     *
     * @param where An SQL where condition for UserAchievement.
     * @return All database entries that meet the condition.
     * @throws SQLException
     */
    public static List<UserAchievement> fromDBWhere(String where) throws SQLException {
        Connection con = UserController.db.getConnection();
        String query = "SELECT * FROM UserAchievement";

        if (where == null) query += ";";
        else query += " WHERE " + where + ";";

        Statement stmt = con.createStatement();

        ResultSet rs = stmt.executeQuery(query);
        LinkedList<UserAchievement> res = new LinkedList<>();

        while (rs.next()) {
            res.add(new UserAchievement( rs.getInt("idUserAchievement"), rs.getInt("idUser"), rs.getInt("idAchievement")));
        }

        con.close();
        return res;
    }
}
