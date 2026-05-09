import { Modal, message, Button } from 'antd';
import { ClockCircleOutlined, FlagOutlined, RollbackOutlined } from '@ant-design/icons';
import { restoreVersionApi } from '../../api/version';
import './VersionCard.css';

const SimpleVersionCard = ({
    version,
    index,
    isPreviewing,
    onPreview,
    onVersionAction,
    formatTime
}) => {
    // 获取快照类型图标
    const getSnapshotTypeIcon = (type) => {
        switch (type) {
            case 'auto_milestone':
                return <FlagOutlined className="milestone-icon" />;
            default:
                return <ClockCircleOutlined className="auto-icon" />;
        }
    };

    // 处理版本恢复
    const handleRestore = async () => {
        console.log('========== 开始恢复版本 ==========');
        console.log('版本信息:', {
            docid: version.docid,
            vid: version.vid,
            snapshotType: version.snapshotType,
            createdAt: version.createdAt
        });

        Modal.confirm({
            title: '确认恢复版本',
            content: '确定要恢复到此版本吗？当前内容将被替换。',
            okText: '确认恢复',
            cancelText: '取消',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    console.log('步骤1: 调用恢复 API...');
                    const response = await restoreVersionApi(version.docid, version.vid, '用户手动恢复');
                    console.log('API 响应:', response);

                    // 关闭版本历史窗口
                    onVersionAction();

                    message.success('版本恢复成功！页面将自动刷新...', 1.5);

                    // 刷新页面，让编辑器从数据库重新初始化
                    // 这是最可靠的方式，因为 Slate-Yjs 的绑定关系需要重新建立
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } catch (error) {
                    console.error('========== 版本恢复失败 ==========');
                    console.error('错误详情:', error);
                    console.error('错误响应:', error.response);
                    message.error(`版本恢复失败: ${error.response?.data?.msg || error.message}`);
                }
            }
        });
    };

    return (
        <div
            className={`version-card simple ${isPreviewing ? 'previewing' : ''} ${version.snapshotType === 'auto_milestone' ? 'milestone' : ''}`}
            style={{ '--index': index }}
            onClick={() => onPreview(version)}
        >
            {/* 时间线节点 */}
            <div className="timeline-node">
                {getSnapshotTypeIcon(version.snapshotType)}
            </div>

            {/* 卡片内容 */}
            <div className="version-card-content">
                <div className="version-info-simple">
                    <div className="version-meta-simple">
                        <span className="editor-name">{version.createdBy || version.editor}</span>
                        <span className="version-time">{formatTime(version.createdAt || version.createtime)}</span>
                    </div>

                    {version.labels && version.labels.length > 0 && (
                        <div className="version-labels-simple">
                            {version.labels.map((label, idx) => (
                                <span key={idx} className="label-tag">{label}</span>
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    type="link"
                    size="small"
                    icon={<RollbackOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRestore();
                    }}
                    className="restore-btn"
                >
                    恢复到此版本
                </Button>
            </div>
        </div>
    );
};

export default SimpleVersionCard;
