// 将 HTML 或 Markdown 转换为 Slate 节点格式
import * as Y from 'yjs';

// HTML 转 Slate 节点
export const htmlToSlate = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return deserializeHtml(doc.body);
};

const deserializeHtml = (el) => {
    if (el.nodeType === Node.TEXT_NODE) {
        return { text: el.textContent };
    }

    if (el.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    const children = Array.from(el.childNodes)
        .map(deserializeHtml)
        .flat()
        .filter(Boolean);

    if (children.length === 0) {
        children.push({ text: '' });
    }

    switch (el.nodeName) {
        case 'BODY':
            return children;
        case 'BR':
            return { text: '\n' };
        case 'P':
            return { type: 'paragraph', children };
        case 'H1':
            return { type: 'heading-one', children };
        case 'H2':
            return { type: 'heading-two', children };
        case 'BLOCKQUOTE':
            return { type: 'block-quote', children };
        case 'UL':
            return { type: 'bulleted-list', children };
        case 'OL':
            return { type: 'numbered-list', children };
        case 'LI':
            return { type: 'list-item', children };
        case 'STRONG':
        case 'B':
            return children.map(child => ({ ...child, bold: true }));
        case 'EM':
        case 'I':
            return children.map(child => ({ ...child, italic: true }));
        case 'U':
            return children.map(child => ({ ...child, underline: true }));
        case 'CODE':
            return children.map(child => ({ ...child, code: true }));
        default:
            return children;
    }
};

// Markdown 转 Slate 节点
export const markdownToSlate = (markdown) => {
    const lines = markdown.split('\n');
    const nodes = [];
    let currentList = null;
    let currentListType = null;

    for (let line of lines) {
        line = line.trim();

        if (!line) {
            if (currentList) {
                nodes.push(currentList);
                currentList = null;
                currentListType = null;
            }
            continue;
        }

        // 标题
        if (line.startsWith('# ')) {
            if (currentList) {
                nodes.push(currentList);
                currentList = null;
                currentListType = null;
            }
            nodes.push({
                type: 'heading-one',
                children: parseInlineMarkdown(line.substring(2))
            });
            continue;
        }

        if (line.startsWith('## ')) {
            if (currentList) {
                nodes.push(currentList);
                currentList = null;
                currentListType = null;
            }
            nodes.push({
                type: 'heading-two',
                children: parseInlineMarkdown(line.substring(3))
            });
            continue;
        }

        // 引用
        if (line.startsWith('> ')) {
            if (currentList) {
                nodes.push(currentList);
                currentList = null;
                currentListType = null;
            }
            nodes.push({
                type: 'block-quote',
                children: parseInlineMarkdown(line.substring(2))
            });
            continue;
        }

        // 无序列表
        if (line.startsWith('- ') || line.startsWith('* ')) {
            if (currentListType !== 'bulleted') {
                if (currentList) nodes.push(currentList);
                currentList = { type: 'bulleted-list', children: [] };
                currentListType = 'bulleted';
            }
            currentList.children.push({
                type: 'list-item',
                children: parseInlineMarkdown(line.substring(2))
            });
            continue;
        }

        // 有序列表
        const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/);
        if (orderedMatch) {
            if (currentListType !== 'numbered') {
                if (currentList) nodes.push(currentList);
                currentList = { type: 'numbered-list', children: [] };
                currentListType = 'numbered';
            }
            currentList.children.push({
                type: 'list-item',
                children: parseInlineMarkdown(orderedMatch[2])
            });
            continue;
        }

        // 普通段落
        if (currentList) {
            nodes.push(currentList);
            currentList = null;
            currentListType = null;
        }
        nodes.push({
            type: 'paragraph',
            children: parseInlineMarkdown(line)
        });
    }

    if (currentList) {
        nodes.push(currentList);
    }

    return nodes.length > 0 ? nodes : [{ type: 'paragraph', children: [{ text: '' }] }];
};

// 解析行内 Markdown 格式
const parseInlineMarkdown = (text) => {
    const children = [];
    let current = '';
    let i = 0;

    while (i < text.length) {
        // 粗体 **text**
        if (text.substring(i, i + 2) === '**') {
            if (current) {
                children.push({ text: current });
                current = '';
            }
            i += 2;
            let boldText = '';
            while (i < text.length && text.substring(i, i + 2) !== '**') {
                boldText += text[i];
                i++;
            }
            if (boldText) {
                children.push({ text: boldText, bold: true });
            }
            i += 2;
            continue;
        }

        // 斜体 *text*
        if (text[i] === '*' && text[i + 1] !== '*') {
            if (current) {
                children.push({ text: current });
                current = '';
            }
            i++;
            let italicText = '';
            while (i < text.length && text[i] !== '*') {
                italicText += text[i];
                i++;
            }
            if (italicText) {
                children.push({ text: italicText, italic: true });
            }
            i++;
            continue;
        }

        // 代码 `code`
        if (text[i] === '`') {
            if (current) {
                children.push({ text: current });
                current = '';
            }
            i++;
            let codeText = '';
            while (i < text.length && text[i] !== '`') {
                codeText += text[i];
                i++;
            }
            if (codeText) {
                children.push({ text: codeText, code: true });
            }
            i++;
            continue;
        }

        current += text[i];
        i++;
    }

    if (current) {
        children.push({ text: current });
    }

    return children.length > 0 ? children : [{ text: '' }];
};

// 将 Slate 节点转换为可以直接插入编辑器的格式
// 这个函数返回处理好的 Slate 节点，而不是 Yjs Base64
export const prepareSlateNodesForImport = (slateNodes) => {
    // 确保节点格式正确，添加必要的默认值
    return normalizeSlateNodes(slateNodes);
};

const normalizeSlateNodes = (nodes) => {
    if (!Array.isArray(nodes)) {
        return [{ type: 'paragraph', children: [{ text: '' }] }];
    }

    return nodes.map(node => {
        if (node.text !== undefined) {
            // 文本节点
            return { text: node.text || '', ...node };
        } else if (node.children) {
            // 元素节点
            return {
                type: node.type || 'paragraph',
                children: normalizeSlateNodes(node.children),
                ...node
            };
        } else {
            // 无效节点，转换为空段落
            return { type: 'paragraph', children: [{ text: '' }] };
        }
    });
};
