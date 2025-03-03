import{_ as a}from"./otp_bind-CjpnJHjd.js";import{_ as e,a as i}from"./otp_unbind--GLshPGm.js";import{_ as t}from"./plugin-vue_export-helper-x3n3nnut.js";import{o as r,c as n,e as d}from"./app-ZLHqZvGM.js";const o={},s=d('<h1 id="双因素认证" tabindex="-1"><a class="header-anchor" href="#双因素认证" aria-hidden="true">#</a> 双因素认证</h1><h2 id="_1-双因素认证" tabindex="-1"><a class="header-anchor" href="#_1-双因素认证" aria-hidden="true">#</a> 1 双因素认证</h2><p>双因素认证（ Two-Factor Authentication、缩写 2FA）是一种安全的登录验证技术。要求用户登录时除密码外，需要额外的身份验证信息从而提升帐号的安全性。可以使用得软件有1Password、 Authy、Microsoft Authenticator 等。</p><h3 id="_1-1-绑定" tabindex="-1"><a class="header-anchor" href="#_1-1-绑定" aria-hidden="true">#</a> 1.1 绑定</h3><figure><img src="'+a+'" alt="双因素绑定" tabindex="0" loading="lazy"><figcaption>双因素绑定</figcaption></figure><ul><li>打开支持的软件进行扫码，扫码后会生成 6位安全码，输入即可完成首次绑定。</li></ul><h3 id="_1-2-绑定后登录时候需要输入安全码" tabindex="-1"><a class="header-anchor" href="#_1-2-绑定后登录时候需要输入安全码" aria-hidden="true">#</a> 1.2 绑定后登录时候需要输入安全码</h3><figure><img src="'+e+'" alt="双因素登录" tabindex="0" loading="lazy"><figcaption>双因素登录</figcaption></figure><ul><li>打开支持的软件，看到6位安全码，输入即可，登录即可。</li></ul><h3 id="_1-3-解绑" tabindex="-1"><a class="header-anchor" href="#_1-3-解绑" aria-hidden="true">#</a> 1.3 解绑</h3><figure><img src="'+i+`" alt="双因素解绑" tabindex="0" loading="lazy"><figcaption>双因素解绑</figcaption></figure><ul><li>打开支持的软件进行扫码，扫码后会生成 6位安全码，输入即可完成解绑原有的信息随之失效。</li></ul><p>PS:如果admin设置了2FA登录，但是丢失了，SamWaf策略为可以在程序目录下执行：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SamWafLinux64 resetotp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>执行后即可清除2fa原有绑定信息。</p>`,15),c=[s];function l(h,u){return r(),n("div",null,c)}const g=t(o,[["render",l],["__file","Otp.html.vue"]]);export{g as default};
