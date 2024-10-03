[TOC]

**RTMS**

---

# 初步设想

## 思想

## 			着重与交流的团队协作程序，通过创建一个团队工作室，成员上传工作文件并对工作文件进行修改。成员间可通过语音通话方式对修改的文件内容进行解释以达到工作任务的高效对接。

## **技术实现**

​	前端：html css/sass js React Taro { Yjs(协同编辑) WebSocket(实时通信) }

​	后端：java  SpringBoot  腾讯RTC(多人实时音视频通话) 

首先是websocket实时通讯技术，比较符合项目的频繁编辑功能的性质；而Yjs的初衷就是为了实现协同编辑，最关键的功能就是解决并发冲突。处理并发冲突还可以使用锁，据说会比较简单，但这样不能存在多人同时修改一处文件。

目前先关注的是页面的设计以及如何做到文件的上传(可以基于微信原生接口实现)和保存，实时编辑，协同编辑的这些方面。

协同编辑可以看这些文章：

https://blog.csdn.net/React_Community/article/details/123492567?fromshare=blogdetail&sharetype=blogdetail&sharerId=123492567&sharerefer=PC&sharesource=weixin_43677196&sharefrom=from_link


https://zhuanlan.zhihu.com/p/452980520

https://dreamit.blog.csdn.net/article/details/102819510?fromshare=blogdetail&sharetype=blogdetail&sharerId=102819510&sharerefer=PC&sharesource=weixin_43677196&sharefrom=from_link

websocket了解：

https://spring.io/guides/gs/messaging-stomp-websocket#scratch

现在还没有找到一个比较好的项目来借鉴，建议github搜搜协同编辑之类的
