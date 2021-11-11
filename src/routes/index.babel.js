'use strict';

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.object.set-prototype-of.js");

require("core-js/modules/es.object.get-prototype-of.js");

require("core-js/modules/es.reflect.construct.js");

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.array-buffer.slice.js");

require("core-js/modules/es.typed-array.int32-array.js");

require("core-js/modules/es.typed-array.copy-within.js");

require("core-js/modules/es.typed-array.every.js");

require("core-js/modules/es.typed-array.fill.js");

require("core-js/modules/es.typed-array.filter.js");

require("core-js/modules/es.typed-array.find.js");

require("core-js/modules/es.typed-array.find-index.js");

require("core-js/modules/es.typed-array.for-each.js");

require("core-js/modules/es.typed-array.includes.js");

require("core-js/modules/es.typed-array.index-of.js");

require("core-js/modules/es.typed-array.iterator.js");

require("core-js/modules/es.typed-array.join.js");

require("core-js/modules/es.typed-array.last-index-of.js");

require("core-js/modules/es.typed-array.map.js");

require("core-js/modules/es.typed-array.reduce.js");

require("core-js/modules/es.typed-array.reduce-right.js");

require("core-js/modules/es.typed-array.reverse.js");

require("core-js/modules/es.typed-array.set.js");

require("core-js/modules/es.typed-array.slice.js");

require("core-js/modules/es.typed-array.some.js");

require("core-js/modules/es.typed-array.sort.js");

require("core-js/modules/es.typed-array.subarray.js");

require("core-js/modules/es.typed-array.to-locale-string.js");

require("core-js/modules/es.typed-array.to-string.js");

require("core-js/modules/es.array.sort.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/es.array.splice.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.string.starts-with.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.set.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.fill.js");

require("core-js/modules/es.map.js");

require("core-js/modules/es.string.anchor.js");

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function noop() {}

function run(fn) {
  return fn();
}

function blank_object() {
  return Object.create(null);
}

function run_all(fns) {
  fns.forEach(run);
}

function is_function(thing) {
  return typeof thing === 'function';
}

function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && _typeof(a) === 'object' || typeof a === 'function';
}

function is_empty(obj) {
  return Object.keys(obj).length === 0;
} // Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
// at the end of hydration without touching the remaining nodes.


var is_hydrating = false;

function start_hydrating() {
  is_hydrating = true;
}

function end_hydrating() {
  is_hydrating = false;
}

