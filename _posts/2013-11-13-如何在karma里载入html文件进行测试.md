---
layout : post 
title : 如何在karma里载入html文件进行测试
tags :  测试 karma 
---

因为要测试代码在iframe里的运行情况，必须载入一个html文件，然后判断该文件里的js执行情况，在karma里无法直接载入一个html文件，同时由于路径的变更，测试同样跑不过，下面是详述原因和解决办法

## 需要测试的场景

当前工程的目录结构如下

```
.
├── Gruntfile.js
├── karma.conf.js
├── package.json
├── src
│   ├── source.js
├── test
│   ├── iframes
│   │   ├── hello.html
│   ├── lib
│   ├── mainSpec.js
│   └── runner.html

```

在mainSpec.js里写入一个iframe到当前`document`下，路径为`iframes/hello.html`,
`hello.html`里会引入`souce.js`，然后进行一些操作，`mainSpec.js`
再对写入iframe进行检测，判断执行结果


## 问题

有两个问题需要解决

* karma会把html文件当作js载入，也就是它会使用一个script标签把文件载入 
* karma对于html文件使用html-js预处理，页面中输出的是一个hello.html.js

在karma.conf.js里配置一下files对象解决问题1, served默认是true,也可以不加的，详细可以[官方文档](http://karma-runner.github.io/0.10/config/files.html)

```
   files: [
                'test/lib/**/*.js',
                'src/source.js',
                'test/mainSpec.js',
                { pattern: 'test/iframes/*', included: false, served: true }
   ]

```

在karma.conf.js里覆盖掉默认的html-js预处理

```
    preprocessors: {
        'test/iframes/*': ['']
    }
```


## 路径的问题

看样子是正常了，运行一下`karma run`，还是报错，我们写入的路径是`./iframes/hello.html`，
这是由于karma默认的执行路径是`http://localhost:9876/debug.html`，写入的路径会变成`http://localhost:9876/iframes/hello.html`，而karma会把当前目录放在`/base/`下([这里介绍过](/2013/08/21/karma%E4%B8%8B%E6%B5%8B%E8%AF%95%E5%BC%82%E6%AD%A5%E8%BD%BD%E5%85%A5%E7%9A%84js%E6%96%87%E4%BB%B6.html))，很明显会404。

可以很直接的把写入的路径变成`/base/test/iframes/hello.html`，但是这样，这个测试就严重依赖karma了，你可能注意到test目录下还有一个runner.html，这个文件我们可以手工运行，如果写成了前面的这个路径，手工运行就完全不行。为了保证runner.html的正常工作,我们必须使用相对路径。

改造一下mainSpec.js，区别对待karma环境和普通环境中载入的iframe的路径

```javascript
function getPath(path) {
       if (window.__karma__) {
           return path.replace(/\.\//, '/base/test/')
       } else {
           return path
       }
}

//写入文件的时候
...
iframe.src = getPath('./iframes/hello.html')
...

```

这样之后我们的代码就可以正常的在karma和普通环境中跑测试了。
