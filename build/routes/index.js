var Index = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
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
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    // Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
    // at the end of hydration without touching the remaining nodes.
    let is_hydrating = false;
    function start_hydrating() {
        is_hydrating = true;
    }
    function end_hydrating() {
        is_hydrating = false;
    }
    function upper_bound(low, high, key, value) {
        // Return first index of value larger than input value in the range [low, high)
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (key(mid) <= value) {
                low = mid + 1;
            }
            else {
                high = mid;
            }
        }
        return low;
    }
    function init_hydrate(target) {
        if (target.hydrate_init)
            return;
        target.hydrate_init = true;
        // We know that all children have claim_order values since the unclaimed have been detached if target is not <head>
        let children = target.childNodes;
        // If target is <head>, there may be children without claim_order
        if (target.nodeName === 'HEAD') {
            const myChildren = [];
            for (let i = 0; i < children.length; i++) {
                const node = children[i];
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
        const m = new Int32Array(children.length + 1);
        // Predecessor indices + 1
        const p = new Int32Array(children.length);
        m[0] = -1;
        let longest = 0;
        for (let i = 0; i < children.length; i++) {
            const current = children[i].claim_order;
            // Find the largest subsequence length such that it ends in a value less than our current value
            // upper_bound returns first greater value, so we subtract one
            // with fast path for when we are on the current longest subsequence
            const seqLen = ((longest > 0 && children[m[longest]].claim_order <= current) ? longest + 1 : upper_bound(1, longest, idx => children[m[idx]].claim_order, current)) - 1;
            p[i] = m[seqLen] + 1;
            const newLen = seqLen + 1;
            // We can guarantee that current is the smallest value. Otherwise, we would have generated a longer sequence.
            m[newLen] = i;
            longest = Math.max(newLen, longest);
        }
        // The longest increasing subsequence of nodes (initially reversed)
        const lis = [];
        // The rest of the nodes, nodes that will be moved
        const toMove = [];
        let last = children.length - 1;
        for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
            lis.push(children[cur - 1]);
            for (; last >= cur; last--) {
                toMove.push(children[last]);
            }
            last--;
        }
        for (; last >= 0; last--) {
            toMove.push(children[last]);
        }
        lis.reverse();
        // We sort the nodes being moved to guarantee that their insertion order matches the claim order
        toMove.sort((a, b) => a.claim_order - b.claim_order);
        // Finally, we move the nodes
        for (let i = 0, j = 0; i < toMove.length; i++) {
            while (j < lis.length && toMove[i].claim_order >= lis[j].claim_order) {
                j++;
            }
            const anchor = j < lis.length ? lis[j] : null;
            target.insertBefore(toMove[i], anchor);
        }
    }
    function append_hydration(target, node) {
        if (is_hydrating) {
            init_hydrate(target);
            if ((target.actual_end_child === undefined) || ((target.actual_end_child !== null) && (target.actual_end_child.parentElement !== target))) {
                target.actual_end_child = target.firstChild;
            }
            // Skip nodes of undefined ordering
            while ((target.actual_end_child !== null) && (target.actual_end_child.claim_order === undefined)) {
                target.actual_end_child = target.actual_end_child.nextSibling;
            }
            if (node !== target.actual_end_child) {
                // We only insert if the ordering of this node should be modified or the parent node is not target
                if (node.claim_order !== undefined || node.parentNode !== target) {
                    target.insertBefore(node, target.actual_end_child);
                }
            }
            else {
                target.actual_end_child = node.nextSibling;
            }
        }
        else if (node.parentNode !== target || node.nextSibling !== null) {
            target.appendChild(node);
        }
    }
    function insert_hydration(target, node, anchor) {
        if (is_hydrating && !anchor) {
            append_hydration(target, node);
        }
        else if (node.parentNode !== target || node.nextSibling != anchor) {
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
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function init_claim_info(nodes) {
        if (nodes.claim_info === undefined) {
            nodes.claim_info = { last_index: 0, total_claimed: 0 };
        }
    }
    function claim_node(nodes, predicate, processNode, createNode, dontUpdateLastIndex = false) {
        // Try to find nodes in an order such that we lengthen the longest increasing subsequence
        init_claim_info(nodes);
        const resultNode = (() => {
            // We first try to find an element after the previous one
            for (let i = nodes.claim_info.last_index; i < nodes.length; i++) {
                const node = nodes[i];
                if (predicate(node)) {
                    const replacement = processNode(node);
                    if (replacement === undefined) {
                        nodes.splice(i, 1);
                    }
                    else {
                        nodes[i] = replacement;
                    }
                    if (!dontUpdateLastIndex) {
                        nodes.claim_info.last_index = i;
                    }
                    return node;
                }
            }
            // Otherwise, we try to find one before
            // We iterate in reverse so that we don't go too far back
            for (let i = nodes.claim_info.last_index - 1; i >= 0; i--) {
                const node = nodes[i];
                if (predicate(node)) {
                    const replacement = processNode(node);
                    if (replacement === undefined) {
                        nodes.splice(i, 1);
                    }
                    else {
                        nodes[i] = replacement;
                    }
                    if (!dontUpdateLastIndex) {
                        nodes.claim_info.last_index = i;
                    }
                    else if (replacement === undefined) {
                        // Since we spliced before the last_index, we decrease it
                        nodes.claim_info.last_index--;
                    }
                    return node;
                }
            }
            // If we can't find any matching node, we create a new one
            return createNode();
        })();
        resultNode.claim_order = nodes.claim_info.total_claimed;
        nodes.claim_info.total_claimed += 1;
        return resultNode;
    }
    function claim_element_base(nodes, name, attributes, create_element) {
        return claim_node(nodes, (node) => node.nodeName === name, (node) => {
            const remove = [];
            for (let j = 0; j < node.attributes.length; j++) {
                const attribute = node.attributes[j];
                if (!attributes[attribute.name]) {
                    remove.push(attribute.name);
                }
            }
            remove.forEach(v => node.removeAttribute(v));
            return undefined;
        }, () => create_element(name));
    }
    function claim_element(nodes, name, attributes) {
        return claim_element_base(nodes, name, attributes, element);
    }
    function claim_svg_element(nodes, name, attributes) {
        return claim_element_base(nodes, name, attributes, svg_element);
    }
    function claim_text(nodes, data) {
        return claim_node(nodes, (node) => node.nodeType === 3, (node) => {
            const dataStr = '' + data;
            if (node.data.startsWith(dataStr)) {
                if (node.data.length !== dataStr.length) {
                    return node.splitText(dataStr.length);
                }
            }
            else {
                node.data = dataStr;
            }
        }, () => text(data), true // Text nodes should not update last index since it is likely not worth it to eliminate an increasing subsequence of actual elements
        );
    }
    function claim_space(nodes) {
        return claim_text(nodes, ' ');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
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
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
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
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
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
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
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
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                start_hydrating();
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            end_hydrating();
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
    }
    function append_hydration_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append_hydration(target, node);
    }
    function insert_hydration_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert_hydration(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\routes\index.svelte generated by Svelte v3.44.1 */

    const { console: console_1 } = globals;
    const file = "src\\routes\\index.svelte";

    // (163:12) {:else}
    function create_else_block_2(ctx) {
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			this.h();
    		},
    		l: function claim(nodes) {
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

    			children(path).forEach(detach_dev);
    			svg_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file, 164, 20, 3662);
    			attr_dev(svg, "id", "closed-lock");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 svelte-fpokw");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			add_location(svg, file, 163, 16, 3485);
    		},
    		m: function mount(target, anchor) {
    			insert_hydration_dev(target, svg, anchor);
    			append_hydration_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler_1*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(163:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (159:12) {#if !styleLock}
    function create_if_block_2(ctx) {
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			this.h();
    		},
    		l: function claim(nodes) {
    			svg = claim_svg_element(nodes, "svg", {
    				xmlns: true,
    				class: true,
    				viewBox: true,
    				fill: true
    			});

    			var svg_nodes = children(svg);
    			path = claim_svg_element(svg_nodes, "path", { d: true });
    			children(path).forEach(detach_dev);
    			svg_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(path, "d", "M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z");
    			add_location(path, file, 160, 20, 3270);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 svelte-fpokw");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			add_location(svg, file, 159, 16, 3110);
    		},
    		m: function mount(target, anchor) {
    			insert_hydration_dev(target, svg, anchor);
    			append_hydration_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(159:12) {#if !styleLock}",
    		ctx
    	});

    	return block;
    }

    // (178:12) {:else}
    function create_else_block_1(ctx) {
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			this.h();
    		},
    		l: function claim(nodes) {
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

    			children(path).forEach(detach_dev);
    			svg_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file, 179, 20, 4571);
    			attr_dev(svg, "id", "closed-lock");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 svelte-fpokw");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			add_location(svg, file, 178, 16, 4394);
    		},
    		m: function mount(target, anchor) {
    			insert_hydration_dev(target, svg, anchor);
    			append_hydration_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler_3*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(178:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (174:12) {#if !themeLock}
    function create_if_block_1(ctx) {
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			this.h();
    		},
    		l: function claim(nodes) {
    			svg = claim_svg_element(nodes, "svg", {
    				xmlns: true,
    				class: true,
    				viewBox: true,
    				fill: true
    			});

    			var svg_nodes = children(svg);
    			path = claim_svg_element(svg_nodes, "path", { d: true });
    			children(path).forEach(detach_dev);
    			svg_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(path, "d", "M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z");
    			add_location(path, file, 175, 20, 4179);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 svelte-fpokw");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			add_location(svg, file, 174, 16, 4019);
    		},
    		m: function mount(target, anchor) {
    			insert_hydration_dev(target, svg, anchor);
    			append_hydration_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler_2*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(174:12) {#if !themeLock}",
    		ctx
    	});

    	return block;
    }

    // (193:12) {:else}
    function create_else_block(ctx) {
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			this.h();
    		},
    		l: function claim(nodes) {
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

    			children(path).forEach(detach_dev);
    			svg_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file, 194, 20, 5488);
    			attr_dev(svg, "id", "closed-lock");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 svelte-fpokw");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			add_location(svg, file, 193, 16, 5311);
    		},
    		m: function mount(target, anchor) {
    			insert_hydration_dev(target, svg, anchor);
    			append_hydration_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler_5*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(193:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (189:12) {#if !genreLock}
    function create_if_block(ctx) {
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			this.h();
    		},
    		l: function claim(nodes) {
    			svg = claim_svg_element(nodes, "svg", {
    				xmlns: true,
    				class: true,
    				viewBox: true,
    				fill: true
    			});

    			var svg_nodes = children(svg);
    			path = claim_svg_element(svg_nodes, "path", { d: true });
    			children(path).forEach(detach_dev);
    			svg_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(path, "d", "M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z");
    			add_location(path, file, 190, 20, 5096);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 svelte-fpokw");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			add_location(svg, file, 189, 16, 4936);
    		},
    		m: function mount(target, anchor) {
    			insert_hydration_dev(target, svg, anchor);
    			append_hydration_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler_4*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(189:12) {#if !genreLock}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t0;
    	let t1;
    	let div4;
    	let div0;
    	let svg;
    	let path;
    	let t2;
    	let div1;
    	let legend0;
    	let t3;
    	let t4;
    	let t5;
    	let h40;
    	let t6;
    	let t7;
    	let div2;
    	let legend1;
    	let t8;
    	let t9;
    	let t10;
    	let h41;
    	let t11;
    	let t12;
    	let div3;
    	let legend2;
    	let t13;
    	let t14;
    	let t15;
    	let h42;
    	let t16;
    	let t17;
    	let button;
    	let t18;
    	let t19;
    	let footer;
    	let div5;
    	let t20;
    	let a;
    	let t21;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (!/*styleLock*/ ctx[3]) return create_if_block_2;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (!/*themeLock*/ ctx[4]) return create_if_block_1;
    		return create_else_block_1;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (!/*genreLock*/ ctx[5]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type_2 = select_block_type_2(ctx);
    	let if_block2 = current_block_type_2(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			t0 = text("Game Idea Generator");
    			t1 = space();
    			div4 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t2 = space();
    			div1 = element("div");
    			legend0 = element("legend");
    			t3 = text("STYLE");
    			t4 = space();
    			if_block0.c();
    			t5 = space();
    			h40 = element("h4");
    			t6 = text(/*style*/ ctx[0]);
    			t7 = space();
    			div2 = element("div");
    			legend1 = element("legend");
    			t8 = text("THEME");
    			t9 = space();
    			if_block1.c();
    			t10 = space();
    			h41 = element("h4");
    			t11 = text(/*theme*/ ctx[1]);
    			t12 = space();
    			div3 = element("div");
    			legend2 = element("legend");
    			t13 = text("GENRE");
    			t14 = space();
    			if_block2.c();
    			t15 = space();
    			h42 = element("h4");
    			t16 = text(/*genre*/ ctx[2]);
    			t17 = space();
    			button = element("button");
    			t18 = text("GENERATE");
    			t19 = space();
    			footer = element("footer");
    			div5 = element("div");
    			t20 = text("Copyright 2021 - ");
    			a = element("a");
    			t21 = text("ignurof.xyz");
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", { class: true });
    			var main_nodes = children(main);
    			h1 = claim_element(main_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, "Game Idea Generator");
    			h1_nodes.forEach(detach_dev);
    			t1 = claim_space(main_nodes);
    			div4 = claim_element(main_nodes, "DIV", { class: true });
    			var div4_nodes = children(div4);
    			div0 = claim_element(div4_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);

    			svg = claim_svg_element(div0_nodes, "svg", {
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

    			children(path).forEach(detach_dev);
    			svg_nodes.forEach(detach_dev);
    			div0_nodes.forEach(detach_dev);
    			t2 = claim_space(div4_nodes);
    			div1 = claim_element(div4_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			legend0 = claim_element(div1_nodes, "LEGEND", { class: true });
    			var legend0_nodes = children(legend0);
    			t3 = claim_text(legend0_nodes, "STYLE");
    			legend0_nodes.forEach(detach_dev);
    			t4 = claim_space(div1_nodes);
    			if_block0.l(div1_nodes);
    			div1_nodes.forEach(detach_dev);
    			t5 = claim_space(div4_nodes);
    			h40 = claim_element(div4_nodes, "H4", { class: true });
    			var h40_nodes = children(h40);
    			t6 = claim_text(h40_nodes, /*style*/ ctx[0]);
    			h40_nodes.forEach(detach_dev);
    			t7 = claim_space(div4_nodes);
    			div2 = claim_element(div4_nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			legend1 = claim_element(div2_nodes, "LEGEND", { class: true });
    			var legend1_nodes = children(legend1);
    			t8 = claim_text(legend1_nodes, "THEME");
    			legend1_nodes.forEach(detach_dev);
    			t9 = claim_space(div2_nodes);
    			if_block1.l(div2_nodes);
    			div2_nodes.forEach(detach_dev);
    			t10 = claim_space(div4_nodes);
    			h41 = claim_element(div4_nodes, "H4", { class: true });
    			var h41_nodes = children(h41);
    			t11 = claim_text(h41_nodes, /*theme*/ ctx[1]);
    			h41_nodes.forEach(detach_dev);
    			t12 = claim_space(div4_nodes);
    			div3 = claim_element(div4_nodes, "DIV", { class: true });
    			var div3_nodes = children(div3);
    			legend2 = claim_element(div3_nodes, "LEGEND", { class: true });
    			var legend2_nodes = children(legend2);
    			t13 = claim_text(legend2_nodes, "GENRE");
    			legend2_nodes.forEach(detach_dev);
    			t14 = claim_space(div3_nodes);
    			if_block2.l(div3_nodes);
    			div3_nodes.forEach(detach_dev);
    			t15 = claim_space(div4_nodes);
    			h42 = claim_element(div4_nodes, "H4", { class: true });
    			var h42_nodes = children(h42);
    			t16 = claim_text(h42_nodes, /*genre*/ ctx[2]);
    			h42_nodes.forEach(detach_dev);
    			t17 = claim_space(div4_nodes);
    			button = claim_element(div4_nodes, "BUTTON", { class: true });
    			var button_nodes = children(button);
    			t18 = claim_text(button_nodes, "GENERATE");
    			button_nodes.forEach(detach_dev);
    			div4_nodes.forEach(detach_dev);
    			t19 = claim_space(main_nodes);
    			footer = claim_element(main_nodes, "FOOTER", { class: true });
    			var footer_nodes = children(footer);
    			div5 = claim_element(footer_nodes, "DIV", { class: true });
    			var div5_nodes = children(div5);
    			t20 = claim_text(div5_nodes, "Copyright 2021 - ");
    			a = claim_element(div5_nodes, "A", { href: true, target: true, class: true });
    			var a_nodes = children(a);
    			t21 = claim_text(a_nodes, "ignurof.xyz");
    			a_nodes.forEach(detach_dev);
    			div5_nodes.forEach(detach_dev);
    			footer_nodes.forEach(detach_dev);
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "svelte-fpokw");
    			add_location(h1, file, 147, 4, 2580);
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file, 152, 16, 2795);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 svelte-fpokw");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			add_location(svg, file, 151, 12, 2681);
    			attr_dev(div0, "class", "play-icon svelte-fpokw");
    			add_location(div0, file, 150, 8, 2644);
    			attr_dev(legend0, "class", "svelte-fpokw");
    			add_location(legend0, file, 157, 12, 3040);
    			attr_dev(div1, "class", "field svelte-fpokw");
    			add_location(div1, file, 156, 8, 3007);
    			attr_dev(h40, "class", "svelte-fpokw");
    			add_location(h40, file, 169, 8, 3888);
    			attr_dev(legend1, "class", "svelte-fpokw");
    			add_location(legend1, file, 172, 12, 3949);
    			attr_dev(div2, "class", "field svelte-fpokw");
    			add_location(div2, file, 171, 8, 3916);
    			attr_dev(h41, "class", "svelte-fpokw");
    			add_location(h41, file, 184, 8, 4797);
    			attr_dev(legend2, "class", "svelte-fpokw");
    			add_location(legend2, file, 187, 12, 4866);
    			attr_dev(div3, "class", "field svelte-fpokw");
    			add_location(div3, file, 186, 8, 4833);
    			attr_dev(h42, "class", "svelte-fpokw");
    			add_location(h42, file, 199, 8, 5714);
    			attr_dev(button, "class", "svelte-fpokw");
    			add_location(button, file, 201, 8, 5754);
    			attr_dev(div4, "class", "card svelte-fpokw");
    			add_location(div4, file, 149, 4, 2616);
    			attr_dev(a, "href", "https://ignurof.xyz");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-fpokw");
    			add_location(a, file, 208, 29, 5909);
    			attr_dev(div5, "class", "credits svelte-fpokw");
    			add_location(div5, file, 207, 8, 5857);
    			attr_dev(footer, "class", "svelte-fpokw");
    			add_location(footer, file, 206, 4, 5839);
    			attr_dev(main, "class", "svelte-fpokw");
    			add_location(main, file, 146, 0, 2568);
    		},
    		m: function mount(target, anchor) {
    			insert_hydration_dev(target, main, anchor);
    			append_hydration_dev(main, h1);
    			append_hydration_dev(h1, t0);
    			append_hydration_dev(main, t1);
    			append_hydration_dev(main, div4);
    			append_hydration_dev(div4, div0);
    			append_hydration_dev(div0, svg);
    			append_hydration_dev(svg, path);
    			append_hydration_dev(div4, t2);
    			append_hydration_dev(div4, div1);
    			append_hydration_dev(div1, legend0);
    			append_hydration_dev(legend0, t3);
    			append_hydration_dev(div1, t4);
    			if_block0.m(div1, null);
    			append_hydration_dev(div4, t5);
    			append_hydration_dev(div4, h40);
    			append_hydration_dev(h40, t6);
    			append_hydration_dev(div4, t7);
    			append_hydration_dev(div4, div2);
    			append_hydration_dev(div2, legend1);
    			append_hydration_dev(legend1, t8);
    			append_hydration_dev(div2, t9);
    			if_block1.m(div2, null);
    			append_hydration_dev(div4, t10);
    			append_hydration_dev(div4, h41);
    			append_hydration_dev(h41, t11);
    			append_hydration_dev(div4, t12);
    			append_hydration_dev(div4, div3);
    			append_hydration_dev(div3, legend2);
    			append_hydration_dev(legend2, t13);
    			append_hydration_dev(div3, t14);
    			if_block2.m(div3, null);
    			append_hydration_dev(div4, t15);
    			append_hydration_dev(div4, h42);
    			append_hydration_dev(h42, t16);
    			append_hydration_dev(div4, t17);
    			append_hydration_dev(div4, button);
    			append_hydration_dev(button, t18);
    			append_hydration_dev(main, t19);
    			append_hydration_dev(main, footer);
    			append_hydration_dev(footer, div5);
    			append_hydration_dev(div5, t20);
    			append_hydration_dev(div5, a);
    			append_hydration_dev(a, t21);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_6*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, null);
    				}
    			}

    			if (dirty & /*style*/ 1) set_data_dev(t6, /*style*/ ctx[0]);

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			}

    			if (dirty & /*theme*/ 2) set_data_dev(t11, /*theme*/ ctx[1]);

    			if (current_block_type_2 === (current_block_type_2 = select_block_type_2(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type_2(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div3, null);
    				}
    			}

    			if (dirty & /*genre*/ 4) set_data_dev(t16, /*genre*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block0.d();
    			if_block1.d();
    			if_block2.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Routes', slots, []);
    	let style = "";
    	let theme = "";
    	let genre = "";
    	let styleLock = false;
    	let themeLock = false;
    	let genreLock = false;

    	// Request idea object from backend
    	const FetchNewIdea = async () => {
    		let response = await fetch("/generate");
    		if (!response.ok) return console.error("Something went wrong with generate request!");
    		let result = await response.json();
    		if (!styleLock) $$invalidate(0, style = result.style);
    		if (!themeLock) $$invalidate(1, theme = result.theme);
    		if (!genreLock) $$invalidate(2, genre = result.genre);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Routes> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(3, styleLock = !styleLock);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(3, styleLock = !styleLock);
    	};

    	const click_handler_2 = () => {
    		$$invalidate(4, themeLock = !themeLock);
    	};

    	const click_handler_3 = () => {
    		$$invalidate(4, themeLock = !themeLock);
    	};

    	const click_handler_4 = () => {
    		$$invalidate(5, genreLock = !genreLock);
    	};

    	const click_handler_5 = () => {
    		$$invalidate(5, genreLock = !genreLock);
    	};

    	const click_handler_6 = () => FetchNewIdea();

    	$$self.$capture_state = () => ({
    		style,
    		theme,
    		genre,
    		styleLock,
    		themeLock,
    		genreLock,
    		FetchNewIdea
    	});

    	$$self.$inject_state = $$props => {
    		if ('style' in $$props) $$invalidate(0, style = $$props.style);
    		if ('theme' in $$props) $$invalidate(1, theme = $$props.theme);
    		if ('genre' in $$props) $$invalidate(2, genre = $$props.genre);
    		if ('styleLock' in $$props) $$invalidate(3, styleLock = $$props.styleLock);
    		if ('themeLock' in $$props) $$invalidate(4, themeLock = $$props.themeLock);
    		if ('genreLock' in $$props) $$invalidate(5, genreLock = $$props.genreLock);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		style,
    		theme,
    		genre,
    		styleLock,
    		themeLock,
    		genreLock,
    		FetchNewIdea,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6
    	];
    }

    class Routes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Routes",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    return Routes;

})();
