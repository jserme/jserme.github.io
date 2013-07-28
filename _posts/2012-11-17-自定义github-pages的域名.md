---
layout : default 
title : 自定义github pages的域名
tags : github 
---

##什么是github pages
[github pages](http://pages.github.com/)是[github]提供的免费的存放网页的服务，有了它，你就可以轻松使用静态网页构建一个网站，并且如果你有自己的域名，它可以绑定域名。

##为什么要设置域名
域名可以说是一个网站的名片，设置域名有利于品牌统一，彰显网站的专业。

##一、在gh-pages分支里建立CNAME文件
创建gh-pages分支就不介绍了，你可以使用github自带的[自动化生成器来生成](https://help.github.com/articles/creating-pages-with-the-automatic-generator),也可以手动创建一个分支gh-pages，然后推到[github].

为了绑定域名，首先我们在gh-pages这个分支的根目录新建一个CNAME文件，文件内容为你要设置的域名，然后将此文件添加到git中，最后推送到[github]上去，推送之后大概需要10分钟才能生效

```javascript
cat expressjs.jser.us > CNAME
git add .
git commit -a -m "add CNAME file"
git push origin gh-pages 
```

##二、得到你在github上的二级域名的ip
这里我们使用一个简单的命令得到我们的二级域名对应的ip，例如我的二级域名是jserme.github.com
![20121117180447.png](/images/1353148911110_20121117180447.png)

这里可以看到ip是204.232.175.78

##三、设置你的域名dns指向刚才得到的ip
然后我们在域名控制的地方添加一个A纪录，我的域名基本上都是在godaddy上买的，godaddy上默认的dns经常被墙，所以我把dns换成了国内靠谱的[dnspod.cn](http://dnspod.cn)。如下设置
![20121117181954.png](/images/1353149138934_20121117181954.png)

正常情况下，几分钟就可以访问了，例如你现在可以访问[expressjs的中文站点](http://expressjs.jser.us)。



[github]:https://github.com
