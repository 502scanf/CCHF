# CoCreateHub

## 接口（统一前缀/cch/...）

### 用户接口（/cch）

- **注册** **signController**

  1. 路由地址：**/cch/sign**

  2. 请求体：**SignDto** 

     | SignDto | 类型                     | 名称     |
     | ------- | ------------------------ | -------- |
     | 名字    | String                   | uname    |
     | 邮件    | String                   | mail     |
     | 密码    | String                   | password |
     | 头像    | String（base64位图像码） | logo     |

  3. 返回格式：**null**

- **登录 loginContorller**

  1.  路由地址：**/cch/login**

  2. 请求体： **LoginDto**

     | LoginDto | 类型   | 名称     |
     | -------- | ------ | -------- |
     | 登录     | String | login    |
     | 密码     | String | password |

  3. 返回格式：**LoginVo**

     | LoginVo | 类型   | 名称  |
     | ------- | ------ | ----- |
     | 名字    | String | uname |
     | 邮件    | String | mail  |
     | 头像    | String | logo  |
     | 令牌    | String | token |

### 房间接口 roomController（统一接口：/cch/roomPlace）

- **创建**

  1. 路由地址：**/work**

  2. 请求体：**RoomBuildDto**

     | RoomBuildDto | 类型   | 名称     |
     | ------------ | ------ | -------- |
     | 房间名       | String | roomname |

     3.返回格式：**RoomBuildVo**

     | RoomBuildVo | 类型      | 名称     |
     | ----------- | --------- | -------- |
     | 房间id      | String    | roomid   |
     | 房间名      | String    | roomname |
     | 房主id      | String    | onerid   |
     | 房间状态    | int       | status   |
     | 时间        | Timestamp | time     |

- **查询room**

  1. 路由地址：**/{roomname}**

  2. 请求体： **roomname**

     | 房间名字 | 类型   | 名称     |
     | -------- | ------ | -------- |
     | 房间名   | String | roomname |

  3. 返回格式：**roomBuildVo**

     | RoomBuildVo | 类型      | 名称     |
     | ----------- | --------- | -------- |
     | 房间id      | String    | roomid   |
     | 房间名      | String    | roomname |
     | 房主id      | String    | onerid   |
     | 房间状态    | int       | status   |
     | 时间        | Timestamp | time     |

- **查询room列表**

  1. 路由地址： **/roomlist**
  2. 请求体：**null** （根据保存的用户id）
  3. 返回格式：**List<RoomBuildVo>**

- **回收room**

  1. 路由地址：**/recycle/{roomname}**

  2. 请求体： **roomname**

     | 房间名字 | 类型   | 名称     |
     | -------- | ------ | -------- |
     | 房间名   | String | roomname |

  3. 返回格式：**RoomRecycleVo**

     | RoomRecycleVo | 类型   | 名称     |
     | ------------- | ------ | -------- |
     | 房间名        | String | roomname |

### 文件接口 docContorller （统一接口前缀：/cch/docplace）

- **文件创建**

  1. 路由地址： **/build**

  2. 请求体：**DocBuildDto**

     | DocBuildDto | 类型           | 名称      |
     | ----------- | -------------- | --------- |
     | 文件名      | String         | docname   |
     | 文件id      | String         | docroomid |
     | 文件类型    | String（.txt） | doctype   |

  3. 返回格式：**DocBuildVo**

     | DocBuildVo | 类型      | 名称    |
     | ---------- | --------- | ------- |
     | 文件名     | String    | docname |
     | 文件格式   | String    | doctype |
     | 文件状态   | int       | status  |
     | 文件时间   | Timestamp | time    |

- **回收文件**

  1. 路由地址：**/recycle**

  2. 请求体：**DocBuildDto**

     | DocBuildDto | 类型           | 名称      |
     | ----------- | -------------- | --------- |
     | 文件名      | String         | docname   |
     | 文件id      | String         | docroomid |
     | 文件类型    | String（.txt） | doctype   |

  3. 返回格式：**DocRecycleVo**

     | DocRecycleVo | 类型   | 名称    |
     | ------------ | ------ | ------- |
     | 文件名称     | String | docname |
     | 文件格式     | String | doctype |

- **查询文件**

  1.路由地址：**/doc**

  2.请求体：**DocBuildDto**	

  | DocBuildDto | 类型           | 名称      |
  | ----------- | -------------- | --------- |
  | 文件名      | String         | docname   |
  | 文件id      | String         | docroomid |
  | 文件类型    | String（.txt） | doctype   |

  3.返回格式：**DocBuildVo**

  | DocBuildVo | 类型      | 名称    |
  | ---------- | --------- | ------- |
  | 文件名     | String    | docname |
  | 文件格式   | String    | doctype |
  | 文件状态   | int       | status  |
  | 文件时间   | Timestamp | time    |

- **查询文件列表**

  1. 路由地址：**/docList/{roomid}**

  2. 请求体：**roomid**

     | roomid | 类型   | 名称   |
     | ------ | ------ | ------ |
     | 房间id | String | roomid |

  3. 返回格式：**List<DocBuildVo>**

