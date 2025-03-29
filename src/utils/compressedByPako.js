import pako from 'pako';

export const compressedByPako = (data) => {
    const jsonStr = JSON.stringify(data);
    return pako.gzip(jsonStr, { level: 9 });
}