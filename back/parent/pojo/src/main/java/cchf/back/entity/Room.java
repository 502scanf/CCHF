package cchf.back.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {
    private String roomid;
    private String roomname;
    private String onerid;
    private int status;
    private Timestamp time;
    private String roompassword;
}
