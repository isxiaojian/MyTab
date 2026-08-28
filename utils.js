// 解析Hostname域名
function getDomain(urlStr) {
  try {
    if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
      urlStr = 'https://' + urlStr;
    }
    const url = new URL(urlStr);
    return url.hostname;
  } catch (e) {
    return '';
  }
}

// 获取网站缩略图
function getFaviconUrl(urlStr) {
  const domain = getDomain(urlStr);
  if (!domain) return '';
  return `https://api.xinac.net/icon/?url=${domain}`;
}

// 对用户输入进行 HTML 转义，防止 XSS（幂等：可对已转义文本重复调用而不产生双重转义）
function sanitizeInput(str) {
  return str
    .replace(/&(amp|lt|gt|quot|#39);/g, (m, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[e]))
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 反转 HTML 转义，用于还原显示原始文本
function decodeInput(str) {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

// 通用防抖工具函数：延迟执行高频触发的函数调用
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 更新所有开关状态文字（开/关）
function updateStatusTexts() {
  const setStatus = (statusId, switchId) => {
    const statusEl = document.getElementById(statusId);
    if (statusEl) {
      const isChecked = document.getElementById(switchId)?.checked || false;
      statusEl.innerText = isChecked ? '开' : '关';
    }
  };
  setStatus('status-history', 'toggle-history-switch');
  setStatus('status-bg', 'toggle-bg-switch');
  setStatus('status-bg-modal', 'toggle-bg-modal-switch');
  setStatus('status-time-capsule', 'toggle-time-capsule-switch');
  setStatus('status-menu-button', 'toggle-menu-button-switch');
  setStatus('status-force-bing-cn', 'toggle-force-bing-cn');
  setStatus('status-enhanced-visibility', 'toggle-enhanced-visibility');
}

// 显示 modal 遮罩
function showModal(el) {
  el?.classList.add('active');
}

// 隐藏 modal 遮罩
function hideModal(el) {
  el?.classList.remove('active');
}

// 绑定点击遮罩关闭：点击遮罩空白区域（非内容）时触发
// 可传入 onClose 自定义关闭行为，默认仅移除 active class
function bindOverlayClose(el, onClose) {
  el?.addEventListener('click', (e) => {
    if (e.target === el) {
      if (onClose) {
        onClose();
      } else {
        el.classList.remove('active');
      }
    }
  });
}

export { getDomain, getFaviconUrl, sanitizeInput, decodeInput, debounce, updateStatusTexts, showModal, hideModal, bindOverlayClose };
