import{_ as t}from"./add_host-D8tYX7Mg.js";import{_ as r}from"./plugin-vue_export-helper-x3n3nnut.js";import{r as d,o,c,b as a,d as n,e as i,w as l,a as e}from"./app-fOswiYXz.js";const p={},u=e('<h1 id="网站配置" tabindex="-1"><a class="header-anchor" href="#网站配置" aria-hidden="true">#</a> 网站配置</h1><h2 id="_1-部署架构" tabindex="-1"><a class="header-anchor" href="#_1-部署架构" aria-hidden="true">#</a> 1 部署架构：</h2><p>请依据下面的架构方式布局SamWaf防火墙</p><h3 id="_1-1-部署在同台服务器-常见" tabindex="-1"><a class="header-anchor" href="#_1-1-部署在同台服务器-常见" aria-hidden="true">#</a> 1.1 部署在同台服务器（常见）</h3>',4),v={class:"hint-container important"},m=a("p",{class:"hint-container-title"},"重要",-1),h=e(`<div class="language-mermaid line-numbers-mode" data-ext="mermaid"><pre class="language-mermaid"><code><span class="token arrow operator">---</span>
title<span class="token operator">:</span> 部署在同一台服务器
<span class="token arrow operator">---</span>
<span class="token keyword">flowchart</span> TB
    A<span class="token text string">[客户浏览器]</span>
	B<span class="token text string">(SamWaf)</span>
	C<span class="token text string">(Web服务器)</span>
	A <span class="token arrow operator">--&gt;</span> B  
	B <span class="token arrow operator">--&gt;</span> A
	<span class="token keyword">subgraph</span> 服务器1
    B <span class="token arrow operator">--&gt;</span> C
    C <span class="token arrow operator">--&gt;</span> B
    <span class="token keyword">end</span>
  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-部署在不同服务器" tabindex="-1"><a class="header-anchor" href="#_1-2-部署在不同服务器" aria-hidden="true">#</a> 1.2 部署在不同服务器</h3><p>此部署方式适合服务器资源丰富将SamWaf单独部署，域名解析到SamWaf所在服务器即可。 后面接入各各网站服务器，只暴露SamWaf所在服务器</p><div class="language-mermaid line-numbers-mode" data-ext="mermaid"><pre class="language-mermaid"><code><span class="token arrow operator">---</span>
title<span class="token operator">:</span> 部署在不同服务器
<span class="token arrow operator">---</span>
<span class="token keyword">flowchart</span> TB
    A<span class="token text string">[客户浏览器]</span>
	B<span class="token text string">(SamWaf)</span>
	C<span class="token text string">(Web服务器)</span>
	A <span class="token arrow operator">--&gt;</span> B  
	<span class="token keyword">subgraph</span> 服务器1
    B 
    <span class="token keyword">end</span>  
	B <span class="token arrow operator">--&gt;</span> C
	<span class="token keyword">subgraph</span> 服务器2 
    C
    <span class="token keyword">end</span>
	C <span class="token arrow operator">--&gt;</span> B
	B <span class="token arrow operator">--&gt;</span> A 
  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-新增可被防火墙保护的网站" tabindex="-1"><a class="header-anchor" href="#_2-新增可被防火墙保护的网站" aria-hidden="true">#</a> 2 新增可被防火墙保护的网站：</h2><p><img src="`+t+'" alt="新增一个受到SamWaf防火墙保护的网站" loading="lazy"> 配置一次即可随时使用。</p>',6),b=a("li",null,[a("p",null,"网站："),a("ul",null,[a("li",null,"正常填写网站域名即可,注意 https，http前缀,/ 等后缀都不要加")]),a("p",null,"例如：www.baidu.com，pan.baidu.com")],-1),_=a("p",null,"端口：",-1),k=e(`<li><p>加密证书：</p><ul><li>如果是https需要选择加密证书，80端口不需要</li><li>密钥串</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>通常文件名：*.key 内容格式如下：-----BEGIN RSA PRIVATE KEY----- ... 全选复制填写进来
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>证书串</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>通常文件名：*.crt 内容格式如下：-----BEGIN CERTIFICATE----- ... 全选复制填写进来
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>后端系统类型、后端应用类型：</p><ul><li>非必要，可以选择和实际一样，也可以保持默认（后期可能针对后端接入不同做适配处理）</li></ul></li><li><p>后端域名：</p><ul><li>后端域名通常同第一项网站域名相同</li></ul></li><li><p>后端IP：</p><ul><li>如SamWaf同网站在同一台服务器 填写127.0.0.1 如果是不同服务器请填写实际IP</li></ul></li><li><p>后端端口：</p><ul><li>情况1，在SamWaf和网站在同一台服务器，那么端口需要写成81等其他端口 情况2：如果不在同一台服务器，那么此处可以原来端口</li></ul></li>`,5);function g(f,w){const s=d("RouterLink");return o(),c("div",null,[u,a("div",v,[m,a("p",null,[n("重要:部署在同台服务器会存在端口：80、443已经占用得情况 ，请在本机或者网站业务不繁忙得时候操作。"),i(s,{to:"/guide/Question.html#_1-%E7%AB%AF%E5%8F%A380-%E8%A2%AB%E5%8D%A0%E7%94%A8%E6%83%85%E5%86%B5"},{default:l(()=>[n("修改查看常见问题")]),_:1})])]),h,a("ol",null,[b,a("li",null,[_,a("ul",null,[a("li",null,[n("输入需要防护的网站端口 http是80 https 是 443 （如果已经安装了宝塔，Nginx，IIS等 需要手工改动端口成非80，或者非443端口）"),i(s,{to:"/guide/Question.html#_1-%E7%AB%AF%E5%8F%A380-%E8%A2%AB%E5%8D%A0%E7%94%A8%E6%83%85%E5%86%B5"},{default:l(()=>[n("修改查看常见问题")]),_:1})])])]),k])])}const E=r(p,[["render",g],["__file","Host.html.vue"]]);export{E as default};
