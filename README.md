# AI-后端

这是一个基于 Node.js 和 Express 的密钥授权系统，通过爱发电订单号验证设备码并返回对应密钥。支持三种应用：蛊真人、宝可梦、腕上芙宁娜。

## 功能
- 用户输入 6 位不重复设备码、爱发电订单号和应用选择。
- 验证订单号有效性（通过爱发电 API）。
- 订单号一次使用后自动失效。
- 返回密钥并在页面显示。

## 技术栈
- **后端**: Node.js, Express
- **前端**: HTML, CSS, JavaScript
- **依赖**: `express`, `body-parser`, `node-fetch`, `pm2`
- **文件存储**: `keys.json`（设备码和密钥映射），`used_orders.json`（已用订单号）

## 安装

### 前提条件
- Node.js (>= 16.x)
- npm
- PM2（进程管理）

### 步骤
1. **克隆或创建项目目录**：
   ```bash
   mkdir key_website
   cd key_website
2. **安装 Node.js（若未安装** ：
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
3. **安装 PM2**：
4. ```bash
   sudo npm install -g pm2
6. 
体验:
api.nineonepassword.online


curl -X POST  https://api.nineonepassword.online/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"system","content":"You are a helper"}],"input":"Hi","r1":false,"search":false}'




  
