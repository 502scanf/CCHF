import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react'
import { BellOutlined, CloseOutlined } from '@ant-design/icons'
import { getTaskNotificationListApi, getUnreadCountApi, markAsReadApi, markAllAsReadApi } from '../api/taskNotification'
import './AnnouncementPanel.css'

const AnnouncementPanel = forwardRef(({ roomid }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)

    const panelRef = useRef(null)
    const buttonRef = useRef(null)

    // 加载通知数据
    const loadNotifications = useCallback(async () => {
        if (!roomid) return

        setLoading(true)
        try {
            const [notificationsRes, unreadRes] = await Promise.all([
                getTaskNotificationListApi(roomid),
                getUnreadCountApi(roomid)
            ])

            if (notificationsRes.code === 1) {
                setNotifications(notificationsRes.data || [])
            }

            if (unreadRes.code === 1) {
                setUnreadCount(unreadRes.data || 0)
            }
        } catch (error) {
            console.error('加载任务通知失败:', error)
        } finally {
            setLoading(false)
        }
    }, [roomid])

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
        refreshNotifications: loadNotifications
    }), [loadNotifications])

    // 初始加载和房间变化时重新加载
    useEffect(() => {
        loadNotifications()
    }, [roomid, loadNotifications])

    // 定期刷新通知（每30秒）
    useEffect(() => {
        if (!roomid) return

        const interval = setInterval(() => {
            loadNotifications()
        }, 30000)

        return () => clearInterval(interval)
    }, [roomid, loadNotifications])

    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                panelRef.current &&
                buttonRef.current &&
                !panelRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    // 切换公告栏
    const togglePanel = () => {
        setIsOpen(!isOpen)
        if (!isOpen) {
            // 打开时刷新数据
            loadNotifications()
        }
    }

    // 标记为已读
    const markAsRead = async (notificationid) => {
        try {
            const response = await markAsReadApi(notificationid)
            if (response.code === 1) {
                // 更新本地状态
                setNotifications(notifications.map(n =>
                    n.notificationid === notificationid ? { ...n, isRead: 1 } : n
                ))
                // 更新未读数量
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        } catch (error) {
            console.error('标记通知为已读失败:', error)
        }
    }

    // 全部标记为已读
    const markAllAsRead = async () => {
        if (!roomid) return

        try {
            const response = await markAllAsReadApi(roomid)
            if (response.code === 1) {
                // 更新本地状态
                setNotifications(notifications.map(n => ({ ...n, isRead: 1 })))
                setUnreadCount(0)
            }
        } catch (error) {
            console.error('标记所有通知为已读失败:', error)
        }
    }

    return (
        <>
            {/* 铃铛按钮 */}
            <div
                ref={buttonRef}
                className="announcement-bell"
                onClick={togglePanel}
            >
                <BellOutlined style={{ fontSize: '20px', color: 'white' }} />
                {unreadCount > 0 && (
                    <div className="custom-badge"></div>
                )}
            </div>

            {/* 任务通知面板 */}
            {isOpen && (
                <div ref={panelRef} className="announcement-panel">
                    <div className="announcement-header">
                        <div className="announcement-title">任务变更</div>
                        <div className="announcement-actions">
                            {unreadCount > 0 && (
                                <button
                                    className="mark-all-read-btn"
                                    onClick={markAllAsRead}
                                >
                                    全部已读
                                </button>
                            )}
                            <CloseOutlined
                                className="close-icon"
                                onClick={() => setIsOpen(false)}
                            />
                        </div>
                    </div>

                    <div className="announcement-list">
                        {loading ? (
                            <div className="announcement-empty">
                                <span>加载中...</span>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="announcement-empty">
                                <span>暂无任务变更通知</span>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.notificationid}
                                    className={`announcement-item ${notification.isRead === 0 ? 'unread' : 'read'}`}
                                    onClick={() => notification.isRead === 0 && markAsRead(notification.notificationid)}
                                >
                                    {notification.isRead === 0 && (
                                        <span className="unread-dot"></span>
                                    )}
                                    <div className="announcement-content">
                                        <div className="announcement-item-title">
                                            任务变更
                                        </div>
                                        <div className="announcement-item-text">
                                            {notification.actionText}任务，请留意
                                        </div>
                                        <div className="announcement-time">
                                            {notification.timeText}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </>
    )
})

export default AnnouncementPanel