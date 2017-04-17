package controllers;

import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;

/**
 * Determines if someone is logged in and what to do if someone unauthorized
 * wants to access pages without permission.
 */
public class Secured extends Security.Authenticator {
    @Override
    public String getUsername(Http.Context ctx){
        return ctx.session().get("currentlyLoggedIn");
    }

    @Override
    public Result onUnauthorized(Http.Context ctx){
        return redirect("/renderLoginPage");
    }
}
