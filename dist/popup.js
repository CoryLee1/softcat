/******/ (() => { // webpackBootstrap
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// extension/popup/popup.js - 修复版本
// 改进用户界面和错误处理

document.addEventListener('DOMContentLoaded', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
  var toggleBtn, statusDiv, debugBtn, resetBtn, settingsBtn;
  return _regenerator().w(function (_context) {
    while (1) switch (_context.n) {
      case 0:
        console.log('弹窗已加载');

        // 获取DOM元素
        toggleBtn = document.getElementById('toggleSoftCat');
        statusDiv = document.getElementById('status');
        debugBtn = document.getElementById('toggleDebug');
        resetBtn = document.getElementById('resetCat');
        settingsBtn = document.getElementById('settings'); // 初始化界面
        _context.n = 1;
        return updateUI();
      case 1:
        // 绑定事件监听器
        if (toggleBtn) {
          toggleBtn.addEventListener('click', toggleSoftCat);
        }
        if (debugBtn) {
          debugBtn.addEventListener('click', toggleDebug);
        }
        if (resetBtn) {
          resetBtn.addEventListener('click', resetCat);
        }
        if (settingsBtn) {
          settingsBtn.addEventListener('click', openSettings);
        }

        // 定期更新状态
        setInterval(updateUI, 2000);
      case 2:
        return _context.a(2);
    }
  }, _callee);
})));

// 切换软体猫状态
function toggleSoftCat() {
  return _toggleSoftCat.apply(this, arguments);
} // 切换调试模式
function _toggleSoftCat() {
  _toggleSoftCat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var toggleBtn, statusDiv, response, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          toggleBtn = document.getElementById('toggleSoftCat');
          statusDiv = document.getElementById('status');
          _context2.p = 1;
          // 禁用按钮防止重复点击
          toggleBtn.disabled = true;
          toggleBtn.textContent = '处理中...';

          // 向后台脚本发送消息
          _context2.n = 2;
          return sendMessageToBackground({
            action: 'toggleSoftCat'
          });
        case 2:
          response = _context2.v;
          if (!response.success) {
            _context2.n = 4;
            break;
          }
          showStatus(response.message, 'success');
          _context2.n = 3;
          return updateUI();
        case 3:
          _context2.n = 5;
          break;
        case 4:
          showStatus("\u64CD\u4F5C\u5931\u8D25: ".concat(response.error), 'error');
        case 5:
          _context2.n = 7;
          break;
        case 6:
          _context2.p = 6;
          _t = _context2.v;
          console.error('切换软体猫失败:', _t);
          showStatus('操作失败，请重试', 'error');
        case 7:
          _context2.p = 7;
          // 重新启用按钮
          setTimeout(function () {
            toggleBtn.disabled = false;
            updateButtonText();
          }, 1000);
          return _context2.f(7);
        case 8:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 6, 7, 8]]);
  }));
  return _toggleSoftCat.apply(this, arguments);
}
function toggleDebug() {
  return _toggleDebug.apply(this, arguments);
} // 重置软体猫
function _toggleDebug() {
  _toggleDebug = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var _yield$chrome$tabs$qu, _yield$chrome$tabs$qu2, tab, _t2;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          _context3.n = 1;
          return chrome.tabs.query({
            active: true,
            currentWindow: true
          });
        case 1:
          _yield$chrome$tabs$qu = _context3.v;
          _yield$chrome$tabs$qu2 = _slicedToArray(_yield$chrome$tabs$qu, 1);
          tab = _yield$chrome$tabs$qu2[0];
          _context3.n = 2;
          return chrome.tabs.sendMessage(tab.id, {
            action: 'toggleDebug'
          });
        case 2:
          showStatus('调试模式已切换', 'info');
          _context3.n = 4;
          break;
        case 3:
          _context3.p = 3;
          _t2 = _context3.v;
          console.error('切换调试模式失败:', _t2);
          showStatus('切换调试模式失败', 'error');
        case 4:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 3]]);
  }));
  return _toggleDebug.apply(this, arguments);
}
function resetCat() {
  return _resetCat.apply(this, arguments);
} // 打开设置页面
function _resetCat() {
  _resetCat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var _yield$chrome$tabs$qu3, _yield$chrome$tabs$qu4, tab, _t3;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          _context4.n = 1;
          return chrome.tabs.query({
            active: true,
            currentWindow: true
          });
        case 1:
          _yield$chrome$tabs$qu3 = _context4.v;
          _yield$chrome$tabs$qu4 = _slicedToArray(_yield$chrome$tabs$qu3, 1);
          tab = _yield$chrome$tabs$qu4[0];
          _context4.n = 2;
          return chrome.tabs.sendMessage(tab.id, {
            action: 'resetCat'
          });
        case 2:
          showStatus('软体猫已重置', 'success');
          _context4.n = 4;
          break;
        case 3:
          _context4.p = 3;
          _t3 = _context4.v;
          console.error('重置软体猫失败:', _t3);
          showStatus('重置失败', 'error');
        case 4:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 3]]);
  }));
  return _resetCat.apply(this, arguments);
}
function openSettings() {
  chrome.runtime.openOptionsPage();
}

// 更新UI状态
function updateUI() {
  return _updateUI.apply(this, arguments);
} // 更新按钮文本
function _updateUI() {
  _updateUI = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var response, _t4;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          _context5.n = 1;
          return sendMessageToBackground({
            action: 'getSoftCatStatus'
          });
        case 1:
          response = _context5.v;
          updateButtonText(response.enabled);
          updateStatus(response.enabled);
          _context5.n = 3;
          break;
        case 2:
          _context5.p = 2;
          _t4 = _context5.v;
          console.error('更新UI失败:', _t4);
          showStatus('无法获取状态', 'error');
        case 3:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 2]]);
  }));
  return _updateUI.apply(this, arguments);
}
function updateButtonText() {
  var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var toggleBtn = document.getElementById('toggleSoftCat');
  if (toggleBtn && !toggleBtn.disabled) {
    toggleBtn.textContent = enabled ? '关闭软体猫' : '开启软体猫';
    toggleBtn.className = enabled ? 'btn btn-danger' : 'btn btn-primary';
  }
}

// 更新状态显示
function updateStatus(enabled) {
  var statusDiv = document.getElementById('status');
  if (statusDiv) {
    statusDiv.textContent = enabled ? '✅ 软体猫运行中' : '⭕ 软体猫已停止';
    statusDiv.className = enabled ? 'status success' : 'status inactive';
  }
}

// 显示状态消息
function showStatus(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
  var statusDiv = document.getElementById('status');
  if (statusDiv) {
    statusDiv.textContent = message;
    statusDiv.className = "status ".concat(type);

    // 3秒后恢复原状态
    setTimeout(updateUI, 3000);
  }
}

// 向后台脚本发送消息
function sendMessageToBackground(message) {
  return new Promise(function (resolve, reject) {
    chrome.runtime.sendMessage(message, function (response) {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response || {});
      }
    });
  });
}

// 错误处理
window.addEventListener('error', function (e) {
  console.error('弹窗脚本错误:', e.error);
  showStatus('发生未知错误', 'error');
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'statusUpdate') {
    showStatus(request.message, request.type || 'info');
    sendResponse({
      received: true
    });
  }
  return true;
});
/******/ })()
;
//# sourceMappingURL=popup.js.map