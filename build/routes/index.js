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

    // (145:12) {:else}
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
    			add_location(path, file, 146, 20, 3226);
    			attr_dev(svg, "id", "closed-lock");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 svelte-196vt1c");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			add_location(svg, file, 145, 16, 3049);
    		},
    		m: function mount(target, anchor) {
    			insert_hydration_dev(target, svg, anchor);
    			append_hydration_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler_1*/ ctx[9], false, false, false);
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
    		source: "(145:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (141:12) {#if !styleLock}
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
    			add_location(path, file, 142, 20, 2834);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 svelte-196vt1c");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			add_location(svg, file, 141, 16, 2674);
    		},
    		m: function mount(target, anchor) {
    			insert_hydration_dev(target, svg, anchor);
    			append_hydration_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[8], false, false, false);
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
    		source: "(141:12) {#if !styleLock}",
    		ctx
    	});

    	return block;
    }

    // (160:12) {:else}
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
    			add_location(path, file, 161, 20, 4135);
    			attr_dev(svg, "id", "closed-lock");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 svelte-196vt1c");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			add_location(svg, file, 160, 16, 3958);
    		},
    		m: function mount(target, anchor) {
    			insert_hydration_dev(target, svg, anchor);
    			append_hydration_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler_3*/ ctx[11], false, false, false);
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
    		source: "(160:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (156:12) {#if !themeLock}
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
    			add_location(path, file, 157, 20, 3743);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 svelte-196vt1c");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			add_location(svg, file, 156, 16, 3583);
    		},
    		m: function mount(target, anchor) {
    			insert_hydration_dev(target, svg, anchor);
    			append_hydration_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler_2*/ ctx[10], false, false, false);
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
    		source: "(156:12) {#if !themeLock}",
    		ctx
    	});

    	return block;
    }

    // (175:12) {:else}
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
    			add_location(path, file, 176, 20, 5052);
    			attr_dev(svg, "id", "closed-lock");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 svelte-196vt1c");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			add_location(svg, file, 175, 16, 4875);
    		},
    		m: function mount(target, anchor) {
    			insert_hydration_dev(target, svg, anchor);
    			append_hydration_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler_5*/ ctx[13], false, false, false);
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
    		source: "(175:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (171:12) {#if !genreLock}
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
    			add_location(path, file, 172, 20, 4660);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5 svelte-196vt1c");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			add_location(svg, file, 171, 16, 4500);
    		},
    		m: function mount(target, anchor) {
    			insert_hydration_dev(target, svg, anchor);
    			append_hydration_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler_4*/ ctx[12], false, false, false);
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
    		source: "(171:12) {#if !genreLock}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t0;
    	let t1;
    	let div3;
    	let div0;
    	let legend0;
    	let t2;
    	let t3;
    	let t4;
    	let h40;
    	let t5;
    	let t6;
    	let div1;
    	let legend1;
    	let t7;
    	let t8;
    	let t9;
    	let h41;
    	let t10;
    	let t11;
    	let div2;
    	let legend2;
    	let t12;
    	let t13;
    	let t14;
    	let h42;
    	let t15;
    	let t16;
    	let button;
    	let t17;
    	let t18;
    	let footer;
    	let div4;
    	let t19;
    	let a;
    	let t20;
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
    			div3 = element("div");
    			div0 = element("div");
    			legend0 = element("legend");
    			t2 = text("STYLE");
    			t3 = space();
    			if_block0.c();
    			t4 = space();
    			h40 = element("h4");
    			t5 = text(/*style*/ ctx[0]);
    			t6 = space();
    			div1 = element("div");
    			legend1 = element("legend");
    			t7 = text("THEME");
    			t8 = space();
    			if_block1.c();
    			t9 = space();
    			h41 = element("h4");
    			t10 = text(/*theme*/ ctx[1]);
    			t11 = space();
    			div2 = element("div");
    			legend2 = element("legend");
    			t12 = text("GENRE");
    			t13 = space();
    			if_block2.c();
    			t14 = space();
    			h42 = element("h4");
    			t15 = text(/*genre*/ ctx[2]);
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
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", { class: true });
    			var main_nodes = children(main);
    			h1 = claim_element(main_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, "Game Idea Generator");
    			h1_nodes.forEach(detach_dev);
    			t1 = claim_space(main_nodes);
    			div3 = claim_element(main_nodes, "DIV", { class: true });
    			var div3_nodes = children(div3);
    			div0 = claim_element(div3_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			legend0 = claim_element(div0_nodes, "LEGEND", { class: true });
    			var legend0_nodes = children(legend0);
    			t2 = claim_text(legend0_nodes, "STYLE");
    			legend0_nodes.forEach(detach_dev);
    			t3 = claim_space(div0_nodes);
    			if_block0.l(div0_nodes);
    			div0_nodes.forEach(detach_dev);
    			t4 = claim_space(div3_nodes);
    			h40 = claim_element(div3_nodes, "H4", { class: true });
    			var h40_nodes = children(h40);
    			t5 = claim_text(h40_nodes, /*style*/ ctx[0]);
    			h40_nodes.forEach(detach_dev);
    			t6 = claim_space(div3_nodes);
    			div1 = claim_element(div3_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			legend1 = claim_element(div1_nodes, "LEGEND", { class: true });
    			var legend1_nodes = children(legend1);
    			t7 = claim_text(legend1_nodes, "THEME");
    			legend1_nodes.forEach(detach_dev);
    			t8 = claim_space(div1_nodes);
    			if_block1.l(div1_nodes);
    			div1_nodes.forEach(detach_dev);
    			t9 = claim_space(div3_nodes);
    			h41 = claim_element(div3_nodes, "H4", { class: true });
    			var h41_nodes = children(h41);
    			t10 = claim_text(h41_nodes, /*theme*/ ctx[1]);
    			h41_nodes.forEach(detach_dev);
    			t11 = claim_space(div3_nodes);
    			div2 = claim_element(div3_nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			legend2 = claim_element(div2_nodes, "LEGEND", { class: true });
    			var legend2_nodes = children(legend2);
    			t12 = claim_text(legend2_nodes, "GENRE");
    			legend2_nodes.forEach(detach_dev);
    			t13 = claim_space(div2_nodes);
    			if_block2.l(div2_nodes);
    			div2_nodes.forEach(detach_dev);
    			t14 = claim_space(div3_nodes);
    			h42 = claim_element(div3_nodes, "H4", { class: true });
    			var h42_nodes = children(h42);
    			t15 = claim_text(h42_nodes, /*genre*/ ctx[2]);
    			h42_nodes.forEach(detach_dev);
    			div3_nodes.forEach(detach_dev);
    			t16 = claim_space(main_nodes);
    			button = claim_element(main_nodes, "BUTTON", { class: true });
    			var button_nodes = children(button);
    			t17 = claim_text(button_nodes, "GENERATE");
    			button_nodes.forEach(detach_dev);
    			t18 = claim_space(main_nodes);
    			footer = claim_element(main_nodes, "FOOTER", { class: true });
    			var footer_nodes = children(footer);
    			div4 = claim_element(footer_nodes, "DIV", { class: true });
    			var div4_nodes = children(div4);
    			t19 = claim_text(div4_nodes, "Copyright 2021 - ");
    			a = claim_element(div4_nodes, "A", { href: true, target: true, class: true });
    			var a_nodes = children(a);
    			t20 = claim_text(a_nodes, "ignurof.xyz");
    			a_nodes.forEach(detach_dev);
    			div4_nodes.forEach(detach_dev);
    			footer_nodes.forEach(detach_dev);
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "svelte-196vt1c");
    			add_location(h1, file, 134, 4, 2505);
    			attr_dev(legend0, "class", "svelte-196vt1c");
    			add_location(legend0, file, 139, 12, 2604);
    			attr_dev(div0, "class", "field svelte-196vt1c");
    			add_location(div0, file, 138, 8, 2571);
    			attr_dev(h40, "class", "svelte-196vt1c");
    			add_location(h40, file, 151, 8, 3452);
    			attr_dev(legend1, "class", "svelte-196vt1c");
    			add_location(legend1, file, 154, 12, 3513);
    			attr_dev(div1, "class", "field svelte-196vt1c");
    			add_location(div1, file, 153, 8, 3480);
    			attr_dev(h41, "class", "svelte-196vt1c");
    			add_location(h41, file, 166, 8, 4361);
    			attr_dev(legend2, "class", "svelte-196vt1c");
    			add_location(legend2, file, 169, 12, 4430);
    			attr_dev(div2, "class", "field svelte-196vt1c");
    			add_location(div2, file, 168, 8, 4397);
    			attr_dev(h42, "class", "svelte-196vt1c");
    			add_location(h42, file, 181, 8, 5278);
    			attr_dev(div3, "class", "card svelte-196vt1c");
    			add_location(div3, file, 136, 4, 2541);
    			attr_dev(button, "class", "svelte-196vt1c");
    			add_location(button, file, 185, 4, 5328);
    			attr_dev(a, "href", "ignurof.xyz");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-196vt1c");
    			add_location(a, file, 189, 29, 5463);
    			attr_dev(div4, "class", "credits svelte-196vt1c");
    			add_location(div4, file, 188, 8, 5411);
    			attr_dev(footer, "class", "svelte-196vt1c");
    			add_location(footer, file, 187, 4, 5393);
    			attr_dev(main, "class", "svelte-196vt1c");
    			add_location(main, file, 133, 0, 2493);
    		},
    		m: function mount(target, anchor) {
    			insert_hydration_dev(target, main, anchor);
    			append_hydration_dev(main, h1);
    			append_hydration_dev(h1, t0);
    			append_hydration_dev(main, t1);
    			append_hydration_dev(main, div3);
    			append_hydration_dev(div3, div0);
    			append_hydration_dev(div0, legend0);
    			append_hydration_dev(legend0, t2);
    			append_hydration_dev(div0, t3);
    			if_block0.m(div0, null);
    			append_hydration_dev(div3, t4);
    			append_hydration_dev(div3, h40);
    			append_hydration_dev(h40, t5);
    			append_hydration_dev(div3, t6);
    			append_hydration_dev(div3, div1);
    			append_hydration_dev(div1, legend1);
    			append_hydration_dev(legend1, t7);
    			append_hydration_dev(div1, t8);
    			if_block1.m(div1, null);
    			append_hydration_dev(div3, t9);
    			append_hydration_dev(div3, h41);
    			append_hydration_dev(h41, t10);
    			append_hydration_dev(div3, t11);
    			append_hydration_dev(div3, div2);
    			append_hydration_dev(div2, legend2);
    			append_hydration_dev(legend2, t12);
    			append_hydration_dev(div2, t13);
    			if_block2.m(div2, null);
    			append_hydration_dev(div3, t14);
    			append_hydration_dev(div3, h42);
    			append_hydration_dev(h42, t15);
    			append_hydration_dev(main, t16);
    			append_hydration_dev(main, button);
    			append_hydration_dev(button, t17);
    			append_hydration_dev(main, t18);
    			append_hydration_dev(main, footer);
    			append_hydration_dev(footer, div4);
    			append_hydration_dev(div4, t19);
    			append_hydration_dev(div4, a);
    			append_hydration_dev(a, t20);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_6*/ ctx[14], false, false, false);
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
    					if_block0.m(div0, null);
    				}
    			}

    			if (dirty & /*style*/ 1) set_data_dev(t5, /*style*/ ctx[0]);

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

    			if (dirty & /*theme*/ 2) set_data_dev(t10, /*theme*/ ctx[1]);

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

    			if (dirty & /*genre*/ 4) set_data_dev(t15, /*genre*/ ctx[2]);
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
    	let { gameIdeaObj } = $$props;
    	let style = gameIdeaObj.style;
    	let theme = gameIdeaObj.theme;
    	let genre = gameIdeaObj.genre;
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

    	const writable_props = ['gameIdeaObj'];

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

    	$$self.$$set = $$props => {
    		if ('gameIdeaObj' in $$props) $$invalidate(7, gameIdeaObj = $$props.gameIdeaObj);
    	};

    	$$self.$capture_state = () => ({
    		gameIdeaObj,
    		style,
    		theme,
    		genre,
    		styleLock,
    		themeLock,
    		genreLock,
    		FetchNewIdea
    	});

    	$$self.$inject_state = $$props => {
    		if ('gameIdeaObj' in $$props) $$invalidate(7, gameIdeaObj = $$props.gameIdeaObj);
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
    		gameIdeaObj,
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
    		init(this, options, instance, create_fragment, safe_not_equal, { gameIdeaObj: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Routes",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*gameIdeaObj*/ ctx[7] === undefined && !('gameIdeaObj' in props)) {
    			console_1.warn("<Routes> was created without expected prop 'gameIdeaObj'");
    		}
    	}

    	get gameIdeaObj() {
    		throw new Error("<Routes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gameIdeaObj(value) {
    		throw new Error("<Routes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    return Routes;

})();
