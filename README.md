# 微信小程序聊天机器人

这是一个微信小程序聊天机器人，使用 OpenRouter 的 DeepSeek 模型，并通过自定义后端服务器运行。它支持普通问答，并对政治问题进行过滤，返回预设回复。

## 功能
- **聊天界面**: 支持实时发送消息并接收回复。
- **DeepSeek 集成**: 使用 OpenRouter 的 `deepseek/deepseek-chat:free` 模型。
- **政治过滤**: 检测政治问题（如“习近平是谁”、“白纸运动是什么”），回复“你好，这个问题我暂时无法回答，让我们换个话题再聊聊吧。”
- **R1 推理**: 可选的详细推理模式。
- **网络搜索**: 可选的搜索插件，提供增强回答。

## 项目结构
```
wechat-miniprogram/
├── pages/
│   ├── index/
│   │   ├── index.wxml    # 界面结构
│   │   ├── index.wxss    # 样式
│   │   ├── index.js      # 逻辑
│   │   └── index.json    # 页面配置
├── app.js                # 应用逻辑
├── app.json              # 应用配置
├── app.wxss              # 全局样式
└── server/               # 后端服务器代码
    └── server.js         # Express 服务器
```

## 环境要求
- **微信开发者工具**: 版本 1.06.2412050 或更高。
- **Node.js**: 版本 18.x 或更高（用于后端）。
- **操作系统**: Ubuntu（后端服务器示例）或任何支持 Node.js 的系统。

## 体验
### 1. URL
        api.nineonepassword.online
### 2. test ssh 
    curl -X POST  https://api.nineonepassword.online/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"system","content":"You are a helper"}],"input":"Hi","r1":false,"search":false}'

## 安装与配置

### 1. 后端服务器
1. **克隆或创建项目目录**:
   ```bash
   mkdir wechat-backend
   cd wechat-backend
   ```

2. **安装依赖**:
   ```bash
   npm install express axios dotenv
   ```

3. **配置环境变量**:
   - 创建 `.env` 文件：
     ```bash
     nano .env
     ```
   - 添加以下内容（替换为你的实际密钥）：
     ```
     OPENROUTER_API_KEY=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
     PORT=6505
     ```

4. **运行服务器**:
   - 使用 PM2 持久化运行：
     ```bash
     npm install -g pm2
     pm2 start server.js --name "wechat-backend"
     pm2 save
     ```

5. **测试后端**:
   ```bash
   curl -X POST http://localhost:6505/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"system","content":"你是助手"}],"input":"你好","r1":false,"search":false}'
   ```

### 2. 微信小程序
1. **克隆或创建小程序项目**:
   - 将代码放入 `wechat-miniprogram/` 目录。

2. **配置 AppID**:
   - 在 `project.config.json` 中设置你的 AppID：
     ```json
     {
       "appid": "wx89a108563c3f329e",
       "setting": {
         "serverDomain": ["https://yourdomain.com"]
       }
     }
     ```

3. **安装微信开发者工具**:
   - 下载并安装最新版本：[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。

4. **打开项目**:
   - 在微信开发者工具中导入 `wechat-miniprogram/` 目录。

5. **配置后端 URL**:
   - 在 `pages/index/index.js` 的 `callAPI` 函数中更新 URL：
     ```javascript
     url: 'https://yourdomain.com/api/chat', // 替换为你的域名
     ```

## 使用方法
1. **本地测试**:
   - 在微信开发者工具中打开项目。
   - 启用“开发环境不校验请求域名”（设置 > 项目设置）。
   - 输入消息（如“你好”），查看回复。

2. **真机调试**:
   - 确保你的微信账号是小程序的开发者：
     - 登录 [微信公众平台](https://mp.weixin.qq.com/)。
     - 在“成员管理”中添加你的微信号。
   - 点击“真机调试”，用手机扫码测试。

3. **政治问题测试**:
   - 输入“习近平是谁”或“白纸运动是什么”。
   - 预期回复：“你好，这个问题我暂时无法回答，让我们换个话题再聊聊吧。”

## 部署
### 后端
1. **域名配置**:
   - 将域名（如 `yourdomain.com`）指向服务器公网 IP：
     - 获取公网 IP：
       ```bash
       curl http://169.254.169.254/latest/meta-data/public-ipv4
       ```
     - 在 DNS 提供商添加 A 记录：
       ```
       yourdomain.com    A    54.123.45.67    300
       ```

2. **安装 Nginx 和 HTTPS**:
   ```bash
   sudo apt install nginx certbot python3-certbot-nginx
   sudo nano /etc/nginx/sites-available/wechat-backend
   ```
   ```
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$host$request_uri;
   }
   server {
       listen 443 ssl;
       server_name yourdomain.com;
       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

       location /api/ {
           proxy_pass http://localhost:6505;
           proxy_set_header Host $host;
       }
   }
   ```
   ```bash
   sudo ln -s /etc/nginx/sites-available/wechat-backend /etc/nginx/sites-enabled/
   sudo certbot --nginx -d yourdomain.com
   sudo systemctl restart nginx
   ```

### 小程序
1. **提交审核**:
   - 在微信开发者工具中点击“上传”，提交代码。
   - 在微信公众平台完成审核流程。

## 注意事项
- **政治关键词**: 当前包括“政治”、“政府”、“习近平”、“白纸运动”等，可在 `server.js` 的 `politicalKeywords` 数组中调整。
- **安全性**: 生产环境中确保使用 HTTPS。
- **调试**: 真机调试需开发者权限，联系管理员添加你的微信号。

## 问题反馈
如遇问题，请提供：
- 服务器日志：
  ```bash
  tail -15 /home/admin/.pm2/logs/wechat-backend-error.log
  ```
- 小程序控制台输出。

---

### 下一步
- 将 `yourdomain.com` 替换为你的实际域名。
- 如果需要调整内容或添加更多说明，告诉我！

这份 `README.md` 涵盖了项目的安装、配置和使用，适合你的微信小程序聊天机器人项目。试着部署并测试吧！
