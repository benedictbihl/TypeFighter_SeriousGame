package controllers;

import models.db.*;
import play.libs.Json;
import play.mvc.*;
import com.google.gson.Gson;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static play.mvc.Controller.session;
import static play.mvc.Results.ok;

/**
 * Created by Lydia Bartels on 22.03.2017.
 */
public class AchievementController {

    /**
     * Checks which Achievements are unlocked already for the currentlyLogged User
     *
     * @return a json (String) with the given combination of true(unlocked) and false(locked) statements
     * @throws SQLException
     */
    public Result isAchievementUnlocked() throws SQLException {

        List<String> booleanAchievements = new ArrayList<>();
        String idUser = session("currentlyLoggedIn");
        int userID = Integer.parseInt(idUser);

        //Checks for each Achievement for the given user. Returns list with true/false values
        booleanAchievements = UserAchievement.lockedAchievements(userID);

        Gson gson = new Gson();
        String json = gson.toJson(booleanAchievements);

        return ok(json);
    }

    /**
     * Checks, if a new Achievement is unlocked; In that case a new UserAchievement for the given User/Achievement is created
     *
     * @param idUser (currentlyLogged user)
     * @return
     * @throws SQLException
     */
    public static Result isNewAchievementUnlocked(int idUser) throws SQLException {

        List<String> booleanAchievements = new ArrayList<>();

        //Checks for each Achievement for the given user. Returns list with true/false values
        booleanAchievements = UserAchievement.lockedAchievements(idUser);


        int totalScore = 0;
        boolean zeroErrors = false;
        List<PlayedGame> playedGames = PlayedGame.fromDBWithId(idUser);
        for (PlayedGame playedGame : playedGames) {
            totalScore += playedGame.getScore();
            if (playedGame.getErrors() == 0) {
                zeroErrors = true;
            }
        }

        /**
         * First Achievement: Total Score > 1000
         */
        if (booleanAchievements.get(0) == "false") {
            if (totalScore > 1000) {
                UserAchievement.create(idUser,1);
            }
        }
        /**
         * Second Achievement: Total Score > 5000
         */
        if (booleanAchievements.get(1) == "false") {
            if (totalScore > 5000) {
                UserAchievement.create(idUser,2);
            }
        }
        /**
         * Third Achievement: Total Score > 10000
         */
        if (booleanAchievements.get(2) == "false") {
            if (totalScore > 10000) {
                UserAchievement.create(idUser,3);
            }
        }
        /**
         * Fourth Achievement: Total Score > 50000
         */
        if (booleanAchievements.get(3) == "false") {
            if (totalScore > 50000) {
                UserAchievement.create(idUser,4);
            }
        }
        /**
         * Fifth Achievement: Total Score > 100000
         */
        if (booleanAchievements.get(4) == "false") {
            if (totalScore > 100000) {
                UserAchievement.create(idUser,5);
            }
        }
        /**
         * Sixth Achievement: 5 Games played
         */
        if (booleanAchievements.get(5) == "false") {
            if (playedGames.size() >= 5) {
                UserAchievement.create(idUser,6);
            }
        }
        /**
         * Seventh Achievement: 20 Games played
         */
        if (booleanAchievements.get(6) == "false") {
            if (playedGames.size() >= 20) {
                UserAchievement.create(idUser,7);
            }
        }
        /**
         * Eighth Achievement: Game with 0 errors
         */
        if (booleanAchievements.get(7) == "false") {
            if (zeroErrors == true) {
                UserAchievement.create(idUser,8);
            }
        }
        return ok();
    }
}
