/******/ (() => { // webpackBootstrap
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
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
// Options 页面脚本
var SoftCatOptions = /*#__PURE__*/function () {
  function SoftCatOptions() {
    _classCallCheck(this, SoftCatOptions);
    this.settings = {};
    this.init();
  }
  return _createClass(SoftCatOptions, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.loadSettings();
            case 1:
              this.bindEvents();
              this.updateUI();
            case 2:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }() // 加载设置
  }, {
    key: "loadSettings",
    value: function () {
      var _loadSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var result, _t;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              _context2.n = 1;
              return chrome.storage.sync.get({
                catEnabled: true,
                physicsEnabled: true,
                debugMode: false,
                catSize: 1.0,
                catPosition: {
                  x: 50,
                  y: 65
                },
                physicsQuality: 'medium',
                animationSpeed: 1.0
              });
            case 1:
              result = _context2.v;
              this.settings = result;
              console.log('设置已加载:', this.settings);
              _context2.n = 3;
              break;
            case 2:
              _context2.p = 2;
              _t = _context2.v;
              console.error('加载设置失败:', _t);
            case 3:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 2]]);
      }));
      function loadSettings() {
        return _loadSettings.apply(this, arguments);
      }
      return loadSettings;
    }() // 保存设置
  }, {
    key: "saveSettings",
    value: function () {
      var _saveSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var _t2;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              _context3.n = 1;
              return chrome.storage.sync.set(this.settings);
            case 1:
              console.log('设置已保存:', this.settings);

              // 显示保存成功提示
              this.showNotification('设置已保存！', 'success');

              // 通知所有标签页更新设置
              this.notifyTabs('settingsUpdated', this.settings);
              _context3.n = 3;
              break;
            case 2:
              _context3.p = 2;
              _t2 = _context3.v;
              console.error('保存设置失败:', _t2);
              this.showNotification('保存失败，请重试', 'error');
            case 3:
              return _context3.a(2);
          }
        }, _callee3, this, [[0, 2]]);
      }));
      function saveSettings() {
        return _saveSettings.apply(this, arguments);
      }
      return saveSettings;
    }() // 重置设置
  }, {
    key: "resetSettings",
    value: function () {
      var _resetSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var _t3;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              if (!confirm('确定要重置所有设置吗？')) {
                _context4.n = 5;
                break;
              }
              _context4.p = 1;
              _context4.n = 2;
              return chrome.storage.sync.clear();
            case 2:
              _context4.n = 3;
              return this.loadSettings();
            case 3:
              this.updateUI();
              this.showNotification('设置已重置！', 'success');
              _context4.n = 5;
              break;
            case 4:
              _context4.p = 4;
              _t3 = _context4.v;
              console.error('重置设置失败:', _t3);
              this.showNotification('重置失败，请重试', 'error');
            case 5:
              return _context4.a(2);
          }
        }, _callee4, this, [[1, 4]]);
      }));
      function resetSettings() {
        return _resetSettings.apply(this, arguments);
      }
      return resetSettings;
    }() // 测试软体猫
  }, {
    key: "testCat",
    value: function () {
      var _testCat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        var _yield$chrome$tabs$qu, _yield$chrome$tabs$qu2, tab, _t4;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              _context5.n = 1;
              return chrome.tabs.query({
                active: true,
                currentWindow: true
              });
            case 1:
              _yield$chrome$tabs$qu = _context5.v;
              _yield$chrome$tabs$qu2 = _slicedToArray(_yield$chrome$tabs$qu, 1);
              tab = _yield$chrome$tabs$qu2[0];
              if (!tab) {
                _context5.n = 4;
                break;
              }
              _context5.n = 2;
              return chrome.scripting.executeScript({
                target: {
                  tabId: tab.id
                },
                files: ['shared/softcat-core.js']
              });
            case 2:
              _context5.n = 3;
              return chrome.scripting.executeScript({
                target: {
                  tabId: tab.id
                },
                files: ['content/content.js']
              });
            case 3:
              this.showNotification('软体猫已注入到当前页面！', 'success');
            case 4:
              _context5.n = 6;
              break;
            case 5:
              _context5.p = 5;
              _t4 = _context5.v;
              console.error('测试软体猫失败:', _t4);
              this.showNotification('测试失败，请确保页面允许脚本注入', 'error');
            case 6:
              return _context5.a(2);
          }
        }, _callee5, this, [[0, 5]]);
      }));
      function testCat() {
        return _testCat.apply(this, arguments);
      }
      return testCat;
    }() // 绑定事件
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;
      // 复选框事件
      document.getElementById('catEnabled').addEventListener('change', function (e) {
        _this.settings.catEnabled = e.target.checked;
      });
      document.getElementById('physicsEnabled').addEventListener('change', function (e) {
        _this.settings.physicsEnabled = e.target.checked;
      });
      document.getElementById('debugMode').addEventListener('change', function (e) {
        _this.settings.debugMode = e.target.checked;
      });

      // 滑块事件
      document.getElementById('catSize').addEventListener('input', function (e) {
        _this.settings.catSize = parseFloat(e.target.value);
        document.getElementById('catSizeValue').textContent = "".concat(e.target.value, "x");
      });
      document.getElementById('positionX').addEventListener('input', function (e) {
        _this.settings.catPosition.x = parseInt(e.target.value);
        document.getElementById('positionXValue').textContent = "".concat(e.target.value, "%");
      });
      document.getElementById('positionY').addEventListener('input', function (e) {
        _this.settings.catPosition.y = parseInt(e.target.value);
        document.getElementById('positionYValue').textContent = "".concat(e.target.value, "%");
      });
      document.getElementById('animationSpeed').addEventListener('input', function (e) {
        _this.settings.animationSpeed = parseFloat(e.target.value);
        document.getElementById('animationSpeedValue').textContent = "".concat(e.target.value, "x");
      });

      // 选择框事件
      document.getElementById('physicsQuality').addEventListener('change', function (e) {
        _this.settings.physicsQuality = e.target.value;
      });

      // 按钮事件
      document.getElementById('saveSettings').addEventListener('click', function () {
        _this.saveSettings();
      });
      document.getElementById('resetSettings').addEventListener('click', function () {
        _this.resetSettings();
      });
      document.getElementById('testCat').addEventListener('click', function () {
        _this.testCat();
      });
    }

    // 更新UI
  }, {
    key: "updateUI",
    value: function updateUI() {
      // 更新复选框
      document.getElementById('catEnabled').checked = this.settings.catEnabled;
      document.getElementById('physicsEnabled').checked = this.settings.physicsEnabled;
      document.getElementById('debugMode').checked = this.settings.debugMode;

      // 更新滑块
      document.getElementById('catSize').value = this.settings.catSize;
      document.getElementById('catSizeValue').textContent = "".concat(this.settings.catSize, "x");
      document.getElementById('positionX').value = this.settings.catPosition.x;
      document.getElementById('positionXValue').textContent = "".concat(this.settings.catPosition.x, "%");
      document.getElementById('positionY').value = this.settings.catPosition.y;
      document.getElementById('positionYValue').textContent = "".concat(this.settings.catPosition.y, "%");
      document.getElementById('animationSpeed').value = this.settings.animationSpeed;
      document.getElementById('animationSpeedValue').textContent = "".concat(this.settings.animationSpeed, "x");

      // 更新选择框
      document.getElementById('physicsQuality').value = this.settings.physicsQuality;
    }

    // 通知标签页
  }, {
    key: "notifyTabs",
    value: function () {
      var _notifyTabs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(action, data) {
        var tabs, _iterator, _step, tab, _t5, _t6, _t7;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              _context6.n = 1;
              return chrome.tabs.query({});
            case 1:
              tabs = _context6.v;
              _iterator = _createForOfIteratorHelper(tabs);
              _context6.p = 2;
              _iterator.s();
            case 3:
              if ((_step = _iterator.n()).done) {
                _context6.n = 8;
                break;
              }
              tab = _step.value;
              _context6.p = 4;
              _context6.n = 5;
              return chrome.tabs.sendMessage(tab.id, {
                action: action,
                data: data
              });
            case 5:
              _context6.n = 7;
              break;
            case 6:
              _context6.p = 6;
              _t5 = _context6.v;
            case 7:
              _context6.n = 3;
              break;
            case 8:
              _context6.n = 10;
              break;
            case 9:
              _context6.p = 9;
              _t6 = _context6.v;
              _iterator.e(_t6);
            case 10:
              _context6.p = 10;
              _iterator.f();
              return _context6.f(10);
            case 11:
              _context6.n = 13;
              break;
            case 12:
              _context6.p = 12;
              _t7 = _context6.v;
              console.error('通知标签页失败:', _t7);
            case 13:
              return _context6.a(2);
          }
        }, _callee6, null, [[4, 6], [2, 9, 10, 11], [0, 12]]);
      }));
      function notifyTabs(_x, _x2) {
        return _notifyTabs.apply(this, arguments);
      }
      return notifyTabs;
    }() // 显示通知
  }, {
    key: "showNotification",
    value: function showNotification(message) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
      // 创建通知元素
      var notification = document.createElement('div');
      notification.className = "notification notification-".concat(type);
      notification.textContent = message;

      // 添加样式
      notification.style.cssText = "\n      position: fixed;\n      top: 20px;\n      right: 20px;\n      padding: 1rem 1.5rem;\n      border-radius: 6px;\n      color: white;\n      font-weight: 600;\n      z-index: 1000;\n      animation: slideIn 0.3s ease;\n      max-width: 300px;\n    ";

      // 根据类型设置背景色
      var colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#007bff'
      };
      notification.style.backgroundColor = colors[type] || colors.info;

      // 添加到页面
      document.body.appendChild(notification);

      // 3秒后移除
      setTimeout(function () {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(function () {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 3000);
    }
  }]);
}(); // 添加CSS动画
var style = document.createElement('style');
style.textContent = "\n  @keyframes slideIn {\n    from {\n      transform: translateX(100%);\n      opacity: 0;\n    }\n    to {\n      transform: translateX(0);\n      opacity: 1;\n    }\n  }\n  \n  @keyframes slideOut {\n    from {\n      transform: translateX(0);\n      opacity: 1;\n    }\n    to {\n      transform: translateX(100%);\n      opacity: 0;\n    }\n  }\n";
document.head.appendChild(style);

// 初始化选项页面
document.addEventListener('DOMContentLoaded', function () {
  new SoftCatOptions();
});
/******/ })()
;
//# sourceMappingURL=options.js.map