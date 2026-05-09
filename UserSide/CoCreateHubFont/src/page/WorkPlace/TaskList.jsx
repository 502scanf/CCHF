import React, { useState, useEffect } from 'react'
import { Button, Input, message, Modal } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { createTaskApi, getTaskListApi, updateTaskApi, deleteTaskApi } from '@page/api/task.js'
import './TaskList.css'

const TaskList = ({ roomId, onTaskChange }) => {
    const [tasks, setTasks] = useState([])
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    const [editingTask, setEditingTask] = useState(null)
    const [taskContent, setTaskContent] = useState('')
    const [expandedTaskId, setExpandedTaskId] = useState(null)
    const [draggedTaskId, setDraggedTaskId] = useState(null)
    const [dragOverTaskId, setDragOverTaskId] = useState(null)
    const [loading, setLoading] = useState(false)

    // 从后端加载任务列表
    useEffect(() => {
        if (roomId) {
            loadTasks()
        }
    }, [roomId])

    // 加载任务列表
    const loadTasks = async () => {
        try {
            setLoading(true)
            console.log('正在加载任务列表，roomId:', roomId)
            const response = await getTaskListApi(roomId)
            console.log('任务列表响应:', response)
            if (response && response.data) {
                setTasks(response.data)
                console.log('任务列表加载成功，数量:', response.data.length)
            }
        } catch (error) {
            console.error('加载任务列表失败:', error)
            console.error('错误详情:', error.response)
            message.error('加载任务列表失败: ' + (error.message || '未知错误'))
        } finally {
            setLoading(false)
        }
    }

    // 添加任务
    const handleAddTask = () => {
        if (tasks.length >= 10) {
            message.warning('最多只能添加10个任务')
            return
        }
        setEditingTask(null)
        setTaskContent('')
        setIsEditModalVisible(true)
    }

    // 编辑任务
    const handleEditTask = (task) => {
        setEditingTask(task)
        setTaskContent(task.content)
        setIsEditModalVisible(true)
    }

    // 删除任务
    const handleDeleteTask = (taskid) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个任务吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteTaskApi(taskid)
                    message.success('任务已删除')
                    // 重新加载任务列表
                    loadTasks()
                    // 通知父组件刷新通知
                    if (onTaskChange) {
                        onTaskChange()
                    }
                } catch (error) {
                    console.error('删除任务失败:', error)
                    message.error('删除任务失败')
                }
            }
        })
    }

    // 保存任务
    const handleSaveTask = async () => {
        if (!taskContent.trim()) {
            message.warning('任务内容不能为空')
            return
        }

        try {
            if (editingTask) {
                // 编辑现有任务
                await updateTaskApi({
                    taskid: editingTask.taskid,
                    content: taskContent
                })
                message.success('任务已更新')
            } else {
                // 添加新任务
                await createTaskApi({
                    roomid: roomId,
                    content: taskContent
                })
                message.success('任务已添加')
            }

            // 重新加载任务列表
            loadTasks()
            setIsEditModalVisible(false)
            setTaskContent('')
            setEditingTask(null)

            // 通知父组件刷新通知
            if (onTaskChange) {
                onTaskChange()
            }
        } catch (error) {
            console.error('保存任务失败:', error)
            // 错误消息已在 cchRequest 拦截器中处理
        }
    }

    // 切换任务展开/收起
    const toggleTaskExpand = (taskId) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId)
    }

    // 拖拽开始
    const handleDragStart = (e, taskId) => {
        setDraggedTaskId(taskId)
        e.dataTransfer.effectAllowed = 'move'
        e.currentTarget.style.opacity = '0.5'
    }

    // 拖拽结束
    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = '1'
        setDraggedTaskId(null)
        setDragOverTaskId(null)
    }

    // 拖拽经过
    const handleDragOver = (e, taskId) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'

        if (draggedTaskId !== taskId) {
            setDragOverTaskId(taskId)
        }
    }

    // 拖拽离开
    const handleDragLeave = () => {
        setDragOverTaskId(null)
    }

    // 放置（仅前端排序，不保存到后端）
    const handleDrop = (e, dropTaskId) => {
        e.preventDefault()

        if (draggedTaskId === dropTaskId) {
            setDragOverTaskId(null)
            return
        }

        const draggedIndex = tasks.findIndex(t => t.taskid === draggedTaskId)
        const dropIndex = tasks.findIndex(t => t.taskid === dropTaskId)

        if (draggedIndex === -1 || dropIndex === -1) return

        // 重新排序任务（仅前端显示）
        const newTasks = [...tasks]
        const [draggedTask] = newTasks.splice(draggedIndex, 1)
        newTasks.splice(dropIndex, 0, draggedTask)

        setTasks(newTasks)
        setDragOverTaskId(null)
        message.success('任务顺序已更新')
    }

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <span className="task-list-title">任务列表</span>
                <span className="task-count">{tasks.length}/10</span>
            </div>

            <div className="task-items-wrapper">
                {loading ? (
                    <div className="task-empty">
                        <span>加载中...</span>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="task-empty">
                        <span>暂无任务</span>
                    </div>
                ) : (
                    tasks.map((task, index) => {
                        const isExpanded = expandedTaskId === task.taskid
                        const isLongContent = task.content.length > 30
                        const isDragOver = dragOverTaskId === task.taskid

                        return (
                            <div
                                key={task.taskid}
                                className={`task-item ${isExpanded ? 'expanded' : ''} ${isDragOver ? 'drag-over' : ''}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task.taskid)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOver(e, task.taskid)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, task.taskid)}
                            >
                                <div className="task-header" onClick={() => toggleTaskExpand(task.taskid)}>
                                    <div className={`task-number priority-${index + 1}`}>{index + 1}</div>
                                    <div className="task-content-preview">
                                        {isExpanded ? task.content : (
                                            isLongContent ? `${task.content.substring(0, 30)}...` : task.content
                                        )}
                                    </div>
                                    {isLongContent && (
                                        <div className="task-expand-icon">
                                            {isExpanded ? <UpOutlined /> : <DownOutlined />}
                                        </div>
                                    )}
                                </div>

                                {isExpanded && (
                                    <div className="task-expanded-content">
                                        <div className="task-full-content">{task.content}</div>
                                        <div className="task-actions-expanded">
                                            <button
                                                className="task-action-btn-expanded edit-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleEditTask(task)
                                                }}
                                            >
                                                <EditOutlined />
                                                <span>编辑</span>
                                            </button>
                                            <button
                                                className="task-action-btn-expanded delete-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteTask(task.taskid)
                                                }}
                                            >
                                                <DeleteOutlined />
                                                <span>删除</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            <button
                className="task-add-btn"
                onClick={handleAddTask}
                disabled={tasks.length >= 10 || loading}
            >
                <PlusOutlined />
                <span>添加任务</span>
            </button>

            {/* 编辑任务弹窗 */}
            <Modal
                title={editingTask ? '编辑任务' : '添加任务'}
                open={isEditModalVisible}
                onOk={handleSaveTask}
                onCancel={() => {
                    setIsEditModalVisible(false)
                    setTaskContent('')
                    setEditingTask(null)
                }}
                okText="保存"
                cancelText="取消"
                width={400}
            >
                <Input.TextArea
                    value={taskContent}
                    onChange={(e) => setTaskContent(e.target.value)}
                    placeholder="请输入任务内容..."
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    maxLength={200}
                    showCount
                />
            </Modal>
        </div>
    )
}

export default TaskList
