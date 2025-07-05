# 1. 基镜像：使用官方的 Node.js 22-lts-slim 版本
# slim 版本包含了基本的操作系统，足以安装您需要的依赖
FROM node:22-lts-slim

# 作者信息（可选）
LABEL maintainer="Gemini"

# 2. 安装系统依赖
# 更新 apt 包列表，然后安装 graphicsmagick 和 ghostscript
# --no-install-recommends 可以避免安装不必要的推荐包，减小镜像体积
# 最后清理 apt 缓存，这是 Dockerfile 的最佳实践
RUN apt-get update && \
    apt-get install -y --no-install-recommends graphicsmagick ghostscript libreoffice && \
    rm -rf /var/lib/apt/lists/*

# 3. 设置工作目录
# 在容器内创建一个 /app 目录，并将其设置为工作目录
WORKDIR /app

# 4. 复制 package.json 和 package-lock.json
# 利用 Docker 的层缓存机制，只有当这两个文件变化时，才会重新执行 npm install
COPY package*.json ./

# 5. 安装 NPM 依赖
# 使用 npm ci --only=production 可以确保根据 package-lock.json 安装，并且只安装生产环境依赖
# 这比 npm install 更快、更可靠，也使镜像更小
RUN npm ci --only=production

# 6. 复制所有项目文件
# 将当前目录下的所有文件复制到容器的 /app 目录中
COPY . .

# 7. 设置环境变量
# 声明 OPENAI_API_KEY 环境变量。
# 推荐在 `docker run` 命令中传入此变量，而不是在此处硬编码。
# 这里设置一个空值或占位符作为默认值。
ENV OPENAI_API_KEY=""
# 声明应用端口
ENV PORT=3001

# 8. 暴露端口
# 声明容器将监听的端口，与您 index.js 中的设置一致
EXPOSE 3001

# 9. 启动命令
# 定义容器启动时执行的命令
CMD [ "node", "index.js" ]
