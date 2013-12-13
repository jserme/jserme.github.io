---
layout : post 
title : 手工下载Android的SDK
tags :  android 
---

最近在学习Android开发，下载Android特定版本的SDK的时候太慢了，看了看sdk manager里的log，发现是可以手工下载的，下面是方法

首先打开包含所有版本的xml文件

```
http://dl-ssl.google.com/android/repository/repository-8.xml
```

找到需要下载的版本，比如17，搜索`sdk:api-level>17`，把对应的`<sdk:url>`里的值拼接到

```
http://dl-ssl.google.com/android/repository/
```

然后把地址放到迅雷里下载就好了
