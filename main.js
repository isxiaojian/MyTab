import { state, loadState, setState } from './storage.js';
import { updateStatusTexts, sanitizeInput, showModal, hideModal, bindOverlayClose } from './utils.js';
import { initWallpaper } from './wallpaper.js';
import { initQuicklinks } from './quicklinks.js';
import { initSearch, fetchAndShowSuggestions } from './search.js';

const logos = {
  bing: `
    <svg aria-hidden="true" id="logo-icon" width="48" height="48" viewBox="0 0 48 48">
      <path fill="#00A4EF" d="M22.7 25.2H0v22.7h22.7V25.2Z"></path>
      <path fill="#FFB900" d="M47.79 25.2h-22.7v22.7h22.7V25.2Z"></path>
      <path fill="#7FBA00" d="M47.79.1h-22.7v22.7h22.7V.1Z"></path>
      <path fill="#F25022" d="M22.7.1H0v22.7h22.7V.1Z"></path>
    </svg>
    <svg aria-hidden="true" id="logo-text" width="163" height="48" viewBox="0 0 163 48">
      <path id="logo-text-path" d="M31.19 9.66v28.68H26.2v-22.5h-.1l-8.86 22.5h-3.29L4.9 15.84h-.1v22.5H.22V9.66H7.4l8.26 21.2h.1l8.67-21.2h6.77Zm4.08 2.2c0-.8.3-1.5.9-2 .6-.5 1.29-.8 2.08-.8.9 0 1.6.3 2.1.9.5.5.9 1.2.9 2 0 .79-.3 1.49-.9 1.98-.6.5-1.3.8-2.1.8-.9 0-1.49-.3-2.09-.8-.5-.7-.9-1.39-.9-2.09Zm5.37 5.87v20.6h-4.87v-20.6h4.87Zm14.74 17.12a9.16 9.16 0 0 0 4.78-1.79v4.48c-.8.5-1.7.8-2.7 1-.99.2-2.08.3-3.28.3-3.08 0-5.47-.9-7.36-2.9a9.98 9.98 0 0 1-2.9-7.26c0-3.29 1-6.07 2.9-8.16 1.89-2.1 4.68-3.19 8.26-3.19.9 0 1.8.1 2.69.3.9.3 1.69.5 2.19.8v4.67c-.7-.5-1.5-1-2.3-1.29-.79-.3-1.58-.5-2.38-.5-1.9 0-3.49.6-4.68 1.9-1.2 1.29-1.8 2.88-1.8 5.07 0 2.1.5 3.68 1.7 4.88a7.45 7.45 0 0 0 4.88 1.7ZM73.9 17.43c.4 0 .7 0 1.1.1.29.1.59.1.79.2v4.88c-.3-.2-.6-.3-1.1-.5-.5-.2-1.1-.3-1.79-.3-1.2 0-2.19.5-2.99 1.5-.8.99-1.29 2.48-1.29 4.67v10.36h-4.88V17.73h4.88V21h.1c.5-1.1 1.1-1.99 1.99-2.68.8-.6 1.9-.9 3.19-.9Zm2.09 10.95c0-3.38.9-6.07 2.88-8.06 1.9-2 4.58-2.99 8.07-2.99 3.18 0 5.67.9 7.46 2.89 1.8 1.89 2.7 4.48 2.7 7.76 0 3.29-.9 5.98-2.9 7.97-1.89 1.99-4.47 2.98-7.86 2.98-3.19 0-5.67-.9-7.57-2.78-1.89-2-2.78-4.58-2.78-7.77Zm5.07-.2c0 2.1.5 3.78 1.5 4.88a5.4 5.4 0 0 0 4.18 1.7c1.8 0 3.09-.6 4.08-1.7.9-1.1 1.4-2.79 1.4-5.08 0-2.19-.5-3.88-1.5-4.98a4.97 4.97 0 0 0-3.98-1.69c-1.8 0-3.09.6-4.08 1.8-1.2 1.19-1.6 2.88-1.6 5.07Zm23.2-4.98c0 .7.2 1.3.7 1.7.5.4 1.4.9 2.89 1.49 1.89.8 3.28 1.7 4.08 2.59.8 1 1.2 2.09 1.2 3.48 0 1.9-.7 3.49-2.3 4.68-1.5 1.2-3.48 1.8-6.07 1.8a15.8 15.8 0 0 1-5.58-1.1v-4.88c.9.6 1.9 1.1 2.9 1.5.99.3 1.88.5 2.78.5 1.1 0 1.89-.1 2.39-.5.5-.3.8-.8.8-1.5s-.3-1.3-.8-1.7c-.5-.49-1.6-.99-3.09-1.59a8.89 8.89 0 0 1-3.78-2.48 5.7 5.7 0 0 1-1.1-3.59c0-1.89.7-3.38 2.2-4.58a8.8 8.8 0 0 1 5.67-1.79c.7 0 1.5.1 2.39.3.9.1 1.69.4 2.29.6v4.58c-.7-.4-1.4-.8-2.3-1.1-.89-.3-1.69-.5-2.48-.5-.9 0-1.7.2-2.1.5-.39.5-.69.9-.69 1.6Zm10.85 5.18c0-3.38.9-6.07 2.89-8.06 2-2 4.58-2.99 8.06-2.99 3.19 0 5.68.9 7.47 2.89 1.8 1.89 2.69 4.48 2.69 7.76 0 3.29-.9 5.98-2.89 7.97-1.89 1.99-4.48 2.98-7.86 2.98-3.19 0-5.68-.9-7.57-2.78-1.8-2-2.79-4.58-2.79-7.77Zm5.08-.2c0 2.1.5 3.78 1.5 4.88a5.4 5.4 0 0 0 4.17 1.7c1.8 0 3.1-.6 4.09-1.7.9-1.1 1.4-2.79 1.4-5.08 0-2.19-.5-3.88-1.5-4.98a4.96 4.96 0 0 0-3.98-1.69c-1.8 0-3.1.6-4.09 1.8-1.1 1.19-1.59 2.88-1.59 5.07Zm32.16-6.47h-7.27v16.63h-4.88V21.7h-3.48v-3.98h3.48v-2.89c0-2.19.7-3.88 2.1-5.28a7.28 7.28 0 0 1 5.37-2.09c.6 0 1.1 0 1.6.1.49.1.89.1 1.19.3v4.18c-.1-.1-.5-.2-.9-.3-.4-.1-.9-.2-1.4-.2-.99 0-1.79.3-2.28.9-.5.7-.8 1.6-.8 2.79v2.49h7.27v-4.68l4.88-1.5v6.08h4.87v3.98h-4.87v9.66c0 1.3.2 2.19.7 2.69.49.5 1.19.8 2.18.8.3 0 .6-.1 1-.2s.7-.3 1.1-.5v3.98c-.3.2-.8.3-1.5.5-.7.1-1.4.2-2.1.2-2.08 0-3.58-.5-4.57-1.7-1-1.1-1.5-2.69-1.5-4.88V21.71h-.2Z"></path>
    </svg>
  `,
  baidu: `
    <picture>
      <source srcset="img/logo/baidu_logo_dark.png" media="(prefers-color-scheme: dark)">
      <img src="img/logo/baidu_logo_light.png" alt="Baidu Logo" class="baidu-logo-img">
    </picture>
  `,
  google: `
    <picture>
      <source srcset="img/logo/google_logo_dark.png" media="(prefers-color-scheme: dark)">
      <img src="img/logo/google_logo_light.png" alt="Google Logo" class="google-logo-img">
    </picture>
  `,
  custom: ``
};



