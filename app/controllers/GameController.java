package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import models.db.Achievements;
import models.db.PlayedGame;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import views.html.*;


import java.sql.SQLException;

/**
 * Provides game with text from level selected in setup menu
 * and sends score to db after finished game.
 * Created by Benedict on 15.03.2017.
 */
public class GameController extends Controller {

    private String levelText;
    private String levelId;

    @Security.Authenticated(Secured.class)
    public Result renderGamePage() {
        return ok(Game.render(levelText,levelId));
    }

    public Result renderCreditsPage() {
        return ok(Credits.render());
    }

    /**
     * Receives the selected levels text and ID and fills String with it.
     *
     * @return ok()
     * @throws SQLException
     */
    public Result gameText() throws SQLException {
        JsonNode json = request().body().asJson();
        levelId = json.findPath("idLevel").textValue();
        levelText = json.findPath("levelText").textValue();

        return ok();
    }

    /**
     * Receives all necessary data for creating a new PlayedGame object and sends it
     * to db.
     *
     * @return ok()
     * @throws SQLException
     */
    public Result sendScoreToDB() throws SQLException {

        JsonNode json = request().body().asJson();

        int idLevel = Integer.parseInt(json.findPath("lvlId").textValue());
        int score = Integer.parseInt(json.findPath("points").textValue());
        int errors = Integer.parseInt(json.findPath("errors").textValue());
        int loggedInUser = Integer.parseInt(session("currentlyLoggedIn"));

        PlayedGame.create(errors, score, idLevel, loggedInUser);

        /**
         * Check, is new Achievements are unlocked
         */
        AchievementController.isNewAchievementUnlocked(loggedInUser);

        return ok();
    }
}
