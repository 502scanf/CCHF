// WebSocket 服务器管理脚本
// 支持通过 HTTP 请求清除文档缓存

import { WebSocketServer } from 'y-websocket/bin/server.js';
import http from 'http';

let wsServer = null;
const WS_PORT = 1234;
const CONTROL_PORT = 1235;

// 启动 WebSocket 服务器
function startWebSocketServer() {
    if (wsServer) {
        console.log('关闭现有 WebSocket 服务器...');
        wsServer.close();
    }

    console.log(`启动 WebSocket 服务器，端口: ${WS_PORT}`);
    wsServer = new WebSocketServer({ port: WS_PORT });
    console.log('WebSocket 服务器已启动');

    return wsServer;
}

// 清除特定文档的缓存
function clearDocumentCache(docid) {
    if (!wsServer || !wsServer.docs) {
        console.log('WebSocket 服务器未启动或没有文档缓存');
        return false;
    }

    console.log(`========== 清除文档缓存: ${docid} ==========`);

    // y-websocket-server 将文档存储在 wsServer.docs Map 中
    if (wsServer.docs.has(docid)) {
        const doc = wsServer.docs.get(docid);
        console.log(`找到文档缓存，文档大小: ${doc.getArray ? doc.getArray().length : 'unknown'}`);

        // 删除文档缓存
        wsServer.docs.delete(docid);
        console.log(`文档缓存已删除: ${docid}`);

        // 断开所有连接到该文档的客户端
        if (wsServer.conns && wsServer.conns.has(docid)) {
            const connections = wsServer.conns.get(docid);
            console.log(`断开 ${connections.size} 个客户端连接`);
            connections.forEach(conn => {
                try {
                    conn.close();
                } catch (e) {
                    console.error('关闭连接失败:', e.message);
                }
            });
            wsServer.conns.delete(docid);
        }

        console.log(`========== 文档缓存清除完成: ${docid} ==========`);
        return true;
    } else {
        console.log(`文档缓存不存在: ${docid}`);
        return false;
    }
}

// 创建控制服务器（用于接收重启和清除缓存命令）
const controlServer = http.createServer((req, res) => {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/restart') {
        console.log('========== 收到重启请求 ==========');

        // 重启 WebSocket 服务器
        startWebSocketServer();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            message: 'WebSocket 服务器已重启',
            timestamp: new Date().toISOString()
        }));

        console.log('========== WebSocket 服务器重启完成 ==========');
    } else if (req.method === 'POST' && req.url === '/clear-cache') {
        // 清除特定文档的缓存
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { docid } = JSON.parse(body);

                if (!docid) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        message: '缺少 docid 参数'
                    }));
                    return;
                }

                console.log(`收到清除缓存请求: ${docid}`);
                const success = clearDocumentCache(docid);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success,
                    message: success ? `文档缓存已清除: ${docid}` : `文档缓存不存在: ${docid}`,
                    docid,
                    timestamp: new Date().toISOString()
                }));
            } catch (error) {
                console.error('处理清除缓存请求失败:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: '处理请求失败: ' + error.message
                }));
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

// 启动控制服务器
controlServer.listen(CONTROL_PORT, () => {
    console.log(`控制服务器已启动，端口: ${CONTROL_PORT}`);
    console.log(`POST http://localhost:${CONTROL_PORT}/restart - 重启 WebSocket 服务器`);
    console.log(`POST http://localhost:${CONTROL_PORT}/clear-cache - 清除文档缓存 (需要 JSON body: {"docid": "xxx"})`);
});

// 启动 WebSocket 服务器
startWebSocketServer();

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    if (wsServer) {
        wsServer.close();
    }
    controlServer.close();
    process.exit(0);
});
