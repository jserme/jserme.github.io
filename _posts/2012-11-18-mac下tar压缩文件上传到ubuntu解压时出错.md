---
layout : post 
title : mac下tar压缩文件上传到ubuntu解压时出错
tags : mac linux
---

做Blog的程序自动发布脚本时，本地打包的文件在服务器端解压时报了下面的错

```javascript
tar: Ignoring unknown extended header keyword 'SCHILY.dev'
tar: Ignoring unknown extended header keyword 'SCHILY.ino'
tar: Ignoring unknown extended header keyword 'SCHILY.nlink'
```

本机查看一下tar --help发现tar是bsdtar, 服务器上是gnutar，统一一下就行了。	

```javascript
sudo port install gnutar
which gnutar  #显示 /opt/local/bin/gnutar
which tar #显示 /usr/bin/tar
sudo ln -sF /opt/local/bin/gnutar  /usr/bin/tar
```

再次使用tar时不再报错了
