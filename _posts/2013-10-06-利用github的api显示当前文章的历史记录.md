---
layout : post 
title : 利用github的api显示当前文章的历史记录
tags : github
---

利用github放blog也有一段时间了，一直想做一个小功能，就是展示某个文章的历史纪录，简单来说就是`git log 某个文章`

## 两种思路
* 写一个jekyll的插件
* js利用github的api

### 思路1
由于github上的jekyll生成网站时是不允许使用的自定义插件的，这个思路暂时忽略。事实上，可以在本地生成静态网站，然后上传到github上，直接使用`gh-pages`分支来展示，因为不太想重新建一个repo，这个思路暂时忽略吧。

### 思路2
利用github的[commits api](http://developer.github.com/v3/repos/commits/)，比如一个文章的commits可以用下面的请求获取, 指定`path`参数就可以获取特定文件的提交纪录。

```javascript
$.getJSON('https://api.github.com/repos/jserme/jserme.github.io/commits?path=_posts%2F2013-07-29-lion%E4%B8%8B%E7%9A%84safari6%E5%AF%B9%E7%BA%AF%E6%95%B0%E5%AD%97%E4%BD%BF%E7%94%A8toString%E6%8A%A5%E9%94%99.md',function(data){console.log(data)})
```

返回的数据格式是一个数组，在每个文章页面加上下面一个id为history的div，然后通过下面的js渲染出对应html，展示效果见每个文章的下方

```javascript
```



