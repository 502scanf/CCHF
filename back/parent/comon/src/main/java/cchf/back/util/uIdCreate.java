package cchf.back.util;

import java.util.concurrent.ThreadLocalRandom;

public class uIdCreate {
    private static final String BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    public static String generateId(){
        long value = System.currentTimeMillis()*1000
                + ThreadLocalRandom.current()
                .nextInt(1000);
        StringBuilder s = new StringBuilder();
        while(value > 0){
            s.append(BASE62.charAt((int) (value % 62)));
            value /= 62;
        }
        return s.reverse().toString();
    }
}
