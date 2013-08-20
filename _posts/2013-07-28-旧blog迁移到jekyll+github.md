---
layout : post
tltle : 旧blog迁移到jekyll+github
tags : github 
---


##详细说说为什么
如你所见，如果你之前看过我的[Blog](http://jser.me/2012/08/03/%E4%B8%80%E4%B8%AA%E5%85%A8%E6%96%B0%E7%9A%84Blog.html)应该，能感觉到这个Blog又改变了。

看看[首页](http://jser.me)，2013年已经过去了大半了，加上这篇这一年才写了四篇，实在汗颜，不写东西其实是意味着没有总结，这大半年，基本没太大进步 :( 。

为什么一直不想写东西呢，一个重要的原因是被“过去”束缚了，当我打开老的blog，想写东西时，总是忍不住的想改代码，加功能，想改数据库的结构，改界面，搞响应式，加webfont，细想一下，blog本身应该是内容优先，这么做，本末倒置。

趁着这个周末,决定再折腾一把，以后就只写内容，不再处理数据库之类的东西了！

##确立目标
这有点像一个小项目，先确立目标

* 主题基本不变 
    * 当时改这个主题的时候，花了不少时间，不能浪费
* 老的文章的链接支持
    * 放出去的链接多是老的链接，这个需要有一种可以兼容的方式 
* 忽略老评论
    * 是的，你没看错，因为老评论确实也没多少，直接忽略吧
* 使用社会化评论组件 
    * 不需要注册不需要登录，更大化的从社交网站引流
* 保证文章的图片正确 
    * 老的blog系统使用的是静态资源和系统分离的方式，老系统图片全部在s.jser.me下，需要解决
* rss正常输出
    * 纵然google reader已经去了，rss仍然是我最喜爱的一种传递知识的方式
* 标签的使用
    * 老blog一直是有存储标签数据，只是没有正常展示，这次需要把这个问题解决一下
* 独立域名
    * 支持独立域名

##为什么是jekyll + github
用git像管理代码一样管理文章是不是很酷？github是能在网上实现这个的一个最好的选择，它支持gh-pages，不限流量，没有比githu更好的服务了。jekyll是github默认支持的，同时使用非常广泛，这保证了在出问题时能最快的google到答案，它有完整的文档和诸多插件，所以就是它们了！jekyll + github!

##安装jekyll

```bash
sudo gem install jekyll
jekyll new blog
cd blog
jekyll serve -w
```
如上码，`new blog`之后会自动在blog里建立相应的文件和文件夹，`serve -w`加了w参数jekyll监视文件变化，自动生成新的文件。

##导出旧的blog数据
jekyll默认的文章文件格式是`年-月-日-title.md`，写一个nodejs的脚本，把mongodb里存的数据全部搞出来，然后生成文件就行了。
文章的开头需要指明一些文章的数据，这些也一并生成。

```yaml
---
layout : post
title : 这里写标题
tags : 这里写tag 可以空格 分隔
---

```

##修正文章中图片链接
在blog目录新建一个images目录，把以前由程序上传的图片全部放在这个目录下，然后用sed替换掉文章里的图片链接。
mac下的sed，试了多次，一直提示`invaid command code .`，加上e参数就行了，暂不清楚为什么要加e参数，全部替换后，会生成备份文件mde，删除

```bash
sed -ie "s/http:\/\/s.jser.me//g" `grep "http://s.jser.me" -rl *`
rm *.mde
```

##标签的生成
jekyll还是数据组织还是相当不错的，可以通过下面的方式获取所有的标签及它们的数量，在需要展示的地方放上这段，这里用到了[Liquid](https://github.com/Shopify/liquid)的一个标准[过滤器](https://github.com/shopify/liquid/wiki/liquid-for-designers#standard-filters)。

```html
{% raw %}
{% for tag in site.tags %}
<a class="tag" href="/tag.html#{{tag[0]}}">{{tag[0]}}<span class="tagcount">{{tag[1] | size}}</span></a>
{% endfor %}
{% endraw %}
```

##获取相关日志
相关日志jekyll默认就支持，可以通过site.related_posts来获取，默认情况下，这个并不会太精确，如果需要很精确的相关，需要开启`_config.yml`里的选项`lsi:true`。

```html
{% raw %}
{% for post in site.related_posts limit:5 %}
    <div class="article">
        <span class="datetime">{{ post.date | date:"%Y-%m-%d"}}</span>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </div>
{% endfor %}
{% endraw %}
```

##搜索引擎的怎么办
我打算不直接处理搜索引擎，因为jekyll的方式其实就是静态文件的方式，我们无法设置301，所以引导搜索引擎的工作就算我想做也做不到。

但是对于通过以前的链接跳转过来的，可以通过github的自定义404的功能，引导他们到新链接上，比如对于`http://jser.me/p/18795`，我可以保存一个`18795`这样的老的id和新的链接一一对应的数据，然后在404页面引导用户到正确的链接上，比如你可以[访问一下](http://jser.me/p/26d61)。

##按年份输出列表
这是一种我喜欢的方式，有点像归档，可以用下面的代码搞定

```html
{% raw %}
{% for post in site.posts %}
   {% unless post.next %}
     <h1>{{ post.date | date: '%Y' }}</h1>
   {% else %}
     {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
     {% capture nyear %}{{ post.next.date | date: '%Y' }}{% endcapture %}
     {% if year != nyear %}
       <h1>{{ post.date | date: '%Y' }}</h1>
     {% endif %}
   {% endunless %}
   <div class="article">
       <span class="datetime">{{ post.date | date:"%m-%d" }} </span>
       <a href="{{ post.url }}">{{ post.title }}</a>
   </div>
{% endfor %}
{% endraw %}
```

##RSS生成
jekyll会把除了_下目录下的东西都尝试编译一下，所以我们在根目录下放一个符合格式rss.xml，它就会被编译成正确的带有完整数据的rss.xml

```html
{% raw %}
---
layout : nil
---

<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
<channel>
<title>{{site.name |append:' ' xml_escape}}</title>
<image>
    <link>http://jser.me</link>
    <url>http://jser.me/images/logo.png</url>
</image>
<link>http://jser.me</link>
<description/>
<language>zh-cn</language>
<generator>http://jser.me</generator>
<ttl>5</ttl>
<copyright><![CDATA[Copyright &copy; jser.me]]></copyright>
{% for post in site.posts limit: 20 %}
     <item>
         <title>{{ post.title | append:' ' xml_escape }}</title>
         <link>{{ site.url }}{{ post.url }}</link>
         <guid>{{ site.url }}{{ post.id }}</guid>
         <pubDate>{{ post.date | date_to_rfc822 }}</pubDate>
         <author><![CDATA[草依山]]></author>
         <description><![CDATA[{{ post.content | expand_urls: site.url }}]]></description>
     </item>
{% endfor %}
</channel>
</rss>
{% endraw %}
```

##挑选一个社会化评论组件
暂时没有考虑使用discus, [多说](http://duoshuo.com)由于它简洁易用，成功的被我选上了。

##写作时的注意事项
* 语法高亮支持请在`_config.yml`里设置`pygments:true`, 默认情况下它是true
* 可能不知道某些语言高亮的时候应该表示为什么，可以在[这里](http://pygments.org/demo/)查看，比如yml的是yaml
* 如果想输出liquid的东西，需要把它包裹在raw里
* 标题里如果含有:，可以把整个标题用单引号或者它的html实体表示
* 如果想写草稿，创建一个_drafts目录，然后在里面写，启动的时候加个参数`jekyll serve -w --drafts`


##github上的设置
创建仓库，<username>.github.io, 建立一个这样的仓库，可以在master上提交一个jekyll的站点后，github自动帮你生成所有的静态文件。

在本地的blog目录添加一下远程仓库，然后创建一个域名文件CNAME，里面包含你的域名，提交上去，域名绑定我之前[写过](http://jser.me/2012/11/17/%E8%87%AA%E5%AE%9A%E4%B9%89github-pages%E7%9A%84%E5%9F%9F%E5%90%8D.html)。

```bash
cd blog
git init  .
git remote add origin git@github.com:<username>/<username>.github.io.git
cat 'jser.me' > CNMAE
git -am init
git push origin master
```

##总结
一开始的目标完成的怎么样呢

* 主题基本不变             ----- ok
* 老的文章的链接支持       ----- ok
* 忽略老评论               ----- ok
* 使用社会化评论组件       ----- ok
* 保证文章的图片正确       ----- ok 
* rss正常输出              ----- ok
* 标签的使用               ----- ok
* 独立域名                 ----- ok

非常赞，预定目标都完成了。总的来看jekyll足够灵活，基本上满足了我的所有需求，这也算是一次成功的折腾了吧，[源代码在这里](https://github.com/jserme/jserme.github.io)。小伙伴们，一起专注于blog的内容，期待更多内容吧～
