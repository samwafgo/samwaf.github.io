import{_ as e}from"./plugin-vue_export-helper-x3n3nnut.js";import{o as a,c as i,e as t}from"./app-50U0eVnY.js";const n={},r=t(`<h1 id="common-issues" tabindex="-1"><a class="header-anchor" href="#common-issues" aria-hidden="true">#</a> Common Issues</h1><h2 id="_1-port-80-occupied-situation" tabindex="-1"><a class="header-anchor" href="#_1-port-80-occupied-situation" aria-hidden="true">#</a> 1 Port 80 Occupied Situation</h2><p>Common when SamWaf and the web application server are on the same server.</p><h3 id="_1-1-integrated-environments" tabindex="-1"><a class="header-anchor" href="#_1-1-integrated-environments" aria-hidden="true">#</a> 1.1 Integrated Environments</h3><h4 id="_1-1-1-created-with-baota" tabindex="-1"><a class="header-anchor" href="#_1-1-1-created-with-baota" aria-hidden="true">#</a> 1.1.1 Created with Baota</h4><p>Need to modify two locations:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>File 1: /www/server/panel/vhost/nginx/0.default.conf (may not exist initially, wait until a website is created)

File 2: /www/server/panel/vhost/nginx/phpfpm_status.conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_1-1-2-created-with-phpstudy" tabindex="-1"><a class="header-anchor" href="#_1-1-2-created-with-phpstudy" aria-hidden="true">#</a> 1.1.2 Created with PhpStudy</h4><h3 id="_1-2-native-web-environments" tabindex="-1"><a class="header-anchor" href="#_1-2-native-web-environments" aria-hidden="true">#</a> 1.2 Native Web Environments</h3><h4 id="_1-2-1-nginx" tabindex="-1"><a class="header-anchor" href="#_1-2-1-nginx" aria-hidden="true">#</a> 1.2.1 Nginx</h4><p>Change 80 or 443 to another port.</p><h4 id="_1-2-2-iis" tabindex="-1"><a class="header-anchor" href="#_1-2-2-iis" aria-hidden="true">#</a> 1.2.2 IIS</h4><p>Change 80 or 443 to another port.</p><h4 id="_1-2-3-apache" tabindex="-1"><a class="header-anchor" href="#_1-2-3-apache" aria-hidden="true">#</a> 1.2.3 Apache</h4><p>Change 80 or 443 to another port.</p><h2 id="_2-login-related" tabindex="-1"><a class="header-anchor" href="#_2-login-related" aria-hidden="true">#</a> 2 Login-related</h2><h3 id="_2-1-forgot-password" tabindex="-1"><a class="header-anchor" href="#_2-1-forgot-password" aria-hidden="true">#</a> 2.1 Forgot Password</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SamWaf64.exe resetpwd  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,18),d=[r];function s(h,o){return a(),i("div",null,d)}const p=e(n,[["render",s],["__file","index.html.vue"]]);export{p as default};
