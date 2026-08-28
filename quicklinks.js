import { state, setState } from './storage.js';
import { getDomain, getFaviconUrl, sanitizeInput } from './utils.js';

// ===== 快速链接模块 =====
// DOM 引用（type=module 为 defer，模块加载时 DOM 已就绪）
const quicklinksElem = document.getElementById('quicklinks');
const selectQuicklinks = document.getElementById('select-quicklinks');
const modalOverlay = document.getElementById('modal');
const modalForm = document.getElementById('modal-form');
const inputName = document.getElementById('input-name');
const inputUrl = document.getElementById('input-url');
const containerName = document.getElementById('container-name');
const containerUrl = document.getElementById('container-url');
const tipName = document.getElementById('tip-name');
const tipUrl = document.getElementById('tip-url');
const btnDelete = document.getElementById('btn-delete');
const btnCancel = document.getElementById('btn-cancel');

// 模块内共享状态
let currentEditingId = null;
let draggedId = null;

// 渲染快速链接列表
function renderQuicklinks() {
  if (!quicklinksElem) return;
  const rows = quicklinksElem.getAttribute('rows');

  // 获取静态添加按钮（如果不存在则创建）
  let addBtnStatic = quicklinksElem.querySelector('.quicklink-add-static');
  if (!addBtnStatic) {
    addBtnStatic = document.createElement('div');
    addBtnStatic.className = 'quicklink-item quicklink-add-btn quicklink-add-static';
    addBtnStatic.style.display = 'none';
    addBtnStatic.innerHTML = `
      <div class="quicklink-icon quicklink-add-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </div>
      <span class="quicklink-title">添加</span>
    `;
    quicklinksElem.appendChild(addBtnStatic);
  }
  if (addBtnStatic.dataset.bound !== 'true') {
    addBtnStatic.addEventListener('click', () => openAddModal());
    addBtnStatic.dataset.bound = 'true';
  }

  // 清空所有动态生成的快速链接（保留静态按钮）
  const items = quicklinksElem.querySelectorAll('.quicklink-item:not(.quicklink-add-static)');
  items.forEach(el => el.remove());

  if (rows === '0') {
    addBtnStatic.style.display = 'none';
    return;
  }

  // 渲染已有的快速链接
  state.quicklinksList.forEach(item => {
    const linkElem = document.createElement('a');
    linkElem.href = item.url;
    linkElem.className = 'quicklink-item';
    linkElem.target = '_blank';
    linkElem.setAttribute('data-id', item.id);

    const safeTitle = sanitizeInput(item.title);
    const initialChar = (safeTitle || 'W').charAt(0).toUpperCase();
    const faviconUrl = getFaviconUrl(item.url);

    let iconContent = '';
    if (faviconUrl) {
      iconContent = `<img src="${faviconUrl}" alt="${safeTitle}" loading="lazy"
                        onerror="this.onerror=null; this.parentNode.innerText='${initialChar}';">`;
    } else {
      iconContent = initialChar;
    }

    linkElem.innerHTML = `
      <div class="quicklink-icon">${iconContent}</div>
      <span class="quicklink-title">${safeTitle}</span>
      <button type="button" class="quicklink-edit-btn" title="编辑快速链接">
        <svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"/>
        </svg>
      </button>
    `;

    // 拖拽事件
    linkElem.draggable = true;
    linkElem.addEventListener('dragstart', onDragStart);
    linkElem.addEventListener('dragend', onDragEnd);
    linkElem.addEventListener('dragover', onDragOver);
    linkElem.addEventListener('dragenter', onDragEnter);
    linkElem.addEventListener('dragleave', onDragLeave);
    linkElem.addEventListener('drop', onDrop);

    const editBtn = linkElem.querySelector('.quicklink-edit-btn');
    editBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openEditModal(item);
    });

    quicklinksElem.insertBefore(linkElem, addBtnStatic);
  });

  addBtnStatic.style.display = 'flex';
  quicklinksElem.appendChild(addBtnStatic);
}

// ========== 拖拽事件处理函数 ==========
function onDragStart(e) {
  const item = e.currentTarget;
  const id = item.dataset.id;
  if (!id) {
    e.preventDefault();
    return;
  }
  draggedId = id;
  e.dataTransfer.effectAllowed = 'move';
  item.classList.add('dragging');
}

