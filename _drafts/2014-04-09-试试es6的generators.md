---
layout: post
date: 2014-04-09 13:53:48 +0800
title: 试试es6的generators
tags: javascript
---

目前es6在浏览器并没有全面支持，可以通过安装特定版本的node来尝鲜，下面是一些准备工作

1. 安装`nvm`， 用来管理本机的node版本， [这里](https://github.com/creationix/nvm)   
1. 使用nvm安装`0.11.x`，目前最新的版本是`0.11.12`， `nvm install 0.11.12`
1. 为了编辑的时候不提示错误，可以在修改你的`.jshintrc`, 添加`esnext:true`
1. 安装完成后，使用`nvm use 0.11.12`切换当前node的版本
1. 运行一下`node -v`，确认一下


