// Built from src/ by scripts/build.mjs: edit the TypeScript, then npm run build.
import {createRequire as __itemRequire} from 'node:module';
const require = __itemRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "node_modules/yaml/dist/nodes/identity.js"(exports) {
    "use strict";
    var ALIAS = /* @__PURE__ */ Symbol.for("yaml.alias");
    var DOC = /* @__PURE__ */ Symbol.for("yaml.document");
    var MAP = /* @__PURE__ */ Symbol.for("yaml.map");
    var PAIR = /* @__PURE__ */ Symbol.for("yaml.pair");
    var SCALAR = /* @__PURE__ */ Symbol.for("yaml.scalar");
    var SEQ = /* @__PURE__ */ Symbol.for("yaml.seq");
    var NODE_TYPE = /* @__PURE__ */ Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports.ALIAS = ALIAS;
    exports.DOC = DOC;
    exports.MAP = MAP;
    exports.NODE_TYPE = NODE_TYPE;
    exports.PAIR = PAIR;
    exports.SCALAR = SCALAR;
    exports.SEQ = SEQ;
    exports.hasAnchor = hasAnchor;
    exports.isAlias = isAlias;
    exports.isCollection = isCollection;
    exports.isDocument = isDocument;
    exports.isMap = isMap;
    exports.isNode = isNode;
    exports.isPair = isPair;
    exports.isScalar = isScalar;
    exports.isSeq = isSeq;
  }
});

// node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "node_modules/yaml/dist/visit.js"(exports) {
    "use strict";
    var identity = require_identity();
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP2 = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP2;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path15) {
      const ctrl = callVisitor(key, node, visitor, path15);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path15, ctrl);
        return visit_(key, ctrl, visitor, path15);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path15 = Object.freeze(path15.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path15);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path15 = Object.freeze(path15.concat(node));
          const ck = visit_("key", node.key, visitor, path15);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path15);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP2;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path15) {
      const ctrl = await callVisitor(key, node, visitor, path15);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path15, ctrl);
        return visitAsync_(key, ctrl, visitor, path15);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path15 = Object.freeze(path15.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path15);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path15 = Object.freeze(path15.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path15);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path15);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path15) {
      if (typeof visitor === "function")
        return visitor(key, node, path15);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path15);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path15);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path15);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path15);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path15);
      return void 0;
    }
    function replaceNode(key, path15, node) {
      const parent = path15[path15.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports.visit = visit;
    exports.visitAsync = visitAsync;
  }
});

// node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "node_modules/yaml/dist/doc/directives.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports.Directives = Directives;
  }
});

// node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "node_modules/yaml/dist/doc/anchors.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports.anchorIsValid = anchorIsValid;
    exports.anchorNames = anchorNames;
    exports.createNodeAnchors = createNodeAnchors;
    exports.findNewAnchor = findNewAnchor;
  }
});

// node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "node_modules/yaml/dist/doc/applyReviver.js"(exports) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports.applyReviver = applyReviver;
  }
});

// node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "node_modules/yaml/dist/nodes/toJS.js"(exports) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports.toJS = toJS;
  }
});

// node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "node_modules/yaml/dist/nodes/Node.js"(exports) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports.NodeBase = NodeBase;
  }
});

// node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "node_modules/yaml/dist/nodes/Alias.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        if (found && ctx) {
          const { anchors: anchors2, doc: doc2, maxAliasCount } = ctx;
          let data = anchors2.get(found);
          if (!data) {
            toJS.toJS(found, null, ctx);
            data = anchors2.get(found);
          }
          if (data?.res === void 0) {
            const msg = "This should not happen: Alias anchor was not resolved?";
            throw new ReferenceError(msg);
          }
          if (maxAliasCount >= 0) {
            data.count += 1;
            if (data.aliasCount === 0)
              data.aliasCount = getAliasCount(doc2, found, anchors2);
            if (data.count * data.aliasCount > maxAliasCount) {
              const msg = "Excessive alias count indicates a resource exhaustion attack";
              throw new ReferenceError(msg);
            }
          }
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const source = this.resolve(ctx.doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        return ctx.anchors.get(source).res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports.Alias = Alias;
  }
});

// node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "node_modules/yaml/dist/nodes/Scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports.Scalar = Scalar;
    exports.isScalarValue = isScalarValue;
  }
});

// node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "node_modules/yaml/dist/doc/createNode.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t) => t.tag === tagName);
        const tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports.createNode = createNode;
  }
});

// node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "node_modules/yaml/dist/nodes/Collection.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path15, value) {
      let v = value;
      for (let i = path15.length - 1; i >= 0; --i) {
        const k = path15[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path15) => path15 == null || typeof path15 === "object" && !!path15[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path15, value) {
        if (isEmptyPath(path15))
          this.add(value);
        else {
          const [key, ...rest] = path15;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path15) {
        const [key, ...rest] = path15;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path15, keepScalar) {
        const [key, ...rest] = path15;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path15) {
        const [key, ...rest] = path15;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path15, value) {
        const [key, ...rest] = path15;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports.Collection = Collection;
    exports.collectionFromPath = collectionFromPath;
    exports.isEmptyPath = isEmptyPath;
  }
});

// node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyComment.js"(exports) {
    "use strict";
    var stringifyComment = (str2) => str2.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str2, indent, comment) => str2.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str2.endsWith(" ") ? "" : " ") + comment;
    exports.indentComment = indentComment;
    exports.lineComment = lineComment;
    exports.stringifyComment = stringifyComment;
  }
});

// node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "node_modules/yaml/dist/stringify/foldFlowLines.js"(exports) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text2, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text2;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text2.length <= endStep)
        return text2;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text2, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text2[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text2[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text2, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text2[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text2[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text2;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text2;
      if (onFold)
        onFold();
      let res = text2.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text2.length;
        if (fold === 0)
          res = `
${indent}${text2.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text2[fold]}\\`;
          res += `
${indent}${text2.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text2, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text2[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text2[++i];
        } else {
          do {
            ch = text2[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text2[start];
        }
      }
      return end;
    }
    exports.FOLD_BLOCK = FOLD_BLOCK;
    exports.FOLD_FLOW = FOLD_FLOW;
    exports.FOLD_QUOTED = FOLD_QUOTED;
    exports.foldFlowLines = foldFlowLines;
  }
});

// node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyString.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str2) => /^(%|---|\.\.\.)/m.test(str2);
    function lineLengthOverLimit(str2, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str2.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str2[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str2 = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str2 += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str2 += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str2 += "\\0";
                    break;
                  case "0007":
                    str2 += "\\a";
                    break;
                  case "000b":
                    str2 += "\\v";
                    break;
                  case "001b":
                    str2 += "\\e";
                    break;
                  case "0085":
                    str2 += "\\N";
                    break;
                  case "00a0":
                    str2 += "\\_";
                    break;
                  case "2028":
                    str2 += "\\L";
                    break;
                  case "2029":
                    str2 += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str2 += "\\x" + code.substr(2);
                    else
                      str2 += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str2 += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str2 += "\n";
                  i += 2;
                }
                str2 += indent;
                if (json[i + 2] === " ")
                  str2 += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str2 = start ? str2 + json.slice(start) : json;
      return implicitKey ? str2 : foldFlowLines.foldFlowLines(str2, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str2 = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str2);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str2 : foldFlowLines.foldFlowLines(str2, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports.stringifyString = stringifyString;
  }
});

// node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "node_modules/yaml/dist/stringify/stringify.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t) => t.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str2 = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str2;
      return identity.isScalar(node) || str2[0] === "{" || str2[0] === "[" ? `${props} ${str2}` : `${props}
${ctx.indent}${str2}`;
    }
    exports.createStringifyContext = createStringifyContext;
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyPair.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str2 = stringify.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str2.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str2 === "" ? "?" : explicitKey ? `? ${str2}` : str2;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str2 = `? ${str2}`;
        if (keyComment && !keyCommentDone) {
          str2 += stringifyComment.lineComment(str2, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str2;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str2 += stringifyComment.lineComment(str2, ctx.indent, commentString(keyComment));
        str2 = `? ${str2}
${indent}:`;
      } else {
        str2 = `${str2}:`;
        if (keyComment)
          str2 += stringifyComment.lineComment(str2, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str2.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str2 += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str2 += stringifyComment.lineComment(str2, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str2;
    }
    exports.stringifyPair = stringifyPair;
  }
});

// node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "node_modules/yaml/dist/log.js"(exports) {
    "use strict";
    var node_process = __require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports.debug = debug;
    exports.warn = warn;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports.addMergeToJSMap = addMergeToJSMap;
    exports.isMergeKey = isMergeKey;
    exports.merge = merge;
  }
});

// node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports) {
    "use strict";
    var log = require_log();
    var merge = require_merge();
    var stringify = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge.isMergeKey(ctx, key))
        merge.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports.addPairToJSMap = addPairToJSMap;
  }
});

// node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "node_modules/yaml/dist/nodes/Pair.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k = createNode.createNode(key, void 0, ctx);
      const v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports.Pair = Pair;
    exports.createPair = createPair;
  }
});

// node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyCollection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify2 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify2(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str3 = stringify.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str3 += stringifyComment.lineComment(str3, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str3);
      }
      let str2;
      if (lines.length === 0) {
        str2 = flowChars.start + flowChars.end;
      } else {
        str2 = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str2 += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str2 += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str2;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str2 = stringify.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str2.includes("\n"));
        if (i < items.length - 1) {
          str2 += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str2.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str2 += ",";
          }
        }
        if (comment)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment));
        lines.push(str2);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str2 = start;
          for (const line of lines)
            str2 += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str2}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports.stringifyCollection = stringifyCollection;
  }
});

// node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLMap.js"(exports) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports.YAMLMap = YAMLMap;
    exports.findPair = findPair;
  }
});

// node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "node_modules/yaml/dist/schema/common/map.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports.map = map;
  }
});

// node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLSeq.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports.YAMLSeq = YAMLSeq;
  }
});

// node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "node_modules/yaml/dist/schema/common/seq.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports.seq = seq;
  }
});

// node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "node_modules/yaml/dist/schema/common/string.js"(exports) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str2) => str2,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports.string = string;
  }
});

// node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "node_modules/yaml/dist/schema/common/null.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports.nullTag = nullTag;
  }
});

// node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "node_modules/yaml/dist/schema/core/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str2) => new Scalar.Scalar(str2[0] === "t" || str2[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports.boolTag = boolTag;
  }
});

// node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyNumber.js"(exports) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports.stringifyNumber = stringifyNumber;
  }
});

// node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "node_modules/yaml/dist/schema/core/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str2) => str2.slice(-3).toLowerCase() === "nan" ? NaN : str2[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str2) => parseFloat(str2),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str2) {
        const node = new Scalar.Scalar(parseFloat(str2));
        const dot = str2.indexOf(".");
        if (dot !== -1 && str2[str2.length - 1] === "0")
          node.minFractionDigits = str2.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "node_modules/yaml/dist/schema/core/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str2, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str2) : parseInt(str2.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str2, _onError, opt) => intResolve(str2, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str2, _onError, opt) => intResolve(str2, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str2, _onError, opt) => intResolve(str2, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "node_modules/yaml/dist/schema/core/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "node_modules/yaml/dist/schema/json/schema.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str2) => str2,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str2) => str2 === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str2, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str2) : parseInt(str2, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str2) => parseFloat(str2),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str2, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str2)}`);
        return str2;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports) {
    "use strict";
    var node_buffer = __require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str2 = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str2.length);
          for (let i = 0; i < str2.length; ++i)
            buffer[i] = str2.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str2;
        if (typeof node_buffer.Buffer === "function") {
          str2 = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str2 = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str2.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines[i] = str2.substr(o, lineWidth);
          }
          str2 = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str2 }, ctx, onComment, onChompKeep);
      }
    };
    exports.binary = binary;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports.createPairs = createPairs;
    exports.pairs = pairs;
    exports.resolvePairs = resolvePairs;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports.YAMLOMap = YAMLOMap;
    exports.omap = omap;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports.falseTag = falseTag;
    exports.trueTag = trueTag;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str2) => str2.slice(-3).toLowerCase() === "nan" ? NaN : str2[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str2) => parseFloat(str2.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str2) {
        const node = new Scalar.Scalar(parseFloat(str2.replace(/_/g, "")));
        const dot = str2.indexOf(".");
        if (dot !== -1) {
          const f = str2.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str2, offset, radix, { intAsBigInt }) {
      const sign = str2[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str2 = str2.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str2 = `0b${str2}`;
            break;
          case 8:
            str2 = `0o${str2}`;
            break;
          case 16:
            str2 = `0x${str2}`;
            break;
        }
        const n2 = BigInt(str2);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str2, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str2 = value.toString(radix);
        return value < 0 ? "-" + prefix + str2.substr(1) : prefix + str2;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str2, _onError, opt) => intResolve(str2, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str2, _onError, opt) => intResolve(str2, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str2, _onError, opt) => intResolve(str2, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str2, _onError, opt) => intResolve(str2, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intBin = intBin;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports.YAMLSet = YAMLSet;
    exports.set = set;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str2, asBigInt) {
      const sign = str2[0];
      const parts = sign === "-" || sign === "+" ? str2.substring(1) : str2;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n) => n;
      if (typeof value === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str2, _onError, { intAsBigInt }) => parseSexagesimal(str2, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str2) => parseSexagesimal(str2, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str2) {
        const match = str2.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports.floatTime = floatTime;
    exports.intTime = intTime;
    exports.timestamp = timestamp;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "node_modules/yaml/dist/schema/tags.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports.coreKnownTags = coreKnownTags;
    exports.getTags = getTags;
  }
});

// node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "node_modules/yaml/dist/schema/Schema.js"(exports) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports.Schema = Schema;
  }
});

// node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyDocument.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir2 = doc.directives.toString(doc);
        if (dir2) {
          lines.push(dir2);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports.stringifyDocument = stringifyDocument;
  }
});

// node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "node_modules/yaml/dist/doc/Document.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path15, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path15, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path15) {
        if (Collection.isEmptyPath(path15)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path15) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path15, keepScalar) {
        if (Collection.isEmptyPath(path15))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path15, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path15) {
        if (Collection.isEmptyPath(path15))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path15) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path15, value) {
        if (Collection.isEmptyPath(path15)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path15), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path15, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports.Document = Document;
  }
});

// node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "node_modules/yaml/dist/errors.js"(exports) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports.YAMLError = YAMLError;
    exports.YAMLParseError = YAMLParseError;
    exports.YAMLWarning = YAMLWarning;
    exports.prettifyError = prettifyError;
  }
});

// node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "node_modules/yaml/dist/compose/resolve-props.js"(exports) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports.resolveProps = resolveProps;
  }
});

// node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "node_modules/yaml/dist/compose/util-contains-newline.js"(exports) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st of key.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports.containsNewline = containsNewline;
  }
});

// node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports.flowIndentCheck = flowIndentCheck;
  }
});

// node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "node_modules/yaml/dist/compose/util-map-includes.js"(exports) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports.mapIncludes = mapIncludes;
  }
});

// node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-map.js"(exports) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports.resolveBlockMap = resolveBlockMap;
  }
});

// node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-seq.js"(exports) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports.resolveBlockSeq = resolveBlockSeq;
  }
});

// node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "node_modules/yaml/dist/compose/resolve-end.js"(exports) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep + cb;
              sep = "";
              break;
            }
            case "newline":
              if (comment)
                sep += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports.resolveEnd = resolveEnd;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap = fc.start.source === "{";
      const fcName = isMap ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap && !sep && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep)
                for (const st of sep) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports.resolveFlowCollection = resolveFlowCollection;
  }
});

// node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "node_modules/yaml/dist/compose/compose-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports.composeCollection = composeCollection;
  }
});

