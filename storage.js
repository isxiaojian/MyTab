// LocalStorage 读写封装（带 JSON 序列化与异常保护）
const Storage = {
  get(key, defaultValue) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('无法保存设置到 LocalStorage:', e);
    }
  }
};

// ===== 集中状态管理 =====
// 应用所有持久化状态（含默认值），作为单一数据源
const state = {
  engine: 'bing',
  layout: 'focused',
  quicklinksRow: '0',
  historyEnabled: true,
  showTimeCapsule: false,
  showMenuButton: true,
  forceBingCN: false,
  bgEnabled: false,
  customWallpaper: null,
  enhancedVisibility: false,
  customEngineConfig: { name: '', url: '' },
  quicklinksList: [],
  searchHistory: [],
};

// 状态字段对应的 localStorage key
const STATE_KEYS = {
  engine: 'ntp_engine',
  layout: 'ntp_layout',
  quicklinksRow: 'ntp_quicklinks',
  historyEnabled: 'ntp_history_enabled',
  showTimeCapsule: 'ntp_show_time_capsule',
  showMenuButton: 'ntp_show_menu_button',
  forceBingCN: 'ntp_force_bing_cn',
  bgEnabled: 'ntp_bg_enabled',
  customWallpaper: 'ntp_custom_wallpaper',
  enhancedVisibility: 'ntp_enhanced_visibility',
  customEngineConfig: 'ntp_custom_engine_config',
  quicklinksList: 'ntp_quicklinks_list',
  searchHistory: 'ntp_search_history',
};

// 从 localStorage 加载全部状态
function loadState() {
  for (const name of Object.keys(STATE_KEYS)) {
    state[name] = Storage.get(STATE_KEYS[name], state[name]);
  }
}

// 更新单个状态字段并持久化
function setState(name, value) {
  state[name] = value;
  if (Object.prototype.hasOwnProperty.call(STATE_KEYS, name)) {
    Storage.set(STATE_KEYS[name], value);
  }
}

export { Storage, state, loadState, setState };
