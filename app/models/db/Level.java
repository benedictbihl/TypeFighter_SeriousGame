package models.db;

import controllers.UserController;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.List;

/** Models a level with its name, ID and text.
 * Created by Benedict on 08.03.2017.
 */
public class Level {

    private int idLevel;
    private String levelText;
    private String levelName;

    public int getIdLevel() {
        return idLevel;
    }

    /**
     * Creates a new Level instance with the given properties.
     */
    public Level(int idLevel, String levelText, String levelName) {
        this.idLevel = idLevel;
        this.levelText = levelText;
        this.levelName = levelName;
    }

    /**
     * Returns all levels from the Level table.
     */
    public static List<Level> fromDB() throws SQLException {
        return fromDBWhere(null);
    }

    /**
     * Returns all levels that meet a given condition.
     *
     * @param where An SQL where condition for Level.
     * @return All database entries that meet the condition.
     * @throws SQLException
     */

    private static List<Level> fromDBWhere(String where) throws SQLException {
        Connection con = UserController.db.getConnection();
        String query = "SELECT * FROM Level";

        if (where == null) query += ";";
        else query += " WHERE " + where + ";";

        Statement stmt = con.createStatement();

        ResultSet rs = stmt.executeQuery(query);
        LinkedList<Level> res = new LinkedList<Level>();

        while (rs.next()) {
            res.add(new Level(rs.getInt("idLevel"), rs.getString("levelText"), rs.getString("levelName")));
        }

        con.close();
        return res;
    }
}
