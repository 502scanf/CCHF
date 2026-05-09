//设置编辑器连接yjs
import React, { useEffect, useState, useRef, useCallback } from "react";
import * as Y from 'yjs'
import { SlateEditor } from "./SlateEditor.jsx";
import loading from '@assets/loading.svg'
import { WebsocketProvider } from 'y-websocket'
import { saveContentApi, getContentApi } from '@page/api/doc.js'

// Base64 <-> Uint8Array 工具函数
const base64ToUint8Array = (base64) => {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes
}

const uint8ArrayToBase64 = (uint8Array) => {
    let binary = ''
    for (let i = 0; i < uint8Array.length; i++) {
        binary += String.fromCharCode(uint8Array[i])
    }
    return btoa(binary)
}

// 自定义 Hook：监听 awareness 获取当前文档在线用户
export const useDocAwareness = (provider) => {
    const [onlineUsers, setOnlineUsers] = useState([])

    useEffect(() => {
        if (!provider) return

        const updateUsers = () => {
            const states = Array.from(provider.awareness.getStates().values())
            // 过滤掉没有 user 信息，并根据 name 去重
            const usersMap = new Map()
            states.forEach(state => {
                if (state.user && state.user.name) {
                    usersMap.set(state.user.name, state.user)
                }
            })
            setOnlineUsers(Array.from(usersMap.values()))
        }

        // 初始获取一次 + 监听变化
        updateUsers()
        provider.awareness.on('change', updateUsers)

        return () => {
            provider.awareness.off('change', updateUsers)
        }
    }, [provider])

    return onlineUsers
}

const SAVE_INTERVAL = 30000  // 30 秒自动保存

