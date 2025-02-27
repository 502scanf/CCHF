package cchf.back.result;

import lombok.Data;

import java.io.Serializable;


@Data

public class result<T> implements Serializable {
    private Integer code;
    private String msg;
    private T data;

    public static <T> result<T> success(){
        result<T> result = new result<>();
        result.code = 1;
        return result;
    }

    public static <T> result<T> success(T object){
        result<T> result = new result<>();
        result.data = object;
        result.code = 1;
        return result;

    }

    public static <T> result<T> error(String msg){
        result <T> result = new result<>();
        result.msg = msg;
        result.code = 0;
        return result;
    }
}
