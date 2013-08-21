---
layout : post 
title : javascript的几种使用多行字符串的方式 
tags : javascript 多行字符串 
---

JS里并没有标准的多行字符串的表示方法，但是在用模板的时候，为了保证模板的可阅读性，我们又不可避免的使用多行字符串，所以出现了各种搞法，这里以一段jade的模板作为示例，简单总结和对比一下。

## 字符串相加
这是最容易理解也很常用的一种形式，如下

```javascript
var tmpl =''+
    '!!! 5' +
    'html' +
    '  include header' +
    '  body' +
    '    //if IE 6' +
    '        .alert.alert-error' +
    '            center 对不起，我们不支持IE6，请升级你的浏览器' +
    '                a(href="http://windows.microsoft.com/zh-CN/internet-explorer/download-ie") | IE8官方下载' +
    '                a(href="https://www.google.com/intl/en/chrome/browser/") | Chrome下载' +
    '    include head' +
    '    .container' +
    '        .row-fluid' +
    '            .span8' +
    '                block main' +
    '                include pagerbar' +
    '            .span4' +
    '                include sidebar' +
    '    include footer' +
    '    include script'
```
优点:

* 易理解，简单，可靠 
* 足够灵活，可以在单个字符串中添加js逻辑 

缺点 :

* 并不是真正意义上的多行字符串, 如果想要真正的多行，需要自己加`\n` 
* 大量的`+`号看上去满天星,大量的`'`和`"`, 丑陋

## 反斜线
这个叫续行符, 这个并非一种很常见的方式, 但是一旦用上了，还是很容易上瘾，只需要加一个字符

```javascript
var tmpl ='\
    !!! 5\
    html\
      include header\
      body\
        //if IE 6\
            .alert.alert-error\
                center 对不起，我们不支持IE6，请升级你的浏览器\
                    a(href="http://windows.microsoft.com/zh-CN/internet-explorer/download-ie") | IE8官方下载\
                    a(href="https://www.google.com/intl/en/chrome/browser/") | Chrome下载\
        include head\
        .container\
            .row-fluid\
                .span8\
                    block main\
                    include pagerbar\
                .span4\
                    include sidebar\
        include footer\
        include script'
```
优点:

* 简单,每一行只需要有多一个`\`
* 高效！在大部分的浏览器上，这种方式都是最快的，看这个[效率对比](http://jsperf.com/zp-string-concatenation/6)

缺点 :

* 致命缺陷，每一行的`\`必须不可以有空格，否则直接脚本错误 
* 并不是真正意义上的多行字符串, 如果想要真正的多行，需要自己加`\n` 
* 尽管绝大部分的js引擎都支持它，但是它并不是ECMAScript的一部分(我并没有研究规范，这句话是从[google的编码规范](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml?showone=Multiline_string_literals#Multiline_string_literals)翻译过来的)


## 字符串数组join
```javascript
var tmpl = [
    '!!! 5' ,
    'html' ,
    '  include header' ,
    '  body' ,
    '    //if IE 6' ,
    '        .alert.alert-error' ,
    '            center 对不起，我们不支持IE6，请升级你的浏览器' ,
    '                a(href="http://windows.microsoft.com/zh-CN/internet-explorer/download-ie") | IE8官方下载' ,
    '                a(href="https://www.google.com/intl/en/chrome/browser/") | Chrome下载' ,
    '    include head' ,
    '    .container' ,
    '        .row-fluid' ,
    '            .span8' ,
    '                block main' ,
    '                include pagerbar' ,
    '            .span4' ,
    '                include sidebar' ,
    '    include footer' ,
    '    include script'].join('\n');
```
优点:

* 真正意义上的多行字符串 
* 易理解，简单，可靠 
* 足够灵活，可以在单个字符串中添加js逻辑 

缺点 :

* 大量的`,`号和`'`、`"`, 丑陋

## String.prototype.concat

