package cchf.back.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomBuildVo implements Serializable {
    private String roomid;
    private String roomname;
    private String onerid;
    private int status;
    private Timestamp time;


}
