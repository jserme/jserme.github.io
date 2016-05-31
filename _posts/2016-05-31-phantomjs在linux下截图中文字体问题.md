---
layout: post
date: 2016-05-31 10:57:57 +0800
title: phantomjs在linux下截图中文字体问题
tags: nodejs phantomjs
---

最近搞了搞截图的事情，碰到点小问题，刚解决完，趁着手热，记录一下。
目前我们截图用的是 [webshot]，它封装 [phantomjs]，使用起来比较方便，唯一碰到的问题就是中文展现与
真实浏览器里的有区别，问题其实就是字体的问题

我们的样式里是这样：

```css
...{
  ...
  font-family: Helvetica, arial, "microsoft yahei", Monaco, sans-serif;
  ...
}
```

只截取了字体设置的那段，可以看到有 5 种字体，最后的 sans-serif 默认对应是黑体，需要把这5种字体装到截图的
 Linux 服务器，分别从osx和windows上copy出来，注意一下，osx 中的字体是 `.ttc` 和 `.dfont` 格式的，我们
可以借助 [http://transfonter.org/ttc-unpack](http://transfonter.org/ttc-unpack)来转换为 Linux
支持的 `.ttf` 的格式

* Helvetica       : 从 osx 的 /System/Library/Fonts 拷然后转换
* arial           : 从windows拷
* sans-serif      : 默认是黑体，从 osx 拷
* microsoft yahei : 从windows拷
* Monaco          : 从windows拷

把这些文件拷到 Linux 服务器上，然后调用 `fc-cache` 更新一下

```bash
sudo mkdir /usr/share/fonts/custom
sudo cp *.ttf  /usr/share/fonts/custom
fc-cache -fv
```

如果你之前曾经在网上搜索并安装了 `bitmap-fonts` ，还是删除吧

```bash
sudo yum remove bitmap-fonts bitmap-fonts-cjk  # 删除之前安装的东西
```

更新完字体后截图就正常了


[phantomjs]: http://phantomjs.org
[webshot]: https://github.com/brenden/node-webshot
