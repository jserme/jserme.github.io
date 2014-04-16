---
layout: post
date: 2014-04-16 22:23:21 +0800
title: 写了一个压缩html的模块htmlmin
tags: javascript htmlmin
---

本来是不打算写这个模块的，因为有现成的[html-minifier]了，但是我在使用的时候发现集成它，很困难，总是出错，并且它的功能不够单一，还有lint功能，因为看到它有一个[html parser]，那就用这个[html parser]写一个压缩器。

## 它是怎么做的

[htmlmin]是先把[html parser]下载下来，使用它的方法`HTMLParser`方法，下载[html-minifier]的测试文件，写代码跑过[html-minifier]的测试，参考[cssmin]的`cssbin`的代码，搞了一下命令行下的功能，然后就做完了。

按照[npm publish]的指导完成发布模块。

写得比较快，代码基本上没有做任何优化，如果后续有人用或者我自己用的时候碰到问题了，会再去优化

## 怎么使用

直接在命令行下使用：

```bash
npm install -g htmlmin
```
安装完成后，可以看一下帮助，基本的选项已经可以去掉空格换行，压缩css和js

```bash
htmlmin --help
````

在代码里使用，首先需要安装模块和保存依赖

```bash
npm install --save htmlmin
```

然后在你的`nodejs`程序里使用

```javascript
var htmlmin = require('htmlmin')
htmlmin(htmlString, options)
```

其中`options`是一个对象，可以接收的参数是：

* jsmin: 默认值为 `true`, 压缩页面内script标签里js以及`on*`属性里的js代码
* cssmin: 默认值为 `true`, 压缩页面内style标签里css以及`style`属性里的代码
* caseSensitive: 默认值为 `true`, 大小敏感，标签及标签的属性会保留它本来的大小写，如果为false，会转换为小写
* removeComments: 默认值为 `true`, 除了注释的开头加了`!`都会被删除
* removeIgnored: 默认值为 `false`, 删除不认识的标签，比如`<% xx %>`
* removeOptionalTags: 默认值为 `false`, 删除结束标签，有些标签是可以不加结束标签的
* collapseWhitespace: 默认值为 `false`, 删除标签内内容的空格，慎用，有可能会造成内容丢失


希望[htmlmin]能青出于蓝而胜于蓝

[cssmin]:https://github.com/jbleuzen/node-cssmin
[npm publish]:https://gist.github.com/coolaj86/1318304
[html parser]:https://github.com/kangax/html-minifier/blob/gh-pages/src/htmlparser.js
[html-minifier]:https://github.com/kangax/html-minifier
[htmlmin]:https://github.com/jserme/htmlmin
