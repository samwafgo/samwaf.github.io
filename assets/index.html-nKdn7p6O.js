import{_ as i}from"./plugin-vue_export-helper-x3n3nnut.js";import{r as d,o,c as l,a as e,d as a,b as t,e as n}from"./app-V-pi8dPd.js";const r={},c=n('<h1 id="development-manual" tabindex="-1"><a class="header-anchor" href="#development-manual" aria-hidden="true">#</a> Development Manual</h1><h2 id="development-environment" tabindex="-1"><a class="header-anchor" href="#development-environment" aria-hidden="true">#</a> Development Environment</h2><h3 id="backend" tabindex="-1"><a class="header-anchor" href="#backend" aria-hidden="true">#</a> Backend</h3><ul><li>Go version: 1.22.9</li></ul><h3 id="frontend" tabindex="-1"><a class="header-anchor" href="#frontend" aria-hidden="true">#</a> Frontend</h3><ul><li>Node version: 18.20.4</li></ul><h2 id="quick-start" tabindex="-1"><a class="header-anchor" href="#quick-start" aria-hidden="true">#</a> Quick Start</h2>',7),u=n(`<li><p><strong>Clone the backend code</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/samwafgo/SamWaf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>`,1),h=e("strong",null,"Download the precompiled frontend version",-1),p=e("br",null,null,-1),g=e("br",null,null,-1),m={href:"https://github.com/samwafgo/SamWafWeb/releases/latest/download/dist.zip",target:"_blank",rel:"noopener noreferrer"},b=n(`<p>After downloading, extract it into the backend directory:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>SamWaf/public/dist
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Directory structure:</p><div class="language-plaintext line-numbers-mode" data-ext="plaintext"><pre class="language-plaintext"><code>├─public
│  └─dist  // Extract the precompiled frontend content here
│      └─assets
│      └─index.html
│      └─favicon.ico
│      └─robots.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),v=n(`<p><strong>Start the backend</strong><br> Slightly modify the code in <code>global/global.go</code> (to conveniently use the precompiled frontend):</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code> GWAF_RELEASE              <span class="token builtin">string</span>    <span class="token operator">=</span> <span class="token string">&quot;true&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Entry point to start the code:<br><code>main.go</code></p>`,3),f={href:"http://127.0.0.1:26666/",target:"_blank",rel:"noopener noreferrer"},_=n(`<h2 id="development-and-debugging" tabindex="-1"><a class="header-anchor" href="#development-and-debugging" aria-hidden="true">#</a> Development and Debugging</h2><h3 id="backend-1" tabindex="-1"><a class="header-anchor" href="#backend-1" aria-hidden="true">#</a> Backend</h3><p>Ensure <code>global/global.go</code>:</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code> GWAF_RELEASE              <span class="token builtin">string</span>    <span class="token operator">=</span> <span class="token string">&quot;false&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Start: <code>main.go</code></p><h3 id="frontend-1" tabindex="-1"><a class="header-anchor" href="#frontend-1" aria-hidden="true">#</a> Frontend</h3><ol><li><p><strong>Clone the frontend code</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/samwafgo/SamWafWeb
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p><strong>Install dependencies (for the first time)</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p><strong>Start the frontend</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> run dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ol><p>At this point, both the backend and frontend development codes are running, allowing collaborative debugging.</p>`,8);function x(k,E){const s=d("ExternalLinkIcon");return o(),l("div",null,[c,e("ol",null,[u,e("li",null,[e("p",null,[h,p,a(" (A detailed guide for separate compilation is provided later.)"),g,e("a",m,[a("https://github.com/samwafgo/SamWafWeb/releases/latest/download/dist.zip"),t(s)])]),b]),e("li",null,[v,e("p",null,[a("Then access: "),e("a",f,[a("http://127.0.0.1:26666/"),t(s)])])])]),_])}const w=i(r,[["render",x],["__file","index.html.vue"]]);export{w as default};
