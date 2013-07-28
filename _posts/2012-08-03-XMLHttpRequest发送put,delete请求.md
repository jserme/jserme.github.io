---
layout : post 
title : XMLHttpRequest发送put,delete请求
tags : javascript
---

记得之前有同事问过，能不能用js实现http的put和delete请求。最近看了点REST相关的东西，对HTTP协议的构造也有一些新的认识，原来很多请求已经背离了最早设计HTTP协议的初衷，get/post/put/delete分别对应着查/改/增/删，这很像数据库里的select/ update/insert/delete,感觉HTTP协议当初设计的时候是参考了数据库的操作（RFC最初于1969年制定，但是包含http 1.1的规范 RFC 2616于1996年才制定的，关系数据库是1970年提出的理论，具体是个神马关系，不太好说），我们几乎所有的操作都是get和post，put和delete用得非常少，可能与form目前只能使用get和post有关，html5规范中据说有想[实现form](http://www.w3.org/TR/html5/association-of-controls-and-forms.html#attr-fs-method)的put和delete,但是最后放弃了，不知何故。

先放几个与REST相关的链接，有些我还没有消化透：

* http://www.w3.org/QA/2008/10/understanding-http-put.html
* http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
* http://www.cnblogs.com/hyddd/archive/2009/03/31/1426026.html
* http://hi.baidu.com/msingle/blog/item/410517229971d1b54623e805.html
* http://q.sohu.com/forum/5/topic/3464168
那么到底能不能用js实现put和delete呢？

大家都知道XMLHttpRequest对象的open方法第一个参数就是method,有多少人用过除了"GET"和"POST"之外的参数呢？试验了一个，发现了好玩的，哈哈，例子猛击[这里](/demos/1343967804284_httpmethod_test.html "点开看看呗")，请在不同的浏览器中测试，服务器返回的是请求的method。


在IE6，7，8下，自己乱定义的method jser.me光荣牺牲，报错了，但是put,delete都很正常，并且请求过一次的post，居然也成get了，

在FF,chrome下不仅put,delete很正常，jser.me这个自定义的方法也给力的完成了

小试验证明put和delete是完全可以用XMLHttpRequest来实现的~~~

PS:在本机(apache)测试的时候jser.me是很完美的完成了，在服务器上到nginx时被拦了，看配置也没找到哪出问题了，囧
