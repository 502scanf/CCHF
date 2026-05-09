import { cchRequest } from '../util/cchRequest.js';

// 获取版本列表
export const getVersionsApi = (docid, page = 1, size = 20, search = '') => {
    return cchRequest.get(`/cch/version/${docid}/list`, {
        params: { page, size, search }
    });
};

// 获取版本内容
export const getVersionContentApi = (vid) => {
    return cchRequest.get(`/cch/version/content/${vid}`);
};

// 恢复版本
export const restoreVersionApi = (docid, vid, reason = '') => {
    return cchRequest.post(`/cch/version/${docid}/restore`, {
        vid,
        reason
    });
};

// 更新版本标签
export const updateVersionLabelApi = (vid, action, label, labelIndex) => {
    return cchRequest.post(`/cch/version/label/${vid}`, {
        action,
        label,
        labelIndex
    });
};

// 切换版本锁定
export const toggleVersionLockApi = (vid) => {
    return cchRequest.post(`/cch/version/lock/${vid}`);
};

// 版本比较
export const compareVersionsApi = (fromVid, toVid) => {
    return cchRequest.post('/cch/version/compare', {
        fromVid,
        toVid
    });
};

// 导出版本
export const exportVersionApi = (vid, format) => {
    return cchRequest.get(`/cch/version/export/${vid}`, {
        params: { format },
        responseType: 'blob'
    });
};

// 删除版本
export const deleteVersionApi = (vid) => {
    return cchRequest.delete(`/cch/version/${vid}`);
};