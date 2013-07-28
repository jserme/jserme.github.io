---
layout : default 
title : 介绍js-assessment
tags : javascript 单元测试
---

##js-assessment简介
[js-assessment](https://github.com/rmurphey/js-assessment)是一个帮助你通过写单元测试来学习js的小项目，这是一个非常有意思的东西，建议你花时间把这个做完，肯定受益匪浅。


##怎么玩
需要你的电脑上有nodejs环境

```javascript
git clone https://github.com/rmurphey/js-assessment.git
cd js-assessment
npm install 
node bin/serve
```
接着打开你的浏览器访问 http://localhost:4444

然后用你的编辑器到目录app下去编辑每个文件，刷新浏览器，使所有的测试用命都能通过。

如果你实在看不懂英文描述那些方法要求的实现结果，可以到tests目录下的app里看每个测试用例是怎么写的，可以学到不少东西，当然不要作弊啊

##学到的一些东西
* BDD方式开发程序挺有趣的
* 单纯针对语言特性的单元测试很简单
* 两个递归的小例子很好玩
* 写测试用例要覆盖全面，包括一些不常见的情况和边界情况
* mocha写测试用例很爽
* 好的实现方式也更容易测试，比如异步的时候使用promise模式



##答案
是题就会有答案，当然也只是参考答案，没有绝对答案的，[项目自带的](https://github.com/rmurphey/js-assessment-answers)、[小哥我做的](https://github.com/jserme/js-assessment/tree/master/app)

##总结
完成它和写这个文章相距的时间有点长，当时的有些感悟都忘记了。。。所以，以后还是想到了，直接就写，google reader要关闭了，多写了点文章吧。
