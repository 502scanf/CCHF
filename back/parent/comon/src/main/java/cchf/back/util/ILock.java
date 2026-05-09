package cchf.back.util;

public interface ILock {
    boolean tryLock(long timeoutSec);

    void unlock();
}