// node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep === " ")
            sep = "\n";
          else if (!prevMoreIndented && sep === "\n")
            sep = "\n\n";
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep === "\n")
            value += "\n";
          else
            sep = "\n";
        } else {
          value += sep + content;
          sep = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error === -1)
            error = offset + i;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports.resolveBlockScalar = resolveBlockScalar;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel2, code, msg) => onError(offset + rel2, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return unfoldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return unfoldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function unfoldLines(source) {
      const line = /(.*?)\r?\n/sy;
      let match = line.exec(source);
      if (!match)
        return source;
      let trimEnd, trimBoth;
      try {
        trimEnd = new RegExp("(?<![ 	])[ 	]+$");
        trimBoth = new RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
      } catch {
        trimEnd = /[ \t]+$/;
        trimBoth = /^[ \t]+|[ \t]+$/g;
      }
      let res = match[1].replace(trimEnd, "");
      let sep = " ";
      let pos = line.lastIndex;
      while (match = line.exec(source)) {
        const lm = match[1].replace(trimBoth, "");
        if (lm === "") {
          if (sep === "\n")
            res += sep;
          else
            sep = "\n";
        } else {
          res += sep + lm;
          sep = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports.resolveFlowScalar = resolveFlowScalar;
  }
});

// node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "node_modules/yaml/dist/compose/compose-scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports.composeScalar = composeScalar;
  }
});

// node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports.emptyScalarPosition = emptyScalarPosition;
  }
});

// node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "node_modules/yaml/dist/compose/compose-node.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports.composeEmptyNode = composeEmptyNode;
    exports.composeNode = composeNode;
  }
});

// node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "node_modules/yaml/dist/compose/compose-doc.js"(exports) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports.composeDoc = composeDoc;
  }
});

// node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "node_modules/yaml/dist/compose/composer.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports.Composer = Composer;
  }
});

// node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "node_modules/yaml/dist/parse/cst-scalar.js"(exports) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports.createScalarToken = createScalarToken;
    exports.resolveAsScalar = resolveAsScalar;
    exports.setScalarValue = setScalarValue;
  }
});

// node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "node_modules/yaml/dist/parse/cst-stringify.js"(exports) {
    "use strict";
    var stringify = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep)
        for (const st of sep)
          res += st.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "node_modules/yaml/dist/parse/cst-visit.js"(exports) {
    "use strict";
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP2 = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP2;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path15) => {
      let item = cst;
      for (const [field, index] of path15) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path15) => {
      const parent = visit.itemAtPath(cst, path15.slice(0, -1));
      const field = path15[path15.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path15, item, visitor) {
      let ctrl = visitor(item, path15);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path15.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path15);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path15) : ctrl;
    }
    exports.visit = visit;
  }
});

// node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "node_modules/yaml/dist/parse/cst.js"(exports) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports.createScalarToken = cstScalar.createScalarToken;
    exports.resolveAsScalar = cstScalar.resolveAsScalar;
    exports.setScalarValue = cstScalar.setScalarValue;
    exports.stringify = cstStringify.stringify;
    exports.visit = cstVisit.visit;
    exports.BOM = BOM;
    exports.DOCUMENT = DOCUMENT;
    exports.FLOW_END = FLOW_END;
    exports.SCALAR = SCALAR;
    exports.isCollection = isCollection;
    exports.isScalar = isScalar;
    exports.prettyToken = prettyToken;
    exports.tokenType = tokenType;
  }
});

// node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "node_modules/yaml/dist/parse/lexer.js"(exports) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports.Lexer = Lexer;
  }
});

// node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "node_modules/yaml/dist/parse/line-counter.js"(exports) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports.LineCounter = LineCounter;
  }
});

// node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "node_modules/yaml/dist/parse/parser.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        const token = error ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep;
          if (scalar.end) {
            sep = scalar.end;
            sep.push(this.sourceToken);
            delete scalar.end;
          } else
            sep = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep = it.sep;
                  sep.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs);
              } else {
                Object.assign(it, { key: fs, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs, sep: [] });
              else if (it.sep)
                this.stack.push(fs);
              else
                Object.assign(it, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep = fc.end.splice(1, fc.end.length);
            sep.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports.Parser = Parser;
  }
});

// node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "node_modules/yaml/dist/public-api.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments2(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse3(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports.parse = parse3;
    exports.parseAllDocuments = parseAllDocuments2;
    exports.parseDocument = parseDocument;
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "node_modules/yaml/dist/index.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports.Composer = composer.Composer;
    exports.Document = Document.Document;
    exports.Schema = Schema.Schema;
    exports.YAMLError = errors.YAMLError;
    exports.YAMLParseError = errors.YAMLParseError;
    exports.YAMLWarning = errors.YAMLWarning;
    exports.Alias = Alias.Alias;
    exports.isAlias = identity.isAlias;
    exports.isCollection = identity.isCollection;
    exports.isDocument = identity.isDocument;
    exports.isMap = identity.isMap;
    exports.isNode = identity.isNode;
    exports.isPair = identity.isPair;
    exports.isScalar = identity.isScalar;
    exports.isSeq = identity.isSeq;
    exports.Pair = Pair.Pair;
    exports.Scalar = Scalar.Scalar;
    exports.YAMLMap = YAMLMap.YAMLMap;
    exports.YAMLSeq = YAMLSeq.YAMLSeq;
    exports.CST = cst;
    exports.Lexer = lexer.Lexer;
    exports.LineCounter = lineCounter.LineCounter;
    exports.Parser = parser.Parser;
    exports.parse = publicApi.parse;
    exports.parseAllDocuments = publicApi.parseAllDocuments;
    exports.parseDocument = publicApi.parseDocument;
    exports.stringify = publicApi.stringify;
    exports.visit = visit.visit;
    exports.visitAsync = visit.visitAsync;
  }
});

// node_modules/@vscode/ripgrep/lib/index.js
var lib_exports = {};
__export(lib_exports, {
  rgPath: () => rgPath
});
import { createRequire } from "node:module";
var require2, arch, binaryName, platformPkg, resolved, rgPath;
var init_lib = __esm({
  "node_modules/@vscode/ripgrep/lib/index.js"() {
    require2 = createRequire(import.meta.url);
    arch = process.env.npm_config_arch || process.arch;
    binaryName = process.platform === "win32" ? "rg.exe" : "rg";
    platformPkg = `@vscode/ripgrep-${process.platform}-${arch}`;
    try {
      resolved = require2.resolve(`${platformPkg}/bin/${binaryName}`);
    } catch {
      throw new Error(
        `Could not find ${platformPkg}. Ensure optionalDependencies are installed for this platform (${process.platform}-${arch}).`
      );
    }
    rgPath = resolved;
  }
});

// items/system/src/index.ts
import path14 from "node:path";

// items/system/src/env/stack.ts
var import_yaml = __toESM(require_dist(), 1);
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

// items/system/src/util/proc.ts
import { execFile } from "node:child_process";
var rein;
var setHost = (r) => void (rein = r);
function run(cmd, args, opts = {}) {
  if (rein) return rein.exec(cmd, args, opts);
  return new Promise(
    (resolve) => execFile(
      cmd,
      args,
      { cwd: opts.cwd, timeout: opts.timeoutMs, maxBuffer: 64 * 1024 * 1024, windowsHide: true },
      (err, stdout, stderr) => resolve({ code: err ? typeof err.code === "number" ? Number(err.code) : 1 : 0, stdout: String(stdout), stderr: String(stderr) })
    )
  );
}
var hostRein = () => rein;

// items/system/src/env/stack.ts
var defaultExec = async (cmd, args, cwd, timeoutMs = 15 * 6e4) => {
  const r = await run(cmd, args, { cwd, timeoutMs }).catch((err) => ({ code: 127, stdout: "", stderr: err.message }));
  return { code: r.code ?? 1, stdout: r.stdout, stderr: r.stderr };
};
var COMPOSE_FILES = ["compose.yaml", "compose.yml", "docker-compose.yml", "docker-compose.yaml"];
var composeFile = (root) => COMPOSE_FILES.map((f) => path.join(root, f)).find((f) => existsSync(f));
function composeServicesFor(file2, dirs) {
  let doc;
  try {
    doc = (0, import_yaml.parse)(readFileSync(file2, "utf8"));
  } catch {
    return [];
  }
  const base = path.dirname(file2);
  const out = [];
  for (const [name, def] of Object.entries(doc?.services ?? {})) {
    const ctx = typeof def?.build === "string" ? def.build : def?.build?.context;
    const at = ctx ? path.resolve(base, ctx) : void 0;
    if (dirs.some((d) => at && (at === d || d.startsWith(at + path.sep) || at.startsWith(d + path.sep)) || path.basename(d).toLowerCase() === name.toLowerCase())) out.push(name);
  }
  return out;
}
function parsePs(stdout) {
  const rows = [];
  const t = stdout.trim();
  if (t.startsWith("[")) {
    try {
      rows.push(...JSON.parse(t));
    } catch {
    }
  } else
    for (const l of t.split("\n"))
      try {
        if (l.trim()) rows.push(JSON.parse(l));
      } catch {
      }
  return rows.map((r) => ({
    name: r.Service ?? r.Name,
    state: String(r.State ?? "").toLowerCase(),
    ...r.Health ? { health: String(r.Health).toLowerCase() } : {},
    ports: (r.Publishers ?? []).filter((p) => p.PublishedPort).map((p) => `localhost:${p.PublishedPort} \u2192 ${p.TargetPort}/${p.Protocol ?? "tcp"}`)
  }));
}
var ready = (s) => s.state === "running" && (!s.health || s.health === "healthy");
var LocalStack = class {
  constructor(root, exec = defaultExec, wait = (ms) => new Promise((r) => setTimeout(r, ms))) {
    this.root = root;
    this.exec = exec;
    this.wait = wait;
  }
  root;
  exec;
  wait;
  file() {
    return composeFile(this.root);
  }
  async status() {
    const f = this.file();
    if (!f) return [];
    const r = await this.exec("docker", ["compose", "-f", f, "ps", "--all", "--format", "json"], this.root, 6e4);
    return r.code === 0 ? parsePs(r.stdout) : [];
  }
  /** Up: the named services (with their depends_on), then wait until each is running and healthy. */
  async up(names, timeoutMs = 5 * 6e4) {
    const f = this.file();
    if (!f) return { ok: false, services: [], message: "No compose file here (compose.yaml or docker-compose.yml)." };
    if ((await this.exec("docker", ["compose", "version"], this.root, 3e4)).code !== 0) return { ok: false, services: [], message: "Docker Compose isn't available (is Docker running?)." };
    const up = await this.exec("docker", ["compose", "-f", f, "up", "-d", "--wait", "--wait-timeout", String(Math.round(timeoutMs / 1e3)), ...names], this.root, timeoutMs + 6e4);
    let services = await this.status();
    for (let t = 0; up.code !== 0 && /unknown flag|--wait/.test(up.stderr) && t < timeoutMs; t += 2e3) {
      if (t === 0) await this.exec("docker", ["compose", "-f", f, "up", "-d", ...names], this.root, timeoutMs);
      services = await this.status();
      if (services.length && services.every(ready)) break;
      await this.wait(2e3);
    }
    const wanted = services;
    const bad = wanted.filter((s) => !ready(s));
    if (bad.length) return { ok: false, services, message: `Not ready: ${bad.map((s) => `${s.name} (${s.health ?? s.state})`).join(", ")}.${up.stderr.trim() ? ` ${up.stderr.trim().split("\n").pop()}` : ""}` };
    return { ok: true, services, message: `Up and healthy: ${wanted.map((s) => s.name).join(", ")}.` };
  }
  async logs(name, lines = 80) {
    const f = this.file();
    if (!f) return "No compose file here.";
    const r = await this.exec("docker", ["compose", "-f", f, "logs", "--no-color", "--tail", String(lines), name], this.root, 6e4);
    return (r.stdout || r.stderr).trim() || "(no output)";
  }
  async down() {
    const f = this.file();
    if (!f) return "No compose file here.";
    const r = await this.exec("docker", ["compose", "-f", f, "down"], this.root, 5 * 6e4);
    return r.code === 0 ? "Stopped the stack." : `docker compose down failed: ${r.stderr.trim().split("\n").pop()}`;
  }
  /** Helm: only into a local cluster. */
  async helm(chartDir) {
    const ctx = (await this.exec("kubectl", ["config", "current-context"], this.root, 2e4)).stdout.trim();
    if (!ctx) return "kubectl has no current context (or isn't installed).";
    if (!/^(?:kind-|k3d-|minikube$|docker-desktop$|rancher-desktop$|orbstack$|colima)/.test(ctx)) return `Refusing to install into ${ctx}: /stack up --helm only deploys to a local cluster (kind, k3d, minikube, Docker Desktop, Rancher Desktop, OrbStack, Colima).`;
    const name = `rein-${path.basename(chartDir).toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`;
    const r = await this.exec("helm", ["upgrade", "--install", name, chartDir, "--wait", "--timeout", "10m"], this.root, 11 * 6e4);
    return r.code === 0 ? `Installed ${name} into ${ctx}.` : `helm failed: ${(r.stderr || r.stdout).trim().split("\n").pop()}`;
  }
};
async function servicesForChange(root, services, exec = defaultExec) {
  const f = composeFile(root);
  if (!f) return [];
  const changed = (await exec("git", ["diff", "--name-only", "HEAD"], root, 3e4)).stdout.split("\n").filter(Boolean).map((x) => path.join(root, x));
  const dirs = services.map((s) => s.dir).filter((d) => changed.some((c) => c.startsWith(d + path.sep)));
  return composeServicesFor(f, dirs);
}
function formatServices(services) {
  if (!services.length) return "Nothing is running.";
  return services.map((s) => `  ${ready(s) ? "\u2713" : "\xB7"} ${s.name}  ${s.state}${s.health ? ` (${s.health})` : ""}${s.ports.length ? `  ${s.ports.join(", ")}` : ""}`).join("\n");
}
function stackTool(experiments, stack, change) {
  return {
    name: "stack",
    label: "Stack",
    description: "",
    describe: () => "Run the services this change needs locally, with Docker Compose, and test against them. action up (services, or omit for the ones your changes touch, with what they depend on: waits until healthy and lists their ports), status, logs (a service's recent output), or down. Ask the user before down if they started the stack themselves.",
    inputSchema: { type: "object", properties: { action: { type: "string", enum: ["up", "status", "logs", "down"] }, services: { type: "array", items: { type: "string" } }, service: { type: "string", description: "For logs" } }, required: ["action"] },
    mutating: true,
    enabled: () => experiments().includes("stack-tool"),
    summarize: (a) => `${a?.action ?? ""} ${(a?.services ?? []).join(" ")}${a?.service ?? ""}`.trim(),
    async run(_ctx, args) {
      const s = stack();
      if (args?.action === "status") return { ok: true, text: formatServices(await s.status()) };
      if (args?.action === "logs") return { ok: true, text: await s.logs(String(args?.service ?? "")) };
      if (args?.action === "down") return { ok: true, text: await s.down() };
      const names = Array.isArray(args?.services) && args.services.length ? args.services.map(String) : await change();
      const r = await s.up(names);
      return { ok: r.ok, text: `${r.message}
${formatServices(r.services)}` };
    }
  };
}

// items/system/src/system/changeset.ts
import { mkdirSync, readdirSync, readFileSync as readFileSync3, writeFileSync } from "node:fs";
import path4 from "node:path";

// items/system/src/agents/bestOf.ts
import { existsSync as existsSync2, readFileSync as readFileSync2 } from "node:fs";
import path2 from "node:path";
function detectTestCommand(root) {
  const has = (f) => existsSync2(path2.join(root, f));
  try {
    const pkg = JSON.parse(readFileSync2(path2.join(root, "package.json"), "utf8"));
    const t = pkg.scripts?.test;
    if (t && !/no test specified/.test(t)) return has("pnpm-lock.yaml") ? "pnpm test" : has("yarn.lock") ? "yarn test" : has("bun.lockb") || has("bun.lock") ? "bun test" : "npm test";
  } catch {
  }
  try {
    if (/^test:/m.test(readFileSync2(path2.join(root, "Makefile"), "utf8"))) return "make test";
  } catch {
  }
  if (has("Cargo.toml")) return "cargo test";
  if (has("go.mod")) return "go test ./...";
  if (has("pytest.ini") || has("conftest.py") || has("tox.ini") || has("pyproject.toml") && /pytest/.test(readFileSync2(path2.join(root, "pyproject.toml"), "utf8"))) return "python -m pytest -q";
  return void 0;
}

