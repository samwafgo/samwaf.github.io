# Custom BlockIng Response Page  

## 1 Custom BlockIng Response Page  
### 1.1 Custom BlockIng Response Page  

![Custom BlockIng Response Page](/images/blocking_page.png)  

- **Custom BlockIng Response Page Name**: Used for identification.  
- **Website**: Normally, select the global website. However, if each website needs a specific response, choose the specific website.  
- **Response Code**: Default is 403, but you can edit it based on your requirements.  
- **Response Content**: The content that is returned to the visitor. Supports variables:  
  ```
  Visit ID:  
  [[.SAMWAF_REQ_UUID]]
  ```
- **Response Header Information**  

  | Key Name          | Description                                                                                         | Example Value                                      |
  |-------------------|-----------------------------------------------------------------------------------------------------|----------------------------------------------------|
  | `Content-Type`    | Specifies the type of the returned content.                                                         | `text/html; charset=UTF-8`, `text/json; charset=UTF-8`  |

### 1.2 HTML Example  

If you are using regular HTML, set the `Content-Type` to: `text/html; charset=UTF-8`.  
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Access is Blocked</title>
    <style>
        /* Basic Styles */
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

        /* Page Content Container */
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }

        /* Title Style */
        h1 {
            font-size: 2.5em;
            color: #d9534f;
            margin: 0;
        }

        /* Visit ID Style */
        h3 {
            font-size: 1.5em;
            color: #5bc0de;
            margin: 20px 0;
        }

        /* Message Style */
        .message {
            font-size: 1.1em;
            color: #999;
            margin-bottom: 30px;
        }

        /* Back to Home Button Style */
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

        /* Responsive Design */
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
        <h1>Your Access is Blocked</h1>
        <p class="message">Your request was blocked due to security policies.<br>If you have any questions, please send the visit ID below to the administrator for further investigation.</p>
        <h3>Visit ID: [[.SAMWAF_REQ_UUID]]</h3>
    </div>
</body>
</html>
```

### 1.3 JSON Example  

If you want to use JSON for API interfaces, set the `Content-Type` to: `text/json; charset=UTF-8`.  
```json
{"samwaf_req_uuid":"[[.SAMWAF_REQ_UUID]]","msg":"Access Blocked"}
```