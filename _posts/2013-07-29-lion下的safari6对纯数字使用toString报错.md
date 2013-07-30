---
layout : post
title : 'lion下的safari6对纯数字使用toString报错, TypeError: Type error'
tags : javascript safari 
---

最近有同事反应在Mac OS 10.8也就是Lion上的safari有广告无法展现的问题，但是不是必现，只是偶尔发生,而之前也有同事反馈在ios上的safari广告有时候也无法展现。用Mac刷了会广告，确实有很大概率的出现问题，在ipad上看也是会有概率出现。

绑定本机hosts，打开开发者工具，一个劲的刷，再也不会出现，心中暗惊，怕哥了，躲起来了？关闭浏览器，重新打开，重现了Bug，擦，再打开开发者工具，又无法复现，难道这是一个会躲开发者的Bug?

但是代码已经定位到

```javascript
utils.encode = function(str) {
   return encodeURIComponent(str.toString());
}
```

最后通过删减，定位到

```javascript
  str.toString()
```

有点惊异，首先传的值不会是undefined和null，都是正常的字符串和数字，理论上调用toString是不应该出现问题的，但是它就是出了，所以还是得想解决办法，其实也挺简单的，换成字符串相加解决之，理论上字符串相加也是调用的toString，为什么它不会出现问题，这很神奇，小伙伴们相当不解，解决问题的代码如下：

```javascript
utils.encode = function(str) {
   return encodeURIComponent(str + '');
}
```

后来发现在Github上也已经有人提过[这个Bug](https://github.com/mleibman/SlickGrid/pull/472)

单独提出来的代码也无法复现这个Bug，附上[测试页面](/demos/2013-07-29-safari-number-tostring-error.html), 这个只是解决问题，真正的原因还没有弄清楚，哪位小伙伴若知详情，求分解。