// items/system/src/pr/linked.ts
var START = "<!-- rein:linked-prs -->";
var END = "<!-- /rein:linked-prs -->";
async function prsForBranch(ws, branch) {
  const found = await Promise.all(
    ws.repos.filter((r) => r.present).map(async (r) => {
      const res = await run("gh", ["pr", "view", branch, "--json", "number,url,title,state,body"], { cwd: r.path, timeoutMs: 6e4 }).catch(() => void 0);
      if (res?.code !== 0) return void 0;
      try {
        return { repo: r.name, dir: r.path, ...JSON.parse(res.stdout) };
      } catch {
        return void 0;
      }
    })
  );
  return found.filter((p) => !!p);
}
function linkedBody(body, self, all) {
  const others = all.filter((p) => p.url !== self.url);
  const section = [START, "### Related pull requests", "", ...others.map((p) => `- ${p.repo}: ${p.url} (${p.title})`), "", "_Merge together: these change the same feature across repos._", END].join("\n");
  const i = body.indexOf(START);
  const j = body.indexOf(END);
  if (i >= 0 && j > i) return `${body.slice(0, i)}${section}${body.slice(j + END.length)}`;
  return `${body.trimEnd()}${body.trim() ? "\n\n" : ""}${section}
`;
}
async function linkPrs(prs) {
  const updated = [];
  const failed = [];
  for (const p of prs) {
    const res = await run("gh", ["pr", "edit", String(p.number), "--body", linkedBody(p.body ?? "", p, prs)], { cwd: p.dir, timeoutMs: 6e4 }).catch((err) => ({ code: 1, stdout: "", stderr: err.message }));
    if (res.code === 0) updated.push(`${p.repo}#${p.number}`);
    else failed.push(`${p.repo}#${p.number}: ${(res.stderr || res.stdout).trim().split("\n").pop()}`);
  }
  return { updated, failed };
}

// items/system/src/util/platform.ts
import { existsSync as existsSync3 } from "node:fs";
import path3 from "node:path";
import { spawnSync } from "node:child_process";
var isWindows = process.platform === "win32";
var gitBash;
function findGitBash() {
  if (gitBash !== void 0) return gitBash ?? void 0;
  const candidates = [
    process.env.REIN_GIT_BASH_PATH,
    process.env.CLAUDE_CODE_GIT_BASH_PATH,
    path3.join(process.env.ProgramFiles ?? "C:\\Program Files", "Git", "bin", "bash.exe"),
    path3.join(process.env["ProgramFiles(x86)"] ?? "C:\\Program Files (x86)", "Git", "bin", "bash.exe"),
    process.env.LOCALAPPDATA && path3.join(process.env.LOCALAPPDATA, "Programs", "Git", "bin", "bash.exe")
  ].filter((p) => !!p);
  let found = candidates.find((p) => existsSync3(p));
  if (!found) {
    const where = spawnSync("where", ["git"], { encoding: "utf8" });
    const git3 = where.stdout?.split(/\r?\n/).find(Boolean);
    const bash = git3 && path3.join(path3.dirname(path3.dirname(git3)), "bin", "bash.exe");
    if (bash && existsSync3(bash)) found = bash;
  }
  gitBash = found ?? null;
  return found;
}
function shellFor(command) {
  if (!isWindows) return { file: process.env.SHELL || "/bin/sh", args: ["-c", command], kind: "posix" };
  const bash = findGitBash();
  if (bash) return { file: bash, args: ["-c", command], kind: "posix" };
  return { file: "powershell.exe", args: ["-NoProfile", "-NonInteractive", "-Command", command], kind: "powershell" };
}

// items/system/src/system/changeset.ts
var dir = (ws) => path4.join(ws.root, ".rein", "changesets");
var file = (ws, name) => path4.join(dir(ws), `${name}.json`);
var git = async (cwd, ...a) => await run("git", a, { cwd, timeoutMs: 6e4 }).catch((err) => ({ code: 1, stdout: "", stderr: err.message }));
function loadChangeSets(ws) {
  try {
    return readdirSync(dir(ws)).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync3(path4.join(dir(ws), f), "utf8"))).sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}
var reposOf = (ws, names) => ws.repos.filter((r) => r.present && (!names?.length || names.includes(r.name)));
async function startChangeSet(ws, name, repoNames) {
  const branch = name.replace(/[^\w./-]+/g, "-");
  const repos = reposOf(ws, repoNames);
  const unknown = (repoNames ?? []).filter((n) => !ws.repos.some((r) => r.name === n && r.present));
  const done = [];
  const failed = unknown.map((n) => `${n}: not a cloned repo of this workspace`);
  for (const r of repos) {
    const exists = (await git(r.path, "rev-parse", "--verify", "-q", `refs/heads/${branch}`)).code === 0;
    const res = await git(r.path, "switch", ...exists ? [branch] : ["-c", branch]);
    if (res.code === 0) done.push(r.name);
    else failed.push(`${r.name}: ${(res.stderr || res.stdout).trim().split("\n").pop()}`);
  }
  const set = { name, branch, repos: done, createdAt: Date.now() };
  mkdirSync(dir(ws), { recursive: true });
  writeFileSync(file(ws, name), JSON.stringify(set, null, 2) + "\n");
  return { set, done, failed };
}
async function changeSetState(ws, set) {
  return Promise.all(
    reposOf(ws, set.repos).map(async (r) => {
      const current = (await git(r.path, "branch", "--show-current")).stdout.trim();
      const upstream = (await git(r.path, "symbolic-ref", "--quiet", "refs/remotes/origin/HEAD")).stdout.trim().replace("refs/remotes/", "") || "HEAD";
      const ahead = Number((await git(r.path, "rev-list", "--count", `${upstream}..${set.branch}`)).stdout.trim()) || 0;
      const dirty = (await git(r.path, "status", "--porcelain")).stdout.split("\n").filter(Boolean).length;
      return { repo: r.name, dir: r.path, onBranch: current === set.branch, ahead, dirty };
    })
  );
}
function dependencyOrder(repos, edges) {
  const deps = new Map(repos.map((r) => [r, new Set(edges.filter((e) => e.from === r && repos.includes(e.to)).map((e) => e.to))]));
  const out = [];
  const visit = (r, stack) => {
    if (out.includes(r) || stack.has(r)) return;
    stack.add(r);
    for (const d of deps.get(r) ?? []) visit(d, stack);
    stack.delete(r);
    out.push(r);
  };
  for (const r of repos) visit(r, /* @__PURE__ */ new Set());
  return out;
}
var shellRunner = async (command, cwd) => {
  const sh = shellFor(command);
  const r = await run(sh.file, sh.args, { cwd, timeoutMs: 60 * 6e4 }).catch((err) => ({ code: 1, stdout: "", stderr: err.message }));
  return { ok: r.code === 0, output: `${r.stdout}
${r.stderr}`.trim() };
};
async function testChangeSet(ws, set, edges, runner = shellRunner, log = () => {
}) {
  const results = [];
  for (const name of dependencyOrder(set.repos, edges)) {
    const r = ws.repos.find((x) => x.name === name);
    const current = (await git(r.path, "branch", "--show-current")).stdout.trim();
    if (current !== set.branch) {
      results.push({ repo: name, ok: false, output: `on ${current || "a detached HEAD"}, not ${set.branch}` });
      continue;
    }
    const command = detectTestCommand(r.path);
    if (!command) {
      results.push({ repo: name, ok: true, output: "no test command found (skipped)" });
      continue;
    }
    log(`${name}: ${command}\u2026`);
    const t = await runner(command, r.path);
    results.push({ repo: name, command, ok: t.ok, output: t.output.split("\n").slice(-12).join("\n") });
  }
  return results;
}
async function openPrs(ws, set, title, exec = git) {
  const opened = [];
  const failed = [];
  for (const r of reposOf(ws, set.repos)) {
    const push = await exec(r.path, "push", "-u", "origin", set.branch);
    if (push.code !== 0) {
      failed.push(`${r.name}: git push failed: ${(push.stderr || push.stdout).trim().split("\n").pop()}`);
      continue;
    }
    const pr = await run("gh", ["pr", "create", "--head", set.branch, "--title", title, "--body", `Part of the change set "${set.name}" across ${set.repos.join(", ")}.`], { cwd: r.path, timeoutMs: 12e4 }).catch((err) => ({ code: 1, stdout: "", stderr: err.message }));
    if (pr.code === 0 || /already exists/.test(pr.stderr)) opened.push(r.name);
    else failed.push(`${r.name}: gh pr create failed: ${(pr.stderr || pr.stdout).trim().split("\n").pop()}`);
  }
  const prs = await prsForBranch(ws, set.branch);
  const linked = prs.length > 1 ? (await linkPrs(prs)).updated : [];
  return { opened, failed, linked };
}
function formatState(set, states) {
  return [`Change set ${set.name} (branch ${set.branch}):`, ...states.map((s) => `  ${s.onBranch ? "\u2713" : "!"} ${s.repo}  ${s.onBranch ? `${s.ahead} commit${s.ahead === 1 ? "" : "s"}` : `not on ${set.branch}`}${s.dirty ? `, ${s.dirty} uncommitted` : ""}`)].join("\n");
}
function formatTests(results) {
  const failed = results.filter((r) => !r.ok);
  return [failed.length ? `${failed.length} of ${results.length} repos failed:` : `All ${results.length} repos pass, tested in dependency order:`, ...results.map((r) => `  ${r.ok ? "\u2713" : "\u2717"} ${r.repo}${r.command ? `  ${r.command}` : ""}${r.ok ? "" : `
${r.output.split("\n").map((l) => `      ${l}`).join("\n")}`}`)].join("\n");
}

// items/system/src/system/codemap.ts
import { createHash } from "node:crypto";
import { existsSync as existsSync7, mkdirSync as mkdirSync2, readdirSync as readdirSync3, readFileSync as readFileSync8, statSync as statSync4, writeFileSync as writeFileSync2 } from "node:fs";
import path9 from "node:path";

// items/system/src/context/owners.ts
var import_yaml2 = __toESM(require_dist(), 1);
import { existsSync as existsSync4, readFileSync as readFileSync4 } from "node:fs";
import path5 from "node:path";

// items/system/src/tools/fs.ts
var DECLARATION = /^(?:\t|  |    )?(?:export\s+|default\s+|public\s+|private\s+|protected\s+|internal\s+|static\s+|async\s+|abstract\s+|final\s+|pub(?:\(crate\))?\s+|override\s+|@\w+\s+)*(?:function\*?|class|interface|type|enum|struct|trait|impl|module|namespace|object|record|def|func|fn|const|let|var|val|package|import\s*\(|describe|it|test|macro_rules!|#{1,3}\s|\w[\w.<>\[\], *&:]*\s+\**\w+\s*\()/;
async function ripgrep() {
  const r = hostRein();
  if (r) return await r.ripgrep() ?? null;
  const pkg = await Promise.resolve().then(() => (init_lib(), lib_exports)).catch(() => void 0);
  if (pkg?.rgPath) return pkg.rgPath;
  return (await run("rg", ["--version"])).code === 0 ? "rg" : null;
}
var escape = (s) => s.replace(/[.+^${}()|[\]\\]/g, "\\$&");
function globToRegExp(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        re += ".*";
        i++;
        if (glob[i + 1] === "/") i++;
      } else re += "[^/]*";
    } else if (c === "?") re += "[^/]";
    else if (c === "{") {
      const end = glob.indexOf("}", i);
      re += `(${glob.slice(i + 1, end).split(",").map(escape).join("|")})`;
      i = end;
    } else re += escape(c);
  }
  return new RegExp(`^${re}$`);
}

