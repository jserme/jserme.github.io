---
layout : post 
title : Virtualbox 克隆虚拟机
tags : linux  Virtualbox
---

我目前的是在ubuntu下开发js,在虚拟机中测试，最近发现IE7也抽疯不少，IEtester不太靠谱，不能一次一次的装系统吧，克隆虚拟机更靠谱一点

Virtualbox图形界面中没有克隆这一项，但是它带的命令中有这个工具

```bash
VBoxManage clonehd          <uuid>|<filename> <outputfile>;
```
克隆一个硬盘（过程会非常长，硬盘越大，时间越长），克隆出来的文件会放在用户目录中的 .Virtulbox/HardDisks 下，然后新建一个虚拟机，使用这引新克隆出来的硬盘，大功告成。
