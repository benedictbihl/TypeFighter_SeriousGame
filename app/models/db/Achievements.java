package models.db;

import controllers.UserController;

import java.sql.*;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by Lydia Bartels on 01.03.2017.
 */
public class Achievements {

    /**
     * Auto incremented primary key of the Achievements table
     */
    private String name;
    private int idAchievement;

    public String getName() {
        return name;
    }

    public int getIdAchievement() {
        return idAchievement;
    }

    /**
     * Creates a new Achievements instance with the given properties.
     */
    private Achievements(int idAchievement, String name) {
        this.name = name;
        this.idAchievement = idAchievement;
    }

    /**
     * Returns all achievements from the Achievements table.
     */
    public static List<Achievements> fromDB() throws SQLException {
        return fromDBWhere(null);
    }

    /**
     * Returns all achievements that meet a given condition.
     *
     * @param where An SQL where condition for Achievement.
     * @return All database entries that meet the condition.
     * @throws SQLException
     */
    public static List<Achievements> fromDBWhere(String where) throws SQLException {
        Connection con = UserController.db.getConnection();
        String query = "SELECT * FROM Achievements";

        if (where == null) query += ";";
        else query += " WHERE " + where + ";";

        Statement stmt = con.createStatement();

        ResultSet rs = stmt.executeQuery(query);
        LinkedList<Achievements> res = new LinkedList<>();

        while (rs.next()) {
            res.add(new Achievements( rs.getInt("idAchievements"), rs.getString("name")));
        }

        con.close();
        return res;
    }
}


