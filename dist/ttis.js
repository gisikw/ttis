"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var ttis = Object.assign(function () {
  var assertions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var failures = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  ttis.queue.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        object = _ref2[0],
        body = _ref2[1];

    body(function (prop) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      assertions += 1;
      var expect = args.pop();
      var res = object[prop].apply(object, args);
      if (typeof expect === "function" ? !expect(res) : res !== expect) failures.push([object, prop, args, res, expect]);
    });
  });
  ttis.report(assertions, failures);
}, {
  queue: [],
  test: function test() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return ttis.queue.push(args);
  },
  report: function report() {
    return typeof window === "undefined" ? ttis.reportToConsole.apply(ttis, arguments) : ttis.reportToBrowser.apply(ttis, arguments);
  },
  reportToConsole: function reportToConsole(assertions, failures) {
    console.log("TTIS: " + (assertions - failures.length) + " of " + assertions + " passing");
    failures.map(ttis.failureMessage).map(function (msg) {
      return console.log(msg);
    });
  },
  reportToBrowser: function reportToBrowser(assertions, failures) {
    var _window = window,
        document = _window.document;

    var el = document.getElementById("ttis-results");
    while (el) {
      el.remove();
      el = document.getElementById("ttis-results");
    }
    var div = document.createElement("div");
    div.setAttribute("id", "ttis-results");
    div.innerHTML = "\n        <strong>TTIS: " + (assertions - failures.length) + " / " + assertions + "</strong>\n      ";
    failures.map(ttis.failureMessage).forEach(function (msg) {
      return div.innerHTML += "<p style='margin:0'>" + msg + "</p>";
    });
    div.style.cssText = "font-family:Arial;position:fixed;z-index:999;top:0;left:0;width:100%;font-size:12px;line-height:20px;box-sizing:border-box;padding:8px";
    div.style.cssText += failures.length ? ";background:rgb(255,70,70)" : ";background:rgb(0,255,0)";
    document.body.appendChild(div);
  },
  failureMessage: function failureMessage(_ref3) {
    var _ref4 = _slicedToArray(_ref3, 5),
        object = _ref4[0],
        prop = _ref4[1],
        args = _ref4[2],
        res = _ref4[3],
        expect = _ref4[4];

    return object.constructor.name.toLowerCase() + "." + prop + "(" + args.join(",") + "): " + (typeof expect === "function" ? "post-condition not met" : "expected " + res + " to be " + expect);
  }
});

