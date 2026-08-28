import { state, setState } from './storage.js';
import { sanitizeInput, decodeInput, debounce } from './utils.js';

// ===== 搜索模块 =====
// DOM 引用（type=module 为 defer，模块加载时 DOM 已就绪）
const searchContainer = document.getElementById('search-container');
const fakebox = document.getElementById('fakebox');
const searchInput = document.getElementById('search-input');
const suggestionList = document.getElementById('suggestion-list');
const suggestionsFooter = document.getElementById('suggestions-footer');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const selectEngine = document.getElementById('select-engine');

// 搜索引擎 URL 映射
const engineSearchUrls = {
  bing: 'https://www.bing.com/search?q=',
  baidu: 'https://www.baidu.com/s?wd=',
  google: 'https://www.google.com/search?q='
};

const bingCNSearchUrl = 'https://cn.bing.com/search?q=';

// 模块内共享状态
let selectedSuggestionIndex = -1;

const historySvgIcon = `<svg width="18" height="18" viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 1 1 7 7 7.07 7.07 0 0 1-6-3.37l-1.44 1.44A8.95 8.95 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>`;
const searchSvgIcon = `<svg width="18" height="18" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`;

// 将搜索关键词存入历史记录（去重、限长50条）
function saveSearchHistory(query) {
  if (!state.historyEnabled || !query) return;
  const safeQuery = sanitizeInput(query);
  const newHistory = state.searchHistory.filter(item => item.toLowerCase() !== safeQuery.toLowerCase());
  newHistory.unshift(safeQuery);
  if (newHistory.length > 50) {
    newHistory.pop();
  }
  setState('searchHistory', newHistory);
}

// 关闭搜索联想下拉面板，重置选中索引
function closeSuggestions() {
  searchContainer?.classList.remove('suggestions-open');
  selectedSuggestionIndex = -1;
}

// 渲染搜索联想下拉列表，合并历史记录与在线建议词条
function renderSuggestions(historyItems, suggestionItems) {
  if (!suggestionList) return;
  suggestionList.innerHTML = '';
  selectedSuggestionIndex = -1;

  const totalItems = [];

  historyItems.forEach(item => {
    totalItems.push({ text: item, isHistory: true });
  });

  suggestionItems.forEach(item => {
    if (!totalItems.some(i => i.text.toLowerCase() === item.toLowerCase())) {
      totalItems.push({ text: item, isHistory: false });
    }
  });

  if (totalItems.length === 0) {
    closeSuggestions();
    return;
  }

  totalItems.forEach((itemObj) => {
    const li = document.createElement('li');
    li.className = 'suggestion-item' + (itemObj.isHistory ? ' history' : '');
    li.innerHTML = `${itemObj.isHistory ? historySvgIcon : searchSvgIcon}<span class="suggestion-text">${sanitizeInput(itemObj.text)}</span>`;

    li.addEventListener('click', () => {
      if (searchInput) searchInput.value = decodeInput(itemObj.text);
      doSearch(itemObj.text);
    });

    suggestionList.appendChild(li);
  });

  if (suggestionsFooter) {
    suggestionsFooter.style.display = historyItems.length > 0 ? 'block' : 'none';
  }

  searchContainer?.classList.add('suggestions-open');
}

// 扩展专用的异步 Fetch 搜索
async function fetchSearchSuggestions(engine, query) {
  try {
    if (engine === 'baidu' || engine === 'bing') {
      const response = await fetch(`https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&p=3`);
      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder('gbk'); // 百度联想词通常返回 GBK 编码
      const text = decoder.decode(buffer);
      const match = text.match(/s:\[(.*?)\]/);
      if (match && match[1]) {
        return match[1].split(',').map(item => item.replace(/^"|"$/g, '').trim()).filter(Boolean);
      }
    } else if (engine === 'google') {
      const response = await fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (Array.isArray(data) && Array.isArray(data[1])) {
        return data[1];
      }
    }
  } catch (e) {
    console.warn('获取搜索联想建议词条失败:', e);
  }
  return [];
}

