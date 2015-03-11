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
  (function($) {
    //必须支持pushstate
    var support =
      window.history && window.history.pushState && window.history.replaceState &&
      !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)

    var cache = {}
    var request = function(url, callback, isCache) {
      var defaultJump = function() {
        location.href = url
      }

      var success = function(data) {
        try {
          if (isCache) {
            cache[url] = data
          }
          callback && callback(data)
        } catch (e) {
          defaultJump()
        }
      }

      if (isCache) {
        cache[url] && success(cache[url])
      }

      $.ajax({
        url: url,
        error: defaultJump,
        success: success
      })
    }

    var getContent = function(data, opts) {
      var body = data.match(opts.contentReg || /<body>[\s\r\n]+([\s\S]+)<\/body>/i)[1]
      var title = data.match(opts.titleReg || /<title>([\s\S]+)<\/title>[\s\r\n]+/i)[1]

      return {
        body: body,
        title: title
      }
    }

    var setContent = function(content, opts) {
      $(opts.container).html(content.body)
      document.title = content.title
    }

    var pushState = function(state) {
      history.pushState(state, state.title, state.url)
    }

    $.fn.ajaxLoadPage = function(opts) {
      if (!support) {
        return this
      }

      if (!opts.container) {
        opts.container = this
      }

      window.onpopstate = function(event) {
        var state = event.state
        if (!state) {
          return
        }
        request(state.url, function(data) {
          var content = getContent(data, opts)
          setContent(content, opts)
          opts.callback && opts.callback()
        }, opts.cache)
      }

      //first init, replace current state
      history.replaceState({
        url: location.href,
        title: document.title
      }, document.title)

      return this.on('click', opts.selector || 'a', function(event) {
        var link = event.currentTarget

        if (location.protocol !== link.protocol || location.hostname !== link.hostname) {
          return
        }

        event.preventDefault()

        var url = link.href
        request(url, function(data) {
          var content = getContent(data, opts)
          setContent(content, opts)
          pushState({
            url: url,
            title: content.title
          })
          opts.callback && opts.callback()
        }, opts.cache)
      })
    }
  })(jQuery)

  $('body').ajaxLoadPage({
    cache: true,
    callback: function() {
      window.DUOSHUO && window.DUOSHUO.init()
    }
  })
})
```
上面的代码其实是第四版，[第一版的代码](https://github.com/jserme/jserme.github.io/blob/c008c54b61268835eeadb485f5cad719887f6d50/_layouts/default.html#L83)在popstate的时候直接用的是链接跳转时的回调，在浏览器前进后退的时候会有bug，[第二版的代码](https://github.com/jserme/jserme.github.io/commit/a77ed74c6dd9d98ed4ea0a5d12b37d05341e0aa2)修复了这个bug，[第三版的代码](https://github.com/jserme/jserme.github.io/commit/8bf8b06d8b4567a83cd8dd9dd9d37739258cb3e4)加了ajax的内存cache，[blog]是部署在github上，有时候会有点慢，尽量利用上一次请求的结果，至于localStorage的缓存，暂时不考虑了，这个还需要缓存的时间及更新问题，没必要搞那么复杂，[第四版的代码](https://github.com/jserme/jserme.github.io/commit/0d52898772ebadda125ab77cc177d81459f7fa68)第一次打开再后退没有state的bug。

同时还需要改造一下`loadJs`函数，让它拥有缓存功能，这样就不必每次更新页面的时候重新加载资源

```javascript
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

```javascript
  //调用刚才写的插件
  $('body').ajaxLoadPage({
    callback: function() {
      window.DUOSHUO && window.DUOSHUO.init()
    }
  })
```
[blog]: http://jser.me
[我]: http://weibo.com/ihubo
