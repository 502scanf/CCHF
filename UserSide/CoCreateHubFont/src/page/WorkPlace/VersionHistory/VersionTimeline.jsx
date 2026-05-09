import React, { useRef, useCallback, useEffect } from 'react';
import { Spin } from 'antd';
import SimpleVersionCard from './SimpleVersionCard';
import './VersionTimeline.css';

const VersionTimeline = ({
    versions,
    loading,
    selectedVersions,
    currentPreviewVid,
    onVersionSelect,
    onLoadMore,
    onPreview,
    onVersionAction,
    hasMore
}) => {
    const timelineRef = useRef(null);

    // 无限滚动处理
    const handleScroll = useCallback(() => {
        if (!timelineRef.current || loading || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = timelineRef.current;
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

        // 当滚动到底部90%时加载更多
        if (scrollPercentage > 0.9) {
            onLoadMore();
        }
    }, [loading, hasMore, onLoadMore]);

    // 绑定滚动事件
    useEffect(() => {
        const timeline = timelineRef.current;
        if (timeline) {
            timeline.addEventListener('scroll', handleScroll);
            return () => timeline.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    // 格式化时间显示
    const formatTime = useCallback((timestamp) => {
        if (!timestamp) return '';

        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // 小于1分钟显示"刚刚"
        if (diff < 60000) {
            return '刚刚';
        }

        // 小于1小时显示"X分钟前"
        if (diff < 3600000) {
            return `${Math.floor(diff / 60000)}分钟前`;
        }

        // 小于24小时显示"X小时前"
        if (diff < 86400000) {
            return `${Math.floor(diff / 3600000)}小时前`;
        }

        // 小于7天显示"X天前"
        if (diff < 604800000) {
            return `${Math.floor(diff / 86400000)}天前`;
        }

        // 超过7天显示具体日期
        return date.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    return (
        <div className="version-timeline" ref={timelineRef}>
            {/* 时间线主轴 */}
            <div className="timeline-axis" />

            {/* 版本卡片列表 */}
            <div className="timeline-content">
                {versions.map((version, index) => (
                    <SimpleVersionCard
                        key={version.vid}
                        version={version}
                        index={index}
                        isPreviewing={currentPreviewVid === version.vid}
                        onPreview={onPreview}
                        onVersionAction={onVersionAction}
                        formatTime={formatTime}
                    />
                ))}

                {/* 加载更多指示器 */}
                {loading && versions.length > 0 && (
                    <div className="loading-more">
                        <Spin size="small" />
                        <span>加载更多版本...</span>
                    </div>
                )}

                {/* 没有更多数据提示 */}
                {!hasMore && versions.length > 0 && (
                    <div className="no-more-data">
                        <span>已加载全部版本</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VersionTimeline;