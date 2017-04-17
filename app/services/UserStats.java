package services;

/**
 * Used for creating an Object which contains all Info about a user needed to be displayed
 * in the stats boxes on the friends page.
 * Created by Benedict on 26.03.2017.
 */
public class UserStats {
    private String name;
    private int highScore;
    private int avgScore;
    private int amtPlayedGames;


    public UserStats(String name, int highScore, int avgScore, int amtPlayedGames) {
        this.name = name;
        this.highScore = highScore;
        this.avgScore = avgScore;
        this.amtPlayedGames = amtPlayedGames;
    }


}