// ===== 工具提示(Tooltip) 初始化 =====
function initTooltips() {
  // 存储当前显示中的 tooltip 位置更新函数，用于滚动/缩放时重新定位
  const activeTooltipIcons = new Set();

  const tooltipReposition = () => {
    activeTooltipIcons.forEach(fn => fn());
  };
  window.addEventListener('scroll', tooltipReposition, true);
  window.addEventListener('resize', tooltipReposition);

  document.querySelectorAll('.tooltip-icon').forEach(icon => {
    const tooltip = icon.querySelector('.tooltip-content');
    if (!tooltip) return;

    // 关键：初始化时就将 tooltip 移到 body，而不是在 show 时
    document.body.appendChild(tooltip);

    let tipWidth = 0;
    let tipHeight = 0;

    // 测量 tooltip 尺寸（首次显示前调用，确保内容已渲染）
    const measureTooltip = () => {
      const tipRect = tooltip.getBoundingClientRect();
      tipWidth = tipRect.width;
      tipHeight = tipRect.height;
    };

    // 根据图标位置计算 tooltip 显示坐标
    const position = () => {
      if (tipWidth === 0 || tipHeight === 0) {
        measureTooltip();
      }
      const rect = icon.getBoundingClientRect();

      // 默认在图标上方显示
      let left = rect.left + rect.width / 2 - tipWidth / 2;
      let top = rect.top - tipHeight - 10;
      let below = false;

      // 如果上方空间不足（<8px），且下方空间充足，则改为下方显示
      if (top < 8 && rect.bottom + tipHeight + 10 < window.innerHeight) {
        top = rect.bottom + 10;
        below = true;
      }

      // 水平方向边界约束，防止超出视口
      left = Math.max(8, Math.min(left, window.innerWidth - tipWidth - 8));

      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';

      // 根据显示方向切换箭头朝向
      if (below) {
        tooltip.classList.add('tooltip-below');
      } else {
        tooltip.classList.remove('tooltip-below');
      }
    };

    const show = () => {
      measureTooltip();
      position();
      tooltip.style.visibility = 'visible';
      tooltip.style.opacity = '1';
      activeTooltipIcons.add(position);
    };

    const hide = () => {
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity = '0';
      activeTooltipIcons.delete(position);
    };

    icon.addEventListener('mouseenter', show);
    icon.addEventListener('focus', show);
    icon.addEventListener('click', show);
    icon.addEventListener('mouseleave', hide);
    icon.addEventListener('blur', hide);
  });
}



