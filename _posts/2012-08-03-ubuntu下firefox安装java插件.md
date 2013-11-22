---
layout : post 
title : ubuntu下firefox安装java插件
tags : ubuntu
---

在ubuntu下连接公司的vpn才发现我的火狐居然没有安装javaplugin

找了一会，找到解决方法，小纪录一下：

安装了jre之后，插件会在下面的路径里

```bash
/usr/lib/jvm/java-6-sun-1.6.0.20/jre/lib/i386/libnpjp2.so
```
在火狐的插件目录里搞一个软链接就好啦

```bash
cd ~/.mozllia
ln -s  /usr/lib/jvm/java-6-sun-1.6.0.20/jre/lib/i386/libnpjp2.so .
```

重启火狐，在浏览器里输入 about:plugins，看到java插件的信息了
恩，可以正常使用vpn了
最后推荐一个GEEK写的文章： http://mad-scientist.us/juniper.html
