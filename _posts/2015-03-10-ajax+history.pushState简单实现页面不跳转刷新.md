---
layout: post
date: 2015-03-10 23:15:25 +0800
title: ajax+history.pushState简单实现页面不跳转刷新
tags: javascript
---

又到了一年一折腾[blog]的时候了，这次简单搞一下以前想弄的一个小功能：点击a链接，页面不跳转，通过ajax获取页面内容，刷新页面

这么做主要是可以提高页面展现速度，从当前页面在站内跳转的时候，减少资源请求

原理很简单：

1. 点击a链接，分析链接地址，站外直接跳走，站内往下
2. 阻止默认事件，ajax获取链接地址的html内容
3. 取到内容里特定的节点，替换到当前页面特定节点里
4. 取到内容里的title,更新页面title
5. 利用history.pushState更新浏览器地址栏里的地址

[我]这里用的是一种简化的方案，更完整的方案其实是有服务端支持，它也有一个名字叫[pjax](https://github.com/defunkt/jquery-pjax)，我的[blog](http://jser.me)内容简单，所以按[我]上面的描述简单实现了一个，js内容如下：

```javascript
loadJs('/js/jquery-1.7.2.min.js', function() {
  //搞成一个简单的jquery插件
  (function($) {
  /*
    $('selector').ajaxLoadPage(options)

    options:
      selector  : 监听点击事件的元素选择器，默认就是a
      container : 内容插入的元素的选择器
      contentReg: 获取内容的正则
      titleReg  : 获取标题的正则
      callback  : 内容替换后的回调
  */
    //必须支持pushstate
    var support =
      window.history && window.history.pushState && window.history.replaceState &&
      !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)

    $.fn.ajaxLoadPage = function(opts) {
      var context = this

      if (!support) {
        return this
      }

      return this.on('click', opts.selector || 'a', function(event) {
        if (!opts.container) {
          opts.container = context
        }

        var link = event.currentTarget

        if (location.protocol !== link.protocol || location.hostname !== link.hostname) {
          return
        }

        event.preventDefault()

        var url = link.href

        var defaultJump = function() {
          location.href = url
        }

        $.ajax({
          url: url,
          error: defaultJump,
          success: function(data) {
            try {
              var body = data.match(opts.contentReg || /<body>[\n\r\s]+([\s\S]+)<\/body>/i)[1]
              var title = data.match(opts.titleReg || /<title>([\s\S]+)<\/title>[\n\r\s]+/i)[1]

              $(opts.container).html(body)
              document.title = title
              history.pushState({}, title, url)

              opts.callback && opts.callback()
            } catch (e) {
              //出错直接跳转
              defaultJump()
            }
          }
        })
      })
    }
  })(jQuery)

  //调用刚才写的插件
  $('body').ajaxLoadPage({
    callback: function() {
      window.DUOSHUO && window.DUOSHUO.init()
    }
  })
})
```

同时还需要改造一下`loadJs`函数，让它拥有缓存功能，这样就不必每次更新页面的时候重新加载资源

```
(function(exports) {
  var cache = {}

  function loadJs(src, callback) {
    if (!cache[src]) {
      cache[src] = {
        state: 'init',
        queue: []
      }
    }

    if (cache[src].state == 'ready') {
      callback()
    } else {
      cache[src].queue.push(callback)
    }

    var doc = document;
    var head = doc.getElementsByTagName('head')[0];
    var s = doc.createElement('script');
    var re = /^(?:loaded|complete|undefined)$/;

    s.onreadystatechange =
      s.onload =
      s.onerror = function() {
        if (re.test(s.readyState)) {
          cache[src].state = 'ready'

          var queue = cache[src].queue
          for (var i = queue.length - 1; i >= 0; i--) {
            queue[i]()
            queue.pop()
          }

          s.onload = s.onerror = s.onreadystatechange = null
          s = null
        }
      }

    s.src = src
    s.async = true

    head.insertBefore(s, head.firstChild)
  }

  exports.loadJs = loadJs
})(this)
```


## 问题列表

### 有js会不正常执行　
多说的脚本好像是只初始化一次，内部可能有某些检查，没有细看它的代码，可以通过传入`callback`来解决，如上面的代码

```
  //调用刚才写的插件
  $('body').ajaxLoadPage({
    callback: function() {
      window.DUOSHUO && window.DUOSHUO.init()
    }
  })
```

[blog]: http://jser.me
[我]: http://weibo.com/ihubo
