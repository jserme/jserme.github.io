---
layout: post
date: 2014-11-13 11:29:27 +0800
title: MAC下安装goagent
---

google是程序员随身宝器，还好有goagent~

下载[goagent](https://github.com/goagent/goagent/)，按照[图文教程](https://github.com/goagent/goagent/blob/wiki/InstallGuide.md)

在执行`python uploader.py`时,会出现这个错误

```
Traceback (most recent call last):
  File "uploader.py", line 28, in <module>
    import fancy_urllib
  File "/Users/hubo/goagent/server/google_appengine.zip/fancy_urllib/__init__.py", line 328, in <module>
AttributeError: 'module' object has no attribute 'HTTPSHandler'
```

这其实是由于系统自带的python没有默认安装ssl，用`brew`安装的python也有这个问题，我们手工编译一下

```
brew install openssl #首先系统需要有openssl
wget https://www.python.org/ftp/python/2.7.8/Python-2.7.8.tar.xz 
tar zxvf Python-2.7.8.tar.xz 
vim  Python-2.7.8/Modules/Setup.dist
```
编辑`Setup.dist`文件，去掉`SSL`那几行前面的注释

接下来正常的编译安装

```
./configure
make 
make install
```
再运行就正常了，接下来还是按照正常的[教程](https://github.com/goagent/goagent/blob/wiki/InstallGuide.md)搞就行了。
