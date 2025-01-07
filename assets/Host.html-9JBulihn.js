import{_ as s,a as h,b as o,c,d as p,e as _,f as u}from"./response_timeout-bqeNEy8r.js";import{_ as m}from"./loadbalanceindex-Emj0p8wn.js";import{_ as f}from"./plugin-vue_export-helper-x3n3nnut.js";import{r as n,o as g,c as x,a,d as i,b as e,w as r,e as t}from"./app-50U0eVnY.js";const b={},A=t('<h1 id="网站配置" tabindex="-1"><a class="header-anchor" href="#网站配置" aria-hidden="true">#</a> 网站配置</h1><h2 id="_1-部署架构" tabindex="-1"><a class="header-anchor" href="#_1-部署架构" aria-hidden="true">#</a> 1 部署架构：</h2><p>请依据下面的架构方式布局SamWaf防火墙</p><h3 id="_1-1-部署在同台服务器-常见" tabindex="-1"><a class="header-anchor" href="#_1-1-部署在同台服务器-常见" aria-hidden="true">#</a> 1.1 部署在同台服务器（常见）</h3>',4),E={class:"hint-container important"},I=a("p",{class:"hint-container-title"},"重要",-1),v=a("h3",{id:"_1-2-部署在不同服务器",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#_1-2-部署在不同服务器","aria-hidden":"true"},"#"),i(" 1.2 部署在不同服务器")],-1),S=a("p",null,"此部署方式适合服务器资源丰富将SamWaf单独部署，域名解析到SamWaf所在服务器即可。 后面接入各各网站服务器，只暴露SamWaf所在服务器",-1),N=t('<h2 id="_2-新增可被防火墙保护的网站" tabindex="-1"><a class="header-anchor" href="#_2-新增可被防火墙保护的网站" aria-hidden="true">#</a> 2 新增可被防火墙保护的网站：</h2><p>关键配置，配置一次即可随时使用。</p><h3 id="_2-1-新增网站" tabindex="-1"><a class="header-anchor" href="#_2-1-新增网站" aria-hidden="true">#</a> 2.1 新增网站</h3><figure><img src="'+s+'" alt="新增一个受到SamWaf防火墙保护的网站" tabindex="0" loading="lazy"><figcaption>新增一个受到SamWaf防火墙保护的网站</figcaption></figure>',4),R=a("li",null,[a("p",null,"网站："),a("ul",null,[a("li",null,"正常填写网站域名即可,注意 https，http前缀,/ 等后缀都不要加")]),a("p",null,"例如：www.baidu.com，pan.baidu.com")],-1),T=a("p",null,"端口：",-1),U=t('<li><p>加密证书： 1.如果是https需要选择加密证书，80端口不需要 首次需要点击“添加新证书”，新增证书。</p><figure><img src="'+h+`" alt="新增SSL证书" tabindex="0" loading="lazy"><figcaption>新增SSL证书</figcaption></figure><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>通常文件名：*.key 内容格式如下：-----BEGIN RSA PRIVATE KEY----- ... 全选复制填写进来
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>证书串</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>通常文件名：*.crt 内容格式如下：-----BEGIN CERTIFICATE----- ... 全选复制填写进来
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="2"><li>从证书夹选择对应证书</li></ol><figure><img src="`+o+'" alt="选择证书" tabindex="0" loading="lazy"><figcaption>选择证书</figcaption></figure></li><li><p>启动状态： 自动启动：添加后正常提供服务；手工启动，添加后不会占用端口，不提供服务。</p></li><li><p>来源严格端口： 来源严格端口 默认是开启，如果关闭后 适合外层nginx,cdn情况</p></li><li><p>后端系统类型、后端应用类型： 非必要，可以选择和实际一样，也可以保持默认（后期可能针对后端接入不同做适配处理）</p></li><li><p>后端IP： 如SamWaf同网站在同一台服务器 填写127.0.0.1 如果是不同服务器请填写实际IP</p></li><li><p>后端端口： 情况1，在SamWaf和网站在同一台服务器，那么端口需要写成81等其他端口 情况2：如果不在同一台服务器，那么此处可以原来端口</p></li>',6),B=t('<h2 id="_3-负载均衡" tabindex="-1"><a class="header-anchor" href="#_3-负载均衡" aria-hidden="true">#</a> 3 负载均衡：</h2><p>负载均衡支持：权重轮询(WRR),IP Hash</p><ul><li><p>权重轮询(WRR)：根据后端服务器的权重，按依次将请求分发给不同的服务器。权值越高的服务器被轮询到的次数（概率）越高。</p></li><li><p>IP Hash：根据请求的源 IP 地址，使用散列键（Hash Key）从散列表找出对应的服务器,使得相同IP每次访问的服务器是固定的。</p></li></ul><h3 id="_3-1-负载均衡配置" tabindex="-1"><a class="header-anchor" href="#_3-1-负载均衡配置" aria-hidden="true">#</a> 3.1 负载均衡配置</h3><p>点击被防护的网站启动“负载均衡”。</p><p><img src="'+m+'" alt="负载均衡列表" loading="lazy">。</p><h3 id="_3-2-添加后端负载" tabindex="-1"><a class="header-anchor" href="#_3-2-添加后端负载" aria-hidden="true">#</a> 3.2 添加后端负载</h3><p><img src="'+c+'" alt="负载配置" loading="lazy">。</p><ul><li>IP： 填入后端可接入的IP</li><li>端口： 填入后端可接入的端口</li><li>权重：填入权重，针对 权重轮询(WRR)模式，可以增加客户访问改服务器的几率。</li></ul><h2 id="_4-网站密码访问" tabindex="-1"><a class="header-anchor" href="#_4-网站密码访问" aria-hidden="true">#</a> 4 网站密码访问</h2><p>自v1.3.9-beta.11 已支持网站密码访问, 添加或者编辑网站最后一个选项卡，网站密码访问。 网站密码访问默认关闭，可以自行打开。</p><h3 id="_4-1-网站密码访问列表" tabindex="-1"><a class="header-anchor" href="#_4-1-网站密码访问列表" aria-hidden="true">#</a> 4.1 网站密码访问列表</h3><p><img src="'+p+'" alt="网站密码访问列表" loading="lazy">，</p><p>在此查看、添加、编辑、或者删除。</p><p>效果如下：</p><p><img src="'+_+'" alt="网站密码访问效果如下" loading="lazy">，</p><h2 id="_5-其他配置" tabindex="-1"><a class="header-anchor" href="#_5-其他配置" aria-hidden="true">#</a> 5.其他配置</h2><h3 id="_5-1-记录日志时排除url" tabindex="-1"><a class="header-anchor" href="#_5-1-记录日志时排除url" aria-hidden="true">#</a> 5.1 记录日志时排除URL</h3><p>一行一个日志url</p><h3 id="_5-2-访问超时设置" tabindex="-1"><a class="header-anchor" href="#_5-2-访问超时设置" aria-hidden="true">#</a> 5.2 访问超时设置</h3><p>自v1.3.9-beta.13 支持自定义设置,默认60s,单位秒，如果填写0则是不限制</p><figure><img src="'+u+'" alt="访问超时设置" tabindex="0" loading="lazy"><figcaption>访问超时设置</figcaption></figure>',22);function P(k,z){const d=n("RouterLink"),l=n("Mermaid");return g(),x("div",null,[A,a("div",E,[I,a("p",null,[i("重要:部署在同台服务器会存在端口：80、443已经占用得情况 ，请在本机或者网站业务不繁忙得时候操作。"),e(d,{to:"/faq/#_1-%E7%AB%AF%E5%8F%A380-%E8%A2%AB%E5%8D%A0%E7%94%A8%E6%83%85%E5%86%B5"},{default:r(()=>[i("修改查看常见问题")]),_:1})])]),e(l,{id:"mermaid-17",code:"eJzT1dXlKsksyUm1UnjZvOL53k1P56x4OqHnyY6Gp/0bns3pfdq18OnMFVwgZWk5+eXJGYlFJQohTlwKQOAY/XTdomcd259t7X+xvAOoLJaL00kjODE3PDFNk4vTWSM8NQluBFDAUUFX107BSUEBqAzMdOTiLC5NSi9KLMhQgCs0BJsNUeAMZjtD9IHZqXkpQJoLAPkcRXk="}),v,S,e(l,{id:"mermaid-24",code:"eJzT1dXlKsksyUm1UnjZvOL53k1P56x4sqP36YSeZ3N6n3YtfDpzBRdITVpOfnlyRmJRiUKIE5cCEDhGP1236FnH9mdb+18s7wAqi+XidNIITswNT0zT5OJ01ghPTYIbARRwVNDVtVNwUlDg4iwuTUovSizIUIDLG4KNdFIAU6l5KSBVTmANztiUG0EUOsOUA62DmA7T5QhSwAUAEXlQdA=="}),N,a("ul",null,[R,a("li",null,[T,a("ul",null,[a("li",null,[i("输入需要防护的网站端口 http是80 https 是 443 （如果已经安装了宝塔，Nginx，IIS等 需要手工改动端口成非80，或者非443端口）"),e(d,{to:"/faq/#_1-%E7%AB%AF%E5%8F%A380-%E8%A2%AB%E5%8D%A0%E7%94%A8%E6%83%85%E5%86%B5"},{default:r(()=>[i("修改查看常见问题")]),_:1})])])]),U]),B])}const D=f(b,[["render",P],["__file","Host.html.vue"]]);export{D as default};
