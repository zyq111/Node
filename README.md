# Node
### 根据文件的后缀名获取文件的类型
models/suffix.js
### 静态文件托管方法
static.js
### 类似express框架的路由方法
models/router.js
### 启动项目
1、安装依赖
```
npm install
```
2、数据库可以自己创建只需在 models/mongodb.js修改数据库名
3、 可以选择在全局安装supervisor
```
npm install -g supervisor
```
安装之后可以选择使用supervisor启动项目当文件更新后或自动进行重启不需要使用node xxx.js重启项目
```
supervisor app.js
```
4、在浏览器打开即可