// ===== 重写下拉菜单(Custom Select) =====


  // 清除下拉面板的内联样式（transform/visibility），
  // 这些样式由 activateDropdown() 临时设置用于动画起始状态
  function clearDropdownInlineStyles(dd) {
    dd.style.transform = '';
    dd.style.visibility = '';
  }

  function initCustomSelects() {
    const displays = document.querySelectorAll('.custom-select-display');
    displays.forEach(display => {
      const selectId = display.getAttribute('data-for');
      const nativeSelect = document.getElementById(selectId);
      if (!nativeSelect) return;

      const textEl = display.querySelector('.custom-select-text');
      let dropdown = null;

      // 关闭所有其他已打开的下拉（除了 exceptDisplay 对应的那个）
      function closeAll(exceptDisplay) {
        document.querySelectorAll('.custom-select-dropdown.active').forEach(dd => {
          if (dd._display !== exceptDisplay) {
            dd.classList.remove('active');
            clearDropdownInlineStyles(dd);
            dd._display.classList.remove('active');
          }
        });
      }

      // 将原生 select 的选中项文本同步到自定义显示组件
      function updateDisplayText() {
        const selectedOption = nativeSelect.options[nativeSelect.selectedIndex];
        if (selectedOption) {
          textEl.textContent = selectedOption.textContent.trim();
        }
      }

      // 根据可用空间计算下拉面板的位置和展开方向
      // 返回值：dropdown._openingUp = true 表示向上展开
      function positionDropdown() {
        if (!dropdown) return;
        const rect = display.getBoundingClientRect();
        dropdown.style.width = rect.width + 'px';

        const dropdownHeight = dropdown.offsetHeight;
        const spaceBelow = window.innerHeight - rect.bottom - 4;
        const spaceAbove = rect.top - 4;

        let openingUp = false;

        // 优先在下方展开（空间充足时）
        if (spaceBelow >= dropdownHeight) {
          dropdown.style.top = rect.bottom + 4 + 'px';
          dropdown.style.left = rect.left + 'px';
        } else if (spaceAbove > spaceBelow && spaceAbove > 0) {
          // 上方空间比下方大，且上方有空间，则向上展开
          dropdown.style.top = Math.max(4, rect.top - dropdownHeight - 4) + 'px';
          dropdown.style.left = rect.left + 'px';
          openingUp = true;
        } else {
          // 空间都不足时，选择可见区域更大的方向，并夹紧到视口内
          const belowTop = rect.bottom + 4;
          const belowClamped = Math.min(belowTop, window.innerHeight - dropdownHeight - 4);
          const aboveTop = rect.top - dropdownHeight - 4;
          const aboveClamped = Math.max(4, aboveTop);

          const belowVisible = window.innerHeight - belowClamped - 4;
          const aboveVisible = aboveClamped + dropdownHeight;

          if (belowVisible >= aboveVisible) {
            dropdown.style.top = belowClamped + 'px';
          } else {
            dropdown.style.top = aboveClamped + 'px';
            openingUp = true;
          }
          dropdown.style.left = rect.left + 'px';
        }

        dropdown._openingUp = openingUp;
      }

      // 激活下拉面板
      function activateDropdown() {
        const openingUp = dropdown._openingUp;
        dropdown.style.transform = openingUp ? 'translateY(4px)' : 'translateY(-4px)';
        dropdown.style.visibility = 'visible';

        // 强制重排，让上述 transform 生效，确保 transition 起点正确
        void dropdown.offsetHeight;

        display.classList.add('active');
        dropdown.classList.add('active');
        dropdown.style.transform = '';
      }

      // 构建下拉面板 DOM —— 从原生 select 的 options 生成自定义选项
      function buildDropdown() {
        if (dropdown) dropdown.remove();
        dropdown = document.createElement('div');
        dropdown.className = 'custom-select-dropdown';
        dropdown._display = display;
        dropdown.setAttribute('data-for-select', selectId);

        Array.from(nativeSelect.options).forEach((opt, index) => {
          const optionEl = document.createElement('div');
          optionEl.className = 'custom-select-option';
          optionEl.textContent = opt.textContent.trim();
          optionEl.setAttribute('data-value', opt.value);
          if (index === nativeSelect.selectedIndex) {
            optionEl.classList.add('selected');
          }
          optionEl.addEventListener('click', (e) => {
            e.stopPropagation();
            nativeSelect.value = opt.value;
            nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
            closeAll(null);
            updateDisplayText();
          });
          dropdown.appendChild(optionEl);
        });

        // 挂到 body 上，脱离父容器 overflow 裁剪
        document.body.appendChild(dropdown);
        positionDropdown();
      }

      // 点击触发器：切换下拉的展开/收起
      display.addEventListener('click', (e) => {
        e.stopPropagation();
        if (display.classList.contains('active')) {
          closeAll(null);
        } else {
          closeAll(display);
          if (!dropdown || !dropdown.isConnected) {
            buildDropdown();
          } else {
            positionDropdown();
            dropdown.querySelectorAll('.custom-select-option').forEach((optEl, i) => {
              optEl.classList.toggle('selected', i === nativeSelect.selectedIndex);
            });
          }
          activateDropdown();
        }
      });

      // 原生 select 变化时同步 UI
      nativeSelect.addEventListener('change', () => {
        updateDisplayText();
        if (dropdown) {
          dropdown.querySelectorAll('.custom-select-option').forEach((optEl, i) => {
            optEl.classList.toggle('selected', i === nativeSelect.selectedIndex);
          });
        }
      });

      updateDisplayText();
    });

    // 点击页面其他位置时关闭所有下拉
    document.addEventListener('click', (e) => {
      const isClickOnDropdown = e.target.closest('.custom-select-dropdown');
      const isClickOnDisplay = e.target.closest('.custom-select-display');
      if (!isClickOnDropdown && !isClickOnDisplay) {
        document.querySelectorAll('.custom-select-dropdown.active').forEach(dd => {
          dd.classList.remove('active');
          clearDropdownInlineStyles(dd);
          dd._display.classList.remove('active');
        });
      }
    });

    // ESC 键关闭所有下拉
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.custom-select-dropdown.active').forEach(dd => {
          dd.classList.remove('active');
          clearDropdownInlineStyles(dd);
          dd._display.classList.remove('active');
        });
      }
    });

    // 滚动/窗口大小变化时重新定位下拉面板
    // 如果触发器已不可见则直接关闭
    function repositionOrClose() {
      const activeDropdowns = document.querySelectorAll('.custom-select-dropdown.active');
      if (!activeDropdowns.length) return;
      activeDropdowns.forEach(dd => {
        const display = dd._display;
        if (!display || !document.body.contains(display)) {
          dd.classList.remove('active');
          clearDropdownInlineStyles(dd);
          if (display) display.classList.remove('active');
          return;
        }
        const rect = display.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) {
          dd.classList.remove('active');
          clearDropdownInlineStyles(dd);
          display.classList.remove('active');
          return;
        }
        dd.style.width = rect.width + 'px';
        const dropdownHeight = dd.offsetHeight;
        const spaceBelow = window.innerHeight - rect.bottom - 4;
        const spaceAbove = rect.top - 4;

        if (spaceBelow >= dropdownHeight) {
          dd.style.top = rect.bottom + 4 + 'px';
          dd.style.left = rect.left + 'px';
        } else if (spaceAbove > spaceBelow && spaceAbove > 0) {
          dd.style.top = Math.max(4, rect.top - dropdownHeight - 4) + 'px';
          dd.style.left = rect.left + 'px';
        } else {
          const belowTop = rect.bottom + 4;
          const belowClamped = Math.min(belowTop, window.innerHeight - dropdownHeight - 4);
          const aboveTop = rect.top - dropdownHeight - 4;
          const aboveClamped = Math.max(4, aboveTop);
          const belowVisible = window.innerHeight - belowClamped - 4;
          const aboveVisible = aboveClamped + dropdownHeight;
          if (belowVisible >= aboveVisible) {
            dd.style.top = belowClamped + 'px';
          } else {
            dd.style.top = aboveClamped + 'px';
          }
          dd.style.left = rect.left + 'px';
        }
    });
  }

  const settingsPanel = document.getElementById('popover-settings');
  if (settingsPanel) {
    settingsPanel.addEventListener('scroll', repositionOrClose);
  }
  window.addEventListener('resize', repositionOrClose);
  window.addEventListener('scroll', repositionOrClose, true);
}