function upper_bound(low, high, key, value) {
  // Return first index of value larger than input value in the range [low, high)
  while (low < high) {
    var mid = low + (high - low >> 1);

    if (key(mid) <= value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}

function init_hydrate(target) {
  if (target.hydrate_init) return;
  target.hydrate_init = true; // We know that all children have claim_order values since the unclaimed have been detached if target is not <head>

  var children = target.childNodes; // If target is <head>, there may be children without claim_order

  if (target.nodeName === 'HEAD') {
    var myChildren = [];

    for (var i = 0; i < children.length; i++) {
      var node = children[i];

      if (node.claim_order !== undefined) {
        myChildren.push(node);
      }
    }

    children = myChildren;
  }
  /*
  * Reorder claimed children optimally.
  * We can reorder claimed children optimally by finding the longest subsequence of
  * nodes that are already claimed in order and only moving the rest. The longest
  * subsequence subsequence of nodes that are claimed in order can be found by
  * computing the longest increasing subsequence of .claim_order values.
  *
  * This algorithm is optimal in generating the least amount of reorder operations
  * possible.
  *
  * Proof:
  * We know that, given a set of reordering operations, the nodes that do not move
  * always form an increasing subsequence, since they do not move among each other
  * meaning that they must be already ordered among each other. Thus, the maximal
  * set of nodes that do not move form a longest increasing subsequence.
  */
  // Compute longest increasing subsequence
  // m: subsequence length j => index k of smallest value that ends an increasing subsequence of length j


  var m = new Int32Array(children.length + 1); // Predecessor indices + 1

  var p = new Int32Array(children.length);
  m[0] = -1;
  var longest = 0;

  for (var _i = 0; _i < children.length; _i++) {
    var current = children[_i].claim_order; // Find the largest subsequence length such that it ends in a value less than our current value
    // upper_bound returns first greater value, so we subtract one
    // with fast path for when we are on the current longest subsequence

    var seqLen = (longest > 0 && children[m[longest]].claim_order <= current ? longest + 1 : upper_bound(1, longest, function (idx) {
      return children[m[idx]].claim_order;
    }, current)) - 1;
    p[_i] = m[seqLen] + 1;
    var newLen = seqLen + 1; // We can guarantee that current is the smallest value. Otherwise, we would have generated a longer sequence.

    m[newLen] = _i;
    longest = Math.max(newLen, longest);
  } // The longest increasing subsequence of nodes (initially reversed)


  var lis = []; // The rest of the nodes, nodes that will be moved

  var toMove = [];
  var last = children.length - 1;

  for (var cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
    lis.push(children[cur - 1]);

    for (; last >= cur; last--) {
      toMove.push(children[last]);
    }

    last--;
  }

  for (; last >= 0; last--) {
    toMove.push(children[last]);
  }

  lis.reverse(); // We sort the nodes being moved to guarantee that their insertion order matches the claim order

  toMove.sort(function (a, b) {
    return a.claim_order - b.claim_order;
  }); // Finally, we move the nodes

  for (var _i2 = 0, j = 0; _i2 < toMove.length; _i2++) {
    while (j < lis.length && toMove[_i2].claim_order >= lis[j].claim_order) {
      j++;
    }

    var anchor = j < lis.length ? lis[j] : null;
    target.insertBefore(toMove[_i2], anchor);
  }
}

function append_hydration(target, node) {
  if (is_hydrating) {
    init_hydrate(target);

    if (target.actual_end_child === undefined || target.actual_end_child !== null && target.actual_end_child.parentElement !== target) {
      target.actual_end_child = target.firstChild;
    } // Skip nodes of undefined ordering


    while (target.actual_end_child !== null && target.actual_end_child.claim_order === undefined) {
      target.actual_end_child = target.actual_end_child.nextSibling;
    }

    if (node !== target.actual_end_child) {
      // We only insert if the ordering of this node should be modified or the parent node is not target
      if (node.claim_order !== undefined || node.parentNode !== target) {
        target.insertBefore(node, target.actual_end_child);
      }
    } else {
      target.actual_end_child = node.nextSibling;
    }
  } else if (node.parentNode !== target || node.nextSibling !== null) {
    target.appendChild(node);
  }
}

function insert_hydration(target, node, anchor) {
  if (is_hydrating && !anchor) {
    append_hydration(target, node);
  } else if (node.parentNode !== target || node.nextSibling != anchor) {
    target.insertBefore(node, anchor || null);
  }
}

function detach(node) {
  node.parentNode.removeChild(node);
}

function element(name) {
  return document.createElement(name);
}

function svg_element(name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name);
}

function text(data) {
  return document.createTextNode(data);
}

function space() {
  return text(' ');
}

function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return function () {
    return node.removeEventListener(event, handler, options);
  };
}

function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

function children(element) {
  return Array.from(element.childNodes);
}

function init_claim_info(nodes) {
  if (nodes.claim_info === undefined) {
    nodes.claim_info = {
      last_index: 0,
      total_claimed: 0
    };
  }
}

function claim_node(nodes, predicate, processNode, createNode) {
  var dontUpdateLastIndex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  // Try to find nodes in an order such that we lengthen the longest increasing subsequence
  init_claim_info(nodes);

  var resultNode = function () {
    // We first try to find an element after the previous one
    for (var i = nodes.claim_info.last_index; i < nodes.length; i++) {
      var node = nodes[i];

      if (predicate(node)) {
        var replacement = processNode(node);

        if (replacement === undefined) {
          nodes.splice(i, 1);
        } else {
          nodes[i] = replacement;
        }

        if (!dontUpdateLastIndex) {
          nodes.claim_info.last_index = i;
        }

        return node;
      }
    } // Otherwise, we try to find one before
    // We iterate in reverse so that we don't go too far back


    for (var _i3 = nodes.claim_info.last_index - 1; _i3 >= 0; _i3--) {
      var _node = nodes[_i3];

      if (predicate(_node)) {
        var _replacement = processNode(_node);

        if (_replacement === undefined) {
          nodes.splice(_i3, 1);
        } else {
          nodes[_i3] = _replacement;
        }

        if (!dontUpdateLastIndex) {
          nodes.claim_info.last_index = _i3;
        } else if (_replacement === undefined) {
          // Since we spliced before the last_index, we decrease it
          nodes.claim_info.last_index--;
        }

        return _node;
      }
    } // If we can't find any matching node, we create a new one


    return createNode();
  }();

  resultNode.claim_order = nodes.claim_info.total_claimed;
  nodes.claim_info.total_claimed += 1;
  return resultNode;
}

