/******/ (() => { // webpackBootstrap
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// extension/content/content.js - 修复版本
// 改进初始化流程和状态管理

console.log('🐱 [CONTENT] 软体猫内容脚本已加载');
var SoftCatContentManager = /*#__PURE__*/function () {
  function SoftCatContentManager() {
    _classCallCheck(this, SoftCatContentManager);
    this.isLibrariesLoaded = false;
    this.isSoftCatReady = false;
    this.maxRetries = 10;
    this.retryDelay = 1000;
    this.checkInterval = 500;
    this.init();
  }

  // 初始化
  return _createClass(SoftCatContentManager, [{
    key: "init",
    value: function init() {
      var _this = this;
      console.log('🔄 [CONTENT] 内容脚本管理器初始化');

      // 等待页面加载完成
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
          return _this.setupMessageListener();
        });
      } else {
        this.setupMessageListener();
      }

      // 检查库文件加载状态
      this.checkLibrariesPeriodically();
    }

    // 设置消息监听器
  }, {
    key: "setupMessageListener",
    value: function setupMessageListener() {
      var _this2 = this;
      console.log('📡 [CONTENT] 设置消息监听器');
      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log('📨 [CONTENT] 收到消息:', request);

        // 异步处理消息
        _this2.handleMessage(request).then(function (response) {
          console.log('📤 [CONTENT] 发送响应:', response);
          sendResponse(response);
        })["catch"](function (error) {
          console.error('❌ [CONTENT] 消息处理错误:', error);
          sendResponse({
            success: false,
            error: error.message,
            action: request.action
          });
        });
        return true; // 保持消息通道开放
      });
    }

    // 处理消息
  }, {
    key: "handleMessage",
    value: function () {
      var _handleMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(request) {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _t = request.action;
              _context.n = _t === 'startSoftCat' ? 1 : _t === 'stopSoftCat' ? 3 : _t === 'toggleDebug' ? 5 : _t === 'resetCat' ? 7 : _t === 'getStatus' ? 9 : _t === 'settingsUpdated' ? 11 : 13;
              break;
            case 1:
              _context.n = 2;
              return this.startSoftCat();
            case 2:
              return _context.a(2, _context.v);
            case 3:
              _context.n = 4;
              return this.stopSoftCat();
            case 4:
              return _context.a(2, _context.v);
            case 5:
              _context.n = 6;
              return this.toggleDebug();
            case 6:
              return _context.a(2, _context.v);
            case 7:
              _context.n = 8;
              return this.resetCat();
            case 8:
              return _context.a(2, _context.v);
            case 9:
              _context.n = 10;
              return this.getStatus();
            case 10:
              return _context.a(2, _context.v);
            case 11:
              _context.n = 12;
              return this.updateSettings(request.data);
            case 12:
              return _context.a(2, _context.v);
            case 13:
              throw new Error("\u672A\u77E5\u64CD\u4F5C: ".concat(request.action));
            case 14:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function handleMessage(_x) {
        return _handleMessage.apply(this, arguments);
      }
      return handleMessage;
    }() // 定期检查库文件
  }, {
    key: "checkLibrariesPeriodically",
    value: function checkLibrariesPeriodically() {
      var _this3 = this;
      var _checkLibraries = function checkLibraries() {
        var p5Loaded = typeof p5 !== 'undefined';
        var matterLoaded = typeof Matter !== 'undefined';
        if (p5Loaded && matterLoaded && !_this3.isLibrariesLoaded) {
          _this3.isLibrariesLoaded = true;
          console.log('✅ [CONTENT] 库文件已加载完成');

          // 检查软体猫是否已准备就绪
          _this3.checkSoftCatReady();
        } else if (!_this3.isLibrariesLoaded) {
          setTimeout(_checkLibraries, _this3.checkInterval);
        }
      };
      _checkLibraries();
    }

    // 检查软体猫是否准备就绪
  }, {
    key: "checkSoftCatReady",
    value: function checkSoftCatReady() {
      var _this4 = this;
      var attempts = 0;
      var _checkReady = function checkReady() {
        attempts++;
        if (window.SoftCat && typeof window.SoftCat.start === 'function') {
          _this4.isSoftCatReady = true;
          console.log('✅ [CONTENT] 软体猫API已准备就绪');
          return;
        }
        if (attempts < _this4.maxRetries) {
          console.log("\uD83D\uDD04 [CONTENT] \u7B49\u5F85\u8F6F\u4F53\u732B\u51C6\u5907\u5C31\u7EEA... (".concat(attempts, "/").concat(_this4.maxRetries, ")"));
          setTimeout(_checkReady, _this4.retryDelay);
        } else {
          console.warn('⚠️ [CONTENT] 软体猫准备超时');
        }
      };
      _checkReady();
    }

    // 启动软体猫
  }, {
    key: "startSoftCat",
    value: function () {
      var _startSoftCat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var success, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              console.log('🚀 [CONTENT] 尝试启动软体猫...');
              _context2.p = 1;
              if (this.checkLibrariesLoaded()) {
                _context2.n = 2;
                break;
              }
              throw new Error('库文件未加载完成');
            case 2:
              _context2.n = 3;
              return this.waitForSoftCatAPI();
            case 3:
              // 启动软体猫
              success = window.SoftCat.start();
              if (!success) {
                _context2.n = 4;
                break;
              }
              return _context2.a(2, {
                success: true,
                message: '软体猫启动成功',
                status: window.SoftCat.getStatus()
              });
            case 4:
              throw new Error('软体猫启动失败');
            case 5:
              _context2.n = 7;
              break;
            case 6:
              _context2.p = 6;
              _t2 = _context2.v;
              console.error('❌ [CONTENT] 启动软体猫失败:', _t2);
              return _context2.a(2, {
                success: false,
                error: _t2.message,
                librariesLoaded: this.isLibrariesLoaded,
                softCatReady: this.isSoftCatReady
              });
            case 7:
              return _context2.a(2);
          }
        }, _callee2, this, [[1, 6]]);
      }));
      function startSoftCat() {
        return _startSoftCat.apply(this, arguments);
      }
      return startSoftCat;
    }() // 停止软体猫
  }, {
    key: "stopSoftCat",
    value: function () {
      var _stopSoftCat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              console.log('⏹️ [CONTENT] 尝试停止软体猫...');
              _context3.p = 1;
              if (!(window.SoftCat && typeof window.SoftCat.stop === 'function')) {
                _context3.n = 2;
                break;
              }
              window.SoftCat.stop();
              return _context3.a(2, {
                success: true,
                message: '软体猫已停止'
              });
            case 2:
              // 如果API不存在，直接清理DOM
              this.cleanupSoftCat();
              return _context3.a(2, {
                success: true,
                message: '软体猫已清理'
              });
            case 3:
              _context3.n = 5;
              break;
            case 4:
              _context3.p = 4;
              _t3 = _context3.v;
              console.error('❌ [CONTENT] 停止软体猫失败:', _t3);

              // 强制清理
              this.cleanupSoftCat();
              return _context3.a(2, {
                success: true,
                message: '软体猫已强制清理',
                error: _t3.message
              });
            case 5:
              return _context3.a(2);
          }
        }, _callee3, this, [[1, 4]]);
      }));
      function stopSoftCat() {
        return _stopSoftCat.apply(this, arguments);
      }
      return stopSoftCat;
    }() // 切换调试模式
  }, {
    key: "toggleDebug",
    value: function () {
      var _toggleDebug = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var debugMode, _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              if (this.isSoftCatAPIAvailable()) {
                _context4.n = 1;
                break;
              }
              throw new Error('软体猫未运行');
            case 1:
              debugMode = window.SoftCat.toggleDebug();
              return _context4.a(2, {
                success: true,
                message: "\u8C03\u8BD5\u6A21\u5F0F\u5DF2".concat(debugMode ? '开启' : '关闭'),
                debugMode: debugMode
              });
            case 2:
              _context4.p = 2;
              _t4 = _context4.v;
              console.error('❌ [CONTENT] 切换调试模式失败:', _t4);
              return _context4.a(2, {
                success: false,
                error: _t4.message
              });
          }
        }, _callee4, this, [[0, 2]]);
      }));
      function toggleDebug() {
        return _toggleDebug.apply(this, arguments);
      }
      return toggleDebug;
    }() // 重置软体猫
  }, {
    key: "resetCat",
    value: function () {
      var _resetCat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        var _t5;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              if (this.isSoftCatAPIAvailable()) {
                _context5.n = 1;
                break;
              }
              throw new Error('软体猫未运行');
            case 1:
              window.SoftCat.reset();
              return _context5.a(2, {
                success: true,
                message: '软体猫已重置'
              });
            case 2:
              _context5.p = 2;
              _t5 = _context5.v;
              console.error('❌ [CONTENT] 重置软体猫失败:', _t5);
              return _context5.a(2, {
                success: false,
                error: _t5.message
              });
          }
        }, _callee5, this, [[0, 2]]);
      }));
      function resetCat() {
        return _resetCat.apply(this, arguments);
      }
      return resetCat;
    }() // 获取状态
  }, {
    key: "getStatus",
    value: function () {
      var _getStatus = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        var baseStatus, softCatStatus, _t6;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              baseStatus = {
                librariesLoaded: this.isLibrariesLoaded,
                softCatReady: this.isSoftCatReady,
                apiAvailable: this.isSoftCatAPIAvailable()
              };
              if (!this.isSoftCatAPIAvailable()) {
                _context6.n = 1;
                break;
              }
              softCatStatus = window.SoftCat.getStatus();
              return _context6.a(2, _objectSpread(_objectSpread({
                success: true
              }, baseStatus), softCatStatus));
            case 1:
              return _context6.a(2, _objectSpread(_objectSpread({
                success: true
              }, baseStatus), {}, {
                loaded: false,
                running: false
              }));
            case 2:
              _context6.n = 4;
              break;
            case 3:
              _context6.p = 3;
              _t6 = _context6.v;
              console.error('❌ [CONTENT] 获取状态失败:', _t6);
              return _context6.a(2, {
                success: false,
                error: _t6.message,
                librariesLoaded: this.isLibrariesLoaded,
                softCatReady: this.isSoftCatReady
              });
            case 4:
              return _context6.a(2);
          }
        }, _callee6, this, [[0, 3]]);
      }));
      function getStatus() {
        return _getStatus.apply(this, arguments);
      }
      return getStatus;
    }() // 更新设置
  }, {
    key: "updateSettings",
    value: function () {
      var _updateSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(settings) {
        var _t7;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              console.log('⚙️ [CONTENT] 更新设置:', settings);
              _context7.p = 1;
              return _context7.a(2, {
                success: true,
                message: '设置已更新'
              });
            case 2:
              _context7.p = 2;
              _t7 = _context7.v;
              console.error('❌ [CONTENT] 更新设置失败:', _t7);
              return _context7.a(2, {
                success: false,
                error: _t7.message
              });
          }
        }, _callee7, null, [[1, 2]]);
      }));
      function updateSettings(_x2) {
        return _updateSettings.apply(this, arguments);
      }
      return updateSettings;
    }() // 辅助方法
  }, {
    key: "checkLibrariesLoaded",
    value: function checkLibrariesLoaded() {
      var p5Loaded = typeof p5 !== 'undefined';
      var matterLoaded = typeof Matter !== 'undefined';
      console.log("\uD83D\uDCDA [CONTENT] \u5E93\u6587\u4EF6\u72B6\u6001 - p5.js: ".concat(p5Loaded, ", Matter.js: ").concat(matterLoaded));
      return p5Loaded && matterLoaded;
    }
  }, {
    key: "isSoftCatAPIAvailable",
    value: function isSoftCatAPIAvailable() {
      return window.SoftCat && typeof window.SoftCat.start === 'function' && typeof window.SoftCat.stop === 'function' && typeof window.SoftCat.getStatus === 'function';
    }
  }, {
    key: "waitForSoftCatAPI",
    value: function () {
      var _waitForSoftCatAPI = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        var timeout,
          startTime,
          _args8 = arguments;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              timeout = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : 10000;
              startTime = Date.now();
            case 1:
              if (this.isSoftCatAPIAvailable()) {
                _context8.n = 4;
                break;
              }
              if (!(Date.now() - startTime > timeout)) {
                _context8.n = 2;
                break;
              }
              throw new Error('等待软体猫API超时');
            case 2:
              console.log('⏳ [CONTENT] 等待软体猫API...');
              _context8.n = 3;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 200);
              });
            case 3:
              _context8.n = 1;
              break;
            case 4:
              console.log('✅ [CONTENT] 软体猫API已准备就绪');
            case 5:
              return _context8.a(2);
          }
        }, _callee8, this);
      }));
      function waitForSoftCatAPI() {
        return _waitForSoftCatAPI.apply(this, arguments);
      }
      return waitForSoftCatAPI;
    }()
  }, {
    key: "cleanupSoftCat",
    value: function cleanupSoftCat() {
      console.log('🧹 [CONTENT] 清理软体猫资源...');
      try {
        // 移除容器
        var container = document.getElementById('softcat-container');
        if (container) {
          container.remove();
          console.log('✅ [CONTENT] 软体猫容器已移除');
        }

        // 移除画布
        var canvas = document.getElementById('softcat-canvas');
        if (canvas) {
          canvas.remove();
          console.log('✅ [CONTENT] 软体猫画布已移除');
        }

        // 清理全局状态
        if (window.SoftCatLoaded) {
          window.SoftCatLoaded = false;
        }
        if (window.SoftCat) {
          delete window.SoftCat;
        }
        this.isSoftCatReady = false;
        console.log('✅ [CONTENT] 软体猫资源清理完成');
      } catch (error) {
        console.error('❌ [CONTENT] 清理软体猫资源失败:', error);
      }
    }
  }]);
}(); // 创建内容脚本管理器实例
var contentManager = new SoftCatContentManager();

// 页面卸载时清理资源
window.addEventListener('beforeunload', function () {
  console.log('🔄 [CONTENT] 页面卸载，清理资源...');
  if (contentManager) {
    contentManager.cleanupSoftCat();
  }
});

// 错误处理
window.addEventListener('error', function (e) {
  console.error('❌ [CONTENT] 内容脚本错误:', e.error);

  // 如果是软体猫相关错误，尝试清理
  if (e.error && e.error.message && e.error.message.includes('SoftCat')) {
    contentManager.cleanupSoftCat();
  }
});

// 暴露给调试用
window.SoftCatContentManager = contentManager;
/******/ })()
;
//# sourceMappingURL=content.js.map