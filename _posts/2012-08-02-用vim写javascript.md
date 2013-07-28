---
layout : post 
title : 用vim写javascript
tags : javascript vim
---

最早的时候我用Dreamweaver写js,或者说不叫写，叫拖放式编程 : ) ,再后来用了一段时间的editplus，发现editplus效率太低了，自动提示，自动完成太弱了，就改用aptana，速度不错，可是一打开一个包含很多文件的工程，卡得不行，这大概是eclipse的通病，最终，在[华大师](http://bluehua.org/)的感召下，转到了ubuntu，彻底用了vim,写点我的心得体会，方便后来人。

首先语法高亮，这个必须的。vim自带的那个javascript的文件太弱了，到[这里](http://www.vim.org/scripts/script.php?script_id=1491 "vim js syntax")下载，完了直接扔到vim的syntax目录下，然后，在vimrc文件里写上

```vim
let b:javascript_fold=1  "开启折叠
let javascript_enable_domhtmlcss=1　"启用对dom html css高亮支持
```
然后呢是语法检查，少写分号，会导致压缩脚本时出问题的，object的属性多写逗号会在IE下报错的，这些可能是手误导致的问题，需要有一个工具提醒我们，[下载它](http://www.javascriptlint.com/download.htm),接下来分别说一下windows下和linux下的配置。
linux:
下载源码包,解压

```bash
$ cd jsl
$ make -f Makefile.ref all
$ cd Linux_All_DBG.OBJ/
$ sudo cp jsl jscpucfg /usr/local/bin/
$ jsl -help:conf > ~/.jsl.conf　#生成配置文件一般我喜欢把它放到个人目录下
```
window:
下载window的包，解压，随便放一个目录，我放在d:\runtimes\jsl\下面，然后把这个路径加到系统PATH中，尽管网上很多说把它放到vim目录下，然后用$VIM去写路径比较好，可是如果你需要在命令行下别的地方用到它，把它加到系统PATH中去也挺划算的。

上面的步骤只是搞jsl的环境，下面才是VIM的配置，[下载它](http://www.vim.org/scripts/script.php?script_id=2578#0.1),然后扔到vim目录下的plugin中去。

linux下修改 vimrc文件（有同学反应不好使，已经改了）

```vim
let g:jslint_command = 'jsl'
let g:jslint_command_options = '-nofilelisting -nocontext -conf "/home/username/.jsl.conf" -nosummary -nologo -process'
map <F8> :call JsonLint()<cr>
```

window下修改 vimrc文件

```vim
map <F10> :call JavascriptLint()<cr>
```
这样你会发现保存js文件时会自动调用jslint，修改.jsl.conf文件中的一些选项让它更适应你的编程风格

最后来个自动补全吧，网上通常会把一个字典文件放在dict中，我比较常用的方法是打开当前文件时同时打开库文件，这样库里　函数都能补全，同时也很文件看库里函数的实现方式。其实想说的只是几个快捷键的使用，*ctrl + n* 和*ctrl + p*是最常用的，它在当前缓冲区、其它缓冲区，以及当前文件所包含的头文件中查找以光标前关键字开始的单词。

vim中其它的补全方式包括：

* 整行补全                      _CTRL-X CTRL-L_
* 根据当前文件里关键字补全        _CTRL-X CTRL-N_
* 根据字典补全                  _CTRL-X CTRL-K_
* 根据同义词字典补全            　_CTRL-X CTRL-T_
* 根据头文件内关键字补全          _CTRL-X CTRL-I_
* 根据标签补全                    _CTRL-X CTRL-]_
* 补全文件名                      _CTRL-X CTRL-F_
* 补全宏定义                      _CTRL-X CTRL-D_
* 补全vim命令                     _CTRL-X CTRL-V_
* 用户自定义补全方式              _CTRL-X CTRL-U_
* 拼写建议                        _CTRL-X CTRL-S_

例如，当我们按下*CTRL-X CTRL-F*时，vim就会弹出下拉菜单，显示出*当前目录下的可选目录和文件,这样，在输入文件名时方便多了。

参考资料：

1. http://easwy.com/blog/archives/advanced-vim-skills-auto-complete/
2. http://blogs.linux.ie/kenguest/2007/03/18/integrating-javascript-lint-with-vim/
3. http://www.gracecode.com/archives/2902/