document.addEventListener('DOMContentLoaded', () => {
  // DOM元素引用
  const btnWaffle = document.getElementById('waffle');
  const btnSettings = document.getElementById('settings');
  const btnCloseSettings = document.getElementById('btn-close-settings');
  const popoverWaffle = document.getElementById('popover-waffle');
  const popoverSettings = document.getElementById('popover-settings');

  const selectEngine = document.getElementById('select-engine');
  const btnEditEngine = document.getElementById('btn-edit-engine');
  const forceBingCNRow = document.getElementById('force-bing-cn-row');
  const toggleForceBingCN = document.getElementById('toggle-force-bing-cn');
  const toggleHistorySwitch = document.getElementById('toggle-history-switch');
  const statusHistoryText = document.getElementById('status-history');
  const logoContainer = document.getElementById('logo');



  // Modal相关DOM元素(自定义搜索引擎
  const customEngineModal = document.getElementById('custom-engine-modal');
  const customEngineForm = document.getElementById('custom-engine-form');
  const inputEngineName = document.getElementById('input-engine-name');
  const inputEngineUrl = document.getElementById('input-engine-url');
  const containerEngineName = document.getElementById('container-engine-name');
  const containerEngineUrl = document.getElementById('container-engine-url');
  const tipEngineName = document.getElementById('tip-engine-name');
  const tipEngineUrl = document.getElementById('tip-engine-url');
  const textEngineUrlError = document.getElementById('text-engine-url-error');
  const btnEngineCancel = document.getElementById('btn-engine-cancel');




  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    var link = document.getElementById('favicon');
    if (link) {
      var icon = e.matches ? 'img/icon_d.png' : 'img/icon_l.png';
      link.href = icon + '?r=' + Math.random();
    }
  });


  // 切换弹出层动画
  function togglePopover(popoverToToggle, otherPopover) {
    otherPopover.classList.remove('active');
    popoverToToggle.classList.toggle('active');
  }

  btnWaffle?.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePopover(popoverWaffle, popoverSettings);
  });

  btnSettings?.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePopover(popoverSettings, popoverWaffle);
  });

  if (btnCloseSettings) {
    btnCloseSettings.addEventListener('click', () => {
      popoverSettings.classList.remove('active');
      document.querySelectorAll('.custom-select-dropdown.active').forEach(dd => {
        dd.classList.remove('active');
        clearDropdownInlineStyles(dd);
        if (dd._display) dd._display.classList.remove('active');
      });
    });
  }

  document.addEventListener('click', (e) => {
    if (!popoverWaffle?.contains(e.target) && !btnWaffle?.contains(e.target)) {
      popoverWaffle?.classList.remove('active');
    }
    if (!popoverSettings?.contains(e.target) && !btnSettings?.contains(e.target)) {
      popoverSettings?.classList.remove('active');
    }
  });

  // 切换Logo
  function setLogo(engine) {
    if (logos[engine] !== undefined && logoContainer) {
      logoContainer.innerHTML = logos[engine];
    }
  }

  // 动态管理自定义搜索引擎编辑按钮显隐
  function updateEngineEditButton(engine) {
    if (btnEditEngine) {
      btnEditEngine.style.display = engine === 'custom' ? 'inline-flex' : 'none';
    }
  }

  // 根据当前引擎决定是否显示"强制必应中国版"选项行
  function updateForceBingCNRow(engine) {
    if (forceBingCNRow) {
      forceBingCNRow.style.display = engine === 'bing' ? 'flex' : 'none';
    }
  }

    // 时间开关相关函数
  let timeCapsuleTimer = null;

  // 更新时间显示的当前时间与日期文本
  function updateTimeCapsule() {
    const display = document.getElementById('time-display');
    if (!display) return;
    if (!display.classList.contains('active')) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = hours + ':' + minutes;
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = year + '/' + month + '/' + day;

    const timeValue = display.querySelector('.time-value');
    const timeDate = display.querySelector('.time-date');
    if (timeValue) timeValue.innerText = timeStr;
    if (timeDate) timeDate.innerText = dateStr;
  }

  // 根据设置控制时间的显示/隐藏与定时器启停
  function applyTimeCapsuleVisibility() {
    const display = document.getElementById('time-display');
    if (!display) return;
    if (state.showTimeCapsule) {
      display.classList.add('active');
      updateTimeCapsule();
      startTimeCapsuleTimer();
    } else {
      display.classList.remove('active');
      stopTimeCapsuleTimer();
    }
  }

  // 根据设置控制菜单按钮（饼图标）的显示/隐藏
  function applyMenuButtonVisibility() {
    const btn = document.getElementById('waffle');
    const popover = document.getElementById('popover-waffle');
    if (!btn) return;
    if (state.showMenuButton) {
      btn.style.display = '';
      if (popover) popover.style.display = '';
    } else {
      btn.style.display = 'none';
      if (popover) popover.classList.remove('active');
    }
  }

  // 启动时间定时器（每分钟更新一次）
  function startTimeCapsuleTimer() {
    if (timeCapsuleTimer) clearInterval(timeCapsuleTimer);
    updateTimeCapsule();
    timeCapsuleTimer = setInterval(updateTimeCapsule, 60000);
  }

  // 停止时间定时器
  function stopTimeCapsuleTimer() {
    if (timeCapsuleTimer) {
      clearInterval(timeCapsuleTimer);
      timeCapsuleTimer = null;
    }
  }

  // B1.读取并应用保存的页面设置
  loadState();
  if (state.engine === 'bingCN') {
    setState('engine', 'bing');
    setState('forceBingCN', true);
  }

  if (selectEngine) selectEngine.value = state.engine;
  if (toggleHistorySwitch) toggleHistorySwitch.checked = state.historyEnabled;
  if (toggleForceBingCN) toggleForceBingCN.checked = state.forceBingCN;

  setLogo(state.engine);
  updateEngineEditButton(state.engine);
  updateForceBingCNRow(state.engine);
  document.body.setAttribute('data-layout', state.layout);

  // 初始化各功能模块（壁纸/快速链接/搜索）
  initWallpaper();
  initQuicklinks();
  initSearch();



