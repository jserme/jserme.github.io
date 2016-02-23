#需要安装 cssmin  npm install -g cssmin
cat cube-min-v1.3.1.css syntax.css app.css | cssmin > app-min.css
