package controllers;



import com.google.inject.Inject;
import models.db.*;
import play.db.Database;
import play.data.Form;
import play.data.FormFactory;
import play.mvc.*;
import services.LoginForm;
import views.html.*;
import java.sql.*;
import java.util.List;


/**
 * Manages renderLoginPage, logout and account creation.
 * Created by Benedict on 25.02.2017.
 */
public class UserController extends Controller {

    public static Database db;
    @Inject
    FormFactory formFactory;
    @Inject
    public UserController(Database db) {
        UserController.db = db;
    }

    public Result renderLoginPage() {
        Form<LoginForm> loginForm = formFactory.form(LoginForm.class);
        boolean userExists = true;
        boolean formEmpty = false;
        return ok(LoginPage.render(loginForm,userExists,formEmpty));
    }

    public Result logout() {
        session().clear();
        return redirect("/login");
    }

    /**
     * checks if renderLoginPage data is entered and if entered data matches a db entry.
     * Creates a session which stores users ID upon successful renderLoginPage.
     * @return either badRequest() with userForm and boolean information about mentioned checks
     * for re-rendering page with error message or a redirect to setup menu.
     * @throws SQLException
     */
    public Result authenticate() throws SQLException {
        Form<LoginForm> userForm = formFactory.form(LoginForm.class).bindFromRequest();
        LoginForm loginForm = userForm.get();
        boolean userExists = true;
        boolean formEmpty = false;
        List<User> Users;
        Users = User.fromDBWithCredentials(loginForm.getUserName(), loginForm.getPassword());

        if (loginForm.getUserName().equals("") || loginForm.getPassword().equals("")) {/*No data entered*/
            formEmpty = true;
            return badRequest(LoginPage.render(userForm,userExists,formEmpty));
        }

        if (Users.isEmpty()) {/*No entry in db*/
            userExists = false;
            return badRequest(LoginPage.render(userForm,userExists,formEmpty));
        } else {/*log in user and store his ID*/
            String userID = Integer.toString(Users.get(0).getIduser());
            session().clear();
            session("currentlyLoggedIn", userID);
            return redirect("/setupMenu");
        }
    }

    public Result renderCreateAccountPage() {
        Form<LoginForm> loginForm = formFactory.form(LoginForm.class);
        boolean nameTaken = false;
        boolean userCreated = false;
        boolean formEmpty = false;
        return ok(CreateAccount.render(loginForm,nameTaken,userCreated,formEmpty));
    }

    /**
     * checks if entered data already exists in db or if no data was entered.
     * if both checks pass creates a new user entry in db.
     * @return badRequest() or ok() with userForm and boolean information about mentioned checks
     * for rerendering page with error or success message.
     * @throws SQLException
     */
    public Result saveAccountToDatabase() throws SQLException {
        Form<LoginForm> userForm = formFactory.form(LoginForm.class).bindFromRequest();
        LoginForm loginForm = userForm.get();
        boolean nameTaken = false;
        boolean userCreated = false;
        boolean formEmpty = false;
        List<User> Users = User.fromDB();

        if (loginForm.getUserName().equals("") || loginForm.getPassword().equals("")) {/*No data entered*/
            formEmpty = true;
            return badRequest(CreateAccount.render(userForm,nameTaken,userCreated,formEmpty));
        }

        for (User u : Users)
            if (u.getName().matches(loginForm.getUserName())) {/*username taken*/
            nameTaken = true;
                return badRequest(CreateAccount.render(userForm,nameTaken,userCreated,formEmpty));
            }
        //both checks passed!
        userCreated = true;
        User.create(loginForm.getUserName(), loginForm.getPassword());
        return ok(CreateAccount.render(userForm,nameTaken,userCreated,formEmpty));
    }

    @Security.Authenticated(Secured.class)
    public Result renderProfilePage() throws SQLException {
        String userID = session("currentlyLoggedIn");
        int userIDint = Integer.parseInt(userID);
        User user = User.fromDBWithID(userIDint);

        return ok(ProfilPage.render(user));
    }

}