// 管理配置文件

// 初始化配置 - 打开重置确认弹窗
document.getElementById('btn-init-config')?.addEventListener('click', () => {
  popoverWaffle?.classList.remove('active');
  showModal(document.getElementById('modal-reset-confirm'));
});

// ===== 重置确认弹窗事件 =====
const modalResetConfirm = document.getElementById('modal-reset-confirm');
const btnResetCancel = document.getElementById('btn-reset-cancel');
const btnResetConfirm = document.getElementById('btn-reset-confirm');

// 取消按钮
btnResetCancel?.addEventListener('click', () => {
  hideModal(modalResetConfirm);
});

// 确定按钮 - 执行重置
btnResetConfirm?.addEventListener('click', () => {
  // 删除所有以 ntp_ 开头的 localStorage 项
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('ntp_')) {
      localStorage.removeItem(key);
    }
  });
  hideModal(modalResetConfirm);
  // 显示完成弹窗
  showModal(document.getElementById('modal-reset-done'));
});

// 完成弹窗 - 刷新页面
document.getElementById('btn-reset-done-confirm')?.addEventListener('click', () => {
  window.location.reload();
});

// 点击遮罩也可刷新
bindOverlayClose(document.getElementById('modal-reset-done'), () => window.location.reload());

// ===== 管理配置文件 - 导出/恢复 =====
const modalManageProfiles = document.getElementById('modal-manage-profiles');
const btnManageProfiles = document.getElementById('btn-manage-profiles');
const btnExportConfig = document.getElementById('btn-export-config');
const btnImportConfig = document.getElementById('btn-import-config');
const btnManageProfilesCancel = document.getElementById('btn-manage-profiles-cancel');
const fileInputRestore = document.getElementById('file-input-restore');

