const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 20025;

app.use(cors());
app.use(bodyParser.json());

const CookieServerCode = {
    SUCCESS: 0,
    COOKIE_EXPIRED: -100,
    COOKIE_ERROR: 400,
    UNKNOWN_ERROR: 401,
}

// 从cookie字符串中提取指定字段的值
const extractCookieValue = (cookies, key) => {
    // 将cookie字符串分割成键值对
    const cookiePairs = cookies.split('; ');
    for (const pair of cookiePairs) {
        // 每个键值对进一步分割成键和值
        if (pair.includes('=')) {
            const [k, v] = pair.split('=', 2);
            // 如果找到了匹配的键，则返回对应的值
            if (k === key) {
                return v;
            }
        }
    }
    // 如果没有找到匹配的键，则返回null
    return null;
}

const getResult = (code, message, data=null) => {
    return {
        code: code,
        message: message,
        data: data
    }
}

app.get('/cookie/getAchievements', (req, res) => {
    const cookie = req.headers['user-cookie'];

    if (!cookie) {
        return res.json(getResult(CookieServerCode.COOKIE_ERROR, '解析 cookie 失败，请确认 cookie 是否正确！'));
    }

    const device_id = extractCookieValue(cookie, '_MHYUUID');

    if (!device_id) {
        return res.json(getResult(CookieServerCode.COOKIE_ERROR, '解析 cookie 失败，请确认 cookie 是否正确！'));
    }

    const type = extractCookieValue(cookie, '_HYVUUID') !== null ? 'hoyolab' : 'mohoyo'
    const url =  type === 'hoyolab' ? 'https://sg-public-api.hoyolab.com/event/rpgcultivate/achievement/list' : 'https://api-takumi.mihoyo.com/event/rpgcultivate/achievement/list'
    const host = type === 'hoyolab' ? 'sg-public-api.hoyolab.com' : 'api-takumi.mihoyo.com'
    const origin = type === 'hoyolab' ? 'https://act.hoyolab.com' : 'https://act.mihoyo.com'
    const referer = type === 'hoyolab' ? 'https://act.hoyolab.com/' : 'https://act.mihoyo.com/'

    // 请求参数
    const params = {
        show_hide: "true",
        need_all: "true"
    };

    // 请求头
    const headers = {
        'cookie': cookie,
        'host': host,
        'origin': origin,
        'referer': referer,
        'x-rpc-device_id': device_id,
        'x-rpc-lang': 'zh-cn',
    };

    // 发送GET请求
    axios.get(url, {
        params: params,
        headers: headers
    })
    .then(response => {
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`请求失败，状态码: ${response.status}`);
        }
    })
    .then(data => {
        if (data.retcode === -100) {
            return res.json(getResult(CookieServerCode.COOKIE_EXPIRED, '请求失败，cookie 无效，请重新获取最新的 cookie！'));
        }
        else if (data.retcode !== 0) {
            return res.json(getResult(CookieServerCode.UNKNOWN_ERROR, '请求失败，未知异常！'));
        }

        const achievements = data.data.achievement_list;

        return res.json(getResult(CookieServerCode.SUCCESS, 'success', achievements));
    })
    .catch(error => {
        return res.status(400).json(getResult(CookieServerCode.UNKNOWN_ERROR, error.message));
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
