# 开发手册
## 开发环境说明

### 后端
- go 版本为1.22.9
### 前端
- Node 版本为18.20.4

## 快速体验
- 1.拉取后台代码
```
git clone https://github.com/samwafgo/SamWaf
```
- 2.下载前端编译好的版本(单独编译教程在后面详细说明)

[https://github.com/samwafgo/SamWafWeb/releases/latest/download/dist.zip](https://github.com/samwafgo/SamWafWeb/releases/latest/download/dist.zip)

下载后释放到后台目录:

```
SamWaf/public/dist
```

目录结构如下：
```
├─public
│  └─dist  //把前端编译好的内容释放到里面
│      └─assets
│      └─index.html
│      └─favicon.ico
│      └─robots.txt
```
- 3.启动后台

稍加改动global/global.go的代码（为了方便直接用前端编译好的代码）
```
 GWAF_RELEASE              string    = "true"
```

启动代码入口:
main.go

随后访问：[http://127.0.0.1:26666/](http://127.0.0.1:26666/) 就可以了

## 开发调试
### 后端
确保global/global.go
```
 GWAF_RELEASE              string    = "false"
```
启动:main.go

### 前端

- 拉取前端代码
```
git clone https://github.com/samwafgo/SamWafWeb
```

- 安装依赖（首次）
```
npm install
```
- 启动前端
```
npm run dev
```

到此位置，后端和前端的开发代码就都启动了，可以进行协同调试了。

