package services;


/**
 * Provides a template used by the login page and create account page.
 * Created by Benedict on 25.02.2017.
 */
public class LoginForm {

    protected String userName;
    protected String password;

    public LoginForm() {
    }

    public LoginForm(String userName, String password) {
        this.userName = userName;
        this.password = password;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
