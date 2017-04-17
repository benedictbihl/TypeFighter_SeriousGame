package services;

import controllers.UserController;
import play.data.validation.Constraints;

import java.sql.*;


/**
 * Created by Lydia Bartels on 01.03.2017.
 */
public class ProfilForm {

    @Constraints.Required
    protected int userID;

    private int highscore;
    private int averageScore;

    public ProfilForm() {

    }

    public ProfilForm(int userID) {
        this.userID = userID;
    }

    public int getUserID() {

        return userID;
    }

    public int getHighscorefromDBWithuserID() throws SQLException {

        Connection con = UserController.db.getConnection();
        String query = "SELECT * FROM USER WHERE idUser=" + userID + ";";

        Statement stmt = con.createStatement();

        ResultSet rs = stmt.executeQuery(query);
        String result = "-";
        if (rs.next()) {
            result = rs.getString("highscore");
        }

        con.close();

        return highscore;

    }

    public int getAverageScorefromDBWithuserID() throws SQLException {

        Connection con = UserController.db.getConnection();
        String query = "SELECT * FROM USER WHERE idUser=" + userID + ";";

        Statement stmt = con.createStatement();

        ResultSet rs = stmt.executeQuery(query);
        String result = "-";
        if (rs.next()) {
            result = rs.getString("averageScore");
        }

        con.close();

        return averageScore;
    }

    /*
    public String getAchievementfromDBWithuserID() throws SQLException {

        Connection con = UserController.db.getConnection();


    }
    */
}