// 打开管理配置文件弹窗
btnManageProfiles?.addEventListener('click', () => {
  popoverWaffle?.classList.remove('active');
  showModal(modalManageProfiles);
});

// 取消按钮
btnManageProfilesCancel?.addEventListener('click', () => {
  hideModal(modalManageProfiles);
});

// 点击遮罩关闭
bindOverlayClose(modalManageProfiles);

// 导出配置
btnExportConfig?.addEventListener('click', () => {
  const keys = [
    'ntp_engine',
    'ntp_layout',
    'ntp_quicklinks',
    'ntp_history_enabled',
    'ntp_show_time_capsule',
    'ntp_show_menu_button',
    'ntp_force_bing_cn',
    'ntp_bg_enabled',
    'ntp_enhanced_visibility',
    'ntp_quicklinks_list',
    'ntp_search_history',
    'ntp_custom_engine_config',
    'ntp_custom_wallpaper'
  ];

  const data = {};
  keys.forEach(key => {
    const val = localStorage.getItem(key);
    if (val !== null) {
      try {
        data[key] = JSON.parse(val);
      } catch (e) {
        data[key] = val;
      }
    }
  });

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  a.download = `MyTab_Backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// 点击恢复配置 -> 触发文件选择
btnImportConfig?.addEventListener('click', () => {
  fileInputRestore?.click();
});

// 文件选择后的处理
fileInputRestore?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      // 检查是否是有效的配置文件（至少包含一些关键字段）
      if (!data || typeof data !== 'object') {
        throw new Error('无效的配置文件格式');
      }

      // 写入 localStorage
      Object.keys(data).forEach(key => {
        localStorage.setItem(key, JSON.stringify(data[key]));
      });

      alert('配置恢复成功！页面将刷新以应用所有设置。');
      window.location.reload();
    } catch (err) {
      alert('配置文件格式错误，请确保选择的是正确的 JSON 备份文件。');
      console.error('导入配置失败:', err);
    }
  };
  reader.readAsText(file);

  // 重置文件输入，允许重复选择同一文件
  fileInputRestore.value = '';
});
  


  // 初始化更新布局预设卡片选中状态
  function updateLayoutPresetUI(currentLayout) {
    document.querySelectorAll('.preset-card').forEach(card => {
      if (card.dataset.layoutVal === currentLayout) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }
  updateLayoutPresetUI(state.layout);

  // 布局卡片点击监听
  document.querySelectorAll('.preset-card').forEach(card => {
    card.addEventListener('click', () => {
      const layoutVal = card.dataset.layoutVal;
      document.body.setAttribute('data-layout', layoutVal);
      setState('layout', layoutVal);
      updateLayoutPresetUI(layoutVal);
    });
  });

  // 设置面板切换监听
  selectEngine?.addEventListener('change', (e) => {
    const val = e.target.value;
    setLogo(val);
    updateEngineEditButton(val);
    updateForceBingCNRow(val);
    setState('engine', val);
    if (val === 'custom' && (!state.customEngineConfig.url || state.customEngineConfig.url === 'https://duckduckgo.com/?q=%s')) {
      openCustomEngineModal();
    }
  });

  toggleForceBingCN?.addEventListener('change', (e) => {
    setState('forceBingCN', e.target.checked);
    updateStatusTexts(); 
  });

  btnEditEngine?.addEventListener('click', () => {
    openCustomEngineModal();
  });

  toggleHistorySwitch?.addEventListener('change', (e) => {
    setState('historyEnabled', e.target.checked);
    updateStatusTexts();
    fetchAndShowSuggestions();
  });

    // 时间开关事件
  const toggleTimeCapsuleSwitch = document.getElementById('toggle-time-capsule-switch');
  const statusTimeCapsuleText = document.getElementById('status-time-capsule');

  if (toggleTimeCapsuleSwitch) {
    toggleTimeCapsuleSwitch.checked = state.showTimeCapsule;
    if (statusTimeCapsuleText) {
      statusTimeCapsuleText.innerText = state.showTimeCapsule ? '开' : '关';
    }

    toggleTimeCapsuleSwitch.addEventListener('change', (e) => {
      setState('showTimeCapsule', e.target.checked);
      updateStatusTexts();
      applyTimeCapsuleVisibility();
    });
  }

  // 菜单按钮开关事件
  const toggleMenuButtonSwitch = document.getElementById('toggle-menu-button-switch');
  const statusMenuButtonText = document.getElementById('status-menu-button');

  if (toggleMenuButtonSwitch) {
    toggleMenuButtonSwitch.checked = state.showMenuButton;
    if (statusMenuButtonText) {
      statusMenuButtonText.innerText = state.showMenuButton ? '开' : '关';
    }

    toggleMenuButtonSwitch.addEventListener('change', (e) => {
      setState('showMenuButton', e.target.checked);
      updateStatusTexts();
      applyMenuButtonVisibility();
    });
  }

  // 如果初始状态是开启，启动定时器并显示
  if (state.showTimeCapsule) {
    applyTimeCapsuleVisibility();
  }
  // 应用菜单按钮初始可见性
  applyMenuButtonVisibility();
  
  // 自定义搜索引擎对话框逻辑
  // 打开/重置自定义搜索引擎编辑弹窗
  function openCustomEngineModal() {
    if (inputEngineName) inputEngineName.value = state.customEngineConfig.name || '';
    if (inputEngineUrl) inputEngineUrl.value = state.customEngineConfig.url || '';
    containerEngineName?.classList.remove('error');
    containerEngineUrl?.classList.remove('error');
    tipEngineName?.classList.remove('active');
    tipEngineUrl?.classList.remove('active');
    showModal(customEngineModal);
    setTimeout(() => inputEngineName?.focus(), 50);
  }

  // 关闭自定义搜索引擎编辑弹窗
  function closeCustomEngineModal() {
    hideModal(customEngineModal);
  }

  btnEngineCancel?.addEventListener('click', closeCustomEngineModal);

  customEngineForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let name = sanitizeInput(inputEngineName.value.trim());
    let url = sanitizeInput(inputEngineUrl.value.trim());
    let hasError = false;

    containerEngineName?.classList.remove('error');
    containerEngineUrl?.classList.remove('error');
    tipEngineName?.classList.remove('active');
    tipEngineUrl?.classList.remove('active');

    if (!name) {
      containerEngineName?.classList.add('error');
      tipEngineName?.classList.add('active');
      inputEngineName?.focus();
      hasError = true;
    }

    if (!url) {
      containerEngineUrl?.classList.add('error');
      tipEngineUrl?.classList.add('active');
      if (!hasError) inputEngineUrl?.focus();
      hasError = true;
    } else if (!url.includes('%s')) {
      containerEngineUrl?.classList.add('error');
      tipEngineUrl?.classList.add('active');
      if (!hasError) inputEngineUrl?.focus();
      hasError = true;
    }

    if (hasError) return;

    setState('customEngineConfig', { name, url });
    closeCustomEngineModal();
  });



  // 初始化状态文字与提示组件
  updateStatusTexts();
  initTooltips();

  // 初始化自定义下拉组件
  initCustomSelects();
});