"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeXFont = void 0;
var FontData_js_1 = require("../FontData.js");
var tex_js_1 = require("../../common/fonts/tex.js");
var normal_js_1 = require("./tex/normal.js");
var delimiters_js_1 = require("../../common/fonts/tex/delimiters.js");
var TeXFont = (function (_super) {
    __extends(TeXFont, _super);
    function TeXFont(options) {
        var e_1, _a;
        if (options === void 0) { options = null; }
        var _this = _super.call(this, options) || this;
        var CLASS = _this.constructor;
        try {
            for (var _b = __values(Object.keys(CLASS.variantCacheIds)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var variant = _c.value;
                _this.variant[variant].cacheID = 'TEX-' + CLASS.variantCacheIds[variant];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return _this;
    }
    TeXFont.defaultDelimiters = delimiters_js_1.delimiters;
    TeXFont.defaultChars = {
        'normal': normal_js_1.normal,
    };
    TeXFont.variantCacheIds = {
        'normal': 'N',
    };
    return TeXFont;
}((0, tex_js_1.CommonTeXFontMixin)(FontData_js_1.SVGFontData)));
exports.TeXFont = TeXFont;
//# sourceMappingURL=tex.js.map