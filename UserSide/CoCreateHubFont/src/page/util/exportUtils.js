// 将 Slate 编辑器内容序列化为不同格式
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx';
import { saveAs } from 'file-saver';

// 序列化为 Markdown
const serializeToMarkdown = (nodes) => {
    return nodes.map(node => serializeNodeToMarkdown(node)).join('\n\n');
};

const serializeNodeToMarkdown = (node) => {
    if (node.text !== undefined) {
        let text = node.text;
        if (node.bold) text = `**${text}**`;
        if (node.italic) text = `*${text}*`;
        if (node.code) text = `\`${text}\``;
        if (node.underline) text = `<u>${text}</u>`;
        return text;
    }

    const children = node.children?.map(n => serializeNodeToMarkdown(n)).join('') || '';

    switch (node.type) {
        case 'heading-one':
            return `# ${children}`;
        case 'heading-two':
            return `## ${children}`;
        case 'block-quote':
            return `> ${children}`;
        case 'numbered-list':
            return node.children?.map((child, i) => `${i + 1}. ${serializeNodeToMarkdown(child)}`).join('\n') || '';
        case 'bulleted-list':
            return node.children?.map(child => `- ${serializeNodeToMarkdown(child)}`).join('\n') || '';
        case 'list-item':
            return children;
        default:
            return children;
    }
};

// 序列化为 Word 文档
const serializeToWord = async (nodes) => {
    const paragraphs = [];

    for (const node of nodes) {
        const nodeParagraphs = serializeNodeToWord(node);
        if (Array.isArray(nodeParagraphs)) {
            paragraphs.push(...nodeParagraphs);
        } else if (nodeParagraphs) {
            paragraphs.push(nodeParagraphs);
        }
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: paragraphs
        }]
    });

    return doc;
};

const serializeNodeToWord = (node, listLevel = 0) => {
    // 处理文本节点
    if (node.text !== undefined) {
        return new TextRun({
            text: node.text,
            bold: node.bold || false,
            italics: node.italic || false,
            underline: node.underline ? {} : undefined,
            font: node.code ? 'Courier New' : undefined,
            shading: node.code ? { fill: 'f4f4f4' } : undefined
        });
    }

    // 获取对齐方式
    const getAlignment = (align) => {
        switch (align) {
            case 'left': return AlignmentType.LEFT;
            case 'center': return AlignmentType.CENTER;
            case 'right': return AlignmentType.RIGHT;
            case 'justify': return AlignmentType.JUSTIFIED;
            default: return AlignmentType.LEFT;
        }
    };

    // 处理子节点
    const children = node.children?.map(n => serializeNodeToWord(n, listLevel)).flat().filter(Boolean) || [];

    switch (node.type) {
        case 'heading-one':
            return new Paragraph({
                text: '',
                heading: HeadingLevel.HEADING_1,
                alignment: getAlignment(node.align),
                children: children
            });
        case 'heading-two':
            return new Paragraph({
                text: '',
                heading: HeadingLevel.HEADING_2,
                alignment: getAlignment(node.align),
                children: children
            });
        case 'block-quote':
            return new Paragraph({
                text: '',
                alignment: getAlignment(node.align),
                indent: { left: 720 }, // 0.5 inch
                italics: true,
                children: children
            });
        case 'numbered-list':
            return node.children?.map((child, index) => {
                const childContent = serializeNodeToWord(child, listLevel + 1);
                if (Array.isArray(childContent)) {
                    return childContent.map((para, i) => {
                        if (i === 0 && para instanceof Paragraph) {
                            return new Paragraph({
                                ...para,
                                numbering: {
                                    reference: 'numbered-list',
                                    level: listLevel
                                }
                            });
                        }
                        return para;
                    });
                }
                return new Paragraph({
                    text: '',
                    numbering: {
                        reference: 'numbered-list',
                        level: listLevel
                    },
                    children: Array.isArray(childContent) ? childContent : [childContent]
                });
            }).flat() || [];
        case 'bulleted-list':
            return node.children?.map(child => {
                const childContent = serializeNodeToWord(child, listLevel + 1);
                if (Array.isArray(childContent)) {
                    return childContent.map((para, i) => {
                        if (i === 0 && para instanceof Paragraph) {
                            return new Paragraph({
                                ...para,
                                bullet: {
                                    level: listLevel
                                }
                            });
                        }
                        return para;
                    });
                }
                return new Paragraph({
                    text: '',
                    bullet: {
                        level: listLevel
                    },
                    children: Array.isArray(childContent) ? childContent : [childContent]
                });
            }).flat() || [];
        case 'list-item':
            return children;
        default:
            return new Paragraph({
                text: '',
                alignment: getAlignment(node.align),
                children: children
            });
    }
};

export const serialize = (nodes, format = 'markdown') => {
    if (format === 'markdown') {
        return serializeToMarkdown(nodes);
    }
    return '';
};

export const exportToWord = async (nodes, filename = 'document.docx') => {
    const doc = await serializeToWord(nodes);
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};
