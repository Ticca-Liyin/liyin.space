
/**
 * 防抖函数
 * @param {Function} fn - 需要防抖的执行函数
 * @param {number} delay - 延迟执行的时间(毫秒)
 * @returns {Function} 防抖后的函数
 */
export const debounce = (fn, delay) => {
    let timer = null;
    return function(...args) {
        clearTimeout(timeout);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}


/**
 * 节流函数
 * @param {Function} fn - 需要节流的执行函数
 * @param {number} delay - 时间间隔（毫秒）
 * @returns {Function} - 节流后的函数
 */
export const throttle = (fn, delay) => {
    let lastTime = 0;
 
    return function (...args) {
        const now = Date.now();
 
        if (!lastTime || now - lastTime >= delay) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
}


/**
 * 节流+防频繁点击函数
 * @param {Function} fn 需要节流的执行函数
 * @param {number} cooldown 执行函数的节流时间间隔(ms)
 * @param {number} delay 点击最小间隔时间(ms)
 * @param {Function} warningFn 请求频繁的警告函数
 * @param {number} warningDelay 警告函数的节流时间(ms)
 * @returns {Function} 节流后的函数
 */
export const throttleDebounce = (fn, cooldown = 1500, delay = 500, warningFn = null, warningDelay = 1000) => {
    let timer = null;
    let lastTime = 0;
    let warningLastTime = 0;

    const setTimeoutFn = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            warningLastTime = 0;
        }, delay);
    };

    const doWarning = () => {
        const now = Date.now();
        if (typeof warningFn === 'function' && (!warningLastTime || now - warningLastTime >= warningDelay)) {
            warningFn();
            warningLastTime = now;
        }
    };
  
    return function (...args) {
        if (timer) {
            doWarning();
            setTimeoutFn();
            return;
        }
      
        const now = Date.now();
        // 首次执行或者距离上次执行超过延迟时间
        if (!lastTime || now - lastTime >= cooldown) {
            fn.apply(this, args);
            lastTime = now;
            setTimeoutFn();
            return;
        } else {
            doWarning();
            setTimeoutFn();
        }
    };
}