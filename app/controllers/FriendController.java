package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.inject.Inject;
import models.db.Friends;
import models.db.Message;
import models.db.PlayedGame;
import models.db.User;
import play.data.Form;
import play.data.FormFactory;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import services.AddFriendsForm;
import services.UserStats;
import views.html.*;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;


/**
 * Manages rendering of FriendPage, adding friends and sending messages
 * Created by Lena on 20.03.2017.
 */

public class FriendController extends Controller {
    private String idReceiver;
    private int idReceiverInt;
    private String message;


    @Inject
    FormFactory formFactory;

    @Security.Authenticated(Secured.class)
    public Result RenderFriendsPage() {

        Form<AddFriendsForm> addFriendsForm = formFactory.form(AddFriendsForm.class);
        boolean userExists = true;
        boolean friendshipExists = false;
        boolean friendAdded = false;
        return ok(FriendPage.render(addFriendsForm, userExists, friendAdded, friendshipExists));
    }

    /**
     * checks if entered user exists
     * if user exists, new friends entry is created
     * @return badRequest() or ok() with friendForm and boolean information
     * for rerendering page with error or success message
     * @throws SQLException
     */
    public Result addFriendsToDatabase() throws SQLException {
        Form<AddFriendsForm> addFriendsForm = formFactory.form(AddFriendsForm.class).bindFromRequest();
        AddFriendsForm friendForm = addFriendsForm.get();

        boolean userExists = true;
        boolean friendshipExists = false;
        boolean friendAdded = false;

        String user1ID = session("currentlyLoggedIn");
        int user1IDint = Integer.parseInt(user1ID);
        User loggedInUser = User.fromDBWithID(user1IDint);
        User userRequestedForAdd;
        List<Friends> userFriends = Friends.allFriendsofLoggedInUser(user1ID);
        List<User> userToAdd = User.fromDBWithName(friendForm.getAddFriend());

        if (userToAdd.isEmpty()){
            userExists = false;
            return badRequest(FriendPage.render(addFriendsForm, userExists, friendshipExists,friendAdded));
        }else{
            userRequestedForAdd = userToAdd.get(0);
        }

        for (Friends f: userFriends){
            if (f.getUser1() == loggedInUser.getIduser() && f.getUser2() == userRequestedForAdd.getIduser() || f.getUser2() == loggedInUser.getIduser() && f.getUser1() == userRequestedForAdd.getIduser()){
                friendshipExists= true;
                return badRequest(FriendPage.render(addFriendsForm, userExists,friendshipExists,friendAdded));
            }
        }

        friendAdded = true;
        Friends.create(user1IDint, userRequestedForAdd.getIduser());
        return ok(FriendPage.render(addFriendsForm, userExists,  friendshipExists,friendAdded));
    }

    /**
     * creates a list with all friends of the currently logged in user
     * @return User list in json format
     * @throws SQLException
     */
    public Result friendsList() throws SQLException{
        String loggedinUser = session("currentlyLoggedIn");
        int loggedinUserInt = Integer.parseInt(loggedinUser);
        List<Friends> friends= Friends.allFriendsofLoggedInUser(loggedinUser);

        List<User> userFriends = new ArrayList<User>();
        userFriends.add(User.fromDBWithID(loggedinUserInt));
        for (Friends f: friends) {
            if (f.getUser1() == loggedinUserInt){
                userFriends.add(User.fromDBWithID(f.getUser2()));
            }else{
                userFriends.add(User.fromDBWithID(f.getUser1()));
            }

        }

        String json = new Gson().toJson(userFriends, new TypeToken<ArrayList<User>>(){}.getType());

        return ok(json);
    }

    /**
     * creates a list of UserStats Objects used for populating user stats on message page with data
     * @return UserStats list in json format
     * @throws SQLException
     */
    public Result profileInfo() throws SQLException{
        String loggedinUser = session("currentlyLoggedIn");
        int loggedinUserInt = Integer.parseInt(loggedinUser);
        List<UserStats> us = new ArrayList<>();
        List<Friends> friends= Friends.allFriendsofLoggedInUser(loggedinUser);
        List<User> userFriends = new ArrayList<>();
        userFriends.add(User.fromDBWithID(loggedinUserInt));

        for (Friends f: friends) {
            if (f.getUser1() == loggedinUserInt) {
                userFriends.add(User.fromDBWithID(f.getUser2()));
            } else {
                userFriends.add(User.fromDBWithID(f.getUser1()));
            }
        }

        for (User u: userFriends) {
            int amtPlayedGames = PlayedGame.fromDBWithId(u.getIduser()).size();
            us.add(new UserStats(u.getName(),u.getHighscore(), u.getAverageScore(),amtPlayedGames));
        }
        String json = new Gson().toJson(us, new TypeToken<ArrayList<UserStats>>(){}.getType());

        return ok(json);
    }
    /**
     * receives the id from the receiver and the message from json
     * @return ok()
     * @throws SQLException
     */
    public Result getReceiverId() throws SQLException{
        JsonNode json = request().body().asJson();
        idReceiver = json.findPath("idUser").textValue();
        idReceiverInt = Integer.parseInt(idReceiver);
        message = json.findPath("message").textValue();
        return ok();
    }


    /**
     * creates new message entry to database
     * @return ok() with text message created
     * @throws SQLException
     * @throws UnsupportedEncodingException
     */
    public Result saveMessageToDatabase() throws SQLException, UnsupportedEncodingException {
        JsonNode json = request().body().asJson();
        String message = json.findPath("message").textValue().substring(8);
        message = URLDecoder.decode(message,"UTF-8");

        String idSender = session("currentlyLoggedIn");
        int idSenderInt = Integer.parseInt(idSender);

        Message.create(message, idReceiverInt, idSenderInt );

        return ok("message created");
    }

    /**
     * creates a list with all sent messages between currently logged in user and a receiver
     * @return ok() with json
     * @throws SQLException
     */
    public Result messageHistory() throws SQLException{
        String idSender = session("currentlyLoggedIn");

        List<Message> history= Message.MessageHistory(idSender, idReceiver);

        String json = new Gson().toJson(history, new TypeToken<ArrayList<Message>>(){}.getType());

        return ok(json);
    }
}