const CollaborativeEditor = ({ docId, editorId, onOnlineUsersChange, pendingImportContent, onImportContentInserted }) => {
    const [connected, setConnected] = useState(false)
    const [isDbLoaded, setIsDbLoaded] = useState(false)
    const [shareType, setShareType] = useState(null)
    const [provider, setProvider] = useState(null)
    const yDocRef = useRef(null)
    const initializingRef = useRef(false) // 防止重复初始化
    const url = import.meta.env.VITE_WS_URL

    // 保存函数
    const saveToDb = useCallback(async () => {
        if (!yDocRef.current) return
        try {
            const state = Y.encodeStateAsUpdate(yDocRef.current)
            const base64 = uint8ArrayToBase64(state)
            await saveContentApi(docId, base64, editorId)
        } catch (e) {
            console.error("自动保存失败:", e)
        }
    }, [docId, editorId])

    useEffect(() => {
        // 防止重复初始化（React StrictMode 会导致 useEffect 执行两次）
        if (initializingRef.current) {
            console.log('⚠️ 检测到重复初始化，跳过');
            return;
        }
        initializingRef.current = true;

        const yDoc = new Y.Doc();
        yDocRef.current = yDoc
        setIsDbLoaded(false)
        setConnected(false)

        console.log('========== 初始化文档编辑器 ==========');
        console.log('文档 ID:', docId);

        // 1. 先从 DB 加载已有内容
        getContentApi(docId).then(res => {
            console.log('步骤1: 从数据库加载内容');
            if (res.data) {
                console.log('数据库返回内容，Base64 长度:', res.data.length);
                const update = base64ToUint8Array(res.data)
                console.log('解码后字节数:', update.length);

                // 诊断：检查 Yjs 更新的内容
                console.log('========== Yjs 更新诊断 ==========');
                console.log('前 20 字节:', Array.from(update.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' '));

                // 创建一个临时文档来测试更新
                const testDoc = new Y.Doc();
                Y.applyUpdate(testDoc, update);
                const testShared = testDoc.get(docId, Y.XmlText);
                console.log('测试文档长度:', testShared.length);

                // 尝试读取节点内容
                if (testShared.length > 0) {
                    try {
                        // 获取第一个节点
                        const firstNode = testShared.get(0);
                        console.log('第一个节点类型:', firstNode ? firstNode.constructor.name : 'null');
                        console.log('第一个节点内容:', JSON.stringify(firstNode, null, 2));
                    } catch (e) {
                        console.log('无法读取节点:', e.message);
                    }
                }

                console.log('测试文档 toString():', testShared.toString());
                testDoc.destroy();
                console.log('========================================');

                Y.applyUpdate(yDoc, update)

                const sharedDoc = yDoc.get(docId, Y.XmlText);
                console.log('应用后 Yjs 文档长度:', sharedDoc.length);

                // 正确读取 Yjs 内容的方式 - 从 Y.XmlText 中提取文本
                try {
                    // Y.XmlText 存储的是 Slate 的富文本结构，不是纯文本
                    // 我们需要检查 Yjs 文档的内部结构
                    console.log('Yjs 文档内部结构:');
                    console.log('- sharedDoc.length:', sharedDoc.length);
                    console.log('- sharedDoc._length:', sharedDoc._length);

                    // 尝试获取第一个字符来验证内容存在
                    if (sharedDoc.length > 0) {
                        try {
                            const firstChar = sharedDoc.toString().charAt(0);
                            console.log('- 第一个字符:', firstChar || '(空字符)');
                            console.log('- toString() 长度:', sharedDoc.toString().length);

                            if (sharedDoc.toString().length > 0) {
                                console.log('- 内容预览:', sharedDoc.toString().substring(0, 200));
                            } else {
                                console.log('⚠️ toString() 返回空字符串，但 length > 0');
                                console.log('这是正常的 - Slate 内容存储为结构化数据，不是纯文本');
                            }
                        } catch (e) {
                            console.log('- 读取字符失败:', e.message);
                        }
                    } else {
                        console.log('- 文档为空（length = 0）');
                    }
                } catch (e) {
                    console.log('读取内容失败:', e.message);
                }
            } else {
                console.log('数据库返回空内容（新文档）');
            }
        }).catch((error) => {
            console.error('从数据库加载内容失败:', error);
        }).finally(() => {
            console.log('步骤2: 数据库加载完成');
            setIsDbLoaded(true)

            // 连接 WebSocket
            console.log('步骤3: 开始连接 WebSocket');

            // 2. 数据库加载完成后，再连接 WebSocket
            const yProvider = new WebsocketProvider(url, docId, yDoc)
            const sharedDoc = yDoc.get(docId, Y.XmlText)

            // 保存数据库加载的内容，用于检测 WebSocket 是否覆盖
            const dbContentLength = sharedDoc.length;
            const dbContentString = sharedDoc.toString();
            console.log('保存数据库内容作为基准:');
            console.log('- 长度:', dbContentLength);
            console.log('- 内容:', dbContentString.substring(0, 100));

            // 标记：WebSocket 是否已经完成首次同步
            let hasCompletedFirstSync = false;

            yProvider.on('sync', (isSynced) => {
                console.log('========== WebSocket 同步事件 ==========');
                console.log('同步状态:', isSynced);
                console.log('同步后文档长度:', sharedDoc.length);
                console.log('同步后内容:', sharedDoc.toString().substring(0, 100));
                console.log('是否首次同步:', !hasCompletedFirstSync);

                if (isSynced && !hasCompletedFirstSync) {
                    hasCompletedFirstSync = true;

                    const afterSyncLength = sharedDoc.length;
                    const afterSyncContent = sharedDoc.toString();
                    console.log('首次同步完成后文档长度:', afterSyncLength);
                    console.log('首次同步完成后内容:', afterSyncContent.substring(0, 100));

                    // 检查：数据库有内容，但 WebSocket 同步后内容不同或为空
                    const dbHadContent = dbContentLength > 0 && dbContentString.trim().length > 0;
                    const wsContentChanged = afterSyncContent !== dbContentString;
                    const wsContentIsEmpty = afterSyncLength === 0 || afterSyncContent.trim().length === 0;

                    console.log('内容检查:');
                    console.log('- 数据库有内容:', dbHadContent);
                    console.log('- WebSocket 内容改变:', wsContentChanged);
                    console.log('- WebSocket 内容为空:', wsContentIsEmpty);

                    if (dbHadContent && wsContentChanged && wsContentIsEmpty) {
                        console.error('⚠️ 警告：WebSocket 同步后文档被清空！');
                        console.error('数据库有内容，但 WebSocket 同步后内容为空');
                        console.log('🔧 解决方案：强制从数据库重新加载并推送到 WebSocket 服务器');

                        // 强制从数据库重新加载内容
                        getContentApi(docId).then(res => {
                            if (res.data) {
                                console.log('从数据库重新加载内容，Base64 长度:', res.data.length);
                                const update = base64ToUint8Array(res.data);

                                console.log('步骤1: 创建新的临时文档并应用数据库内容...');
                                // 创建一个新的临时文档来加载数据库内容
                                const tempDoc = new Y.Doc();
                                Y.applyUpdate(tempDoc, update);

                                console.log('步骤2: 用临时文档的状态替换当前文档...');
                                // 获取临时文档的完整状态
                                const newState = Y.encodeStateAsUpdate(tempDoc);

                                // 在一个事务中完成替换操作
                                yDoc.transact(() => {
                                    // 应用新状态（Yjs 会自动处理差异）
                                    Y.applyUpdate(yDoc, newState);
                                }, 'restore-from-db');

                                tempDoc.destroy();
                                console.log('重新应用后文档长度:', sharedDoc.length);
                                console.log('重新应用后内容:', sharedDoc.toString().substring(0, 100));

                                // WebSocket provider 会自动同步这个更新到服务器
                                console.log('✅ 内容已自动推送到 WebSocket 服务器');

                                // 现在可以设置 connected 状态了
                                setConnected(true);
                            } else {
                                console.warn('数据库返回空内容');
                                setConnected(true);
                            }
                        }).catch(error => {
                            console.error('从数据库重新加载失败:', error);
                            // 即使失败也设置 connected，让用户看到空白并可以手动刷新
                            setConnected(true);
                        });

                        return; // 不设置 connected 状态，等待重新加载完成
                    }
                }

                setConnected(isSynced);
            })

            setShareType(sharedDoc)
            setProvider(yProvider)

            // 设置 awareness 用户信息，让成员列表能显示本人
            yProvider.awareness.setLocalStateField('user', {
                name: editorId,
            })

            // 3. 定时保存
            const timer = setInterval(() => {
                const state = Y.encodeStateAsUpdate(yDoc)
                const base64 = uint8ArrayToBase64(state)
                saveContentApi(docId, base64, editorId).catch(() => { })
            }, SAVE_INTERVAL)

            // 4. 页面关闭 / 切换文档前保存
            const handleBeforeUnload = () => {
                const state = Y.encodeStateAsUpdate(yDoc)
                const base64 = uint8ArrayToBase64(state)
                // 使用 sendBeacon 保证页面关闭时也能发出请求
                // 通过 Vite 代理发送到后端，避免 CORS 问题
                navigator.sendBeacon(
                    '/api/docplace/saveContent',
                    new Blob([JSON.stringify({ docid: docId, content: base64, editorId })],
                        { type: 'application/json' })
                )
            }
            window.addEventListener('beforeunload', handleBeforeUnload)

            // 5. 监听断开 WebSocket 事件（版本恢复时使用）
            const handleDisconnectWebSocket = (event) => {
                if (event.detail.docid === docId) {
                    console.log('========== 收到断开 WebSocket 指令 ==========');
                    console.log('立即断开 WebSocket 连接，防止保存旧内容...');

                    // 立即断开 WebSocket 连接
                    if (yProvider) {
                        yProvider.disconnect();
                        console.log('WebSocket 已断开');
                    }

                    // 停止自动保存
                    if (timer) {
                        clearInterval(timer);
                        console.log('自动保存已停止');
                    }
                }
            };

            console.log('注册 disconnect-websocket 事件监听器，文档 ID:', docId);
            window.addEventListener('disconnect-websocket', handleDisconnectWebSocket);

            // 6. 监听强制重新加载文档事件
            const handleForceReload = async (event) => {
                console.log('收到 force-reload-document 事件:', event.detail);

                if (event.detail.docid === docId) {
                    console.log('========== 检测到版本恢复，强制从数据库重新加载文档 ==========');
                    console.log('当前文档 ID:', docId);

                    try {
                        // 1. 从数据库获取最新内容
                        console.log('步骤1: 从数据库获取恢复的内容...');
                        const res = await getContentApi(docId);

                        if (res.data) {
                            console.log('步骤2: 获取成功，Base64 内容长度:', res.data.length);

                            // 2. 直接用数据库的内容替换整个 Yjs 文档
                            console.log('步骤3: 解码并应用数据库内容...');
                            const update = base64ToUint8Array(res.data);

                            // 创建临时文档来加载数据库内容
                            console.log('步骤4: 创建临时文档并加载数据库内容...');
                            const tempDoc = new Y.Doc();
                            Y.applyUpdate(tempDoc, update);

                            // 获取临时文档的完整状态
                            console.log('步骤5: 获取临时文档的完整状态...');
                            const newState = Y.encodeStateAsUpdate(tempDoc);

                            // 在一个事务中完成替换操作
                            console.log('步骤6: 在事务中替换当前文档状态...');
                            yDoc.transact(() => {
                                Y.applyUpdate(yDoc, newState);
                            }, 'restore-version');

                            tempDoc.destroy();

                            const sharedDoc = yDoc.get(docId, Y.XmlText);
                            console.log('步骤7: 文档内容已更新，新长度:', sharedDoc.length);
                            console.log('步骤7.1: 更新后内容预览:', sharedDoc.toString().substring(0, 200));

                            // 强制保存到数据库
                            console.log('步骤8: 强制保存到数据库...');
                            const state = Y.encodeStateAsUpdate(yDoc);
                            const base64 = uint8ArrayToBase64(state);
                            await saveContentApi(docId, base64, editorId);

                            console.log('========== 文档恢复完成 ==========');
                        } else {
                            console.warn('数据库返回空内容');
                        }
                    } catch (error) {
                        console.error('========== 强制重新加载文档失败 ==========');
                        console.error('错误详情:', error);
                        console.error('错误堆栈:', error.stack);
                    }
                } else {
                    console.log('文档 ID 不匹配，忽略事件。事件 docid:', event.detail.docid, '当前 docid:', docId);
                }
            };

            console.log('注册 force-reload-document 事件监听器，文档 ID:', docId);
            window.addEventListener('force-reload-document', handleForceReload);

            // 清理函数
            yDoc._cleanupFn = () => {
                // 切换文档时保存一次
                const state = Y.encodeStateAsUpdate(yDoc)
                const base64 = uint8ArrayToBase64(state)
                saveContentApi(docId, base64, editorId).catch(() => { })

                clearInterval(timer)
                console.log('移除事件监听器');
                window.removeEventListener('beforeunload', handleBeforeUnload)
                window.removeEventListener('disconnect-websocket', handleDisconnectWebSocket)
                window.removeEventListener('force-reload-document', handleForceReload)
                yDoc?.destroy()
                yProvider?.off('sync', setConnected)
                yProvider?.destroy()
            };
        })

        return () => {
            initializingRef.current = false; // 重置标记
            if (yDoc._cleanupFn) {
                yDoc._cleanupFn();
            }
        }
    }, [docId, editorId])
    // 监听 awareness，把在线用户回传给父组件
    const onlineUsers = useDocAwareness(provider)

    useEffect(() => {
        if (onOnlineUsersChange) {
            onOnlineUsersChange(onlineUsers)
        }
    }, [onlineUsers, onOnlineUsersChange])

    // 版本恢复模式：provider 为 null 时也允许渲染
    if (!connected || !shareType || !provider || !isDbLoaded)
        return <img src={loading} alt={loading} className="loading" />

    return (
        <SlateEditor
            shareType={shareType}
            provider={provider}
            pendingImportContent={pendingImportContent}
            onImportContentInserted={onImportContentInserted}
        />
    )
}

export const HoleEditor = ({ docId, editorId, onOnlineUsersChange, pendingImportContent, onImportContentInserted }) => {
    return (
        <CollaborativeEditor
            docId={docId}
            editorId={editorId}
            onOnlineUsersChange={onOnlineUsersChange}
            pendingImportContent={pendingImportContent}
            onImportContentInserted={onImportContentInserted}
        />
    )
}
