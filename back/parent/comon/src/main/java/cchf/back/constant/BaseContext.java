package cchf.back.constant;

//创建线程上下文
public class BaseContext {
    public static ThreadLocal<String> threadLocal = new ThreadLocal<>();

    public static void setCurrentId(String uid){threadLocal.set(uid);}
    public static String  getCurrentId(){return threadLocal.get();}
}
