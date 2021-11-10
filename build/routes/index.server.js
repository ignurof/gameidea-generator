'use strict';

function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
Promise.resolve();
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots, context) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(context || (parent_component ? parent_component.$$.context : [])),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, $$slots, context);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}

/* src\routes\index.svelte generated by Svelte v3.44.1 */

const css = {
	code: "main.svelte-1nzdlje{color:#f2f4f7;text-align:center;font-size:16px}h1.svelte-1nzdlje{color:#facb49;text-shadow:0px 4px 4px #7c2323;margin-top:4em}.card.svelte-1nzdlje{color:#141414;margin-top:6em;margin-left:auto;margin-right:auto;border:0;border-radius:0.6em;background:#f0f0f0;width:18em;box-shadow:2px 8px 4px rgba(0, 0, 0, 0.24), -2px 8px 4px rgba(0, 0, 0, 0.24);padding-top:1em;padding-bottom:1em}legend.svelte-1nzdlje{color:#655f68;font-size:1em;font-family:Impact, Haettenschweiler, \"Arial Narrow Bold\", sans-serif}h4.svelte-1nzdlje{margin:0;margin-top:0.4em;margin-bottom:1.6em;font-size:1.4em;font-family:\"Gill Sans\", \"Gill Sans MT\", Calibri, \"Trebuchet MS\", sans-serif;text-shadow:2px 4px 4px #b8b8b8}",
	map: "{\"version\":3,\"file\":\"index.svelte\",\"sources\":[\"index.svelte\"],\"sourcesContent\":[\"<script>\\r\\n    export let gameIdeaObj;\\r\\n\\r\\n    let style = gameIdeaObj.style;\\r\\n    let theme = gameIdeaObj.theme;\\r\\n    let genre = gameIdeaObj.genre;\\r\\n</script>\\r\\n\\r\\n<style>main {\\n  color: #f2f4f7;\\n  text-align: center;\\n  font-size: 16px;\\n}\\n\\nh1 {\\n  color: #facb49;\\n  text-shadow: 0px 4px 4px #7c2323;\\n  margin-top: 4em;\\n}\\n\\n.card {\\n  color: #141414;\\n  margin-top: 6em;\\n  margin-left: auto;\\n  margin-right: auto;\\n  border: 0;\\n  border-radius: 0.6em;\\n  background: #f0f0f0;\\n  width: 18em;\\n  box-shadow: 2px 8px 4px rgba(0, 0, 0, 0.24), -2px 8px 4px rgba(0, 0, 0, 0.24);\\n  padding-top: 1em;\\n  padding-bottom: 1em;\\n}\\n\\nlegend {\\n  color: #655f68;\\n  font-size: 1em;\\n  font-family: Impact, Haettenschweiler, \\\"Arial Narrow Bold\\\", sans-serif;\\n}\\n\\nh4 {\\n  margin: 0;\\n  margin-top: 0.4em;\\n  margin-bottom: 1.6em;\\n  font-size: 1.4em;\\n  font-family: \\\"Gill Sans\\\", \\\"Gill Sans MT\\\", Calibri, \\\"Trebuchet MS\\\", sans-serif;\\n  text-shadow: 2px 4px 4px #b8b8b8;\\n}</style>\\r\\n\\r\\n<main>\\r\\n    <h1>Game Idea Generator</h1>\\r\\n\\r\\n    <div class=\\\"card\\\">\\r\\n        <legend>STYLE</legend>\\r\\n        <h4>{style}</h4>\\r\\n        <legend>THEME</legend>\\r\\n        <h4>{theme}</h4>\\r\\n        <legend>GENRE</legend>\\r\\n        <h4>{genre}</h4>\\r\\n    </div>\\r\\n</main>\\r\\n\"],\"names\":[],\"mappings\":\"AAQO,IAAI,eAAC,CAAC,AACX,KAAK,CAAE,OAAO,CACd,UAAU,CAAE,MAAM,CAClB,SAAS,CAAE,IAAI,AACjB,CAAC,AAED,EAAE,eAAC,CAAC,AACF,KAAK,CAAE,OAAO,CACd,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,OAAO,CAChC,UAAU,CAAE,GAAG,AACjB,CAAC,AAED,KAAK,eAAC,CAAC,AACL,KAAK,CAAE,OAAO,CACd,UAAU,CAAE,GAAG,CACf,WAAW,CAAE,IAAI,CACjB,YAAY,CAAE,IAAI,CAClB,MAAM,CAAE,CAAC,CACT,aAAa,CAAE,KAAK,CACpB,UAAU,CAAE,OAAO,CACnB,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAC7E,WAAW,CAAE,GAAG,CAChB,cAAc,CAAE,GAAG,AACrB,CAAC,AAED,MAAM,eAAC,CAAC,AACN,KAAK,CAAE,OAAO,CACd,SAAS,CAAE,GAAG,CACd,WAAW,CAAE,MAAM,CAAC,CAAC,gBAAgB,CAAC,CAAC,mBAAmB,CAAC,CAAC,UAAU,AACxE,CAAC,AAED,EAAE,eAAC,CAAC,AACF,MAAM,CAAE,CAAC,CACT,UAAU,CAAE,KAAK,CACjB,aAAa,CAAE,KAAK,CACpB,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,WAAW,CAAC,CAAC,cAAc,CAAC,CAAC,OAAO,CAAC,CAAC,cAAc,CAAC,CAAC,UAAU,CAC7E,WAAW,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,OAAO,AAClC,CAAC\"}"
};

const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { gameIdeaObj } = $$props;
	let style = gameIdeaObj.style;
	let theme = gameIdeaObj.theme;
	let genre = gameIdeaObj.genre;
	if ($$props.gameIdeaObj === void 0 && $$bindings.gameIdeaObj && gameIdeaObj !== void 0) $$bindings.gameIdeaObj(gameIdeaObj);
	$$result.css.add(css);

	return `<main class="${"svelte-1nzdlje"}"><h1 class="${"svelte-1nzdlje"}">Game Idea Generator</h1>

    <div class="${"card svelte-1nzdlje"}"><legend class="${"svelte-1nzdlje"}">STYLE</legend>
        <h4 class="${"svelte-1nzdlje"}">${escape(style)}</h4>
        <legend class="${"svelte-1nzdlje"}">THEME</legend>
        <h4 class="${"svelte-1nzdlje"}">${escape(theme)}</h4>
        <legend class="${"svelte-1nzdlje"}">GENRE</legend>
        <h4 class="${"svelte-1nzdlje"}">${escape(genre)}</h4></div></main>`;
});

module.exports = Routes;