function claim_element_base(nodes, name, attributes, create_element) {
  return claim_node(nodes, function (node) {
    return node.nodeName === name;
  }, function (node) {
    var remove = [];

    for (var j = 0; j < node.attributes.length; j++) {
      var attribute = node.attributes[j];

      if (!attributes[attribute.name]) {
        remove.push(attribute.name);
      }
    }

    remove.forEach(function (v) {
      return node.removeAttribute(v);
    });
    return undefined;
  }, function () {
    return create_element(name);
  });
}

function claim_element(nodes, name, attributes) {
  return claim_element_base(nodes, name, attributes, element);
}

function claim_svg_element(nodes, name, attributes) {
  return claim_element_base(nodes, name, attributes, svg_element);
}

function claim_text(nodes, data) {
  return claim_node(nodes, function (node) {
    return node.nodeType === 3;
  }, function (node) {
    var dataStr = '' + data;

    if (node.data.startsWith(dataStr)) {
      if (node.data.length !== dataStr.length) {
        return node.splitText(dataStr.length);
      }
    } else {
      node.data = dataStr;
    }
  }, function () {
    return text(data);
  }, true // Text nodes should not update last index since it is likely not worth it to eliminate an increasing subsequence of actual elements
  );
}

function claim_space(nodes) {
  return claim_text(nodes, ' ');
}

function set_data(text, data) {
  data = '' + data;
  if (text.wholeText !== data) text.data = data;
}

var current_component;

function set_current_component(component) {
  current_component = component;
}

var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;

function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}

function add_render_callback(fn) {
  render_callbacks.push(fn);
}

var flushing = false;
var seen_callbacks = new Set();

function flush() {
  if (flushing) return;
  flushing = true;

  do {
    // first, call beforeUpdate functions
    // and update components
    for (var i = 0; i < dirty_components.length; i += 1) {
      var component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }

    set_current_component(null);
    dirty_components.length = 0;

    while (binding_callbacks.length) {
      binding_callbacks.pop()();
    } // then, once components are updated, call
    // afterUpdate functions. This may cause
    // subsequent updates...


    for (var _i4 = 0; _i4 < render_callbacks.length; _i4 += 1) {
      var callback = render_callbacks[_i4];

      if (!seen_callbacks.has(callback)) {
        // ...so guard against infinite loops
        seen_callbacks.add(callback);
        callback();
      }
    }

    render_callbacks.length = 0;
  } while (dirty_components.length);

  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }

  update_scheduled = false;
  flushing = false;
  seen_callbacks.clear();
}

function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    var dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}

var outroing = new Set();

function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}

function mount_component(component, target, anchor, customElement) {
  var _component$$$ = component.$$,
      fragment = _component$$$.fragment,
      on_mount = _component$$$.on_mount,
      on_destroy = _component$$$.on_destroy,
      after_update = _component$$$.after_update;
  fragment && fragment.m(target, anchor);

  if (!customElement) {
    // onMount happens before the initial afterUpdate
    add_render_callback(function () {
      var new_on_destroy = on_mount.map(run).filter(is_function);

      if (on_destroy) {
        on_destroy.push.apply(on_destroy, _toConsumableArray(new_on_destroy));
      } else {
        // Edge case - component was destroyed immediately,
        // most likely as a result of a binding initialising
        run_all(new_on_destroy);
      }

      component.$$.on_mount = [];
    });
  }

  after_update.forEach(add_render_callback);
}

function destroy_component(component, detaching) {
  var $$ = component.$$;

  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching); // TODO null out other refs, including component.$$ (but need to
    // preserve final state?)

    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}

function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }

  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}

