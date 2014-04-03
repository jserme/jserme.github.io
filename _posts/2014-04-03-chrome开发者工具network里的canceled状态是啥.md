---
layout: post
date: 2014-04-03 13:17:51 +0800
title: chrome开发者工具network里的canceled状态是啥
tags : javascript 
---

如图，偶尔会在chrome的network里看到下图的状态

![](/images/chrome-network-cancel.png)

这种情况看[Chromium-dev](https://groups.google.com/a/chromium.org/forum/#!msg/chromium-dev/Fal1ZJnTgGQ/UDdxbrf_Rv4J)的论坛里说是由于用户主动放弃请求导致的，这里的用户指浏览者，当然也指web的开发者

浏览者放弃请求，其实就是他主动点了左上角的停止按钮，上面的图就是我在浏览微博的时候点击了一下停止按钮造成的。

那么开发者主动放弃请求的方式有哪些呢？

* 把一个发请求的dom元素删除掉，比如一个图片
* 在一个资源加载的时候修改它的请求地址，比如iframe
* 对同一个服务器的请求太多，导致某一次出现错误 

上面的情况2对于我们发beacon的图片请求场景下有可能触发，这种情况下我们需要在img onload之后再去删除图片

参考文章：

* https://groups.google.com/a/chromium.org/forum/#!msg/chromium-dev/Fal1ZJnTgGQ/UDdxbrf_Rv4J 
* http://stackoverflow.com/questions/12009423/what-does-status-canceled-for-a-resource-mean-in-chrome-developer-tools
