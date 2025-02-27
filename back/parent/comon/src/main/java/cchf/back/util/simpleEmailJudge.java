package cchf.back.util;

public class simpleEmailJudge {

    public static boolean isEmail(String login){
        return login.contains("@") && login.matches("^[A-Za-z0-9+_.-]+(@[A-Za-z0-9.-]+\\.)+[A-Za-z]{2,}$");
    }

}
