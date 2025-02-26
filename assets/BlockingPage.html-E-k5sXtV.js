import{_ as n}from"./blocking_page-f9H9atCu.js";import{_ as s}from"./plugin-vue_export-helper-x3n3nnut.js";import{o as a,c as t,e as p}from"./app-D4ZPgae6.js";const e={},o=p('<h1 id="custom-blocking-response-page" tabindex="-1"><a class="header-anchor" href="#custom-blocking-response-page" aria-hidden="true">#</a> Custom BlockIng Response Page</h1><h2 id="_1-custom-blocking-response-page" tabindex="-1"><a class="header-anchor" href="#_1-custom-blocking-response-page" aria-hidden="true">#</a> 1 Custom BlockIng Response Page</h2><h3 id="_1-1-custom-blocking-response-page" tabindex="-1"><a class="header-anchor" href="#_1-1-custom-blocking-response-page" aria-hidden="true">#</a> 1.1 Custom BlockIng Response Page</h3><figure><img src="'+n+`" alt="Custom BlockIng Response Page" tabindex="0" loading="lazy"><figcaption>Custom BlockIng Response Page</figcaption></figure><ul><li><p><strong>Custom BlockIng Response Page Name</strong>: Used for identification.</p></li><li><p><strong>Website</strong>: Normally, select the global website. However, if each website needs a specific response, choose the specific website.</p></li><li><p><strong>Response Code</strong>: Default is 403, but you can edit it based on your requirements.</p></li><li><p><strong>Response Content</strong>: The content that is returned to the visitor. Supports variables:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Visit ID:  
[[.SAMWAF_REQ_UUID]]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>Response Header Information</strong></p><table><thead><tr><th>Key Name</th><th>Description</th><th>Example Value</th></tr></thead><tbody><tr><td><code>Content-Type</code></td><td>Specifies the type of the returned content.</td><td><code>text/html; charset=UTF-8</code>, <code>text/json; charset=UTF-8</code></td></tr></tbody></table></li></ul><h3 id="_1-2-html-example" tabindex="-1"><a class="header-anchor" href="#_1-2-html-example" aria-hidden="true">#</a> 1.2 HTML Example</h3><p>If you are using regular HTML, set the <code>Content-Type</code> to: <code>text/html; charset=UTF-8</code>.</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>zh-CN<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>UTF-8<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>viewport<span class="token punctuation">&quot;</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>width=device-width, initial-scale=1.0<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">&gt;</span></span>Your Access is Blocked<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span><span class="token punctuation">&gt;</span></span><span class="token style"><span class="token language-css">
        <span class="token comment">/* Basic Styles */</span>
        <span class="token selector">body</span> <span class="token punctuation">{</span>
            <span class="token property">font-family</span><span class="token punctuation">:</span> <span class="token string">&#39;Arial&#39;</span><span class="token punctuation">,</span> sans-serif<span class="token punctuation">;</span>
            <span class="token property">background-color</span><span class="token punctuation">:</span> #f4f7fa<span class="token punctuation">;</span>
            <span class="token property">margin</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
            <span class="token property">padding</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
            <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>
            <span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
            <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
            <span class="token property">height</span><span class="token punctuation">:</span> 100vh<span class="token punctuation">;</span>
            <span class="token property">color</span><span class="token punctuation">:</span> #333<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">/* Page Content Container */</span>
        <span class="token selector">.container</span> <span class="token punctuation">{</span>
            <span class="token property">background-color</span><span class="token punctuation">:</span> #ffffff<span class="token punctuation">;</span>
            <span class="token property">border-radius</span><span class="token punctuation">:</span> 8px<span class="token punctuation">;</span>
            <span class="token property">padding</span><span class="token punctuation">:</span> 40px<span class="token punctuation">;</span>
            <span class="token property">box-shadow</span><span class="token punctuation">:</span> 0 4px 8px <span class="token function">rgba</span><span class="token punctuation">(</span>0<span class="token punctuation">,</span> 0<span class="token punctuation">,</span> 0<span class="token punctuation">,</span> 0.1<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token property">text-align</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
            <span class="token property">max-width</span><span class="token punctuation">:</span> 600px<span class="token punctuation">;</span>
            <span class="token property">width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">/* Title Style */</span>
        <span class="token selector">h1</span> <span class="token punctuation">{</span>
            <span class="token property">font-size</span><span class="token punctuation">:</span> 2.5em<span class="token punctuation">;</span>
            <span class="token property">color</span><span class="token punctuation">:</span> #d9534f<span class="token punctuation">;</span>
            <span class="token property">margin</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">/* Visit ID Style */</span>
        <span class="token selector">h3</span> <span class="token punctuation">{</span>
            <span class="token property">font-size</span><span class="token punctuation">:</span> 1.5em<span class="token punctuation">;</span>
            <span class="token property">color</span><span class="token punctuation">:</span> #5bc0de<span class="token punctuation">;</span>
            <span class="token property">margin</span><span class="token punctuation">:</span> 20px 0<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">/* Message Style */</span>
        <span class="token selector">.message</span> <span class="token punctuation">{</span>
            <span class="token property">font-size</span><span class="token punctuation">:</span> 1.1em<span class="token punctuation">;</span>
            <span class="token property">color</span><span class="token punctuation">:</span> #999<span class="token punctuation">;</span>
            <span class="token property">margin-bottom</span><span class="token punctuation">:</span> 30px<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">/* Back to Home Button Style */</span>
        <span class="token selector">.back-btn</span> <span class="token punctuation">{</span>
            <span class="token property">background-color</span><span class="token punctuation">:</span> #5cb85c<span class="token punctuation">;</span>
            <span class="token property">color</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span>
            <span class="token property">border</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>
            <span class="token property">padding</span><span class="token punctuation">:</span> 10px 20px<span class="token punctuation">;</span>
            <span class="token property">border-radius</span><span class="token punctuation">:</span> 5px<span class="token punctuation">;</span>
            <span class="token property">text-decoration</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>
            <span class="token property">font-size</span><span class="token punctuation">:</span> 1.1em<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token selector">.back-btn:hover</span> <span class="token punctuation">{</span>
            <span class="token property">background-color</span><span class="token punctuation">:</span> #4cae4c<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token selector">.back-btn:active</span> <span class="token punctuation">{</span>
            <span class="token property">background-color</span><span class="token punctuation">:</span> #398439<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">/* Responsive Design */</span>
        <span class="token atrule"><span class="token rule">@media</span> <span class="token punctuation">(</span><span class="token property">max-width</span><span class="token punctuation">:</span> 768px<span class="token punctuation">)</span></span> <span class="token punctuation">{</span>
            <span class="token selector">.container</span> <span class="token punctuation">{</span>
                <span class="token property">padding</span><span class="token punctuation">:</span> 30px<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>

            <span class="token selector">h1</span> <span class="token punctuation">{</span>
                <span class="token property">font-size</span><span class="token punctuation">:</span> 2em<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>

            <span class="token selector">h3</span> <span class="token punctuation">{</span>
                <span class="token property">font-size</span><span class="token punctuation">:</span> 1.3em<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>

            <span class="token selector">.message</span> <span class="token punctuation">{</span>
                <span class="token property">font-size</span><span class="token punctuation">:</span> 1em<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    </span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>container<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">&gt;</span></span>Your Access is Blocked<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>message<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Your request was blocked due to security policies.<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">&gt;</span></span>If you have any questions, please send the visit ID below to the administrator for further investigation.<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h3</span><span class="token punctuation">&gt;</span></span>Visit ID: [[.SAMWAF_REQ_UUID]]<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h3</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-json-example" tabindex="-1"><a class="header-anchor" href="#_1-3-json-example" aria-hidden="true">#</a> 1.3 JSON Example</h3><p>If you want to use JSON for API interfaces, set the <code>Content-Type</code> to: <code>text/json; charset=UTF-8</code>.</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span><span class="token property">&quot;samwaf_req_uuid&quot;</span><span class="token operator">:</span><span class="token string">&quot;[[.SAMWAF_REQ_UUID]]&quot;</span><span class="token punctuation">,</span><span class="token property">&quot;msg&quot;</span><span class="token operator">:</span><span class="token string">&quot;Access Blocked&quot;</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,11),c=[o];function l(i,u){return a(),t("div",null,c)}const v=s(e,[["render",l],["__file","BlockingPage.html.vue"]]);export{v as default};
