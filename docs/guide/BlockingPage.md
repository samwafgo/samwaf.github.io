# 自定义拦截响应界面
 
## 1 自定义拦截响应界面
自定义拦截响应界面
### 1.1 自定义拦截界面

![自定义拦截界面](/images/blocking_page.png)
 
- 自定义拦截模板页面名称 供自己识别
- 网站 正常选择全局网站即可,当然如果每个网站的返回要特殊处理，那么就选择特定的网站。
- 响应代码 ，默认403，可以依据实际情况进行编辑
- 响应内容 ，给访客返回的内容信息。支持变量：
```
访问ID码：
[[.SAMWAF_REQ_UUID]]

```
- 响应Header头信息

  | 键名            | 描述                                                                                         | 例子值                                    |
  |-------------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------|
  | `Content-Type`    | 表示返回内容的类型。                                                                                  | `text/html; charset=UTF-8`  ， `text/json; charset=UTF-8`                        |


  

 ### 1.2 HTML 示例
 
 如果是正常HTML，可以将Content-Type 设置成：text/html; charset=UTF-8 
 ```
 <!DOCTYPE html>
 <html lang="zh-CN">
 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>您的访问被阻止</title>
     <style>
         /* 基本样式 */
         body {
             font-family: 'Arial', sans-serif;
             background-color: #f4f7fa;
             margin: 0;
             padding: 0;
             display: flex;
             justify-content: center;
             align-items: center;
             height: 100vh;
             color: #333;
         }
 
         /* 页面内容的容器 */
         .container {
             background-color: #ffffff;
             border-radius: 8px;
             padding: 40px;
             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
             text-align: center;
             max-width: 600px;
             width: 100%;
         }
 
         /* 标题样式 */
         h1 {
             font-size: 2.5em;
             color: #d9534f;
             margin: 0;
         }
 
         /* 访问识别码样式 */
         h3 {
             font-size: 1.5em;
             color: #5bc0de;
             margin: 20px 0;
         }
 
         /* 提示文字 */
         .message {
             font-size: 1.1em;
             color: #999;
             margin-bottom: 30px;
         }
 
         /* 返回首页按钮样式 */
         .back-btn {
             background-color: #5cb85c;
             color: white;
             border: none;
             padding: 10px 20px;
             border-radius: 5px;
             text-decoration: none;
             font-size: 1.1em;
         }
 
         .back-btn:hover {
             background-color: #4cae4c;
         }
 
         .back-btn:active {
             background-color: #398439;
         }
 
         /* 响应式设计 */
         @media (max-width: 768px) {
             .container {
                 padding: 30px;
             }
 
             h1 {
                 font-size: 2em;
             }
 
             h3 {
                 font-size: 1.3em;
             }
 
             .message {
                 font-size: 1em;
             }
         }
     </style>
 </head>
 <body>
     <div class="container">
         <h1>您的访问被阻止</h1>
         <p class="message">由于安全策略，您的请求被阻止。<br>如果有疑问，请将下面的访问识别码发给管理员，以便进一步排查。</p>
         <h3>访问识别码：[[.SAMWAF_REQ_UUID]]</h3>
     </div>
 </body>
 </html>
 ```
 
 
### 1.3 JSON 示例
 
 如果是纯API接口也想用JSON，可以将Content-Type 设置成：text/json; charset=UTF-8 
 ```
 {"samwaf_req_uuid":"[[.SAMWAF_REQ_UUID]]","msg":"访问被拦截"} 
 ```