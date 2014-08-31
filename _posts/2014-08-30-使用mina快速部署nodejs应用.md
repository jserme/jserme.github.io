---
layout: post
date: 2014-08-30 13:32:00 +0800
title: 使用mina快速部署nodejs应用
tags : nodejs
---

前面有一篇文章讲到过用[git的hook部署应用](http://jser.me/2013/12/29/%E5%88%A9%E7%94%A8git%E5%BF%AB%E9%80%9F%E9%83%A8%E7%BD%B2%E8%BF%9C%E7%A8%8B%E6%9C%8D%E5%8A%A1%E5%99%A8.html)，hook的方法有一个缺陷就是每次都要到服务器去修改一下hook对应的配置文件，这个配置文件是与当前仓库分离的，调试上会有一些麻烦，借助ruby的一个部署工具[mina](http://nadarei.co/mina/)可以快速的在服务器部署nodejs应用。

## 安装mina

```
gem install mina
```

安装之后，它需要一个配置文件，默认情况下是当前目录的`config/deploy.rb`

## 简单的配置

```
require 'mina/git'
require 'mina/bundler'

set :domain, 'your.server.com'
set :user, 'flipstack'
set :repository, 'flipstack'

task :deploy do
  deploy do
    # Preparations here
    invoke :'git:clone'
    invoke :'bundle:install'
  end
end

task :restart do
  queue 'sudo service restart apache'
end
```

## 运行

在正式的deploy之前一般需要准备一些目录，可以通过 `mina setup`来设置，默认情况下，它会在指定的服务器上创建下面的目录结构

```
.
├── releases 发布的版本
└── shared 这里可以放公用的文件，比如node_modules
```

运行`mina deploy`它会执行task deploy里指定的命令，比如上面的会进行：

1. 登录到服务器
1. git clone 到scm目录
1. 在tmp目录里创建一个build-xxxxx的目录，然后开始执行bundle install
1. 在releases里创建一个发布版本号目录，移动build-xxxxx里的内容进去
1. 软链接current到刚才的版本号目录

## nodejs应用的发布示例

```
require 'mina/git'

set :term_mode, nil
# 这里一个虚拟机的ip
set :domain, '192.168.56.101'
# 登录到机器的用户名
set :user, 'test' # Username in the server to SSH to.
# 发布的目录
set :deploy_to, '/home/test/doitnow'
# 发布的git仓库地址
set :repository, 'ssh://jser.me@192.168.56.1/Users/jser.me/works/doitnow'
# 发布的git分支
set :branch, 'master'

# 设置需要软链接的目录
# 软链接node_modules，可以防止每次npm install时花费的大量时间
set :shared_paths, ['log', 'tmp', 'node_modules']

# 这里使用forever来管理node进程，也推荐使用pm2
set :forever,"#{deploy_to}/shared/node_modules/forever/bin/forever"

# 初始化的时候创建目录，分配目录权限
task :setup do
  queue "mkdir -p #{deploy_to}/shared/log"
  queue "chmod g+rx,u+rwx #{deploy_to}/shared/log"

  queue "mkdir -p #{deploy_to}/shared/node_modules"
  queue "chmod g+rx,u+rwx #{deploy_to}/shared/node_modules"
end

desc "Deploys the current version to the server."
task :deploy do
  deploy do
    invoke :'git:clone'
    # 链接目录
    invoke :'deploy:link_shared_paths'
    # 安装模块
    # 静态资源的编译可以放到package.json里的{scripts:{install:'xxxxx'}}
    queue  "npm install"

    to :launch do
      # 重启应用
      queue "NODE_ENV=production #{forever} stopall"
      queue "NODE_ENV=production #{forever} start -a app.js"
    end
  end
end
```