// 获取搜索联想建议：匹配历史记录 + 异步请求搜索引擎建议
async function fetchAndShowSuggestions() {
  if (!searchInput) return;
  const query = searchInput.value.trim();

  let matchedHistory = [];
  if (state.historyEnabled) {
    if (query) {
      matchedHistory = state.searchHistory.filter(h => h.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    } else {
      matchedHistory = state.searchHistory.slice(0, 5);
    }
  }

  if (!query) {
    if (matchedHistory.length > 0) {
      renderSuggestions(matchedHistory, []);
    } else {
      closeSuggestions();
    }
    return;
  }

  const engine = selectEngine ? selectEngine.value : 'bing';
  let fetchedSuggestions = [];

  if (engine !== 'custom') {
    fetchedSuggestions = await fetchSearchSuggestions(engine, query);
  }

  renderSuggestions(matchedHistory, fetchedSuggestions.slice(0, 8));
}

// 更新联想列表中键盘选中项的高亮状态
function updateSuggestionSelection(items) {
  items.forEach((item, index) => {
    if (index === selectedSuggestionIndex) {
      item.classList.add('selected');
      if (searchInput) searchInput.value = item.querySelector('.suggestion-text').textContent;
    } else {
      item.classList.remove('selected');
    }
  });
}

// 执行搜索逻辑
function doSearch(queryText) {
  const query = queryText !== undefined ? queryText : (searchInput ? searchInput.value.trim() : '');
  if (query) {
    saveSearchHistory(query);
    closeSuggestions();

    const engine = selectEngine ? selectEngine.value : 'bing';
    let targetUrl = '';

    if (engine === 'custom' && state.customEngineConfig.url) {
      targetUrl = state.customEngineConfig.url.replace('%s', encodeURIComponent(query));
    } else {
      let baseUrl = engineSearchUrls[engine] || engineSearchUrls.bing;
      if (engine === 'bing' && state.forceBingCN) {
        baseUrl = bingCNSearchUrl;
      }
      targetUrl = baseUrl + encodeURIComponent(query);
    }
    window.location.href = targetUrl;
  }
}

// 初始化搜索模块：绑定事件
export function initSearch() {
  const debouncedFetchSuggestions = debounce(fetchAndShowSuggestions, 150);

  // 点击搜索区域外关闭联想下拉
  document.addEventListener('click', (e) => {
    if (!searchContainer?.contains(e.target)) {
      closeSuggestions();
    }
  });

  clearHistoryBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    setState('searchHistory', []);
    fetchAndShowSuggestions();
  });

  fakebox?.addEventListener('click', () => {
    searchInput?.focus();
  });

  searchInput?.addEventListener('focus', () => {
    fetchAndShowSuggestions();
  });

  searchInput?.addEventListener('input', () => {
    if (searchInput.value.trim() !== '') {
      fakebox?.classList.add('has-value');
    } else {
      fakebox?.classList.remove('has-value');
    }
    debouncedFetchSuggestions();
  });

  searchInput?.addEventListener('keydown', (e) => {
    if (!suggestionList) return;
    const items = suggestionList.querySelectorAll('.suggestion-item');

    if (e.key === 'ArrowDown') {
      if (items.length > 0) {
        e.preventDefault();
        if (selectedSuggestionIndex < items.length - 1) {
          selectedSuggestionIndex++;
        } else {
          selectedSuggestionIndex = 0;
        }
        updateSuggestionSelection(items);
      }
    } else if (e.key === 'ArrowUp') {
      if (items.length > 0) {
        e.preventDefault();
        if (selectedSuggestionIndex > 0) {
          selectedSuggestionIndex--;
        } else {
          selectedSuggestionIndex = items.length - 1;
        }
        updateSuggestionSelection(items);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && items[selectedSuggestionIndex]) {
        const text = items[selectedSuggestionIndex].querySelector('.suggestion-text').textContent;
        if (searchInput) searchInput.value = text;
        doSearch(text);
      } else {
        doSearch(searchInput.value.trim());
      }
    } else if (e.key === 'Escape') {
      closeSuggestions();
    }
  });
}

export { fetchAndShowSuggestions };
