package services;

/**
 * Provides a template used by the friends page
 * Created by Lena on 20.03.2017.
 */
public class AddFriendsForm {

    protected String addFriend;

    public AddFriendsForm() {
    }

    public AddFriendsForm(String addFriend) {
        this.addFriend = addFriend;
    }

    public String getAddFriend() {
        return addFriend;
    }

    public void setAddFriend(String addFriend) {
        this.addFriend = addFriend;
    }
}