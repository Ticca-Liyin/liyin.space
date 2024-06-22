export default function formatTimestamp(timestamp) {
    if(!timestamp) return ""
    const date = new Date(timestamp);
  
    // 获取年、月、日、小时、分钟和秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // 返回格式化后的日期时间字符串
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}