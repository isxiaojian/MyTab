import { state, setState } from './storage.js';
import { updateStatusTexts, sanitizeInput, showModal, hideModal, bindOverlayClose } from './utils.js';

// ===== 背景/壁纸模块 =====
// DOM 引用（type=module 为 defer，模块加载时 DOM 已就绪）
const toggleBgSwitch = document.getElementById('toggle-bg-switch');
const toggleBgModalSwitch = document.getElementById('toggle-bg-modal-switch');
const toggleEnhancedVisibility = document.getElementById('toggle-enhanced-visibility');
const enhancedVisibilityRow = document.getElementById('enhanced-visibility-row');
const bgVideo = document.getElementById('bg-video');
const bgImage = document.getElementById('bg-image');
const wallpaperTypeTitle = document.getElementById('wallpaper-type-title');
const wallpaperPreviewContainer = document.getElementById('wallpaper-preview-container');
const modalWallpaper = document.getElementById('modal-wallpaper');
const btnOpenBgModal = document.getElementById('btn-open-bg-modal');
const btnCloseWallpaperModal = document.getElementById('btn-close-wallpaper-modal');
const btnUploadWallpaper = document.getElementById('btn-upload-wallpaper');
const btnRemoveWallpaper = document.getElementById('btn-remove-wallpaper');
const inputWallpaperFile = document.getElementById('input-wallpaper-file');
const popoverSettings = document.getElementById('popover-settings');
const btnBingWallpaper = document.getElementById('btn-bing-wallpaper');
const btnCustomUrlWallpaper = document.getElementById('btn-custom-url-wallpaper');
const modalOnlineWallpaper = document.getElementById('modal-online-wallpaper');
const onlineWallpaperForm = document.getElementById('online-wallpaper-form');
const inputOnlineUrl = document.getElementById('input-online-url');
const containerOnlineUrl = document.getElementById('container-online-url');
const tipOnlineUrl = document.getElementById('tip-online-url');
const btnOnlineCancel = document.getElementById('btn-online-cancel');

// 背景显隐及渲染逻辑
function applyBackgroundState() {
  if (toggleBgSwitch) toggleBgSwitch.checked = state.bgEnabled;
  if (toggleBgModalSwitch) toggleBgModalSwitch.checked = state.bgEnabled;

  if (state.bgEnabled) {
    document.body.classList.add('bg-enabled');
    renderWallpaper();
  } else {
    document.body.classList.remove('bg-enabled');
    if (bgVideo) bgVideo.style.display = 'none';
    if (bgImage) bgImage.style.display = 'none';
    if (state.enhancedVisibility) {
      setState('enhancedVisibility', false);
      if (toggleEnhancedVisibility) toggleEnhancedVisibility.checked = false;
    }
  }

  if (enhancedVisibilityRow) {
    enhancedVisibilityRow.style.display = state.bgEnabled ? 'flex' : 'none';
  }
  applyEnhancedVisibility();
}

// 根据"增强可见性"设置与背景开关，切换 body 的 data 属性
function applyEnhancedVisibility() {
  if (state.enhancedVisibility && state.bgEnabled) {
    document.body.setAttribute('data-enhanced-visibility', 'true');
  } else {
    document.body.removeAttribute('data-enhanced-visibility');
  }
}

// 根据自定义壁纸数据，渲染视频/图片背景到页面和预览容器
function renderWallpaper() {
  if (!state.customWallpaper) {
    if (bgVideo) bgVideo.style.display = 'none';
    if (bgImage) {
      bgImage.style.display = 'block';
      bgImage.src = 'img/background.webp';
    }
    if (wallpaperTypeTitle) wallpaperTypeTitle.textContent = '选择图片';
    if (wallpaperPreviewContainer) {
      wallpaperPreviewContainer.innerHTML = `<span style="font-size: 13px; color: var(--settings-text-secondary);">正在使用默认背景</span>`;
    }
    return;
  }

  if (wallpaperTypeTitle) wallpaperTypeTitle.textContent = '上传的背景';

  if (state.customWallpaper.type === 'video') {
    if (bgImage) bgImage.style.display = 'none';
    if (bgVideo) {
      bgVideo.style.display = 'block';
      bgVideo.src = state.customWallpaper.url;
      bgVideo.play().catch(() => {});
    }

    if (wallpaperPreviewContainer) {
      wallpaperPreviewContainer.innerHTML = `
        <video src="${state.customWallpaper.url}" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;"></video>
      `;
    }
  } else {
    if (bgVideo) bgVideo.style.display = 'none';
    if (bgImage) {
      bgImage.style.display = 'block';
      bgImage.src = state.customWallpaper.url;
    }

    if (wallpaperPreviewContainer) {
      wallpaperPreviewContainer.innerHTML = `
        <img src="${state.customWallpaper.url}" alt="背景预览" style="width:100%;height:100%;object-fit:cover;" />
      `;
    }
  }
}

