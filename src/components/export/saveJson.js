export default function saveJson(data, fileName){
    var jsonString = JSON.stringify(data, null, 2); // 将 JSON 转换为字符串

    var blob = new Blob([jsonString], {type: "application/json"}); // 创建 Blob 对象
    var url = URL.createObjectURL(blob); // 创建临时 URL

    // 创建一个 <a> 元素并设置下载属性
    var link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    // 模拟点击链接以下载文件
    link.click();

    // // 释放临时 URL 的资源
    URL.revokeObjectURL(url);
}