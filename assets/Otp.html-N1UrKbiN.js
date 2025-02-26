import{_ as i,a as n,b as t}from"./otp_unbind-KBv7e8sv.js";import{_ as e}from"./plugin-vue_export-helper-x3n3nnut.js";import{o as a,c as o,e as r}from"./app-D4ZPgae6.js";const d={},c=r('<h1 id="two-factor-authentication-2fa" tabindex="-1"><a class="header-anchor" href="#two-factor-authentication-2fa" aria-hidden="true">#</a> Two-Factor Authentication (2FA)</h1><h2 id="_1-two-factor-authentication" tabindex="-1"><a class="header-anchor" href="#_1-two-factor-authentication" aria-hidden="true">#</a> 1 Two-Factor Authentication</h2><p>Two-Factor Authentication (2FA) is a secure login authentication technology. It requires users to provide additional authentication information beyond their password during login to enhance account security. Supported applications include 1Password, Authy, Microsoft Authenticator, etc.</p><h3 id="_1-1-binding" tabindex="-1"><a class="header-anchor" href="#_1-1-binding" aria-hidden="true">#</a> 1.1 Binding</h3><figure><img src="'+i+'" alt="2FA Binding" tabindex="0" loading="lazy"><figcaption>2FA Binding</figcaption></figure><ul><li>Open a supported application to scan the QR code. A 6-digit security code will be generated after scanning. Enter the code to complete initial binding.</li></ul><h3 id="_1-2-post-binding-login" tabindex="-1"><a class="header-anchor" href="#_1-2-post-binding-login" aria-hidden="true">#</a> 1.2 Post-Binding Login</h3><figure><img src="'+n+'" alt="2FA Login" tabindex="0" loading="lazy"><figcaption>2FA Login</figcaption></figure><ul><li>Open the supported application to view the 6-digit security code. Enter the code to log in.</li></ul><h3 id="_1-3-unbinding" tabindex="-1"><a class="header-anchor" href="#_1-3-unbinding" aria-hidden="true">#</a> 1.3 Unbinding</h3><figure><img src="'+t+`" alt="2FA Unbinding" tabindex="0" loading="lazy"><figcaption>2FA Unbinding</figcaption></figure><ul><li>Open a supported application to scan the QR code. A 6-digit security code will be generated after scanning. Enter the code to unbind, which will invalidate the original binding information.</li></ul><p>PS: If an admin has enabled 2FA login but lost access, the SamWaf policy allows executing the following command in the program directory:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SamWafLinux64 resetotp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This command will clear all existing 2FA binding information.</p>`,15),l=[c];function s(h,g){return a(),o("div",null,l)}const m=e(d,[["render",s],["__file","Otp.html.vue"]]);export{m as default};