// items/system/src/context/owners.ts
var CODEOWNERS = [".github/CODEOWNERS", "CODEOWNERS", "docs/CODEOWNERS", ".gitlab/CODEOWNERS"];
function patternMatcher(pattern) {
  let p = pattern;
  const anchored = p.startsWith("/");
  if (anchored) p = p.slice(1);
  const dirOnly = p.endsWith("/");
  if (dirOnly) p = p.slice(0, -1);
  const lead = anchored || p.includes("/") ? "" : "(?:.*/)?";
  const body = globToRegExp(p).source.slice(1, -1);
  const self = new RegExp(`^${lead}${body}$`);
  const inside = new RegExp(`^${lead}${body}/.*$`);
  return (file2) => !dirOnly && self.test(file2) || inside.test(file2);
}
function parseCodeowners(text2) {
  const rules = [];
  for (const raw of text2.split("\n")) {
    const line = raw.replace(/(^|\s)#.*$/, "").trim();
    if (!line || /^\^?\[.*\]/.test(line)) continue;
    const [pattern, ...owners] = line.split(/\s+/);
    if (pattern) rules.push({ pattern, matches: patternMatcher(pattern), owners });
  }
  return rules;
}
function loadCodeowners(root) {
  for (const f of CODEOWNERS) {
    try {
      return parseCodeowners(readFileSync4(path5.join(root, f), "utf8"));
    } catch {
    }
  }
  return [];
}
async function backstageOwners(root) {
  const out = /* @__PURE__ */ new Map();
  const rg = await ripgrep();
  if (!rg) return out;
  const r = await run(rg, ["--files", "-g", "catalog-info.y*ml", "--color", "never"], { cwd: root, timeoutMs: 2e4 }).catch(() => void 0);
  for (const f of (r?.stdout ?? "").split(/\r?\n/).filter(Boolean)) {
    try {
      for (const doc of String(readFileSync4(path5.join(root, f), "utf8")).split(/^---\s*$/m)) {
        const owner = (0, import_yaml2.parse)(doc)?.spec?.owner;
        if (owner) out.set(path5.dirname(f).replace(/\\/g, "/"), owner);
      }
    } catch {
    }
  }
  return out;
}
async function historyOwners(root, file2) {
  const r = await run("git", ["log", "--since=1 year ago", "-n", "300", "--format=%an", "--", file2], { cwd: root, timeoutMs: 2e4 }).catch(() => void 0);
  const counts = /* @__PURE__ */ new Map();
  for (const a of (r?.stdout ?? "").split("\n").filter(Boolean)) counts.set(a, (counts.get(a) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([a, n]) => `${a} (${n} commit${n === 1 ? "" : "s"})`);
}
async function ownersOf(root, files2) {
  const rules = loadCodeowners(root);
  const catalog = await backstageOwners(root);
  return Promise.all(
    files2.map(async (file2) => {
      const f = file2.replace(/\\/g, "/");
      const rule = [...rules].reverse().find((r) => r.matches(f));
      if (rule?.owners.length) return { file: f, owners: rule.owners, source: "CODEOWNERS" };
      const dir2 = [...catalog.keys()].filter((d) => d === "." || f === d || f.startsWith(`${d}/`)).sort((a, b) => b.length - a.length)[0];
      if (dir2 !== void 0) return { file: f, owners: [catalog.get(dir2)], source: "Backstage" };
      const hist = existsSync4(path5.join(root, ".git")) ? await historyOwners(root, f) : [];
      return { file: f, owners: hist, source: hist.length ? "git history" : "none" };
    })
  );
}

// items/system/src/context/repoMap.ts
import { readFileSync as readFileSync5, statSync } from "node:fs";
import path6 from "node:path";
var SOURCE = /\.(?:[cm]?[jt]sx?|py|go|rs|java|kt|kts|scala|swift|rb|php|cs|fs|c|cc|cpp|cxx|h|hh|hpp|m|mm|ex|exs|erl|hs|ml|clj|dart|lua|r|jl|sol|zig|nim|vue|svelte)$/i;
var SKIP = /(?:^|\/)(?:node_modules|vendor|third_party|dist|build|out|target|\.next|coverage|__generated__|generated|gen)\/|(?:\.min\.|\.d\.ts$|_pb2?\.|\.pb\.go$|\.g\.dart$)|(?:^|\/)(?:tests?|__tests__|spec|testdata|fixtures)\/|(?:[._-](?:test|spec))\.[a-z]+$/i;
var EXPORTED = /^\s*(?:export\b|pub\b|public\b|def [^_]|func [A-Z]|class |interface |type |struct |trait |module |object )/;
var MAX_FILES = 5e3;
var MAX_BYTES = 4e5;
function declarations(text2) {
  const out = [];
  for (const line of text2.split("\n")) {
    if (/^\s/.test(line) || !DECLARATION.test(line) || /^(?:\/\/|\/\*|\*|#(?!#* )|--|;|import\b|from\b|use\b|package\b|require\b)/.test(line)) continue;
    const sig = /\b(?:function|class|interface|struct|impl|trait|enum|fn|func|def|module|namespace|object)\b/.test(line) ? line.replace(/\s*\{.*$/, "") : line;
    out.push(sig.replace(/\s*[{:]?\s*$/, "").replace(/\s+/g, " ").slice(0, 140));
  }
  return out;
}
async function repoMap(root, budgetTokens = 4e3) {
  const rg = await ripgrep();
  const listed = rg ? (await run(rg, ["--files", "--color", "never"], { cwd: root, timeoutMs: 3e4 }).catch(() => void 0))?.stdout ?? "" : "";
  const files2 = listed.split(/\r?\n/).map((f) => f.replace(/\\/g, "/")).filter((f) => f && SOURCE.test(f) && !SKIP.test(f)).slice(0, MAX_FILES);
  const entries = [];
  for (const file2 of files2) {
    let text2 = "";
    try {
      if (statSync(path6.join(root, file2)).size > MAX_BYTES) continue;
      text2 = readFileSync5(path6.join(root, file2), "utf8");
    } catch {
      continue;
    }
    const decls = declarations(text2);
    if (decls.length) entries.push({ file: file2, decls, exported: decls.filter((d) => EXPORTED.test(d)).length, depth: file2.split("/").length });
  }
  entries.sort((a, b) => b.exported - a.exported || a.depth - b.depth || a.file.localeCompare(b.file));
  const budget = budgetTokens * 4;
  const parts = [];
  let used = 0;
  for (const e of entries) {
    const block = `${e.file}
${e.decls.slice(0, 25).map((d) => `  ${d}`).join("\n")}${e.decls.length > 25 ? `
  \u2026 ${e.decls.length - 25} more` : ""}`;
    if (used + block.length > budget) continue;
    parts.push(block);
    used += block.length + 1;
  }
  return { text: parts.sort().join("\n"), files: entries.length, shown: parts.length };
}

// items/system/src/system/services.ts
var import_yaml4 = __toESM(require_dist(), 1);
import { existsSync as existsSync6, readdirSync as readdirSync2, readFileSync as readFileSync7, statSync as statSync3 } from "node:fs";
import path8 from "node:path";

// items/system/src/workspace/index.ts
var import_yaml3 = __toESM(require_dist(), 1);
import { existsSync as existsSync5, readFileSync as readFileSync6, statSync as statSync2 } from "node:fs";
import path7 from "node:path";
var WORKSPACE_FILES = ["rein.workspace.yaml", "rein.workspace.yml"];
var str = (v) => typeof v === "string" && v.trim() ? v.trim() : void 0;
function parseWorkspace(file2, text2) {
  const root = path7.dirname(file2);
  const ws = { root, file: file2, repos: [], errors: [] };
  let doc;
  try {
    doc = (0, import_yaml3.parse)(text2);
  } catch (err) {
    ws.errors.push(`${path7.basename(file2)}: ${err.message.split("\n")[0]}`);
    return ws;
  }
  if (!doc || typeof doc !== "object") return ws;
  const d = doc;
  ws.name = str(d.name);
  const list = Array.isArray(d.repos) ? d.repos : d.repos && typeof d.repos === "object" ? Object.entries(d.repos).map(([name, v]) => ({ name, ...v })) : [];
  for (const [i, raw] of list.entries()) {
    const r = typeof raw === "string" ? { path: raw } : raw;
    const rel2 = str(r?.path) ?? (str(r?.name) ? str(r.name) : void 0);
    if (!rel2) {
      ws.errors.push(`repos[${i}]: needs a path (or a name, used as the folder)`);
      continue;
    }
    const abs = path7.resolve(root, rel2.startsWith("~/") ? path7.join(process.env.HOME ?? "", rel2.slice(2)) : rel2);
    const name = str(r.name) ?? path7.basename(abs);
    if (ws.repos.some((x) => x.name === name)) {
      ws.errors.push(`repos[${i}]: the name "${name}" is used twice`);
      continue;
    }
    let present = false;
    try {
      present = statSync2(abs).isDirectory();
    } catch {
    }
    const sparse = (Array.isArray(r.sparse) ? r.sparse : typeof r.sparse === "string" ? [r.sparse] : []).map((s) => String(s).trim().replace(/^\/+|\/+$/g, "")).filter(Boolean);
    const filter = str(r.filter);
    if (filter && filter !== "blob:none" && filter !== "tree:0") ws.errors.push(`repos[${i}]: filter must be blob:none or tree:0, not ${filter}`);
    ws.repos.push({ name, path: abs, url: str(r.url), role: str(r.role), branch: str(r.branch), ...sparse.length ? { sparse } : {}, ...filter === "blob:none" || filter === "tree:0" ? { filter } : {}, present });
  }
  return ws;
}
function findWorkspace(cwd = process.cwd()) {
  let dir2 = path7.resolve(cwd);
  for (; ; ) {
    for (const f of WORKSPACE_FILES) {
      const file2 = path7.join(dir2, f);
      if (existsSync5(file2)) {
        let text2 = "";
        try {
          text2 = readFileSync6(file2, "utf8");
        } catch {
        }
        return parseWorkspace(file2, text2);
      }
    }
    const parent = path7.dirname(dir2);
    if (parent === dir2) return void 0;
    dir2 = parent;
  }
}

// items/system/src/system/services.ts
var SERVICE_ROOTS = ["services", "apps", "packages", "cmd", "svc", "microservices"];
var isDir = (p) => {
  try {
    return statSync3(p).isDirectory();
  } catch {
    return false;
  }
};
var read = (f) => {
  try {
    return readFileSync7(f, "utf8");
  } catch {
    return void 0;
  }
};
var rel = (root, f) => path8.relative(root, f).split(path8.sep).join("/");
function findServices(root) {
  const ws = findWorkspace(root);
  if (ws && ws.repos.filter((r) => r.present).length > 1) return ws.repos.filter((r) => r.present).map((r) => ({ name: r.name, dir: r.path, provides: [] }));
  const out = [];
  for (const top of SERVICE_ROOTS) {
    const d = path8.join(root, top);
    if (!isDir(d)) continue;
    for (const name of readdirSync2(d)) {
      const dir2 = path8.join(d, name);
      if (!isDir(dir2) || name.startsWith(".")) continue;
      if (["package.json", "go.mod", "pyproject.toml", "Cargo.toml", "pom.xml", "build.gradle", "build.gradle.kts", "Dockerfile", "requirements.txt"].some((m) => existsSync6(path8.join(dir2, m)))) out.push({ name, dir: dir2, provides: [] });
    }
  }
  return out.length ? out : [{ name: path8.basename(root), dir: root, provides: [] }];
}
async function files(dir2, globs) {
  const rg = await ripgrep();
  if (!rg) return [];
  const r = await run(rg, ["--files", "--color", "never", ...globs.flatMap((g) => ["-g", g])], { cwd: dir2, timeoutMs: 3e4 }).catch(() => void 0);
  return (r?.stdout ?? "").split(/\r?\n/).filter(Boolean).map((f) => path8.join(dir2, f));
}
function aliases(s) {
  const base = s.name.toLowerCase().replace(/[-_](service|svc|api|server|app)$/, "");
  return [.../* @__PURE__ */ new Set([s.name.toLowerCase(), base, `${base}-service`, `${base}_service`, `${base}-api`, `${base}-svc`])];
}
async function buildGraph(root) {
  const services = findServices(root);
  const edges = [];
  const add = (e) => {
    if (e.from !== e.to && !edges.some((x) => x.from === e.from && x.to === e.to && x.kind === e.kind)) edges.push(e);
  };
  const byAlias = /* @__PURE__ */ new Map();
  for (const s of services) for (const a of aliases(s)) byAlias.set(a, s.name);
  const owner = (file2) => services.filter((s) => file2 === s.dir || file2.startsWith(s.dir + path8.sep)).sort((a, b) => b.dir.length - a.dir.length)[0]?.name;
  const top = findWorkspace(root)?.root ?? root;
  for (const s of services) {
    for (const f of await files(s.dir, ["**/openapi*.{yaml,yml,json}", "**/swagger*.{yaml,yml,json}", "**/*.proto", "**/*.graphql"])) {
      const text2 = read(f) ?? "";
      if (f.endsWith(".proto")) for (const m of text2.matchAll(/^\s*service\s+(\w+)/gm)) s.provides.push(`grpc ${m[1]}`);
      else if (/\.(?:graphql)$/.test(f)) s.provides.push(`graphql ${rel(s.dir, f)}`);
      else s.provides.push(`http ${rel(s.dir, f)}`);
    }
  }
  const grpcOwner = /* @__PURE__ */ new Map();
  for (const s of services) for (const p of s.provides) if (p.startsWith("grpc ")) grpcOwner.set(p.slice(5), s.name);
  for (const f of await files(top, ["**/{docker-,}compose*.{yml,yaml}"])) {
    let doc;
    try {
      doc = (0, import_yaml4.parse)(read(f) ?? "");
    } catch {
      continue;
    }
    for (const [name, def] of Object.entries(doc?.services ?? {})) {
      const from = byAlias.get(name.toLowerCase());
      if (!from) continue;
      const deps = Array.isArray(def?.depends_on) ? def.depends_on : Object.keys(def?.depends_on ?? {});
      for (const d of [...deps, ...(def?.links ?? []).map((l) => l.split(":")[0])]) {
        const to = byAlias.get(String(d).toLowerCase());
        if (to) add({ from, to, kind: "compose", evidence: `${rel(top, f)}: ${name} depends on ${d}` });
      }
      for (const v of Object.values(Array.isArray(def?.environment) ? Object.fromEntries(def.environment.map((e) => e.split("="))) : def?.environment ?? {})) urlEdge(from, String(v), `${rel(top, f)}: ${name}`, "compose");
    }
  }
  function urlEdge(from, value, evidence, kind = "http") {
    for (const m of value.matchAll(/\b(?:https?|grpcs?|amqp|redis|postgres(?:ql)?):\/\/([a-z0-9][a-z0-9_-]*)(?:\.[a-z0-9.-]*)?(?::\d+)?/gi)) {
      const to = byAlias.get(m[1].toLowerCase());
      if (to) add({ from, to, kind, evidence });
    }
    for (const m of value.matchAll(/\b([a-z0-9][a-z0-9-]*)\.[a-z0-9-]+\.svc(?:\.cluster\.local)?\b/gi)) {
      const to = byAlias.get(m[1].toLowerCase());
      if (to) add({ from, to, kind: kind === "compose" ? "kubernetes" : kind, evidence });
    }
  }
  for (const s of services) {
    for (const f of await files(s.dir, ["**/*.{yaml,yml}", "!**/node_modules/**"])) {
      const text2 = read(f) ?? "";
      if (!/\b(?:kind:\s*(?:Deployment|StatefulSet|Service|ConfigMap|CronJob|Job)|env:|values)/.test(text2) && !/values.*\.ya?ml$/.test(f)) continue;
      try {
        for (const d of (0, import_yaml4.parseAllDocuments)(text2)) urlEdge(s.name, JSON.stringify(d.toJSON() ?? {}), rel(top, f), /kind:/.test(text2) ? "kubernetes" : "http");
      } catch {
      }
    }
    for (const f of await files(s.dir, ["**/*.{ts,tsx,js,mjs,py,go,java,kt,rb,cs}", "**/.env*", "**/*.{env,properties,toml}", "!**/node_modules/**", "!**/vendor/**", "!**/*.{test,spec}.*"])) {
      const text2 = read(f) ?? "";
      if (text2.length > 4e5) continue;
      const lines = text2.split("\n");
      lines.forEach((line, i) => {
        const where = `${rel(top, f)}:${i + 1}`;
        if (/:\/\/|\.svc\b/.test(line)) urlEdge(s.name, line, where);
        for (const m of line.matchAll(/\b([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*?)_(?:SERVICE_)?(?:URL|HOST|ADDR|ADDRESS|ENDPOINT|BASE_URL)\b/g)) {
          const to = byAlias.get(m[1].toLowerCase().replace(/_/g, "-")) ?? byAlias.get(m[1].toLowerCase());
          if (to) add({ from: s.name, to, kind: "http", evidence: `${where} (${m[0]})` });
        }
        for (const m of line.matchAll(/\b(?:New|new\s+)?(\w+?)(?:Client|Stub|BlockingStub|FutureStub)\s*\(/g)) {
          const to = grpcOwner.get(m[1]);
          if (to) add({ from: s.name, to, kind: "grpc", evidence: `${where} (${m[1]} client)` });
        }
      });
    }
    const pkg = read(path8.join(s.dir, "package.json"));
    if (pkg) {
      try {
        const deps = Object.keys({ ...JSON.parse(pkg).dependencies, ...JSON.parse(pkg).devDependencies });
        for (const o of services) {
          const name = (() => {
            try {
              return JSON.parse(read(path8.join(o.dir, "package.json")) ?? "{}").name;
            } catch {
              return void 0;
            }
          })();
          if (o !== s && name && deps.includes(name)) add({ from: s.name, to: o.name, kind: "package", evidence: `${rel(top, path8.join(s.dir, "package.json"))}: depends on ${name}` });
        }
      } catch {
      }
    }
    const gomod = read(path8.join(s.dir, "go.mod"));
    if (gomod)
      for (const o of services) {
        const mod = read(path8.join(o.dir, "go.mod"))?.match(/^module\s+(\S+)/m)?.[1];
        if (o !== s && mod && new RegExp(`^\\s*(?:require\\s+)?${mod.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s`, "m").test(gomod)) add({ from: s.name, to: o.name, kind: "package", evidence: `${rel(top, path8.join(s.dir, "go.mod"))}: requires ${mod}` });
      }
  }
  return { services, edges };
}
function formatGraph(g) {
  if (g.services.length < 2) return "Only one service here: no graph to draw. In a workspace (rein.workspace.yaml) or a monorepo with services/ or apps/, /services shows who calls whom.";
  const lines = [`${g.services.length} services, ${g.edges.length} dependencies:`];
  for (const s of g.services) {
    const out = g.edges.filter((e) => e.from === s.name);
    const inc = g.edges.filter((e) => e.to === s.name);
    lines.push(`  ${s.name}${s.provides.length ? `  (provides ${s.provides.slice(0, 4).join(", ")}${s.provides.length > 4 ? ", \u2026" : ""})` : ""}`);
    for (const e of out) lines.push(`    \u2192 ${e.to}  [${e.kind}] ${e.evidence}`);
    if (!out.length && !inc.length) lines.push("    (no dependencies found)");
  }
  return lines.join("\n");
}
function mermaid(g) {
  const id = (n) => n.replace(/[^\w]/g, "_");
  return ["```mermaid", "graph LR", ...g.services.map((s) => `  ${id(s.name)}["${s.name}"]`), ...g.edges.map((e) => `  ${id(e.from)} -->|${e.kind}| ${id(e.to)}`), "```"].join("\n");
}
function neighbours(g, name) {
  return { callers: g.edges.filter((e) => e.to === name), callees: g.edges.filter((e) => e.from === name) };
}

// items/system/src/system/codemap.ts
var codemapDir = (root) => path9.join(root, "docs", "codemap");
var NOTES_START = "<!-- rein:notes -->";
var NOTES_END = "<!-- /rein:notes -->";
var EMPTY_NOTES = "_What this service is for, how it works, what to watch out for. Run `/codemap annotate` to have the agent write it, or write it yourself: regenerating keeps it._";
var manifest = (root) => path9.join(codemapDir(root), ".codemap.json");
var slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "service";
async function serviceHash(dir2) {
  const listed = (await run("git", ["ls-files", "-s"], { cwd: dir2, timeoutMs: 6e4 }).catch(() => void 0))?.stdout;
  if (listed) return createHash("sha1").update(listed).digest("hex").slice(0, 16);
  const h = createHash("sha1");
  const walk = (d, depth) => {
    if (depth > 6) return;
    for (const e of readdirSync3(d, { withFileTypes: true })) {
      if (e.name.startsWith(".") || e.name === "node_modules") continue;
      const f = path9.join(d, e.name);
      if (e.isDirectory()) walk(f, depth + 1);
      else h.update(`${f}:${statSync4(f).size}:${statSync4(f).mtimeMs}`);
    }
  };
  walk(dir2, 0);
  return h.digest("hex").slice(0, 16);
}
function folders(dir2) {
  const count = (d, depth = 0) => {
    let n = 0;
    try {
      for (const e of readdirSync3(d, { withFileTypes: true })) {
        if (e.name.startsWith(".") || ["node_modules", "dist", "build", "vendor", "target"].includes(e.name)) continue;
        n += e.isDirectory() ? depth < 8 ? count(path9.join(d, e.name), depth + 1) : 0 : 1;
      }
    } catch {
    }
    return n;
  };
  try {
    return readdirSync3(dir2, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith(".") && !["node_modules", "dist", "build", "vendor", "target", "coverage"].includes(e.name)).map((e) => ({ name: e.name, files: count(path9.join(dir2, e.name)) })).filter((f) => f.files).sort((a, b) => b.files - a.files).slice(0, 12);
  } catch {
    return [];
  }
}
function entryPoints(dir2) {
  const out = [];
  try {
    const pkg = JSON.parse(readFileSync8(path9.join(dir2, "package.json"), "utf8"));
    if (pkg.main) out.push(pkg.main);
    if (typeof pkg.bin === "string") out.push(pkg.bin);
    else if (pkg.bin) out.push(...Object.values(pkg.bin));
    if (pkg.scripts?.start) out.push(`npm start: ${pkg.scripts.start}`);
  } catch {
  }
  for (const f of ["main.go", "cmd", "src/main.ts", "src/index.ts", "src/server.ts", "app.py", "main.py", "manage.py", "__main__.py", "src/main.rs", "Dockerfile"]) if (existsSync7(path9.join(dir2, f))) out.push(f);
  return [...new Set(out)];
}
var keptNotes = (file2) => {
  try {
    const t = readFileSync8(file2, "utf8");
    const i = t.indexOf(NOTES_START);
    const j = t.indexOf(NOTES_END);
    return i >= 0 && j > i ? t.slice(i + NOTES_START.length, j).trim() : void 0;
  } catch {
    return void 0;
  }
};
async function writeCodemap(root, g, opts = {}) {
  const dir2 = codemapDir(root);
  mkdirSync2(dir2, { recursive: true });
  let hashes = {};
  try {
    hashes = JSON.parse(readFileSync8(manifest(root), "utf8"));
  } catch {
  }
  const written = [];
  const unchanged = [];
  const relOf = (p) => path9.relative(root, p).split(path9.sep).join("/") || ".";
  for (const s of g.services) {
    const file2 = path9.join(dir2, `${slug(s.name)}.md`);
    const hash = `${await serviceHash(s.dir)}:${g.edges.filter((e) => e.from === s.name || e.to === s.name).length}`;
    if (!opts.force && hashes[s.name] === hash && existsSync7(file2)) {
      unchanged.push(s.name);
      continue;
    }
    const map = await repoMap(s.dir, 1200).catch(() => void 0);
    const owners = [...new Set((await ownersOf(root, [relOf(s.dir)]).catch(() => [])).flatMap((o) => o.source === "git history" ? [] : o.owners))];
    const calls = g.edges.filter((e) => e.from === s.name);
    const calledBy = g.edges.filter((e) => e.to === s.name);
    const entries = entryPoints(s.dir);
    const page = [
      `# ${s.name}`,
      "",
      `\`${relOf(s.dir)}\`${owners.length ? ` \xB7 owned by ${owners.join(", ")}` : ""}`,
      "",
      "## Notes",
      "",
      NOTES_START,
      keptNotes(file2) ?? EMPTY_NOTES,
      NOTES_END,
      "",
      "## Provides",
      "",
      ...s.provides.length ? s.provides.map((p) => `- ${p}`) : ["_No API contract found (OpenAPI, protobuf, GraphQL)._"],
      "",
      "## Calls",
      "",
      ...calls.length ? calls.map((e) => `- [${e.to}](${slug(e.to)}.md) (${e.kind}): ${e.evidence}`) : ["_Nothing found._"],
      "",
      "## Called by",
      "",
      ...calledBy.length ? calledBy.map((e) => `- [${e.from}](${slug(e.from)}.md) (${e.kind}): ${e.evidence}`) : ["_Nothing found._"],
      "",
      "## Entry points",
      "",
      ...entries.length ? entries.map((f) => `- \`${f}\``) : ["_None found._"],
      "",
      "## Layout",
      "",
      ...folders(s.dir).map((f) => `- \`${f.name}/\` (${f.files} files)`),
      "",
      ...map?.shown ? ["## Key declarations", "", "```text", map.text.trim(), "```", ""] : [],
      `<sub>Generated by Rein's /codemap. Everything except the notes is regenerated.</sub>`,
      ""
    ].join("\n");
    writeFileSync2(file2, page);
    hashes[s.name] = hash;
    written.push(s.name);
  }
  const index = [
    "# Codemap",
    "",
    `${g.services.length} services and how they depend on each other. Each page has the service's APIs, callers, owners and layout.`,
    "",
    mermaid(g),
    "",
    "| Service | Provides | Calls | Called by |",
    "| --- | --- | --- | --- |",
    ...g.services.map((s) => `| [${s.name}](${slug(s.name)}.md) | ${s.provides.length ? s.provides.slice(0, 3).join(", ") : "\u2014"} | ${[...new Set(g.edges.filter((e) => e.from === s.name).map((e) => e.to))].join(", ") || "\u2014"} | ${[...new Set(g.edges.filter((e) => e.to === s.name).map((e) => e.from))].join(", ") || "\u2014"} |`),
    "",
    "<sub>Generated by Rein's /codemap.</sub>",
    ""
  ].join("\n");
  writeFileSync2(path9.join(dir2, "README.md"), index);
  writeFileSync2(manifest(root), JSON.stringify(hashes, null, 2) + "\n");
  return { written, unchanged, dir: dir2 };
}
async function codemapStatus(root, g) {
  let hashes = {};
  try {
    hashes = JSON.parse(readFileSync8(manifest(root), "utf8"));
  } catch {
  }
  const stale = [];
  const missing = [];
  const unannotated = [];
  for (const s of g.services) {
    const file2 = path9.join(codemapDir(root), `${slug(s.name)}.md`);
    if (!existsSync7(file2)) {
      missing.push(s.name);
      continue;
    }
    const hash = `${await serviceHash(s.dir)}:${g.edges.filter((e) => e.from === s.name || e.to === s.name).length}`;
    if (hashes[s.name] !== hash) stale.push(s.name);
    if ((keptNotes(file2) ?? EMPTY_NOTES) === EMPTY_NOTES) unannotated.push(s.name);
  }
  return { stale, missing, unannotated };
}
function annotateTask(root, services) {
  const rel2 = path9.relative(process.cwd(), codemapDir(root)).split(path9.sep).join("/") || "docs/codemap";
  return [
    `Write the Notes section of these codemap pages in ${rel2}/: ${services.map((s) => `${slug(s)}.md`).join(", ")}.`,
    `For each, read the service (its entry points, main modules and APIs, listed on the page) and write 3\u20136 sentences between ${NOTES_START} and ${NOTES_END}: what it's for, how a request moves through it, what it depends on and why, and anything surprising a newcomer should know. Replace only the text between the markers; the rest of each page is generated.`
  ].join("\n\n");
}

// items/system/src/system/impact.ts
import { realpathSync } from "node:fs";
import path13 from "node:path";

// items/system/src/contracts/changes.ts
import { readFileSync as readFileSync9 } from "node:fs";
import path10 from "node:path";

// items/system/src/contracts/diff.ts
var import_yaml5 = __toESM(require_dist(), 1);
function contractKind(file2, text2) {
  if (/\.proto$/i.test(file2)) return "protobuf";
  if (/\.(?:graphql|gql)$/i.test(file2)) return "graphql";
  if (/\.avsc$/i.test(file2)) return "avro";
  if (/\.(?:ya?ml|json)$/i.test(file2) && (/(?:openapi|swagger)/i.test(file2) || text2 !== void 0 && /(?:^|[{,])\s*["']?(?:openapi|swagger)["']?\s*:/m.test(text2))) return "openapi";
  return void 0;
}
function diffContract(kind, before, after) {
  if (kind === "openapi") return diffOpenApi(before, after);
  if (kind === "protobuf") return diffProto(before, after);
  if (kind === "graphql") return diffGraphql(before, after);
  return diffAvro(before, after);
}
var B = (where, what) => ({ kind: "breaking", where, what });
var S = (where, what) => ({ kind: "safe", where, what });
var METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"];
function loadDoc(text2) {
  try {
    return (0, import_yaml5.parse)(text2) ?? {};
  } catch {
    return {};
  }
}
function deref(doc, s, depth = 0) {
  if (!s || typeof s !== "object" || depth > 8) return s;
  if (typeof s.$ref === "string" && s.$ref.startsWith("#/")) {
    const target = s.$ref.slice(2).split("/").reduce((o, k) => o?.[k.replace(/~1/g, "/").replace(/~0/g, "~")], doc);
    return deref(doc, target, depth + 1);
  }
  return s;
}
var typeOf = (s) => s ? [s.type, s.format].filter(Boolean).join("/") || (s.items ? "array" : s.properties ? "object" : "") : "";
function diffSchema(da, db, a, b, where, dir2, out, depth = 0) {
  a = deref(da, a);
  b = deref(db, b);
  if (!a || !b || depth > 6) return;
  const ta = typeOf(a);
  const tb = typeOf(b);
  if (ta && tb && ta !== tb) {
    out.push(B(where, `type changed from ${ta} to ${tb}`));
    return;
  }
  const pa = a.properties ?? {};
  const pb = b.properties ?? {};
  const ra = new Set(a.required ?? []);
  const rb = new Set(b.required ?? []);
  for (const k of Object.keys(pa)) {
    if (!(k in pb)) out.push(dir2 === "response" ? B(`${where}.${k}`, "response field removed") : rb.has(k) ? B(`${where}.${k}`, "request field removed") : S(`${where}.${k}`, "optional request field removed"));
    else diffSchema(da, db, pa[k], pb[k], `${where}.${k}`, dir2, out, depth + 1);
  }
  for (const k of Object.keys(pb)) {
    if (k in pa) continue;
    out.push(dir2 === "request" && rb.has(k) ? B(`${where}.${k}`, "new required request field") : S(`${where}.${k}`, `${dir2} field added`));
  }
  for (const k of rb) if (dir2 === "request" && k in pa && !ra.has(k)) out.push(B(`${where}.${k}`, "request field became required"));
  for (const k of ra) if (dir2 === "response" && k in pb && !rb.has(k)) out.push(B(`${where}.${k}`, "response field is no longer always present"));
  const ea = Array.isArray(a.enum) ? a.enum.map(String) : void 0;
  const eb = Array.isArray(b.enum) ? b.enum.map(String) : void 0;
  if (ea && eb) {
    const gone = ea.filter((v) => !eb.includes(v));
    const added = eb.filter((v) => !ea.includes(v));
    if (gone.length) out.push(dir2 === "request" ? B(where, `enum values removed: ${gone.join(", ")}`) : S(where, `enum values no longer returned: ${gone.join(", ")}`));
    if (added.length) out.push(dir2 === "response" ? B(where, `new enum values clients may not handle: ${added.join(", ")}`) : S(where, `enum values added: ${added.join(", ")}`));
  }
  if (a.items || b.items) diffSchema(da, db, a.items, b.items, `${where}[]`, dir2, out, depth + 1);
}
function diffOpenApi(before, after) {
  const da = loadDoc(before);
  const db = loadDoc(after);
  const out = [];
  const pa = da.paths ?? {};
  const pb = db.paths ?? {};
  for (const p of Object.keys(pa)) {
    for (const m of METHODS) {
      const oa = pa[p]?.[m];
      if (!oa) continue;
      const ob = pb[p]?.[m];
      const op = `${m.toUpperCase()} ${p}`;
      if (!ob) {
        out.push(B(op, "operation removed"));
        continue;
      }
      const params = (o, item, d) => [...item?.parameters ?? [], ...o.parameters ?? []].map((x) => deref(d, x)).filter((x) => x?.name);
      const qa = params(oa, pa[p], da);
      const qb = params(ob, pb[p], db);
      const key = (x) => `${x.in}:${x.name}`;
      for (const x of qa) {
        const y = qb.find((q) => key(q) === key(x));
        if (!y) out.push(x.in === "path" || x.required ? B(`${op} ${x.in} ${x.name}`, "parameter removed") : S(`${op} ${x.in} ${x.name}`, "optional parameter removed"));
        else {
          if (y.required && !x.required) out.push(B(`${op} ${x.in} ${x.name}`, "parameter became required"));
          diffSchema(da, db, x.schema, y.schema, `${op} ${x.in} ${x.name}`, "request", out);
        }
      }
      for (const y of qb) if (!qa.some((x) => key(x) === key(y))) out.push(y.required ? B(`${op} ${y.in} ${y.name}`, "new required parameter") : S(`${op} ${y.in} ${y.name}`, "optional parameter added"));
      const body = (o, d) => {
        const rb = deref(d, o.requestBody);
        const content = rb?.content ?? {};
        const mt = content["application/json"] ?? Object.values(content)[0];
        return { schema: mt?.schema ?? (o.parameters ?? []).map((x) => deref(d, x)).find((x) => x?.in === "body")?.schema, required: !!rb?.required };
      };
      const ba = body(oa, da);
      const bb = body(ob, db);
      if (bb.schema && !ba.schema && bb.required) out.push(B(`${op} body`, "new required request body"));
      diffSchema(da, db, ba.schema, bb.schema, `${op} body`, "request", out);
      const ra = oa.responses ?? {};
      const rbs = ob.responses ?? {};
      for (const code of Object.keys(ra)) {
        if (!(code in rbs)) {
          if (/^2/.test(code)) out.push(B(`${op} ${code}`, "success response removed"));
          continue;
        }
        const schemaOf = (r, d) => {
          const x = deref(d, r);
          return (x?.content?.["application/json"] ?? Object.values(x?.content ?? {})[0])?.schema ?? x?.schema;
        };
        diffSchema(da, db, schemaOf(ra[code], da), schemaOf(rbs[code], db), `${op} ${code}`, "response", out);
      }
      for (const code of Object.keys(rbs)) if (!(code in ra)) out.push(S(`${op} ${code}`, "response added"));
    }
  }
  for (const p of Object.keys(pb)) for (const m of METHODS) if (pb[p]?.[m] && !pa[p]?.[m]) out.push(S(`${m.toUpperCase()} ${p}`, "operation added"));
  return out;
}
function stripComments(t) {
  return t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}
function ownLines(body) {
  let out = "";
  let i = 0;
  const head = /\b(message|enum|oneof)\s+\w+\s*\{/y;
  while (i < body.length) {
    head.lastIndex = i;
    const m = /\w/.test(body[i - 1] ?? "") ? null : head.exec(body);
    if (!m) {
      out += body[i++];
      continue;
    }
    let depth = 1;
    let j = head.lastIndex;
    for (; j < body.length && depth; j++) depth += body[j] === "{" ? 1 : body[j] === "}" ? -1 : 0;
    if (m[1] === "oneof") out += body.slice(head.lastIndex, j - 1);
    i = j;
  }
  return out;
}
function blocks(text2, prefix = "") {
  const out = [];
  const re = /\b(message|enum|service)\s+(\w+)\s*\{/g;
  let m;
  while (m = re.exec(text2)) {
    let depth = 1;
    let i = re.lastIndex;
    for (; i < text2.length && depth; i++) depth += text2[i] === "{" ? 1 : text2[i] === "}" ? -1 : 0;
    const body = text2.slice(re.lastIndex, i - 1);
    const name = `${prefix}${m[2]}`;
    const own = ownLines(body);
    out.push({ kind: m[1], name, body: own });
    if (m[1] === "message") out.push(...blocks(body, `${name}.`));
    re.lastIndex = i;
  }
  return out;
}
function parseProto(text2) {
  const t = stripComments(text2);
  const doc = { pkg: t.match(/^\s*package\s+([\w.]+)\s*;/m)?.[1] ?? "", messages: /* @__PURE__ */ new Map(), enums: /* @__PURE__ */ new Map(), rpcs: /* @__PURE__ */ new Map() };
  for (const b of blocks(t)) {
    if (b.kind === "message") {
      const fields = [...b.body.matchAll(/(?:^|;)\s*(optional|repeated|required)?\s*((?:map\s*<[^>]+>)|[\w.]+)\s+(\w+)\s*=\s*(\d+)/gm)].filter((m) => m[2] !== "reserved" && m[2] !== "option").map((m) => ({ label: m[1] ?? "", type: m[2].replace(/\s+/g, ""), name: m[3], number: Number(m[4]) }));
      const reserved = /* @__PURE__ */ new Set();
      for (const r of b.body.matchAll(/(?:^|;)\s*reserved\s+([^;]+);/gm)) for (const part of r[1].split(",")) reserved.add(part.trim().replace(/^"|"$/g, ""));
      doc.messages.set(b.name, { fields, reserved });
    } else if (b.kind === "enum") {
      doc.enums.set(b.name, new Map([...b.body.matchAll(/(?:^|;)\s*(\w+)\s*=\s*(-?\d+)/gm)].map((m) => [m[1], Number(m[2])])));
    } else {
      for (const r of b.body.matchAll(/\brpc\s+(\w+)\s*\(\s*(stream\s+)?([\w.]+)\s*\)\s*returns\s*\(\s*(stream\s+)?([\w.]+)\s*\)/g))
        doc.rpcs.set(`${b.name}.${r[1]}`, `(${r[2] ?? ""}${r[3]}) returns (${r[4] ?? ""}${r[5]})`.replace(/\s+/g, " "));
    }
  }
  return doc;
}
function diffProto(before, after) {
  const a = parseProto(before);
  const b = parseProto(after);
  const out = [];
  if (a.pkg !== b.pkg) out.push(B("package", `package renamed from ${a.pkg || "(none)"} to ${b.pkg || "(none)"}`));
  for (const [name, ma] of a.messages) {
    const mb = b.messages.get(name);
    if (!mb) {
      out.push(B(name, "message removed"));
      continue;
    }
    for (const f of ma.fields) {
      const byNumber = mb.fields.find((x) => x.number === f.number);
      const where = `${name}.${f.name} (= ${f.number})`;
      if (!byNumber) {
        const reserved = mb.reserved.has(String(f.number)) || mb.reserved.has(f.name) || [...mb.reserved].some((r) => /^(\d+)\s+to\s+(\d+|max)$/.test(r) && f.number >= Number(r.split(/\s+to\s+/)[0]) && (r.endsWith("max") || f.number <= Number(r.split(/\s+to\s+/)[1])));
        out.push(reserved ? S(where, "field removed (its number is reserved)") : B(where, "field removed without reserving its number: a later field could reuse it"));
        continue;
      }
      if (byNumber.type !== f.type) out.push(B(where, `type changed from ${f.type} to ${byNumber.type}`));
      if (byNumber.name !== f.name) out.push(B(where, `field renamed to ${byNumber.name} (breaks JSON and text format)`));
      if (byNumber.label === "repeated" !== (f.label === "repeated")) out.push(B(where, `changed ${f.label === "repeated" ? "from" : "to"} repeated`));
      if (byNumber.label === "required" && f.label !== "required") out.push(B(where, "became required"));
    }
    for (const f of mb.fields) if (!ma.fields.some((x) => x.number === f.number)) out.push(f.label === "required" ? B(`${name}.${f.name} (= ${f.number})`, "new required field") : S(`${name}.${f.name} (= ${f.number})`, "field added"));
  }
  for (const name of b.messages.keys()) if (!a.messages.has(name)) out.push(S(name, "message added"));
  for (const [name, ea] of a.enums) {
    const eb = b.enums.get(name);
    if (!eb) {
      out.push(B(name, "enum removed"));
      continue;
    }
    for (const [v, n] of ea) {
      if (!eb.has(v)) out.push(B(`${name}.${v}`, "enum value removed"));
      else if (eb.get(v) !== n) out.push(B(`${name}.${v}`, `enum number changed from ${n} to ${eb.get(v)}`));
    }
    for (const v of eb.keys()) if (!ea.has(v)) out.push(S(`${name}.${v}`, "enum value added"));
  }
  for (const [rpc, sig] of a.rpcs) {
    const now = b.rpcs.get(rpc);
    if (!now) out.push(B(rpc, "rpc removed"));
    else if (now !== sig) out.push(B(rpc, `rpc signature changed from ${sig} to ${now}`));
  }
  for (const rpc of b.rpcs.keys()) if (!a.rpcs.has(rpc)) out.push(S(rpc, "rpc added"));
  return out;
}
function parseGraphql(text2) {
  const t = text2.replace(/#.*$/gm, "").replace(/"""[\s\S]*?"""|"[^"\n]*"/g, "");
  const types = /* @__PURE__ */ new Map();
  for (const m of t.matchAll(/\b(?:extend\s+)?(type|input|interface|enum)\s+(\w+)[^{]*\{([^}]*)\}/g)) {
    const kind = m[1];
    const body = m[3];
    const ty = types.get(m[2]) ?? { kind, fields: /* @__PURE__ */ new Map(), values: /* @__PURE__ */ new Set() };
    if (kind === "enum") for (const v of body.match(/\b[A-Z_][A-Z0-9_]*\b/g) ?? []) ty.values.add(v);
    else
      for (const f of body.matchAll(/(\w+)\s*(?:\(([^)]*)\))?\s*:\s*([\w[\]!]+)(\s*=\s*[^\s,)]+)?/g)) {
        const args = /* @__PURE__ */ new Map();
        for (const a of (f[2] ?? "").matchAll(/(\w+)\s*:\s*([\w[\]!]+)(\s*=)?/g)) args.set(a[1], { type: a[2], hasDefault: !!a[3] });
        ty.fields.set(f[1], { type: f[3], args });
      }
    types.set(m[2], ty);
  }
  return types;
}
var nonNull = (t) => t.endsWith("!");
var bare = (t) => t.replace(/!/g, "");
function diffGraphql(before, after) {
  const a = parseGraphql(before);
  const b = parseGraphql(after);
  const out = [];
  for (const [name, ta] of a) {
    const tb = b.get(name);
    if (!tb) {
      out.push(B(name, `${ta.kind} removed`));
      continue;
    }
    const input = ta.kind === "input";
    for (const v of ta.values) if (!tb.values.has(v)) out.push(B(`${name}.${v}`, "enum value removed"));
    for (const v of tb.values) if (!ta.values.has(v)) out.push(S(`${name}.${v}`, "enum value added"));
    for (const [f, fa] of ta.fields) {
      const fb = tb.fields.get(f);
      const where = `${name}.${f}`;
      if (!fb) {
        out.push(B(where, input ? "input field removed" : "field removed"));
        continue;
      }
      if (bare(fa.type) !== bare(fb.type)) out.push(B(where, `type changed from ${fa.type} to ${fb.type}`));
      else if (input && !nonNull(fa.type) && nonNull(fb.type)) out.push(B(where, "input field became required"));
      else if (!input && nonNull(fa.type) && !nonNull(fb.type)) out.push(B(where, "field became nullable"));
      for (const [arg, x] of fa.args) {
        const y = fb.args.get(arg);
        if (!y) out.push(B(`${where}(${arg})`, "argument removed"));
        else if (bare(x.type) !== bare(y.type)) out.push(B(`${where}(${arg})`, `argument type changed from ${x.type} to ${y.type}`));
        else if (!nonNull(x.type) && nonNull(y.type) && !y.hasDefault) out.push(B(`${where}(${arg})`, "argument became required"));
      }
      for (const [arg, y] of fb.args) if (!fa.args.has(arg)) out.push(nonNull(y.type) && !y.hasDefault ? B(`${where}(${arg})`, "new required argument") : S(`${where}(${arg})`, "argument added"));
    }
    for (const [f, fb] of tb.fields) if (!ta.fields.has(f)) out.push(input && nonNull(fb.type) ? B(`${name}.${f}`, "new required input field") : S(`${name}.${f}`, "field added"));
  }
  for (const [name, tb] of b) if (!a.has(name)) out.push(S(name, `${tb.kind} added`));
  return out;
}
function diffAvro(before, after) {
  let a;
  let b;
  try {
    a = JSON.parse(before);
    b = JSON.parse(after);
  } catch {
    return [];
  }
  const out = [];
  const tname = (t) => typeof t === "string" ? t : Array.isArray(t) ? `[${t.map(tname).join(", ")}]` : t?.type === "array" ? `array<${tname(t.items)}>` : t?.type === "map" ? `map<${tname(t.values)}>` : t?.name ?? t?.type ?? "?";
  const promotable = { int: ["long", "float", "double"], long: ["float", "double"], float: ["double"], string: ["bytes"], bytes: ["string"] };
  const walk = (x, y, where) => {
    if (!x || !y) return;
    if (x.type === "record" && y.type === "record") {
      const fx = new Map((x.fields ?? []).map((f) => [f.name, f]));
      const fy = new Map((y.fields ?? []).map((f) => [f.name, f]));
      for (const [n, f] of fx) {
        const g = fy.get(n) ?? [...fy.values()].find((h) => (h.aliases ?? []).includes(n));
        if (!g) out.push(S(`${where}.${n}`, "field removed (old data still reads; readers that need it break)"));
        else {
          const ta = tname(f.type);
          const tb = tname(g.type);
          if (ta !== tb && !(promotable[ta] ?? []).includes(tb) && !(Array.isArray(g.type) && g.type.map(tname).includes(ta))) out.push(B(`${where}.${n}`, `type changed from ${ta} to ${tb}`));
          else walk(typeof f.type === "object" ? f.type : void 0, typeof g.type === "object" ? g.type : void 0, `${where}.${n}`);
        }
      }
      for (const [n, g] of fy) if (!fx.has(n) && !(g.aliases ?? []).some((al) => fx.has(al))) out.push(g.default === void 0 ? B(`${where}.${n}`, "new field without a default: old data has no value for it") : S(`${where}.${n}`, "field added with a default"));
    } else if (x.type === "enum" && y.type === "enum") {
      const gone = (x.symbols ?? []).filter((s) => !(y.symbols ?? []).includes(s));
      if (gone.length && y.default === void 0) out.push(B(where, `enum symbols removed: ${gone.join(", ")}`));
      const added = (y.symbols ?? []).filter((s) => !(x.symbols ?? []).includes(s));
      if (added.length) out.push(S(where, `enum symbols added: ${added.join(", ")}`));
    } else if (x.type === "array" && y.type === "array") walk(x.items, y.items, `${where}[]`);
  };
  walk(a, b, a?.name ?? "record");
  return out;
}

// items/system/src/contracts/changes.ts
var read2 = (f) => {
  try {
    return readFileSync9(f, "utf8");
  } catch {
    return void 0;
  }
};
function classify(file2, before, after) {
  const kind = contractKind(file2, after ?? before);
  if (!kind) return void 0;
  if (before === void 0) return { file: file2, changes: [{ kind: "safe", where: file2, what: "new contract" }] };
  if (after === void 0) return { file: file2, changes: [{ kind: "breaking", where: file2, what: "contract file deleted" }] };
  return { file: file2, changes: diffContract(kind, before, after) };
}
async function branchContracts(root) {
  const git3 = async (...a) => await run("git", a, { cwd: root, timeoutMs: 3e4 }).catch(() => void 0) ?? { code: 1, stdout: "", stderr: "" };
  const head = (await git3("symbolic-ref", "--quiet", "refs/remotes/origin/HEAD")).stdout.trim().replace("refs/remotes/", "") || "origin/main";
  const mb = (await git3("merge-base", "HEAD", head)).stdout.trim();
  const base = mb || "HEAD";
  const changed = (await git3("diff", "--name-only", "--no-renames", base)).stdout.split("\n").filter(Boolean);
  const added = (await git3("ls-files", "--others", "--exclude-standard")).stdout.split("\n").filter(Boolean);
  const files2 = [];
  for (const f of [.../* @__PURE__ */ new Set([...changed, ...added])]) {
    const old = await git3("show", `${base}:${f}`);
    const r = classify(f, old.code === 0 ? old.stdout : void 0, read2(path10.join(root, f)));
    if (r) files2.push(r);
  }
  return { base: mb ? head : "HEAD", files: files2 };
}

// items/system/src/system/api.ts
import { readFileSync as readFileSync10 } from "node:fs";
import path11 from "node:path";
var METHODS2 = ["get", "post", "put", "patch", "delete", "head", "options"];
function parseEndpoint(s) {
  const m = s.trim().match(/^(?:([A-Za-z]+)\s+)?(\/\S*)$/);
  if (!m) return void 0;
  const method = m[1]?.toLowerCase();
  if (method && !METHODS2.includes(method)) return void 0;
  const segments = m[2].split("/").filter(Boolean).map((p) => /^(?:\{[^}]+\}|:\w+|<[^>]+>|\*)$/.test(p) ? null : p);
  return { ...method ? { method } : {}, segments };
}
function pathPattern(segments) {
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const param = String.raw`(?:\$\{[^}]+\}|\{[^}]+\}|:[A-Za-z_]\w*|<[^>]+>|%[sd]|['"\`]\s*\+\s*[\w.()[\]]+(?:\s*\+\s*['"\`])?|[\w-]+)`;
  const body = segments.map((s) => s === null ? param : esc(s)).join("/");
  return new RegExp(`/${body}(?=$|[?'"\`)\\s#:]|/?['"\`])`);
}
var CALL_METHOD = /\b(?:fetch|axios|got|ky|request|http|client|requests|httpx|session|api|\$http)\b[^\n]{0,60}?\.?(get|post|put|patch|delete)\b|method\s*[:=]\s*['"](GET|POST|PUT|PATCH|DELETE)['"]|\b(Get|Post|Put|Patch|Delete)(?:Async)?\(/i;
var ROUTE_DEF = /\b(?:app|router|routes|route|r|e|g|api|server|fastify|bp|blueprint|mux|v\d)\.(?:get|post|put|patch|delete|all|route|use)\(\s*['"`]|@(?:app|router|api|bp|blueprint)\.(?:get|post|put|patch|delete|route)\(|@(?:Get|Post|Put|Patch|Delete|Request)Mapping\(|HandleFunc\(|\.(?:GET|POST|PUT|PATCH|DELETE|Handle)\(/;
async function grep(dir2, needle, ignoreCase = false) {
  const rg = await ripgrep();
  if (!rg) return [];
  const r = await run(rg, ["-n", "--no-heading", "--color", "never", "-F", ...ignoreCase ? ["-i"] : [], "-g", "!**/node_modules/**", "-g", "!**/vendor/**", "-g", "!**/dist/**", "-g", "!**/*.{lock,map,min.js}", "--", needle, "."], { cwd: dir2, timeoutMs: 6e4 }).catch(() => void 0);
  return (r?.stdout ?? "").split(/\r?\n/).map((l) => l.match(/^(.*?):(\d+):(.*)$/)).filter((m) => !!m).map((m) => ({ file: m[1].replace(/\\/g, "/").replace(/^\.\//, ""), line: Number(m[2]), text: m[3].trim().slice(0, 200) }));
}
async function findApiRefs(root, services, target) {
  const rpc = target.match(/^(\w+)[./](\w+)$/);
  if (rpc && !target.startsWith("/")) return findRpcRefs(services, rpc[1], rpc[2], target);
  const ep = parseEndpoint(target);
  if (!ep) return void 0;
  const re = pathPattern(ep.segments);
  const literal = ep.segments.slice(0, ep.segments.indexOf(null) < 0 ? void 0 : ep.segments.indexOf(null)).join("/");
  const needle = `/${literal}`;
  const out = { target, gateways: [], providers: [], consumers: [] };
  const top = findWorkspace(root)?.root ?? root;
  for (const s of services) {
    for (const hit of await grep(s.dir, needle)) {
      if (!re.test(hit.text)) continue;
      const place = { service: s.name, file: path11.relative(top, path11.join(s.dir, hit.file)).split(path11.sep).join("/"), line: hit.line, text: hit.text };
      const f = hit.file;
      const m = hit.text.match(CALL_METHOD);
      const method = (m?.[1] ?? m?.[2] ?? m?.[3])?.toLowerCase() ?? (/\bfetch\s*\([^,]*\)/.test(hit.text) && !/\bmethod\b/.test(hit.text) ? "get" : void 0);
      if (/\.(?:ya?ml|json)$/.test(f) && /openapi|swagger/i.test(f + readHead(path11.join(s.dir, f)))) out.providers.push(place);
      else if (/(?:^|\/)(?:nginx|ingress|gateway|kong|envoy|traefik)/i.test(f) || /\.conf$/i.test(f) || /^\s*location\s/.test(hit.text) || /\bpath:\s/.test(hit.text)) out.gateways.push(place);
      else if (ROUTE_DEF.test(hit.text)) out.providers.push(place);
      else if (/\.(?:md|txt|rst)$/.test(f) || /(?:^|\/)(?:docs?|tests?|__tests__)\//.test(f)) continue;
      else if (!ep.method || !method || method === ep.method) out.consumers.push(place);
    }
  }
  const providerServices = new Set(out.providers.map((p) => p.service));
  out.consumers = out.consumers.filter((c) => !providerServices.has(c.service) || !ROUTE_DEF.test(c.text));
  return sorted(out);
}
var byPlace = (a, b) => a.service.localeCompare(b.service) || a.file.localeCompare(b.file) || a.line - b.line;
var sorted = (r) => ({ ...r, gateways: r.gateways.sort(byPlace), providers: r.providers.sort(byPlace), consumers: r.consumers.sort(byPlace) });
var readHead = (f) => {
  try {
    return readFileSync10(f, "utf8").slice(0, 200);
  } catch {
    return "";
  }
};
async function findRpcRefs(services, svc, method, target) {
  const out = { target, gateways: [], providers: [], consumers: [] };
  for (const s of services) {
    const owns = s.provides.includes(`grpc ${svc}`);
    for (const hit of await grep(s.dir, method, true)) {
      const word = new RegExp(`\\b${method}\\b`, "i");
      if (!word.test(hit.text)) continue;
      const place = { service: s.name, file: hit.file, line: hit.line, text: hit.text };
      if (hit.file.endsWith(".proto")) {
        if (/\brpc\s/.test(hit.text)) out.providers.push(place);
      } else if (owns && /\bfunc\s*\(|\bdef\s|\bpublic\s|\basync\s+\w+\(|override|implements|Servicer|Server\b/.test(hit.text)) out.providers.push(place);
      else if (!owns && new RegExp(`\\.${method}\\s*\\(|\\.${method[0].toLowerCase()}${method.slice(1)}\\s*\\(`).test(hit.text)) {
        const text2 = readHead(path11.join(s.dir, hit.file)) + await readAll(path11.join(s.dir, hit.file));
        if (new RegExp(`\\b${svc}(?:Client|Stub|BlockingStub|FutureStub|Service)\\b`).test(text2)) out.consumers.push(place);
      }
    }
  }
  return sorted(out);
}
var readAll = async (f) => {
  try {
    return readFileSync10(f, "utf8");
  } catch {
    return "";
  }
};
function formatRefs(r) {
  const list = (title, ps) => ps.length ? [`${title}:`, ...ps.slice(0, 40).map((p) => `  ${p.service}  ${p.file}:${p.line}  ${p.text}`), ...ps.length > 40 ? [`  \u2026 ${ps.length - 40} more`] : []] : [`${title}: none found`];
  return [`${r.target}`, ...list("Gateway", r.gateways), ...list("Served by", r.providers), ...list("Called from", r.consumers)].join("\n");
}

// items/system/src/system/scip.ts
import { existsSync as existsSync8, readFileSync as readFileSync11, statSync as statSync5 } from "node:fs";
import path12 from "node:path";
var Reader = class {
  constructor(buf, end = buf.length) {
    this.buf = buf;
    this.end = end;
  }
  buf;
  end;
  pos = 0;
  done() {
    return this.pos >= this.end;
  }
  varint() {
    let x = 0;
    let shift = 0;
    for (; ; ) {
      const b = this.buf[this.pos++];
      x += (b & 127) * 2 ** shift;
      if (b < 128) return x;
      shift += 7;
    }
  }
  /** A field: its number, wire type, and a reader of its bytes (length-delimited) or its value. */
  field() {
    const key = this.varint();
    const n = Math.floor(key / 8);
    const wire = key & 7;
    if (wire === 0) return { n, wire, value: this.varint() };
    if (wire === 2) {
      const len = this.varint();
      const bytes = this.buf.subarray(this.pos, this.pos + len);
      this.pos += len;
      return { n, wire, value: len, bytes };
    }
    if (wire === 1) this.pos += 8;
    else if (wire === 5) this.pos += 4;
    return { n, wire, value: 0 };
  }
};
var text = (b) => b ? Buffer.from(b).toString("utf8") : "";
var packed = (b) => {
  const out = [];
  if (!b) return out;
  const r = new Reader(b);
  while (!r.done()) out.push(r.varint());
  return out;
};
var firstInt = (b) => {
  if (!b) return 0;
  const r = new Reader(b);
  while (!r.done()) {
    const f = r.field();
    if (f.n === 1 && f.wire === 0) return f.value;
  }
  return 0;
};
function decodeIndex(buf) {
  const docs = [];
  const r = new Reader(buf);
  while (!r.done()) {
    const f = r.field();
    if (f.n !== 2 || !f.bytes) continue;
    const doc = { path: "", occurrences: [], symbols: [] };
    const d = new Reader(f.bytes);
    while (!d.done()) {
      const g = d.field();
      if (g.n === 1) doc.path = text(g.bytes);
      else if (g.n === 2 && g.bytes) {
        const o = new Reader(g.bytes);
        let symbol = "";
        let roles = 0;
        let line;
        while (!o.done()) {
          const h = o.field();
          if (h.n === 1 && h.bytes && line === void 0) line = packed(h.bytes)[0];
          else if ((h.n === 8 || h.n === 9) && h.bytes) line = firstInt(h.bytes);
          else if (h.n === 2) symbol = text(h.bytes);
          else if (h.n === 3) roles = h.value;
        }
        if (symbol && !symbol.startsWith("local ")) doc.occurrences.push({ symbol, line: (line ?? 0) + 1, roles });
      } else if (g.n === 3 && g.bytes) {
        const s = new Reader(g.bytes);
        let symbol = "";
        let name = "";
        while (!s.done()) {
          const h = s.field();
          if (h.n === 1) symbol = text(h.bytes);
          else if (h.n === 6) name = text(h.bytes);
        }
        if (symbol) doc.symbols.push({ symbol, name });
      }
    }
    docs.push(doc);
  }
  return docs;
}
function symbolKey(symbol) {
  const parts = symbol.split(" ");
  return parts.length >= 5 ? [parts[0], parts[1], parts[2], ...parts.slice(4)].join(" ") : symbol;
}
function shortName(symbol) {
  const d = symbol.split(" ").slice(4).join(" ");
  const m = d.match(/([\w$]+)(?:\([^)]*\))?[#.:/!]?$/);
  return m?.[1] ?? d;
}
var indexFile = (repo) => ["index.scip", path12.join(".rein", "index.scip")].map((f) => path12.join(repo, f)).find((f) => existsSync8(f));
function buildSymbolGraph(repos) {
  const g = { defs: /* @__PURE__ */ new Map(), refs: /* @__PURE__ */ new Map(), names: /* @__PURE__ */ new Map(), repos: [] };
  for (const repo of repos) {
    const f = indexFile(repo.dir);
    if (!f) continue;
    g.repos.push(repo.name);
    for (const doc of decodeIndex(readFileSync11(f))) {
      for (const s of doc.symbols) if (s.name) g.names.set(symbolKey(s.symbol), s.name);
      for (const o of doc.occurrences) {
        const key = symbolKey(o.symbol);
        const occ = { repo: repo.name, file: doc.path, line: o.line, definition: (o.roles & 1) === 1 };
        const map = occ.definition ? g.defs : g.refs;
        map.set(key, [...map.get(key) ?? [], occ]);
      }
    }
  }
  return g;
}
function lookup(g, query, max = 10) {
  const q = query.toLowerCase();
  const keys = [.../* @__PURE__ */ new Set([...g.defs.keys(), ...g.refs.keys()])].filter((k) => (g.names.get(k) ?? shortName(k)).toLowerCase() === q || k.toLowerCase().includes(q));
  return keys.map((key) => ({ key, name: g.names.get(key) ?? shortName(key), defs: g.defs.get(key) ?? [], refs: g.refs.get(key) ?? [] })).sort((a, b) => Number(b.defs.length > 0) - Number(a.defs.length > 0) || new Set(b.refs.map((r) => r.repo)).size - new Set(a.refs.map((r) => r.repo)).size).slice(0, max);
}
function crossRepo(g) {
  const out = [];
  for (const [key, defs] of g.defs) {
    const home = new Set(defs.map((d) => d.repo));
    const usedIn = [...new Set((g.refs.get(key) ?? []).map((r) => r.repo).filter((r) => !home.has(r)))];
    if (usedIn.length) out.push({ key, name: g.names.get(key) ?? shortName(key), from: [...home].join(", "), usedIn });
  }
  return out.sort((a, b) => b.usedIn.length - a.usedIn.length);
}
function formatLookup(rs) {
  if (!rs.length) return "No symbol by that name in the SCIP indexes.";
  return rs.map((r) => [`${r.name}  ${r.key}`, ...r.defs.map((d) => `  defined  ${d.repo}  ${d.file}:${d.line}`), ...r.refs.slice(0, 30).map((x) => `  used     ${x.repo}  ${x.file}:${x.line}`), ...r.refs.length > 30 ? [`  \u2026 ${r.refs.length - 30} more uses`] : []].join("\n")).join("\n\n");
}
var INDEXERS = [
  { when: ["tsconfig.json", "package.json"], cmd: "scip-typescript", args: ["index"] },
  { when: ["pyproject.toml", "setup.py", "requirements.txt"], cmd: "scip-python", args: ["index", "."] },
  { when: ["go.mod"], cmd: "scip-go", args: [] },
  { when: ["Cargo.toml"], cmd: "rust-analyzer", args: ["scip", "."] },
  { when: ["pom.xml", "build.gradle", "build.gradle.kts"], cmd: "scip-java", args: ["index"] }
];
async function indexRepos(repos, log) {
  for (const repo of repos) {
    const ix = INDEXERS.find((i) => i.when.some((f2) => existsSync8(path12.join(repo.dir, f2))));
    if (!ix) {
      log(`${repo.name}: no SCIP indexer for this language`);
      continue;
    }
    const found = await run(ix.cmd, ["--help"], { cwd: repo.dir, timeoutMs: 2e4 }).catch(() => void 0);
    if (!found || /ENOENT|not found/i.test(found.stderr ?? "")) {
      log(`${repo.name}: ${ix.cmd} isn't installed, skipped`);
      continue;
    }
    log(`${repo.name}: ${ix.cmd} ${ix.args.join(" ")}\u2026`);
    const r = await run(ix.cmd, ix.args, { cwd: repo.dir, timeoutMs: 30 * 6e4 }).catch((err) => ({ code: 1, stdout: "", stderr: err.message }));
    const f = indexFile(repo.dir);
    log(r.code === 0 && f ? `${repo.name}: indexed (${Math.round(statSync5(f).size / 1024)} KB)` : `${repo.name}: ${ix.cmd} failed: ${(r.stderr || r.stdout).trim().split("\n").pop()}`);
  }
}

// items/system/src/system/impact.ts
var real = (p) => {
  try {
    return realpathSync.native(p);
  } catch {
    return path13.resolve(p);
  }
};
var git2 = async (cwd, ...a) => (await run("git", a, { cwd, timeoutMs: 6e4 }).catch(() => void 0))?.stdout ?? "";
function targetOf(kind, where) {
  const ep = where.match(/^([A-Z]+) (\/\S*)/);
  if (ep) return { target: `${ep[1]} ${ep[2]}`, kind: "endpoint" };
  if (kind === "protobuf" || /\.proto/.test(kind)) {
    const rpc = where.match(/^(\w+)\.(\w+)$/);
    if (rpc) return { target: where, kind: "rpc" };
  }
  return void 0;
}
async function changedExports(dir2, base) {
  const diff = await git2(dir2, "diff", "-U0", "--no-color", base, "--", "*.ts", "*.tsx", "*.js", "*.mjs", "*.py", "*.go");
  const out = [];
  let file2 = "";
  for (const line of diff.split("\n")) {
    const f = line.match(/^\+\+\+ b\/(.+)$/);
    if (f) {
      file2 = f[1];
      continue;
    }
    if (!/^[-+](?![-+])/.test(line)) continue;
    const t = line.slice(1);
    const m = t.match(/^export\s+(?:declare\s+)?(?:default\s+)?(?:async\s+)?(?:function\*?|class|const|let|type|interface|enum)\s+([A-Za-z_$][\w$]*)/) ?? (file2.endsWith(".py") ? t.match(/^(?:def|class)\s+([A-Za-z]\w*)/) : null) ?? (file2.endsWith(".go") ? t.match(/^(?:func\s+(?:\([^)]*\)\s+)?|type\s+)([A-Z]\w*)/) : null);
    if (m && !out.some((x) => x.name === m[1] && x.file === file2)) out.push({ file: file2, name: m[1] });
  }
  return out;
}
async function wordUses(dir2, name) {
  const rg = await ripgrep();
  if (!rg) return [];
  const r = await run(rg, ["-n", "--no-heading", "--color", "never", "-w", "-g", "!**/node_modules/**", "-g", "!**/vendor/**", "-g", "!**/dist/**", "--", name, "."], { cwd: dir2, timeoutMs: 6e4 }).catch(() => void 0);
  return (r?.stdout ?? "").split(/\r?\n/).map((l) => l.replace(/^\.[\\/]/, "").match(/^(.*?):(\d+):(.*)$/)).filter((m) => !!m).map((m) => ({ file: m[1].replace(/\\/g, "/"), line: Number(m[2]), text: m[3].trim().slice(0, 200) }));
}
async function impactReport(root, services) {
  const items = [];
  const repos = [...new Set(services.map((s) => s.dir))];
  const tops = /* @__PURE__ */ new Map();
  for (const d of repos) tops.set(d, (await git2(d, "rev-parse", "--show-toplevel")).trim() || d);
  let base = "HEAD";
  const seenTop = /* @__PURE__ */ new Set();
  for (const [, top] of tops) {
    if (seenTop.has(top)) continue;
    seenTop.add(top);
    const c = await branchContracts(top);
    base = c.base;
    for (const f of c.files) {
      const kind = f.file.endsWith(".proto") ? "protobuf" : f.file;
      for (const ch of f.changes) {
        const t = targetOf(kind, ch.where);
        if (!t) continue;
        const item = items.find((i) => i.what === t.target) ?? (items.push({ what: t.target, kind: t.kind, breaking: false, changes: [], callers: [] }), items[items.length - 1]);
        item.breaking ||= ch.kind === "breaking";
        item.changes.push(`${ch.kind === "breaking" ? "\u2717" : "\u2713"} ${ch.where}: ${ch.what}`);
      }
    }
    const mb = (await git2(top, "merge-base", "HEAD", base === "HEAD" ? "HEAD" : base)).trim() || "HEAD";
    for (const e of await changedExports(top, mb)) {
      if (items.some((i) => i.what === e.name)) continue;
      const home = real(path13.join(top, e.file));
      items.push({ what: e.name, kind: "symbol", breaking: false, changes: [`changed in ${path13.relative(real(root), home).split(path13.sep).join("/") || e.file}`], callers: [], home });
    }
  }
  const symbols = buildSymbolGraph(services);
  for (const item of items) {
    if (item.kind !== "symbol") {
      const r = await findApiRefs(root, services, item.what);
      item.callers = r?.consumers ?? [];
      continue;
    }
    const scip = symbols.repos.length ? lookup(symbols, item.what, 1)[0] : void 0;
    if (scip) item.callers = scip.refs.map((r) => ({ service: r.repo, file: r.file, line: r.line, text: "" }));
    else
      for (const s of services) {
        if (item.home?.startsWith(real(s.dir) + path13.sep)) continue;
        for (const u of await wordUses(s.dir, item.what)) item.callers.push({ service: s.name, file: path13.relative(root, path13.join(s.dir, u.file)).split(path13.sep).join("/"), line: u.line, text: u.text });
      }
  }
  return { items: items.sort((a, b) => Number(b.breaking) - Number(a.breaking) || b.callers.length - a.callers.length), base };
}
function formatImpact(r) {
  if (!r.items.length) return `Nothing this branch changes is used elsewhere: no changed endpoints, RPCs or exported symbols (against ${r.base}).`;
  const blocks2 = r.items.map((i) => {
    const byRepo = /* @__PURE__ */ new Map();
    for (const c of i.callers) byRepo.set(c.service, [...byRepo.get(c.service) ?? [], c]);
    return [
      `${i.breaking ? "\u2717 breaking" : "\xB7"} ${i.what}  (${i.callers.length} caller${i.callers.length === 1 ? "" : "s"} in ${byRepo.size} service${byRepo.size === 1 ? "" : "s"})`,
      ...i.changes.slice(0, 6).map((c) => `    ${c}`),
      ...[...byRepo].flatMap(([svc, cs]) => [`    ${svc}:`, ...cs.slice(0, 10).map((c) => `      ${c.file}:${c.line}${c.text ? `  ${c.text}` : ""}`), ...cs.length > 10 ? [`      \u2026 ${cs.length - 10} more`] : []])
    ].join("\n");
  });
  const callers = r.items.reduce((n, i) => n + i.callers.length, 0);
  return [`Impact of this branch (against ${r.base}): ${r.items.length} changed thing${r.items.length === 1 ? "" : "s"}, ${callers} caller${callers === 1 ? "" : "s"}`, ...blocks2].join("\n\n");
}

// items/system/src/system/tools.ts
var cached;
async function graphFor(root, maxAgeMs = 5 * 6e4) {
  if (cached && cached.root === root && Date.now() - cached.at < maxAgeMs) return cached.graph;
  const graph = await buildGraph(root);
  cached = { root, at: Date.now(), graph };
  return graph;
}
function serviceGraphTool(experiments, root) {
  return {
    name: "service_graph",
    label: "Services",
    description: "",
    describe: () => "The system's services and who calls whom (from docker-compose, Kubernetes config, URLs and *_URL settings, gRPC clients, internal packages), with the file and line behind each link. Give a service to see its callers and what it calls, or omit it for the whole graph. Use it before changing a service's API, to know who else is affected.",
    inputSchema: { type: "object", properties: { service: { type: "string", description: "A service (repo or folder) name; omit for all" } } },
    mutating: false,
    enabled: () => experiments().includes("system-graph"),
    summarize: (a) => String(a?.service ?? "all"),
    async run(_ctx, args) {
      const g = await graphFor(root());
      const name = args?.service ? String(args.service) : void 0;
      if (!name) return { ok: true, text: formatGraph(g) };
      const s = g.services.find((x) => x.name.toLowerCase() === name.toLowerCase());
      if (!s) return { ok: false, text: `no service "${name}"; services: ${g.services.map((x) => x.name).join(", ")}` };
      const { callers, callees } = neighbours(g, s.name);
      return {
        ok: true,
        text: [`${s.name}${s.provides.length ? ` provides ${s.provides.join(", ")}` : ""}`, `Called by:${callers.length ? "" : " nothing found"}`, ...callers.map((e) => `  ${e.from} [${e.kind}] ${e.evidence}`), `Calls:${callees.length ? "" : " nothing found"}`, ...callees.map((e) => `  ${e.to} [${e.kind}] ${e.evidence}`)].join("\n")
      };
    }
  };
}
function symbolRefsTool(experiments, root) {
  return {
    name: "symbol_refs",
    label: "SymbolRefs",
    description: "",
    describe: () => "Where a function, type or constant is defined and every place it is used, across all the repos (from their SCIP indexes, index.scip). Give its name (e.g. formatMoney, OrderStatus). Use it before changing a shared library or API to find callers in other repos.",
    inputSchema: { type: "object", properties: { name: { type: "string", description: "The symbol name" } }, required: ["name"] },
    mutating: false,
    enabled: () => experiments().includes("system-graph"),
    summarize: (a) => String(a?.name ?? ""),
    async run(_ctx, args) {
      const g = buildSymbolGraph(findServices(root()));
      if (!g.repos.length) return { ok: false, text: "no SCIP indexes (index.scip) in these repos: /symbols index writes them where the indexers are installed" };
      return { ok: true, text: formatLookup(lookup(g, String(args?.name ?? ""))) };
    }
  };
}
function apiRefsTool(experiments, root) {
  return {
    name: "api_refs",
    label: "ApiRefs",
    description: "",
    describe: () => 'Follow an HTTP endpoint ("POST /orders/{id}") or a gRPC method ("Ledger.Post") across every repo: the gateway route in front of it, where it is served (OpenAPI path, route registration or implementation), and every call site in the other services. For a function or type name, use symbol_refs.',
    inputSchema: { type: "object", properties: { target: { type: "string", description: 'An endpoint ("GET /users/{id}") or an RPC ("Service.Method")' } }, required: ["target"] },
    mutating: false,
    enabled: () => experiments().includes("system-graph"),
    summarize: (a) => String(a?.target ?? ""),
    async run(_ctx, args) {
      const g = await graphFor(root());
      const r = await findApiRefs(root(), g.services, String(args?.target ?? ""));
      if (!r) return { ok: false, text: 'give an endpoint like "POST /orders/{id}" or an RPC like "Ledger.Post"' };
      return { ok: true, text: formatRefs(r) };
    }
  };
}

// items/system/src/index.ts
function activate(rein2) {
  setHost(rein2);
  const toolsOn = () => rein2.settings.get("tools") === true;
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  if (toolsOn()) {
    const on = () => ["system-graph", "stack-tool"];
    const root = () => process.cwd();
    const wsRoot = () => findWorkspace()?.root ?? process.cwd();
    const defs = [serviceGraphTool(on, root), symbolRefsTool(on, root), apiRefsTool(on, root), stackTool(on, () => new LocalStack(wsRoot()), async () => servicesForChange(wsRoot(), findServices(process.cwd())))];
    for (const d of defs)
      rein2.registerTool({
        name: d.name,
        label: d.label,
        description: d.describe?.() ?? d.description,
        inputSchema: d.inputSchema,
        mutating: d.mutating,
        summarize: (a) => d.summarize(a),
        run: (args, ctx) => d.run({ root: ctx.cwd }, args)
      });
  }
  rein2.registerCommand({
    name: "services",
    description: "Which service calls which",
    usage: "Which service calls which, from compose, Kubernetes, URLs, gRPC clients and packages: /services, /services mermaid; /services tools on|off for the agent\u2019s tools",
    async run(args, ctx) {
      const [sub, state] = args.trim().split(/\s+/);
      if (sub === "tools") {
        if (state === "on" || state === "off") {
          rein2.settings.set("tools", state === "on");
          return ctx.log(`The agent\u2019s system tools (service_graph, symbol_refs, api_refs, stack) are ${state} from the next time Rein starts.`);
        }
        return ctx.log(`The agent\u2019s system tools are ${toolsOn() ? "on" : "off"}. /services tools on|off`);
      }
      const g = await graphFor(ctx.cwd, 0);
      ctx.log(sub === "mermaid" ? mermaid(g) : formatGraph(g));
    }
  });
  rein2.registerCommand({
    name: "symbols",
    description: "Symbols across repos, from their SCIP indexes",
    usage: "Symbols across repos from their SCIP indexes: /symbols <name> (definition and every use), /symbols cross (used outside their repo), /symbols index",
    async run(args, ctx) {
      const arg = args.trim();
      const repos = findServices(ctx.cwd);
      if (arg === "index") return void await indexRepos(repos, (line) => ctx.log(line));
      const g = buildSymbolGraph(repos);
      if (!g.repos.length) return ctx.log("No SCIP indexes (index.scip) here yet. /symbols index writes one per repo with scip-typescript, scip-python, scip-go, scip-java or rust-analyzer, where installed.");
      if (!arg || arg === "cross") {
        const seams = crossRepo(g);
        return ctx.log(seams.length ? [`${plural(seams.length, "symbol")} used outside the repo that defines ${seams.length === 1 ? "it" : "them"} (indexes from ${g.repos.join(", ")}):`, ...seams.slice(0, 40).map((s) => `  ${s.name}  ${s.from} \u2192 ${s.usedIn.join(", ")}`)].join("\n") : `Nothing is shared between ${g.repos.join(", ")} (by their indexes).`);
      }
      ctx.log(formatLookup(lookup(g, arg)));
    }
  });
  rein2.registerCommand({
    name: "refs",
    description: "Follow an endpoint or RPC across repos",
    usage: "Follow an endpoint (POST /orders/{id}) or RPC (Ledger.Post) across repos: gateway, the service that serves it, every caller",
    async run(args, ctx) {
      const target = args.trim();
      if (!target) return ctx.log("Usage: /refs <endpoint or RPC>, e.g. /refs POST /orders/{id} or /refs Ledger.Post", "error");
      const g = await graphFor(ctx.cwd);
      const r = await findApiRefs(ctx.cwd, g.services, target);
      ctx.log(r ? formatRefs(r) : "Give an endpoint like POST /orders/{id} or an RPC like Ledger.Post (for a function or type, /symbols <name>).", r ? "info" : "error");
    }
  });
  rein2.registerCommand({
    name: "impact",
    description: "Every caller, in every repo, of what this branch changes",
    usage: "Every caller, in every repo, of the endpoints, RPCs and exported symbols this branch changes, breaking changes first",
    async run(_args, ctx) {
      ctx.log("Working out what this branch changes and who uses it\u2026");
      const g = await graphFor(ctx.cwd);
      ctx.log(formatImpact(await impactReport(ctx.cwd, g.services)));
    }
  });
  rein2.registerCommand({
    name: "changeset",
    description: "One change across several repos",
    usage: "One change across several repos: /changeset start <name> [repos], status, test (in dependency order), pr [yes] (linked PRs)",
    async run(args, ctx) {
      const ws = findWorkspace(ctx.cwd);
      if (!ws) return ctx.log("Change sets span the repos of a workspace: put a rein.workspace.yaml above them first (see the Workspaces docs).", "error");
      const [sub = "status", ...rest] = args.trim().split(/\s+/).filter(Boolean);
      if (sub === "start") {
        const [name, ...repos] = rest;
        if (!name) return ctx.log("Usage: /changeset start <name> [repo\u2026] (all cloned repos when none are named)", "error");
        const { set: set2, done, failed } = await startChangeSet(ws, name, repos);
        return ctx.log([`Change set ${set2.name}: branch ${set2.branch} in ${done.join(", ") || "no repo"}.`, ...failed].join("\n"), failed.length ? "error" : "info");
      }
      const sets = loadChangeSets(ws);
      const yes = rest.includes("yes");
      const named = rest.filter((x) => x !== "yes")[0];
      const set = named ? sets.find((s) => s.name === named) : sets[0];
      if (!set) return ctx.log(sets.length ? `No change set "${named}". Change sets: ${sets.map((s) => s.name).join(", ")}` : "No change sets yet: /changeset start <name> makes one branch for the task in each repo.");
      if (sub === "status") return ctx.log(formatState(set, await changeSetState(ws, set)));
      if (sub === "test") {
        const g = await graphFor(ctx.cwd);
        return ctx.log(formatTests(await testChangeSet(ws, set, g.edges, void 0, (l) => ctx.log(l))));
      }
      if (sub === "pr") {
        if (!yes) return ctx.log(`/changeset pr yes will push ${set.branch} in ${set.repos.join(", ")}, open a pull request in each (gh), and link them to each other.`);
        const r = await openPrs(ws, set, set.name);
        return ctx.log([r.opened.length && `Opened pull requests in ${r.opened.join(", ")}.`, r.linked.length && `Linked ${r.linked.join(", ")}.`, ...r.failed].filter(Boolean).join("\n"), r.failed.length ? "error" : "info");
      }
      ctx.log("Usage: /changeset [start <name> [repo\u2026] | status | test | pr [yes]] [name]", "error");
    }
  });
  rein2.registerCommand({
    name: "codemap",
    description: "Architecture maps of the services",
    usage: "Architecture map in docs/codemap/: a page per service, kept fresh. /codemap writes or refreshes it, /codemap status, /codemap annotate",
    async run(args, ctx) {
      const root = findWorkspace(ctx.cwd)?.root ?? ctx.cwd;
      const arg = args.trim();
      const g = await graphFor(ctx.cwd, 0);
      if (arg === "status") {
        const s = await codemapStatus(root, g);
        return ctx.log([`Codemap in ${path14.relative(ctx.cwd, codemapDir(root)) || "docs/codemap"}:`, s.missing.length ? `  no page yet: ${s.missing.join(", ")}` : "", s.stale.length ? `  out of date: ${s.stale.join(", ")} (/codemap refreshes them)` : "", s.unannotated.length ? `  no notes yet: ${s.unannotated.join(", ")} (/codemap annotate)` : "", !s.missing.length && !s.stale.length && !s.unannotated.length ? "  up to date" : ""].filter(Boolean).join("\n"));
      }
      const r = await writeCodemap(root, g, { force: arg === "rebuild" });
      ctx.log(`Codemap: ${r.written.length ? `wrote ${r.written.join(", ")}` : "every page was up to date"}${r.unchanged.length && r.written.length ? ` (${r.unchanged.length} unchanged)` : ""}, in ${path14.relative(ctx.cwd, r.dir) || r.dir}/.`);
      if (arg === "annotate") {
        const { unannotated } = await codemapStatus(root, g);
        if (!unannotated.length) return ctx.log("Every page has notes.");
        ctx.send(annotateTask(root, unannotated));
      }
    }
  });
  rein2.registerCommand({
    name: "stack",
    description: "Run the services a change needs locally",
    usage: "Run the services a change needs locally (Docker Compose), wait for health checks: /stack up [services | --helm <chart>], status, logs <service>, down",
    async run(args, ctx) {
      const root = findWorkspace(ctx.cwd)?.root ?? ctx.cwd;
      const stack = new LocalStack(root);
      const [sub = "status", ...rest] = args.trim().split(/\s+/).filter(Boolean);
      if (sub === "up" && rest[0] === "--helm") {
        if (!rest[1]) return ctx.log("Usage: /stack up --helm <chart folder>", "error");
        return ctx.log(await stack.helm(path14.resolve(ctx.cwd, rest[1])));
      }
      if (sub === "up") {
        const names = rest.length ? rest : await servicesForChange(root, findServices(ctx.cwd));
        ctx.log(`Starting ${names.length ? names.join(", ") : "the whole stack"} (docker compose up --wait)\u2026`);
        const r = await stack.up(names);
        return ctx.log(`${r.message}
${formatServices(r.services)}`, r.ok ? "info" : "error");
      }
      if (sub === "logs") return ctx.log(await stack.logs(rest[0] ?? ""));
      if (sub === "down") return ctx.log(await stack.down());
      ctx.log(composeFile(root) ? formatServices(await stack.status()) : "No compose file here (compose.yaml or docker-compose.yml).");
    }
  });
}
export {
  activate
};
