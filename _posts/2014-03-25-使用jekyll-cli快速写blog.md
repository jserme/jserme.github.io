---
layout: post
date: 2014-03-25 22:07:07 +0800
title: 使用jekyll-cli快速写blog
tags : jekyll
---

如果看过[这篇](http://jser.me/2013/07/28/%E6%97%A7blog%E8%BF%81%E7%A7%BB%E5%88%B0jekyll%2Bgithub.html)Blog肯定知道此博客是使用jekyll生成的，然后托管在github。写Blog的时候会发现新建一个日志的时候，需要创建一个包含日期与标题的文件，然后在打开的文件里还需要再次写入标题，这样的重复过程对于程序员来说是不可以容忍的！

于是我打算写一个命令行的工具，来加速这个过程，本着程序员懒惰的精神，写之前先找一下有没有现成的，这种非常常见的问题，肯定是有人已经解决了，下面是[主角jekyll-cli](https://github.com/jsw0528/jekyll-cli)

这是一个nodejs写的在命令行下使用jekyll的工具，可以帮助大家减少一些重复操作。

安装过`nodejs`之后，可以用下面的命令来安装

```bash
$ npm install -g jekyll-cli
```
安装完成后，使用`jkl`命令就行了。

我最常用的就是新建日志，在`jekyll`的根目录，执行

```bash
$ jkl post 使用jekyll-cli快速写blog
```

正常的情况下它就会在`_post`目录创建好一个文件名是`使用jekyll-cli快速写blog`的markdown文件，同时这个文件的内容已经写上了时间，标题

如果你不想使用中文的文件名，可以加上`-p`参数，它会帮你把中文转换为拼音

```bash
$ jkl post -p 使用jekyll-cli快速写blog
```

更多详细的用法，可以查看帮助

```bash
$ jkl -h
```

子命令的详细用法，可以同样可以查看帮助，比如查看`post`的详细用法和参数

```bash
$ jkl post -h
```

好了，你一定很奇怪这么简单的东西为什么还要写一个日志，因为，发现这个东西后，我发现它是默认把中文转化为拼音的，爱国的我决定[改造一下它](https://github.com/jsw0528/jekyll-cli/pull/1)，恩，因为它有我的几行代码，哈哈：）