function init(component, options, instance, create_fragment, not_equal, props, append_styles) {
  var dirty = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : [-1];
  var parent_component = current_component;
  set_current_component(component);
  var $$ = component.$$ = {
    fragment: null,
    ctx: null,
    // state
    props: props,
    update: noop,
    not_equal: not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty: dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  var ready = false;
  $$.ctx = instance ? instance(component, options.props || {}, function (i, ret) {
    var value = (arguments.length <= 2 ? 0 : arguments.length - 2) ? arguments.length <= 2 ? undefined : arguments[2] : ret;

    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
      if (ready) make_dirty(component, i);
    }

    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update); // `false` as a special case of no DOM component

  $$.fragment = create_fragment ? create_fragment($$.ctx) : false;

  if (options.target) {
    if (options.hydrate) {
      start_hydrating();
      var nodes = children(options.target); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $$.fragment && $$.fragment.c();
    }

    if (options.intro) transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    end_hydrating();
    flush();
  }

  set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */


var SvelteComponent = /*#__PURE__*/function () {
  function SvelteComponent() {
    _classCallCheck(this, SvelteComponent);
  }

  _createClass(SvelteComponent, [{
    key: "$destroy",
    value: function $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
  }, {
    key: "$on",
    value: function $on(type, callback) {
      var callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return function () {
        var index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
      };
    }
  }, {
    key: "$set",
    value: function $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  }]);

  return SvelteComponent;
}();
/* src\routes\index.svelte generated by Svelte v3.44.1 */


function create_else_block_2(ctx) {
  var svg;
  var path;
  var mounted;
  var dispose;
  return {
    c: function c() {
      svg = svg_element("svg");
      path = svg_element("path");
      this.h();
    },
    l: function l(nodes) {
      svg = claim_svg_element(nodes, "svg", {
        id: true,
        xmlns: true,
        class: true,
        viewBox: true,
        fill: true
      });
      var svg_nodes = children(svg);
      path = claim_svg_element(svg_nodes, "path", {
        "fill-rule": true,
        d: true,
        "clip-rule": true
      });
      children(path).forEach(detach);
      svg_nodes.forEach(detach);
      this.h();
    },
    h: function h() {
      attr(path, "fill-rule", "evenodd");
      attr(path, "d", "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z");
      attr(path, "clip-rule", "evenodd");
      attr(svg, "id", "closed-lock");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "class", "h-5 w-5 svelte-o0k1tz");
      attr(svg, "viewBox", "0 0 20 20");
      attr(svg, "fill", "currentColor");
    },
    m: function m(target, anchor) {
      insert_hydration(target, svg, anchor);
      append_hydration(svg, path);

      if (!mounted) {
        dispose = listen(svg, "click",
        /*click_handler_1*/
        ctx[9]);
        mounted = true;
      }
    },
    p: noop,
    d: function d(detaching) {
      if (detaching) detach(svg);
      mounted = false;
      dispose();
    }
  };
} // (133:12) {#if !styleLock}


function create_if_block_2(ctx) {
  var svg;
  var path;
  var mounted;
  var dispose;
  return {
    c: function c() {
      svg = svg_element("svg");
      path = svg_element("path");
      this.h();
    },
    l: function l(nodes) {
      svg = claim_svg_element(nodes, "svg", {
        xmlns: true,
        class: true,
        viewBox: true,
        fill: true
      });
      var svg_nodes = children(svg);
      path = claim_svg_element(svg_nodes, "path", {
        d: true
      });
      children(path).forEach(detach);
      svg_nodes.forEach(detach);
      this.h();
    },
    h: function h() {
      attr(path, "d", "M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "class", "h-5 w-5 svelte-o0k1tz");
      attr(svg, "viewBox", "0 0 20 20");
      attr(svg, "fill", "currentColor");
    },
    m: function m(target, anchor) {
      insert_hydration(target, svg, anchor);
      append_hydration(svg, path);

      if (!mounted) {
        dispose = listen(svg, "click",
        /*click_handler*/
        ctx[8]);
        mounted = true;
      }
    },
    p: noop,
    d: function d(detaching) {
      if (detaching) detach(svg);
      mounted = false;
      dispose();
    }
  };
} // (152:12) {:else}


function create_else_block_1(ctx) {
  var svg;
  var path;
  var mounted;
  var dispose;
  return {
    c: function c() {
      svg = svg_element("svg");
      path = svg_element("path");
      this.h();
    },
    l: function l(nodes) {
      svg = claim_svg_element(nodes, "svg", {
        id: true,
        xmlns: true,
        class: true,
        viewBox: true,
        fill: true
      });
      var svg_nodes = children(svg);
      path = claim_svg_element(svg_nodes, "path", {
        "fill-rule": true,
        d: true,
        "clip-rule": true
      });
      children(path).forEach(detach);
      svg_nodes.forEach(detach);
      this.h();
    },
    h: function h() {
      attr(path, "fill-rule", "evenodd");
      attr(path, "d", "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z");
      attr(path, "clip-rule", "evenodd");
      attr(svg, "id", "closed-lock");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "class", "h-5 w-5 svelte-o0k1tz");
      attr(svg, "viewBox", "0 0 20 20");
      attr(svg, "fill", "currentColor");
    },
    m: function m(target, anchor) {
      insert_hydration(target, svg, anchor);
      append_hydration(svg, path);

      if (!mounted) {
        dispose = listen(svg, "click",
        /*click_handler_3*/
        ctx[11]);
        mounted = true;
      }
    },
    p: noop,
    d: function d(detaching) {
      if (detaching) detach(svg);
      mounted = false;
      dispose();
    }
  };
} // (148:12) {#if !themeLock}


function create_if_block_1(ctx) {
  var svg;
  var path;
  var mounted;
  var dispose;
  return {
    c: function c() {
      svg = svg_element("svg");
      path = svg_element("path");
      this.h();
    },
    l: function l(nodes) {
      svg = claim_svg_element(nodes, "svg", {
        xmlns: true,
        class: true,
        viewBox: true,
        fill: true
      });
      var svg_nodes = children(svg);
      path = claim_svg_element(svg_nodes, "path", {
        d: true
      });
      children(path).forEach(detach);
      svg_nodes.forEach(detach);
      this.h();
    },
    h: function h() {
      attr(path, "d", "M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "class", "h-5 w-5 svelte-o0k1tz");
      attr(svg, "viewBox", "0 0 20 20");
      attr(svg, "fill", "currentColor");
    },
    m: function m(target, anchor) {
      insert_hydration(target, svg, anchor);
      append_hydration(svg, path);

      if (!mounted) {
        dispose = listen(svg, "click",
        /*click_handler_2*/
        ctx[10]);
        mounted = true;
      }
    },
    p: noop,
    d: function d(detaching) {
      if (detaching) detach(svg);
      mounted = false;
      dispose();
    }
  };
} // (167:12) {:else}


function create_else_block(ctx) {
  var svg;
  var path;
  var mounted;
  var dispose;
  return {
    c: function c() {
      svg = svg_element("svg");
      path = svg_element("path");
      this.h();
    },
    l: function l(nodes) {
      svg = claim_svg_element(nodes, "svg", {
        id: true,
        xmlns: true,
        class: true,
        viewBox: true,
        fill: true
      });
      var svg_nodes = children(svg);
      path = claim_svg_element(svg_nodes, "path", {
        "fill-rule": true,
        d: true,
        "clip-rule": true
      });
      children(path).forEach(detach);
      svg_nodes.forEach(detach);
      this.h();
    },
    h: function h() {
      attr(path, "fill-rule", "evenodd");
      attr(path, "d", "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z");
      attr(path, "clip-rule", "evenodd");
      attr(svg, "id", "closed-lock");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "class", "h-5 w-5 svelte-o0k1tz");
      attr(svg, "viewBox", "0 0 20 20");
      attr(svg, "fill", "currentColor");
    },
    m: function m(target, anchor) {
      insert_hydration(target, svg, anchor);
      append_hydration(svg, path);

      if (!mounted) {
        dispose = listen(svg, "click",
        /*click_handler_5*/
        ctx[13]);
        mounted = true;
      }
    },
    p: noop,
    d: function d(detaching) {
      if (detaching) detach(svg);
      mounted = false;
      dispose();
    }
  };
} // (163:12) {#if !genreLock}


function create_if_block(ctx) {
  var svg;
  var path;
  var mounted;
  var dispose;
  return {
    c: function c() {
      svg = svg_element("svg");
      path = svg_element("path");
      this.h();
    },
    l: function l(nodes) {
      svg = claim_svg_element(nodes, "svg", {
        xmlns: true,
        class: true,
        viewBox: true,
        fill: true
      });
      var svg_nodes = children(svg);
      path = claim_svg_element(svg_nodes, "path", {
        d: true
      });
      children(path).forEach(detach);
      svg_nodes.forEach(detach);
      this.h();
    },
    h: function h() {
      attr(path, "d", "M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "class", "h-5 w-5 svelte-o0k1tz");
      attr(svg, "viewBox", "0 0 20 20");
      attr(svg, "fill", "currentColor");
    },
    m: function m(target, anchor) {
      insert_hydration(target, svg, anchor);
      append_hydration(svg, path);

      if (!mounted) {
        dispose = listen(svg, "click",
        /*click_handler_4*/
        ctx[12]);
        mounted = true;
      }
    },
    p: noop,
    d: function d(detaching) {
      if (detaching) detach(svg);
      mounted = false;
      dispose();
    }
  };
}

function create_fragment(ctx) {
  var main;
  var h1;
  var t0;
  var t1;
  var div3;
  var div0;
  var legend0;
  var t2;
  var t3;
  var t4;
  var h40;
  var t5;
  var t6;
  var div1;
  var legend1;
  var t7;
  var t8;
  var t9;
  var h41;
  var t10;
  var t11;
  var div2;
  var legend2;
  var t12;
  var t13;
  var t14;
  var h42;
  var t15;
  var t16;
  var button;
  var t17;
  var t18;
  var footer;
  var div4;
  var t19;
  var a;
  var t20;
  var mounted;
  var dispose;

  function select_block_type(ctx, dirty) {
    if (!
    /*styleLock*/
    ctx[3]) return create_if_block_2;
    return create_else_block_2;
  }

  var current_block_type = select_block_type(ctx);
  var if_block0 = current_block_type(ctx);

  function select_block_type_1(ctx, dirty) {
    if (!
    /*themeLock*/
    ctx[4]) return create_if_block_1;
    return create_else_block_1;
  }

  var current_block_type_1 = select_block_type_1(ctx);
  var if_block1 = current_block_type_1(ctx);

  function select_block_type_2(ctx, dirty) {
    if (!
    /*genreLock*/
    ctx[5]) return create_if_block;
    return create_else_block;
  }

  var current_block_type_2 = select_block_type_2(ctx);
  var if_block2 = current_block_type_2(ctx);
  return {
    c: function c() {
      main = element("main");
      h1 = element("h1");
      t0 = text("Game Idea Generator");
      t1 = space();
      div3 = element("div");
      div0 = element("div");
      legend0 = element("legend");
      t2 = text("STYLE");
      t3 = space();
      if_block0.c();
      t4 = space();
      h40 = element("h4");
      t5 = text(
      /*style*/
      ctx[0]);
      t6 = space();
      div1 = element("div");
      legend1 = element("legend");
      t7 = text("THEME");
      t8 = space();
      if_block1.c();
      t9 = space();
      h41 = element("h4");
      t10 = text(
      /*theme*/
      ctx[1]);
      t11 = space();
      div2 = element("div");
      legend2 = element("legend");
      t12 = text("GENRE");
      t13 = space();
      if_block2.c();
      t14 = space();
      h42 = element("h4");
      t15 = text(
      /*genre*/
      ctx[2]);
      t16 = space();
      button = element("button");
      t17 = text("GENERATE");
      t18 = space();
      footer = element("footer");
      div4 = element("div");
      t19 = text("Copyright 2021 - ");
      a = element("a");
      t20 = text("ignurof.xyz");
      this.h();
    },
    l: function l(nodes) {
      main = claim_element(nodes, "MAIN", {
        class: true
      });
      var main_nodes = children(main);
      h1 = claim_element(main_nodes, "H1", {
        class: true
      });
      var h1_nodes = children(h1);
      t0 = claim_text(h1_nodes, "Game Idea Generator");
      h1_nodes.forEach(detach);
      t1 = claim_space(main_nodes);
      div3 = claim_element(main_nodes, "DIV", {
        class: true
      });
      var div3_nodes = children(div3);
      div0 = claim_element(div3_nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      legend0 = claim_element(div0_nodes, "LEGEND", {
        class: true
      });
      var legend0_nodes = children(legend0);
      t2 = claim_text(legend0_nodes, "STYLE");
      legend0_nodes.forEach(detach);
      t3 = claim_space(div0_nodes);
      if_block0.l(div0_nodes);
      div0_nodes.forEach(detach);
      t4 = claim_space(div3_nodes);
      h40 = claim_element(div3_nodes, "H4", {
        class: true
      });
      var h40_nodes = children(h40);
      t5 = claim_text(h40_nodes,
      /*style*/
      ctx[0]);
      h40_nodes.forEach(detach);
      t6 = claim_space(div3_nodes);
      div1 = claim_element(div3_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      legend1 = claim_element(div1_nodes, "LEGEND", {
        class: true
      });
      var legend1_nodes = children(legend1);
      t7 = claim_text(legend1_nodes, "THEME");
      legend1_nodes.forEach(detach);
      t8 = claim_space(div1_nodes);
      if_block1.l(div1_nodes);
      div1_nodes.forEach(detach);
      t9 = claim_space(div3_nodes);
      h41 = claim_element(div3_nodes, "H4", {
        class: true
      });
      var h41_nodes = children(h41);
      t10 = claim_text(h41_nodes,
      /*theme*/
      ctx[1]);
      h41_nodes.forEach(detach);
      t11 = claim_space(div3_nodes);
      div2 = claim_element(div3_nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      legend2 = claim_element(div2_nodes, "LEGEND", {
        class: true
      });
      var legend2_nodes = children(legend2);
      t12 = claim_text(legend2_nodes, "GENRE");
      legend2_nodes.forEach(detach);
      t13 = claim_space(div2_nodes);
      if_block2.l(div2_nodes);
      div2_nodes.forEach(detach);
      t14 = claim_space(div3_nodes);
      h42 = claim_element(div3_nodes, "H4", {
        class: true
      });
      var h42_nodes = children(h42);
      t15 = claim_text(h42_nodes,
      /*genre*/
      ctx[2]);
      h42_nodes.forEach(detach);
      div3_nodes.forEach(detach);
      t16 = claim_space(main_nodes);
      button = claim_element(main_nodes, "BUTTON", {
        class: true
      });
      var button_nodes = children(button);
      t17 = claim_text(button_nodes, "GENERATE");
      button_nodes.forEach(detach);
      t18 = claim_space(main_nodes);
      footer = claim_element(main_nodes, "FOOTER", {
        class: true
      });
      var footer_nodes = children(footer);
      div4 = claim_element(footer_nodes, "DIV", {
        class: true
      });
      var div4_nodes = children(div4);
      t19 = claim_text(div4_nodes, "Copyright 2021 - ");
      a = claim_element(div4_nodes, "A", {
        href: true,
        target: true,
        class: true
      });
      var a_nodes = children(a);
      t20 = claim_text(a_nodes, "ignurof.xyz");
      a_nodes.forEach(detach);
      div4_nodes.forEach(detach);
      footer_nodes.forEach(detach);
      main_nodes.forEach(detach);
      this.h();
    },
    h: function h() {
      attr(h1, "class", "svelte-o0k1tz");
      attr(legend0, "class", "svelte-o0k1tz");
      attr(div0, "class", "field svelte-o0k1tz");
      attr(h40, "class", "svelte-o0k1tz");
      attr(legend1, "class", "svelte-o0k1tz");
      attr(div1, "class", "field svelte-o0k1tz");
      attr(h41, "class", "svelte-o0k1tz");
      attr(legend2, "class", "svelte-o0k1tz");
      attr(div2, "class", "field svelte-o0k1tz");
      attr(h42, "class", "svelte-o0k1tz");
      attr(div3, "class", "card svelte-o0k1tz");
      attr(button, "class", "svelte-o0k1tz");
      attr(a, "href", "ignurof.xyz");
      attr(a, "target", "_blank");
      attr(a, "class", "svelte-o0k1tz");
      attr(div4, "class", "credits svelte-o0k1tz");
      attr(footer, "class", "svelte-o0k1tz");
      attr(main, "class", "svelte-o0k1tz");
    },
    m: function m(target, anchor) {
      insert_hydration(target, main, anchor);
      append_hydration(main, h1);
      append_hydration(h1, t0);
      append_hydration(main, t1);
      append_hydration(main, div3);
      append_hydration(div3, div0);
      append_hydration(div0, legend0);
      append_hydration(legend0, t2);
      append_hydration(div0, t3);
      if_block0.m(div0, null);
      append_hydration(div3, t4);
      append_hydration(div3, h40);
      append_hydration(h40, t5);
      append_hydration(div3, t6);
      append_hydration(div3, div1);
      append_hydration(div1, legend1);
      append_hydration(legend1, t7);
      append_hydration(div1, t8);
      if_block1.m(div1, null);
      append_hydration(div3, t9);
      append_hydration(div3, h41);
      append_hydration(h41, t10);
      append_hydration(div3, t11);
      append_hydration(div3, div2);
      append_hydration(div2, legend2);
      append_hydration(legend2, t12);
      append_hydration(div2, t13);
      if_block2.m(div2, null);
      append_hydration(div3, t14);
      append_hydration(div3, h42);
      append_hydration(h42, t15);
      append_hydration(main, t16);
      append_hydration(main, button);
      append_hydration(button, t17);
      append_hydration(main, t18);
      append_hydration(main, footer);
      append_hydration(footer, div4);
      append_hydration(div4, t19);
      append_hydration(div4, a);
      append_hydration(a, t20);

      if (!mounted) {
        dispose = listen(button, "click",
        /*click_handler_6*/
        ctx[14]);
        mounted = true;
      }
    },
    p: function p(ctx, _ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          dirty = _ref2[0];

      if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
        if_block0.p(ctx, dirty);
      } else {
        if_block0.d(1);
        if_block0 = current_block_type(ctx);

        if (if_block0) {
          if_block0.c();
          if_block0.m(div0, null);
        }
      }

      if (dirty &
      /*style*/
      1) set_data(t5,
      /*style*/
      ctx[0]);

      if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
        if_block1.p(ctx, dirty);
      } else {
        if_block1.d(1);
        if_block1 = current_block_type_1(ctx);

        if (if_block1) {
          if_block1.c();
          if_block1.m(div1, null);
        }
      }

      if (dirty &
      /*theme*/
      2) set_data(t10,
      /*theme*/
      ctx[1]);

      if (current_block_type_2 === (current_block_type_2 = select_block_type_2(ctx)) && if_block2) {
        if_block2.p(ctx, dirty);
      } else {
        if_block2.d(1);
        if_block2 = current_block_type_2(ctx);

        if (if_block2) {
          if_block2.c();
          if_block2.m(div2, null);
        }
      }

      if (dirty &
      /*genre*/
      4) set_data(t15,
      /*genre*/
      ctx[2]);
    },
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (detaching) detach(main);
      if_block0.d();
      if_block1.d();
      if_block2.d();
      mounted = false;
      dispose();
    }
  };
}

function instance($$self, $$props, $$invalidate) {
  var gameIdeaObj = $$props.gameIdeaObj;
  var style = gameIdeaObj.style;
  var theme = gameIdeaObj.theme;
  var genre = gameIdeaObj.genre;
  var styleLock = false;
  var themeLock = false;
  var genreLock = false; // Request idea object from backend

  var FetchNewIdea = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var response, result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetch("/generate");

            case 2:
              response = _context.sent;

              if (response.ok) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", console.error("Something went wrong with generate request!"));

            case 5:
              _context.next = 7;
              return response.json();

            case 7:
              result = _context.sent;
              if (!styleLock) $$invalidate(0, style = result.style);
              if (!themeLock) $$invalidate(1, theme = result.theme);
              if (!genreLock) $$invalidate(2, genre = result.genre);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function FetchNewIdea() {
      return _ref3.apply(this, arguments);
    };
  }();

  var click_handler = function click_handler() {
    $$invalidate(3, styleLock = !styleLock);
  };

  var click_handler_1 = function click_handler_1() {
    $$invalidate(3, styleLock = !styleLock);
  };

  var click_handler_2 = function click_handler_2() {
    $$invalidate(4, themeLock = !themeLock);
  };

  var click_handler_3 = function click_handler_3() {
    $$invalidate(4, themeLock = !themeLock);
  };

  var click_handler_4 = function click_handler_4() {
    $$invalidate(5, genreLock = !genreLock);
  };

  var click_handler_5 = function click_handler_5() {
    $$invalidate(5, genreLock = !genreLock);
  };

  var click_handler_6 = function click_handler_6() {
    return FetchNewIdea();
  };

  $$self.$$set = function ($$props) {
    if ('gameIdeaObj' in $$props) $$invalidate(7, gameIdeaObj = $$props.gameIdeaObj);
  };

  return [style, theme, genre, styleLock, themeLock, genreLock, FetchNewIdea, gameIdeaObj, click_handler, click_handler_1, click_handler_2, click_handler_3, click_handler_4, click_handler_5, click_handler_6];
}

var Routes = /*#__PURE__*/function (_SvelteComponent) {
  _inherits(Routes, _SvelteComponent);

  var _super = _createSuper(Routes);

  function Routes(options) {
    var _this;

    _classCallCheck(this, Routes);

    _this = _super.call(this);
    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {
      gameIdeaObj: 7
    });
    return _this;
  }

  return Routes;
}(SvelteComponent);

module.exports = Routes;