package controllers;


import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import models.db.Level;
import models.db.PlayedGame;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import views.html.*;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Manages the setup menu page and fills it with requested data.
 * Created by Benedict on 08.03.2017.
 */
public class SetupController extends Controller {



    @Security.Authenticated(Secured.class)
    public Result renderSetupMenu() {
        return ok(SetupMenu.render());
    }

    /**
     * Retrieves all levels saved in db
     * @return json string with all levels
     * @throws SQLException
     */
    public Result levelList() throws SQLException{
        List<Level> levels;
        levels = Level.fromDB();
        String json = new Gson().toJson(levels, new TypeToken<ArrayList<Level>>(){}.getType());

        return ok(json);
    }


    public Result sendTop3Scores () throws SQLException {
        List<PlayedGame> top3Games = PlayedGame.top3ForEachLevel();
        String top3 = new Gson().toJson(top3Games, new TypeToken<ArrayList<PlayedGame>>(){}.getType());

        return ok(top3);

    }


}