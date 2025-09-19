/******/ (() => { // webpackBootstrap
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
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
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// extension/background/background.js - 修复版本
// 改进状态管理和错误处理

console.log('🔧 [BACKGROUND] 软体猫后台脚本已加载');

// 导入数据库管理器
importScripts('./database.js');
var SoftCatBackgroundManager = /*#__PURE__*/function () {
  function SoftCatBackgroundManager() {
    _classCallCheck(this, SoftCatBackgroundManager);
    this.tabStates = new Map(); // 存储每个标签页的状态
    this.globalEnabled = false;
    this.database = new SoftCatDatabase(); // 初始化数据库

    this.init();
  }

  // 初始化
  return _createClass(SoftCatBackgroundManager, [{
    key: "init",
    value: function init() {
      console.log('🔄 [BACKGROUND] 后台管理器初始化');

      // 监听扩展安装
      chrome.runtime.onInstalled.addListener(this.handleInstalled.bind(this));

      // 监听消息
      chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));

      // 监听标签页事件
      chrome.tabs.onUpdated.addListener(this.handleTabUpdated.bind(this));
      chrome.tabs.onActivated.addListener(this.handleTabActivated.bind(this));
      chrome.tabs.onRemoved.addListener(this.handleTabRemoved.bind(this));

      // 从存储中恢复状态
      this.restoreState();
    }

    // 处理扩展安装
  }, {
    key: "handleInstalled",
    value: function handleInstalled(details) {
      console.log('🎉 [BACKGROUND] 软体猫扩展已安装/更新:', details.reason);
      if (details.reason === 'install') {
        // 首次安装，设置默认状态
        this.saveState();
      }
    }

    // 处理消息
  }, {
    key: "handleMessage",
    value: function handleMessage(request, sender, sendResponse) {
      console.log('📨 [BACKGROUND] 收到消息:', request, '来自:', sender);

      // 异步处理消息
      this.processMessage(request, sender).then(function (response) {
        console.log('📤 [BACKGROUND] 发送响应:', response);
        sendResponse(response);
      })["catch"](function (error) {
        console.error('❌ [BACKGROUND] 消息处理错误:', error);
        sendResponse({
          success: false,
          error: error.message,
          action: request.action
        });
      });
      return true; // 保持消息通道开放
    }

    // 处理消息的核心逻辑
  }, {
    key: "processMessage",
    value: function () {
      var _processMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(request, sender) {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              console.log('📨 [BACKGROUND] 处理消息:', request.action, '来自:', sender);
              _t = request.action;
              _context.n = _t === 'toggleSoftCat' ? 1 : _t === 'getSoftCatStatus' ? 3 : _t === 'collectAllTabs' ? 5 : _t === 'openLaundryRoom' ? 7 : _t === 'getDatabaseTabs' ? 9 : _t === 'getLatestCollection' ? 11 : _t === 'test' ? 13 : 14;
              break;
            case 1:
              _context.n = 2;
              return this.toggleSoftCat(sender.tab);
            case 2:
              return _context.a(2, _context.v);
            case 3:
              _context.n = 4;
              return this.getSoftCatStatus(sender.tab);
            case 4:
              return _context.a(2, _context.v);
            case 5:
              console.log('📋 [BACKGROUND] 收到一键收Tab请求');
              _context.n = 6;
              return this.collectAllTabs();
            case 6:
              return _context.a(2, _context.v);
            case 7:
              console.log('🏠 [BACKGROUND] 收到打开洗衣房请求');
              _context.n = 8;
              return this.openLaundryRoom();
            case 8:
              return _context.a(2, _context.v);
            case 9:
              _context.n = 10;
              return this.getDatabaseTabs();
            case 10:
              return _context.a(2, _context.v);
            case 11:
              _context.n = 12;
              return this.getLatestCollection();
            case 12:
              return _context.a(2, _context.v);
            case 13:
              return _context.a(2, {
                status: 'background script working',
                timestamp: Date.now()
              });
            case 14:
              console.error('❌ [BACKGROUND] 未知操作:', request.action);
              throw new Error("\u672A\u77E5\u64CD\u4F5C: ".concat(request.action));
            case 15:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function processMessage(_x, _x2) {
        return _processMessage.apply(this, arguments);
      }
      return processMessage;
    }() // 切换软体猫状态
  }, {
    key: "toggleSoftCat",
    value: function () {
      var _toggleSoftCat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(tab) {
        var _tab;
        var _yield$chrome$tabs$qu, _yield$chrome$tabs$qu2, activeTab, currentStatus, isCurrentlyRunning, response, _tab2, _tab3, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              console.log('🔄 [BACKGROUND] 切换软体猫状态，标签页:', (_tab = tab) === null || _tab === void 0 ? void 0 : _tab.id);
              _context2.p = 1;
              if (tab) {
                _context2.n = 3;
                break;
              }
              _context2.n = 2;
              return chrome.tabs.query({
                active: true,
                currentWindow: true
              });
            case 2:
              _yield$chrome$tabs$qu = _context2.v;
              _yield$chrome$tabs$qu2 = _slicedToArray(_yield$chrome$tabs$qu, 1);
              activeTab = _yield$chrome$tabs$qu2[0];
              tab = activeTab;
            case 3:
              if (tab) {
                _context2.n = 4;
                break;
              }
              throw new Error('无法获取当前标签页');
            case 4:
              if (this.isValidTab(tab)) {
                _context2.n = 5;
                break;
              }
              throw new Error('当前页面不支持软体猫（chrome://、moz-extension:// 等系统页面）');
            case 5:
              _context2.n = 6;
              return this.getTabStatus(tab.id);
            case 6:
              currentStatus = _context2.v;
              isCurrentlyRunning = currentStatus.running;
              console.log("\uD83C\uDFAF [BACKGROUND] \u6807\u7B7E\u9875 ".concat(tab.id, " \u5F53\u524D\u72B6\u6001:"), currentStatus);
              if (!isCurrentlyRunning) {
                _context2.n = 8;
                break;
              }
              _context2.n = 7;
              return this.stopSoftCatInTab(tab.id);
            case 7:
              response = _context2.v;
              _context2.n = 10;
              break;
            case 8:
              _context2.n = 9;
              return this.startSoftCatInTab(tab.id);
            case 9:
              response = _context2.v;
            case 10:
              // 更新全局状态
              this.updateGlobalState();

              // 保存状态
              this.saveState();
              return _context2.a(2, response);
            case 11:
              _context2.p = 11;
              _t2 = _context2.v;
              console.error('❌ [BACKGROUND] 切换软体猫失败:', _t2);
              return _context2.a(2, {
                success: false,
                error: _t2.message,
                details: {
                  tabId: (_tab2 = tab) === null || _tab2 === void 0 ? void 0 : _tab2.id,
                  tabUrl: (_tab3 = tab) === null || _tab3 === void 0 ? void 0 : _tab3.url
                }
              });
          }
        }, _callee2, this, [[1, 11]]);
      }));
      function toggleSoftCat(_x3) {
        return _toggleSoftCat.apply(this, arguments);
      }
      return toggleSoftCat;
    }() // 在标签页中启动软体猫
  }, {
    key: "startSoftCatInTab",
    value: function () {
      var _startSoftCatInTab = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(tabId) {
        var response, _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              console.log("\uD83D\uDE80 [BACKGROUND] \u5728\u6807\u7B7E\u9875 ".concat(tabId, " \u4E2D\u542F\u52A8\u8F6F\u4F53\u732B"));
              _context3.p = 1;
              _context3.n = 2;
              return this.sendMessageToTab(tabId, {
                action: 'startSoftCat'
              });
            case 2:
              response = _context3.v;
              if (!response.success) {
                _context3.n = 3;
                break;
              }
              // 更新标签页状态
              this.setTabState(tabId, {
                enabled: true,
                running: true,
                lastStarted: Date.now()
              });
              return _context3.a(2, {
                success: true,
                enabled: true,
                message: '软体猫已启动',
                tabId: tabId
              });
            case 3:
              throw new Error(response.error || '启动失败');
            case 4:
              _context3.n = 6;
              break;
            case 5:
              _context3.p = 5;
              _t3 = _context3.v;
              console.error("\u274C [BACKGROUND] \u5728\u6807\u7B7E\u9875 ".concat(tabId, " \u542F\u52A8\u8F6F\u4F53\u732B\u5931\u8D25:"), _t3);

              // 更新状态为失败
              this.setTabState(tabId, {
                enabled: false,
                running: false,
                lastError: _t3.message
              });
              return _context3.a(2, {
                success: false,
                enabled: false,
                error: _t3.message,
                tabId: tabId
              });
            case 6:
              return _context3.a(2);
          }
        }, _callee3, this, [[1, 5]]);
      }));
      function startSoftCatInTab(_x4) {
        return _startSoftCatInTab.apply(this, arguments);
      }
      return startSoftCatInTab;
    }() // 在标签页中停止软体猫
  }, {
    key: "stopSoftCatInTab",
    value: function () {
      var _stopSoftCatInTab = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(tabId) {
        var response, _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              console.log("\u23F9\uFE0F [BACKGROUND] \u5728\u6807\u7B7E\u9875 ".concat(tabId, " \u4E2D\u505C\u6B62\u8F6F\u4F53\u732B"));
              _context4.p = 1;
              _context4.n = 2;
              return this.sendMessageToTab(tabId, {
                action: 'stopSoftCat'
              });
            case 2:
              response = _context4.v;
              if (!response.success) {
                _context4.n = 3;
                break;
              }
              // 更新标签页状态
              this.setTabState(tabId, {
                enabled: false,
                running: false,
                lastStopped: Date.now()
              });
              return _context4.a(2, {
                success: true,
                enabled: false,
                message: '软体猫已停止',
                tabId: tabId
              });
            case 3:
              throw new Error(response.error || '停止失败');
            case 4:
              _context4.n = 6;
              break;
            case 5:
              _context4.p = 5;
              _t4 = _context4.v;
              console.error("\u274C [BACKGROUND] \u5728\u6807\u7B7E\u9875 ".concat(tabId, " \u505C\u6B62\u8F6F\u4F53\u732B\u5931\u8D25:"), _t4);

              // 即使停止失败，也标记为未运行
              this.setTabState(tabId, {
                enabled: false,
                running: false,
                lastError: _t4.message
              });
              return _context4.a(2, {
                success: true,
                // 停止操作总是返回成功
                enabled: false,
                message: '软体猫已停止（可能存在错误）',
                error: _t4.message,
                tabId: tabId
              });
            case 6:
              return _context4.a(2);
          }
        }, _callee4, this, [[1, 5]]);
      }));
      function stopSoftCatInTab(_x5) {
        return _stopSoftCatInTab.apply(this, arguments);
      }
      return stopSoftCatInTab;
    }() // 获取软体猫状态
  }, {
    key: "getSoftCatStatus",
    value: function () {
      var _getSoftCatStatus = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(tab) {
        var _yield$chrome$tabs$qu3, _yield$chrome$tabs$qu4, activeTab, tabStatus, _t5;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              if (tab) {
                _context5.n = 2;
                break;
              }
              _context5.n = 1;
              return chrome.tabs.query({
                active: true,
                currentWindow: true
              });
            case 1:
              _yield$chrome$tabs$qu3 = _context5.v;
              _yield$chrome$tabs$qu4 = _slicedToArray(_yield$chrome$tabs$qu3, 1);
              activeTab = _yield$chrome$tabs$qu4[0];
              tab = activeTab;
            case 2:
              if (tab) {
                _context5.n = 3;
                break;
              }
              return _context5.a(2, {
                success: false,
                error: '无法获取当前标签页'
              });
            case 3:
              _context5.n = 4;
              return this.getTabStatus(tab.id);
            case 4:
              tabStatus = _context5.v;
              return _context5.a(2, _objectSpread({
                success: true,
                enabled: tabStatus.running,
                tabId: tab.id,
                tabUrl: tab.url,
                globalEnabled: this.globalEnabled
              }, tabStatus));
            case 5:
              _context5.p = 5;
              _t5 = _context5.v;
              console.error('❌ [BACKGROUND] 获取状态失败:', _t5);
              return _context5.a(2, {
                success: false,
                error: _t5.message
              });
          }
        }, _callee5, this, [[0, 5]]);
      }));
      function getSoftCatStatus(_x6) {
        return _getSoftCatStatus.apply(this, arguments);
      }
      return getSoftCatStatus;
    }() // 获取标签页状态
  }, {
    key: "getTabStatus",
    value: function () {
      var _getTabStatus = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(tabId) {
        var response, cachedState, _t6;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              _context6.n = 1;
              return this.sendMessageToTab(tabId, {
                action: 'getStatus'
              }, 2000);
            case 1:
              response = _context6.v;
              if (!response.success) {
                _context6.n = 2;
                break;
              }
              // 更新缓存状态
              this.setTabState(tabId, {
                running: response.running,
                loaded: response.loaded,
                lastChecked: Date.now()
              });
              return _context6.a(2, response);
            case 2:
              throw new Error(response.error || '获取状态失败');
            case 3:
              _context6.n = 5;
              break;
            case 4:
              _context6.p = 4;
              _t6 = _context6.v;
              console.warn("\u26A0\uFE0F [BACKGROUND] \u65E0\u6CD5\u83B7\u53D6\u6807\u7B7E\u9875 ".concat(tabId, " \u7684\u5B9E\u65F6\u72B6\u6001:"), _t6.message);

              // 返回缓存状态
              cachedState = this.tabStates.get(tabId) || {
                running: false,
                loaded: false,
                enabled: false
              };
              return _context6.a(2, _objectSpread(_objectSpread({
                success: true
              }, cachedState), {}, {
                fromCache: true
              }));
            case 5:
              return _context6.a(2);
          }
        }, _callee6, this, [[0, 4]]);
      }));
      function getTabStatus(_x7) {
        return _getTabStatus.apply(this, arguments);
      }
      return getTabStatus;
    }() // 处理标签页更新
  }, {
    key: "handleTabUpdated",
    value: function handleTabUpdated(tabId, changeInfo, tab) {
      var _this = this;
      if (changeInfo.status === 'complete') {
        console.log("\uD83D\uDD04 [BACKGROUND] \u6807\u7B7E\u9875 ".concat(tabId, " \u52A0\u8F7D\u5B8C\u6210"));

        // 延迟检查是否需要重新启动软体猫
        setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
          var tabState, _t7;
          return _regenerator().w(function (_context7) {
            while (1) switch (_context7.p = _context7.n) {
              case 0:
                tabState = _this.tabStates.get(tabId);
                if (!(tabState && tabState.enabled && _this.isValidTab(tab))) {
                  _context7.n = 4;
                  break;
                }
                console.log("\uD83D\uDD04 [BACKGROUND] \u5728\u5237\u65B0\u7684\u6807\u7B7E\u9875 ".concat(tabId, " \u4E2D\u91CD\u65B0\u542F\u52A8\u8F6F\u4F53\u732B"));
                _context7.p = 1;
                _context7.n = 2;
                return _this.startSoftCatInTab(tabId);
              case 2:
                _context7.n = 4;
                break;
              case 3:
                _context7.p = 3;
                _t7 = _context7.v;
                console.error("\u274C [BACKGROUND] \u91CD\u65B0\u542F\u52A8\u8F6F\u4F53\u732B\u5931\u8D25:", _t7);
              case 4:
                return _context7.a(2);
            }
          }, _callee7, null, [[1, 3]]);
        })), 1000);
      }
    }

    // 处理标签页激活
  }, {
    key: "handleTabActivated",
    value: function handleTabActivated(activeInfo) {
      console.log("\uD83C\uDFAF [BACKGROUND] \u6807\u7B7E\u9875 ".concat(activeInfo.tabId, " \u88AB\u6FC0\u6D3B"));

      // 这里可以添加标签页切换时的逻辑
      // 比如更新扩展图标状态等
    }

    // 处理标签页移除
  }, {
    key: "handleTabRemoved",
    value: function handleTabRemoved(tabId, removeInfo) {
      console.log("\uD83D\uDDD1\uFE0F [BACKGROUND] \u6807\u7B7E\u9875 ".concat(tabId, " \u88AB\u79FB\u9664"));

      // 清理标签页状态
      if (this.tabStates.has(tabId)) {
        this.tabStates["delete"](tabId);
        this.updateGlobalState();
        this.saveState();
      }
    }

    // 辅助方法
  }, {
    key: "isValidTab",
    value: function isValidTab(tab) {
      if (!tab || !tab.url) return false;
      var invalidPrefixes = ['chrome://', 'chrome-extension://', 'moz-extension://', 'edge://', 'about:', 'data:', 'file://'];
      return !invalidPrefixes.some(function (prefix) {
        return tab.url.startsWith(prefix);
      });
    }
  }, {
    key: "sendMessageToTab",
    value: function () {
      var _sendMessageToTab = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(tabId, message) {
        var timeout,
          _args8 = arguments;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              timeout = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : 5000;
              return _context8.a(2, new Promise(function (resolve, reject) {
                var timer = setTimeout(function () {
                  reject(new Error('消息发送超时'));
                }, timeout);
                chrome.tabs.sendMessage(tabId, message, function (response) {
                  clearTimeout(timer);
                  if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                  } else {
                    resolve(response || {
                      success: false,
                      error: '无响应'
                    });
                  }
                });
              }));
          }
        }, _callee8);
      }));
      function sendMessageToTab(_x8, _x9) {
        return _sendMessageToTab.apply(this, arguments);
      }
      return sendMessageToTab;
    }()
  }, {
    key: "setTabState",
    value: function setTabState(tabId, state) {
      var currentState = this.tabStates.get(tabId) || {};
      var newState = _objectSpread(_objectSpread(_objectSpread({}, currentState), state), {}, {
        lastUpdated: Date.now()
      });
      this.tabStates.set(tabId, newState);
      console.log("\uD83D\uDCCA [BACKGROUND] \u6807\u7B7E\u9875 ".concat(tabId, " \u72B6\u6001\u5DF2\u66F4\u65B0:"), newState);
    }
  }, {
    key: "updateGlobalState",
    value: function updateGlobalState() {
      // 检查是否有任何标签页在运行软体猫
      var hasRunningTabs = Array.from(this.tabStates.values()).some(function (state) {
        return state.running;
      });
      this.globalEnabled = hasRunningTabs;
      console.log("\uD83C\uDF10 [BACKGROUND] \u5168\u5C40\u72B6\u6001\u5DF2\u66F4\u65B0: ".concat(this.globalEnabled ? '启用' : '禁用'));
    }

    // 状态持久化
  }, {
    key: "saveState",
    value: function () {
      var _saveState = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        var stateData, _t8;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              _context9.p = 0;
              stateData = {
                globalEnabled: this.globalEnabled,
                tabStates: Object.fromEntries(this.tabStates),
                lastSaved: Date.now()
              };
              _context9.n = 1;
              return chrome.storage.local.set({
                softcatState: stateData
              });
            case 1:
              console.log('💾 [BACKGROUND] 状态已保存');
              _context9.n = 3;
              break;
            case 2:
              _context9.p = 2;
              _t8 = _context9.v;
              console.error('❌ [BACKGROUND] 保存状态失败:', _t8);
            case 3:
              return _context9.a(2);
          }
        }, _callee9, this, [[0, 2]]);
      }));
      function saveState() {
        return _saveState.apply(this, arguments);
      }
      return saveState;
    }()
  }, {
    key: "restoreState",
    value: function () {
      var _restoreState = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
        var result, stateData, _t9;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              _context0.p = 0;
              _context0.n = 1;
              return chrome.storage.local.get('softcatState');
            case 1:
              result = _context0.v;
              if (result.softcatState) {
                stateData = result.softcatState;
                this.globalEnabled = stateData.globalEnabled || false;
                this.tabStates = new Map(Object.entries(stateData.tabStates || {}));
                console.log('📂 [BACKGROUND] 状态已恢复:', {
                  globalEnabled: this.globalEnabled,
                  tabCount: this.tabStates.size
                });
              }
              _context0.n = 3;
              break;
            case 2:
              _context0.p = 2;
              _t9 = _context0.v;
              console.error('❌ [BACKGROUND] 恢复状态失败:', _t9);
            case 3:
              return _context0.a(2);
          }
        }, _callee0, this, [[0, 2]]);
      }));
      function restoreState() {
        return _restoreState.apply(this, arguments);
      }
      return restoreState;
    }() // 一键收Tab功能 - 收集并关闭其他标签页，打开洗衣房
  }, {
    key: "collectAllTabs",
    value: function () {
      var _collectAllTabs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
        var tabs, tabData, savedTabIds, _iterator, _step, tab, savedTab, collectionId, currentTab, tabsToClose, tabIds, laundryRoomUrl, _t0, _t1, _t10;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.p = _context1.n) {
            case 0:
              _context1.p = 0;
              console.log('📋 [BACKGROUND] 开始一键收Tab...');

              // 检查数据库是否可用
              if (this.database) {
                _context1.n = 1;
                break;
              }
              console.error('❌ [BACKGROUND] 数据库未初始化');
              return _context1.a(2, {
                success: false,
                error: '数据库未初始化'
              });
            case 1:
              // 初始化数据库
              console.log('🗄️ [BACKGROUND] 初始化数据库...');
              _context1.n = 2;
              return this.database.init();
            case 2:
              console.log('✅ [BACKGROUND] 数据库初始化完成');

              // 获取所有标签页
              _context1.n = 3;
              return chrome.tabs.query({});
            case 3:
              tabs = _context1.v;
              tabData = tabs.map(function (tab) {
                return {
                  id: tab.id,
                  url: tab.url,
                  title: tab.title,
                  favIconUrl: tab.favIconUrl,
                  windowId: tab.windowId,
                  active: tab.active,
                  pinned: tab.pinned,
                  audible: tab.audible,
                  mutedInfo: tab.mutedInfo,
                  lastAccessed: tab.lastAccessed || Date.now()
                };
              });
              console.log("\uD83D\uDCCA [BACKGROUND] \u5F00\u59CB\u5904\u7406 ".concat(tabData.length, " \u4E2A\u6807\u7B7E\u9875..."));

              // 保存每个标签页的详细信息到数据库
              savedTabIds = [];
              _iterator = _createForOfIteratorHelper(tabData);
              _context1.p = 4;
              _iterator.s();
            case 5:
              if ((_step = _iterator.n()).done) {
                _context1.n = 10;
                break;
              }
              tab = _step.value;
              _context1.p = 6;
              _context1.n = 7;
              return this.database.saveTabDetails(tab);
            case 7:
              savedTab = _context1.v;
              savedTabIds.push(savedTab.id);
              console.log("\u2705 [BACKGROUND] \u5DF2\u4FDD\u5B58\u6807\u7B7E\u9875: ".concat(savedTab.summary));
              _context1.n = 9;
              break;
            case 8:
              _context1.p = 8;
              _t0 = _context1.v;
              console.error("\u274C [BACKGROUND] \u4FDD\u5B58\u6807\u7B7E\u9875\u5931\u8D25: ".concat(tab.url), _t0);
            case 9:
              _context1.n = 5;
              break;
            case 10:
              _context1.n = 12;
              break;
            case 11:
              _context1.p = 11;
              _t1 = _context1.v;
              _iterator.e(_t1);
            case 12:
              _context1.p = 12;
              _iterator.f();
              return _context1.f(12);
            case 13:
              _context1.n = 14;
              return this.database.saveCollection(savedTabIds, '一键收Tab');
            case 14:
              collectionId = _context1.v;
              console.log("\uD83D\uDCDA [BACKGROUND] \u5DF2\u4FDD\u5B58\u6536\u96C6\u8BB0\u5F55: ".concat(collectionId));

              // 关闭除当前标签页外的所有标签页
              currentTab = tabs.find(function (tab) {
                return tab.active;
              });
              tabsToClose = tabs.filter(function (tab) {
                return tab.id !== currentTab.id;
              });
              if (!(tabsToClose.length > 0)) {
                _context1.n = 16;
                break;
              }
              tabIds = tabsToClose.map(function (tab) {
                return tab.id;
              });
              _context1.n = 15;
              return chrome.tabs.remove(tabIds);
            case 15:
              console.log("\uD83D\uDDD1\uFE0F [BACKGROUND] \u5DF2\u5173\u95ED ".concat(tabsToClose.length, " \u4E2A\u6807\u7B7E\u9875"));
            case 16:
              // 打开洗衣房页面
              laundryRoomUrl = chrome.runtime.getURL('laundry-room.html');
              _context1.n = 17;
              return chrome.tabs.create({
                url: laundryRoomUrl,
                active: true
              });
            case 17:
              console.log('🏠 [BACKGROUND] 已打开洗衣房页面');
              return _context1.a(2, {
                success: true,
                tabs: tabData,
                count: tabData.length,
                closedCount: tabsToClose.length,
                savedCount: savedTabIds.length,
                collectionId: collectionId,
                timestamp: Date.now()
              });
            case 18:
              _context1.p = 18;
              _t10 = _context1.v;
              console.error('❌ [BACKGROUND] 一键收Tab失败:', _t10);
              return _context1.a(2, {
                success: false,
                error: _t10.message
              });
          }
        }, _callee1, this, [[6, 8], [4, 11, 12, 13], [0, 18]]);
      }));
      function collectAllTabs() {
        return _collectAllTabs.apply(this, arguments);
      }
      return collectAllTabs;
    }() // 打开洗衣房
  }, {
    key: "openLaundryRoom",
    value: function () {
      var _openLaundryRoom = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
        var laundryRoomUrl, tab, _t11;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.p = _context10.n) {
            case 0:
              _context10.p = 0;
              console.log('🏠 [BACKGROUND] 打开洗衣房...');

              // 创建洗衣房页面
              laundryRoomUrl = chrome.runtime.getURL('laundry-room.html');
              console.log('🔗 [BACKGROUND] 洗衣房URL:', laundryRoomUrl);
              _context10.n = 1;
              return chrome.tabs.create({
                url: laundryRoomUrl,
                active: true
              });
            case 1:
              tab = _context10.v;
              console.log('✅ [BACKGROUND] 洗衣房已打开，标签页ID:', tab.id);
              return _context10.a(2, {
                success: true,
                tabId: tab.id,
                url: laundryRoomUrl
              });
            case 2:
              _context10.p = 2;
              _t11 = _context10.v;
              console.error('❌ [BACKGROUND] 打开洗衣房失败:', _t11);
              return _context10.a(2, {
                success: false,
                error: _t11.message
              });
          }
        }, _callee10, null, [[0, 2]]);
      }));
      function openLaundryRoom() {
        return _openLaundryRoom.apply(this, arguments);
      }
      return openLaundryRoom;
    }() // 获取数据库中的标签页
  }, {
    key: "getDatabaseTabs",
    value: function () {
      var _getDatabaseTabs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
        var tabs, _t12;
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.p = _context11.n) {
            case 0:
              _context11.p = 0;
              _context11.n = 1;
              return this.database.init();
            case 1:
              _context11.n = 2;
              return this.database.getAllTabs();
            case 2:
              tabs = _context11.v;
              return _context11.a(2, {
                success: true,
                tabs: tabs,
                count: tabs.length
              });
            case 3:
              _context11.p = 3;
              _t12 = _context11.v;
              console.error('❌ [BACKGROUND] 获取数据库标签页失败:', _t12);
              return _context11.a(2, {
                success: false,
                error: _t12.message
              });
          }
        }, _callee11, this, [[0, 3]]);
      }));
      function getDatabaseTabs() {
        return _getDatabaseTabs.apply(this, arguments);
      }
      return getDatabaseTabs;
    }() // 获取最新收集记录
  }, {
    key: "getLatestCollection",
    value: function () {
      var _getLatestCollection = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
        var collection, tabs, _t13;
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.p = _context12.n) {
            case 0:
              _context12.p = 0;
              _context12.n = 1;
              return this.database.init();
            case 1:
              _context12.n = 2;
              return this.database.getLatestCollection();
            case 2:
              collection = _context12.v;
              if (!collection) {
                _context12.n = 4;
                break;
              }
              _context12.n = 3;
              return this.database.getTabsByCollection(collection.id);
            case 3:
              tabs = _context12.v;
              return _context12.a(2, {
                success: true,
                collection: collection,
                tabs: tabs,
                count: tabs.length
              });
            case 4:
              return _context12.a(2, {
                success: true,
                collection: null,
                tabs: [],
                count: 0
              });
            case 5:
              _context12.n = 7;
              break;
            case 6:
              _context12.p = 6;
              _t13 = _context12.v;
              console.error('❌ [BACKGROUND] 获取最新收集记录失败:', _t13);
              return _context12.a(2, {
                success: false,
                error: _t13.message
              });
            case 7:
              return _context12.a(2);
          }
        }, _callee12, this, [[0, 6]]);
      }));
      function getLatestCollection() {
        return _getLatestCollection.apply(this, arguments);
      }
      return getLatestCollection;
    }() // 调试方法
  }, {
    key: "getDebugInfo",
    value: function getDebugInfo() {
      return {
        globalEnabled: this.globalEnabled,
        tabStates: Object.fromEntries(this.tabStates),
        timestamp: Date.now()
      };
    }
  }]);
}(); // 创建后台管理器实例
var backgroundManager = new SoftCatBackgroundManager();

// 暴露给调试用
if (typeof globalThis !== 'undefined') {
  globalThis.SoftCatBackgroundManager = backgroundManager;
}

// 错误处理
self.addEventListener('error', function (event) {
  console.error('❌ [BACKGROUND] 后台脚本错误:', event.error);
});
console.log('✅ [BACKGROUND] 软体猫后台脚本初始化完成');
/******/ })()
;
//# sourceMappingURL=background.js.map