# Development Manual  

## Development Environment  

### Backend  
- Go version: 1.22.9  

### Frontend  
- Node version: 18.20.4  

## Quick Start  

1. **Clone the backend code**  
   ```bash
   git clone https://github.com/samwafgo/SamWaf
   ```  

2. **Download the precompiled frontend version**  
   (A detailed guide for separate compilation is provided later.)  
   [https://github.com/samwafgo/SamWafWeb/releases/latest/download/dist.zip](https://github.com/samwafgo/SamWafWeb/releases/latest/download/dist.zip)  

   After downloading, extract it into the backend directory:  
   ```bash
   SamWaf/public/dist
   ```  

   Directory structure:  
   ```plaintext
   ├─public
   │  └─dist  // Extract the precompiled frontend content here
   │      └─assets
   │      └─index.html
   │      └─favicon.ico
   │      └─robots.txt
   ```  

3. **Start the backend**  
   Slightly modify the code in `global/global.go` (to conveniently use the precompiled frontend):  
   ```go
    GWAF_RELEASE              string    = "true"
   ```  

   Entry point to start the code:  
   `main.go`  

   Then access: [http://127.0.0.1:26666/](http://127.0.0.1:26666/)  

## Development and Debugging  

### Backend  
Ensure `global/global.go`:  
```go
 GWAF_RELEASE              string    = "false"
```  
Start: `main.go`  

### Frontend  

1. **Clone the frontend code**  
   ```bash
   git clone https://github.com/samwafgo/SamWafWeb
   ```  

2. **Install dependencies (for the first time)**  
   ```bash
   npm install
   ```  

3. **Start the frontend**  
   ```bash
   npm run dev
   ```  

At this point, both the backend and frontend development codes are running, allowing collaborative debugging.  