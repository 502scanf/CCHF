export function toFile(content,filename){
    return new File([content], filename,
        { type: 'text/plain' });
}
