---
layout: post
date: 2014-03-11 15:45:35 +0800
title: 通过例子对比grunt和gulp
tags: grunt javascript gulp
---

Grunt出来之后，nodejs里的构建工具宝座长久以来就是它的，随着新星Gulp的出现，Grunt的地位明显被削弱了。因为打算换换口味，决定对比一下它们。

相应的代码在[这里](https://github.com/jserme/gruntvsgulp)，不想看文章的可以自己clone一下代码，然后对比一下。

## 定一下我们的任务

用两个工具分别实现一些常见的任务，对比性能、代码

* 分别实现合并代码，压缩代码、压缩图片
* 性能对比，代码对比

## 目录结构

```
.
├── Gruntfile.js
├── dist
├── grunt.md
├── gulp.md
├── gulpfile.js
├── node_modules
├── package.json
├── readme.md
└── src
    ├── images
    │   └── test.jpg
    └── js
        ├── jquery-1.11.0.js
        └── underscore.js
```
## 使用Grunt

### 首先安装grunt

```
npm install --save-dev grunt
```

### 安装我们需要的grunt的插件

* 校验代码 jshint 
* 移动代码 copy
* 合并代码 concat
* 压缩代码 uglify
* 压缩图片 imagemin
* 时间分析的插件 time-grunt

```
npm install --save-dev grunt-contrib-jshint
npm install --save-dev grunt-contrib-uglify
npm install --save-dev grunt-contrib-imagemin
npm install --save-dev grunt-contrib-concat
npm install --save-dev grunt-contrib-copy
```

### 结果

然后我们来写代码，详细内容还是看[Gruntfile.js](https://github.com/jserme/gruntvsgulp/blob/master/Gruntfile.js)，下面是一张运行完后的截图

![](https://raw.github.com/jserme/gruntvsgulp/master/images/grunt-result.png)

可以看出grunt运行时间为3.6s，相应的信息输出很详细


## 使用Glup

### 全局安装gulp

```
npm install -g --save-dev gulp
```

### 安装相关的`gulp`插件

```
npm install --save-dev gulp-concat  gulp-uglify  gulp-imagemin  gulp-jshint
```

### 结果

按照[开始教程](https://github.com/gulpjs/gulp/blob/master/README.md#gulp---)里的内容创建一个[gulpfile.js](https://github.com/jserme/gruntvsgulp/blob/master/gulpfile.js)

运行结果，如图：

![](https://raw.github.com/jserme/gruntvsgulp/master/images/gulp-result.png)

可以看到`gulp`代码更短，输出更简洁

## 总结

可能由于项目比较小的原因，`Gulp`在性能上并没有领先,但是在代码清晰度和可维护性上`Gulp`绝对是完胜，还是推荐`Gulp`