function onDragEnd(e) {
  const item = e.currentTarget;
  item.classList.remove('dragging');
  document.querySelectorAll('.quicklink-item.drag-over').forEach(el => {
    el.classList.remove('drag-over');
  });
  draggedId = null;
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function onDragEnter(e) {
  e.preventDefault();
  const target = e.currentTarget;
  const targetId = target.dataset.id;
  if (targetId && targetId !== draggedId) {
    target.classList.add('drag-over');
  }
}

function onDragLeave(e) {
  const target = e.currentTarget;
  target.classList.remove('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  const target = e.currentTarget;
  target.classList.remove('drag-over');

  const targetId = target.dataset.id;
  if (!targetId || !draggedId || targetId === draggedId) {
    return;
  }

  const draggedIndex = state.quicklinksList.findIndex(item => item.id === draggedId);
  const targetIndex = state.quicklinksList.findIndex(item => item.id === targetId);

  if (draggedIndex === -1 || targetIndex === -1) {
    return;
  }

  const [draggedItem] = state.quicklinksList.splice(draggedIndex, 1);
  state.quicklinksList.splice(targetIndex, 0, draggedItem);

  setState('quicklinksList', state.quicklinksList);
  renderQuicklinks();
}

// ===== 快速链接弹窗校验 =====
function clearErrors() {
  containerName?.classList.remove('error');
  containerUrl?.classList.remove('error');
  tipName?.classList.remove('active');
  tipUrl?.classList.remove('active');
}

function showNameError() {
  containerName?.classList.add('error');
  tipName?.classList.add('active');
}

function showUrlError() {
  containerUrl?.classList.add('error');
  tipUrl?.classList.add('active');
}

function openAddModal() {
  currentEditingId = null;
  if (inputName) inputName.value = '';
  if (inputUrl) inputUrl.value = '';
  clearErrors();
  if (btnDelete) btnDelete.style.display = 'none';
  modalOverlay?.classList.add('active');
  setTimeout(() => inputName?.focus(), 50);
}

function openEditModal(item) {
  currentEditingId = item.id;
  if (inputName) inputName.value = item.title;
  if (inputUrl) inputUrl.value = item.url;
  clearErrors();
  if (btnDelete) btnDelete.style.display = 'inline-flex';
  modalOverlay?.classList.add('active');
  setTimeout(() => inputName?.focus(), 50);
}

function closeModal() {
  modalOverlay?.classList.remove('active');
  currentEditingId = null;
  clearErrors();
}

// 初始化快速链接模块：绑定事件并首次渲染
export function initQuicklinks() {
  if (selectQuicklinks) selectQuicklinks.value = state.quicklinksRow;
  quicklinksElem?.setAttribute('rows', state.quicklinksRow);

  selectQuicklinks?.addEventListener('change', (e) => {
    const val = e.target.value;
    quicklinksElem?.setAttribute('rows', val);
    setState('quicklinksRow', val);
    renderQuicklinks();
  });

  inputName?.addEventListener('input', () => {
    containerName?.classList.remove('error');
    tipName?.classList.remove('active');
  });

  inputUrl?.addEventListener('input', () => {
    containerUrl?.classList.remove('error');
    tipUrl?.classList.remove('active');
  });

  btnCancel?.addEventListener('click', closeModal);

  btnDelete?.addEventListener('click', () => {
    if (currentEditingId) {
      setState('quicklinksList', state.quicklinksList.filter(item => item.id !== currentEditingId));
      renderQuicklinks();
      closeModal();
    }
  });

  modalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const title = sanitizeInput(inputName.value.trim());
    let url = sanitizeInput(inputUrl.value.trim());
    let hasError = false;

    if (!title) {
      showNameError();
      inputName.focus();
      hasError = true;
    }

    if (!url) {
      showUrlError();
      if (!hasError) inputUrl.focus();
      hasError = true;
    } else {
      const domain = getDomain(url);
      if (!domain) {
        showUrlError();
        if (!hasError) inputUrl.focus();
        hasError = true;
      }
    }

    if (hasError) return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (currentEditingId) {
      const itemIndex = state.quicklinksList.findIndex(item => item.id === currentEditingId);
      if (itemIndex !== -1) {
        state.quicklinksList[itemIndex] = { ...state.quicklinksList[itemIndex], title, url };
      }
    } else {
      const newItem = {
        id: Date.now().toString(),
        title,
        url
      };
      state.quicklinksList.push(newItem);
    }

    setState('quicklinksList', state.quicklinksList);
    renderQuicklinks();
    closeModal();
  });

  renderQuicklinks();
}

export { renderQuicklinks };