// 关闭自定义 URL 在线壁纸弹窗
function closeOnlineModal() {
  hideModal(modalOnlineWallpaper);
  containerOnlineUrl?.classList.remove('error');
  tipOnlineUrl?.classList.remove('active');
}

// 初始化壁纸模块：恢复初始状态并绑定事件
export function initWallpaper() {
  if (toggleEnhancedVisibility) toggleEnhancedVisibility.checked = state.enhancedVisibility;
  applyBackgroundState();

  // 背景开关同步响应
  toggleBgSwitch?.addEventListener('change', (e) => {
    setState('bgEnabled', e.target.checked);
    applyBackgroundState();
    updateStatusTexts();
  });

  toggleBgModalSwitch?.addEventListener('change', (e) => {
    setState('bgEnabled', e.target.checked);
    applyBackgroundState();
    updateStatusTexts();
  });

  toggleEnhancedVisibility?.addEventListener('change', (e) => {
    setState('enhancedVisibility', e.target.checked);
    applyEnhancedVisibility();
    updateStatusTexts();
  });

  // 壁纸弹窗逻辑
  btnOpenBgModal?.addEventListener('click', () => {
    popoverSettings?.classList.remove('active');
    showModal(modalWallpaper);
    renderWallpaper();
    updateStatusTexts();
  });

  btnCloseWallpaperModal?.addEventListener('click', () => {
    hideModal(modalWallpaper);
  });

  btnUploadWallpaper?.addEventListener('click', () => {
    inputWallpaperFile?.click();
  });

  inputWallpaperFile?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();

    reader.onload = (event) => {
      setState('customWallpaper', {
        type: isVideo ? 'video' : 'image',
        url: event.target.result
      });
      applyBackgroundState();
    };

    reader.readAsDataURL(file);
  });

  btnRemoveWallpaper?.addEventListener('click', () => {
    setState('customWallpaper', null);
    applyBackgroundState();
  });

  // 必应每日壁纸
  btnBingWallpaper?.addEventListener('click', async () => {
    try {
      const response = await fetch('https://bing.biturl.top/?resolution=1920x1080&format=json');
      if (!response.ok) throw new Error('网络请求失败');
      const data = await response.json();
      let url = data.url;
      if (url && url.startsWith('http')) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        setState('customWallpaper', { type: 'image', url: url });
        if (!state.bgEnabled) {
          setState('bgEnabled', true);
        }
        applyBackgroundState();
        if (toggleBgSwitch) toggleBgSwitch.checked = true;
        if (toggleBgModalSwitch) toggleBgModalSwitch.checked = true;
        updateStatusTexts();
        closeOnlineModal();
      }
    } catch (error) {
      console.error('获取必应壁纸失败:', error);
      alert('获取壁纸失败，请检查网络连接后重试。');
    }
  });

  // 自定义URL - 打开弹窗
  btnCustomUrlWallpaper?.addEventListener('click', () => {
    inputOnlineUrl.value = '';
    containerOnlineUrl?.classList.remove('error');
    tipOnlineUrl?.classList.remove('active');
    showModal(modalOnlineWallpaper);
    setTimeout(() => inputOnlineUrl?.focus(), 50);
  });

  btnOnlineCancel?.addEventListener('click', closeOnlineModal);

  // 点击遮罩关闭
  bindOverlayClose(modalOnlineWallpaper, closeOnlineModal);

  // 表单提交
  onlineWallpaperForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = sanitizeInput(inputOnlineUrl.value.trim());
    containerOnlineUrl?.classList.remove('error');
    tipOnlineUrl?.classList.remove('active');

    if (!url) {
      containerOnlineUrl?.classList.add('error');
      tipOnlineUrl?.classList.add('active');
      inputOnlineUrl?.focus();
      return;
    }

    // 简单URL格式校验
    try {
      new URL(url);
    } catch (_) {
      containerOnlineUrl?.classList.add('error');
      tipOnlineUrl?.classList.add('active');
      inputOnlineUrl?.focus();
      return;
    }

    // 判断类型（根据文件扩展名）
    const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url);
    setState('customWallpaper', { type: isVideo ? 'video' : 'image', url: url });
    if (!state.bgEnabled) {
      setState('bgEnabled', true);
    }
    applyBackgroundState();
    if (toggleBgSwitch) toggleBgSwitch.checked = true;
    if (toggleBgModalSwitch) toggleBgModalSwitch.checked = true;
    updateStatusTexts();
    closeOnlineModal();
  });

  // 输入时清除错误状态
  inputOnlineUrl?.addEventListener('input', () => {
    containerOnlineUrl?.classList.remove('error');
    tipOnlineUrl?.classList.remove('active');
  });
}

export { applyBackgroundState, applyEnhancedVisibility, renderWallpaper };
