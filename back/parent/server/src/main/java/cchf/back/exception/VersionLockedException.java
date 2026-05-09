package cchf.back.exception;

public class VersionLockedException extends RuntimeException {
    public VersionLockedException(String message) {
        super(message);
    }
}