```javascript
var tmpl = String.prototype.concat.call(
    '!!! 5' ,
    'html' ,
    '  include header' ,
    '  body' ,
    '    //if IE 6' ,
    '        .alert.alert-error' ,
    '            center 对不起，我们不支持IE6，请升级你的浏览器' ,
    '                a(href="http://windows.microsoft.com/zh-CN/internet-explorer/download-ie") | IE8官方下载' ,
    '                a(href="https://www.google.com/intl/en/chrome/browser/") | Chrome下载' ,
    '    include head' ,
    '    .container' ,
    '        .row-fluid' ,
    '            .span8' ,
    '                block main' ,
    '                include pagerbar' ,
    '            .span4' ,
    '                include sidebar' ,
    '    include footer' ,
    '    include script');
```
优点:

* 不常用，事实上字符串的concat方法远没有`+`号常见
* 易理解，简单，可靠 
* 足够灵活，可以在单个字符串中添加js逻辑 

缺点 :

* 并不是真正意义上的多行字符串 
* 大量的`,`号和`'`、`"`, 丑陋

## heredoc
这是一种很有技巧的解决办法, 利用了function的toString方法

```javascript
function heredoc(fn) {
    return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
}

var tmpl = heredoc(function(){/*
    !!! 5
    html
      include header
      body
        //if IE 6
            .alert.alert-error
                center 对不起，我们不支持IE6，请升级你的浏览器
                    a(href="http://windows.microsoft.com/zh-CN/internet-explorer/download-ie") | IE8官方下载
                    a(href="https://www.google.com/intl/en/chrome/browser/") | Chrome下载
        include head
        .container
            .row-fluid
                .span8
                    block main
                    include pagerbar
                .span4
                    include sidebar
        include footer
        include script
 */});
```

优点:

* 模板字符串内不必写多余的任何字符，干净，简单 
* 真正意义上的多行字符串, 有`\n`哦 

缺点 :

* 不可以在单个字符串中添加js逻辑 
* 容易被压缩器压缩掉，yui compressor可以通过`/*!`来避免被压缩掉，[uglifyjs](https://github.com/mishoo/UglifyJS2)和[gcc](https://developers.google.com/closure/compiler/)也可以通过选项配置不删除特定的注释，这个不是大问题


## coffeescript
相当于换了一个语言，其实这种语言上缺少的功能，通过[coffeescript](http://coffeescript.org/#strings)这种以js为编译目标的语言来实现是一种非常棒的选择。    

```coffeescript
var tmpl = """ 
    !!! 5
    html
      include header
      body
        //if IE 6
            .alert.alert-error
                center 对不起，我们不支持IE6，请升级你的浏览器
                    a(href="http://windows.microsoft.com/zh-CN/internet-explorer/download-ie") | IE8官方下载
                    a(href="https://www.google.com/intl/en/chrome/browser/") | Chrome下载
        include head
        .container
            .row-fluid
                .span8
                    block main
                    include pagerbar
                .span4
                    include sidebar
        include footer
        include script
    """
```

优点:

* 易理解，简单，可靠 

缺点 :

* 需要了解coffeescript 
* 整个文件都需要用coffeescript来写


## ES6
ES6的有一个新的特性，[Template Strings](http://wiki.ecmascript.org/doku.php?id=harmony:quasis), 这是语言层面上第一次实现了多行字符串, 在[chrome canary](https://www.google.com/intl/en/chrome/browser/canary.html)里打开`Enable Experimental JavaScript`就可以使用这个特性，另外[typescript](http://www.typescriptlang.org/)也会支持这种方式

```javascript
var tmpl = 
   `!!! 5
    html
      include header
      body
        //if IE 6
            .alert.alert-error
                center 对不起，我们不支持IE6，请升级你的浏览器
                    a(href="http://windows.microsoft.com/zh-CN/internet-explorer/download-ie") | IE8官方下载
                    a(href="https://www.google.com/intl/en/chrome/browser/") | Chrome下载
        include head
        .container
            .row-fluid
                .span8
                    block main
                    include pagerbar
                .span4
                    include sidebar
        include footer
        include script`
```
优点:

* 易理解，原生支持 
* 真正的多行字符串

缺点 :

* JS引擎支持有限 

##总结

看了这么些写法，如何选择？如果你用的是coffeescript，放心大胆的使用它支持的多行字符串写法；如果是在客户端，同时你解决了你的压缩器去掉注释的问题，推荐使用heredoc；如果你无法解决压缩器的问题，使用反斜线连接吧，每行只需要加一个字符。
