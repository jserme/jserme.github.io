---
layout : post 
title : ubuntu下ibus安装极点五笔码表
tags : ibus  ubuntu  极点五笔
---

好像是上次更新到10.10的时候小企鹅坏了，从此就再也没有振作起来  :&lt;(，找错误也没搞清楚到底怎么回事，大概是因为我的系统是64位导致的，之后一直将就着用ibus,可是ibus的五笔是五笔86，用的那叫一个难受呀，由于这个原因，我写了很长一段时间的英文注释。。。。汗！

今天实在是忍受不了，终于找到一个极点五笔的码表，啊。。。生活一下美好了，中文了

http://forum.ubuntu.org.cn/viewtopic.php?t=262266

具体看上面的帖子

```bash
tar xvzf vissible-ibus.tar.gz

sudo cp vissible.db /usr/share/ibus-table/tables
sudo cp vissible.gif /usr/share/ibus-table/icons
```

运行之后，在系统--首选项--IBUS设置--输入法 里添加极点五笔
