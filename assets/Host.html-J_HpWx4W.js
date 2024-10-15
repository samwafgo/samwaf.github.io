import{_ as d,a as l,b as c,c as h}from"./loadbalance_edit-Y_ANXrd1.js";import{_ as u}from"./loadbalanceindex-Emj0p8wn.js";import{_ as p}from"./plugin-vue_export-helper-x3n3nnut.js";import{r,o as f,c as m,a as e,d as t,b as a,w as s,e as i}from"./app-JMSO4sFP.js";const b={},g=i('<h1 id="website-configuration" tabindex="-1"><a class="header-anchor" href="#website-configuration" aria-hidden="true">#</a> Website Configuration</h1><h2 id="_1-deployment-architecture" tabindex="-1"><a class="header-anchor" href="#_1-deployment-architecture" aria-hidden="true">#</a> 1 Deployment Architecture:</h2><p>Please layout the SamWaf firewall according to the architecture below.</p><h3 id="_1-1-deployed-on-the-same-server-common" tabindex="-1"><a class="header-anchor" href="#_1-1-deployed-on-the-same-server-common" aria-hidden="true">#</a> 1.1 Deployed on the Same Server (Common)</h3>',4),y={class:"hint-container important"},_=e("p",{class:"hint-container-title"},"Important",-1),w=e("h3",{id:"_1-2-deployed-on-different-servers",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_1-2-deployed-on-different-servers","aria-hidden":"true"},"#"),t(" 1.2 Deployed on Different Servers")],-1),v=e("p",null,"This deployment method is suitable for servers with abundant resources, allowing SamWaf to be deployed separately, and the domain name should be resolved to the server where SamWaf is located. Other website servers can then be connected, exposing only the server where SamWaf is located.",-1),A=i('<h2 id="_2-adding-websites-protected-by-the-firewall" tabindex="-1"><a class="header-anchor" href="#_2-adding-websites-protected-by-the-firewall" aria-hidden="true">#</a> 2 Adding Websites Protected by the Firewall:</h2><p>Key configuration; set it up once for future use.</p><h3 id="_2-1-add-website" tabindex="-1"><a class="header-anchor" href="#_2-1-add-website" aria-hidden="true">#</a> 2.1 Add Website</h3><figure><img src="'+d+'" alt="Add a website protected by SamWaf firewall" tabindex="0" loading="lazy"><figcaption>Add a website protected by SamWaf firewall</figcaption></figure>',4),x=e("li",null,[e("p",null,"Website:"),e("ul",null,[e("li",null,"Enter the website domain name correctly, avoiding prefixes like https, http, or suffixes like /.")]),e("p",null,"For example: www.baidu.com, pan.baidu.com")],-1),C=e("p",null,"Port:",-1),E=i('<li><p>Encryption Certificate:</p><ol><li>If it&#39;s https, you need to select an encryption certificate. The 80 port does not require one. You need to click &quot;Add New Certificate&quot; to add a new certificate.</li></ol><figure><img src="'+l+`" alt="Add SSL Certificate" tabindex="0" loading="lazy"><figcaption>Add SSL Certificate</figcaption></figure><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Typical filename: *.key Content format: -----BEGIN RSA PRIVATE KEY----- ... Copy and paste all the contents here.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>Certificate String</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Typical filename: *.crt Content format: -----BEGIN CERTIFICATE----- ... Copy and paste all the contents here.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="2"><li>Select the corresponding certificate from the certificate folder.</li></ol><figure><img src="`+c+'" alt="Select Certificate" tabindex="0" loading="lazy"><figcaption>Select Certificate</figcaption></figure></li><li><p>Startup Status: Automatic startup: After adding, it normally provides services; manual startup: after adding, it will not occupy ports and will not provide services.</p></li><li><p>Strict Source Port: The strict source port is enabled by default. If disabled, it is suitable for outer Nginx or CDN situations.</p></li><li><p>Backend System Type and Backend Application Type: Not necessary; you can select the actual type or keep the default (adaptations may be made for different backend access later).</p></li><li><p>Backend IP: If SamWaf and the website are on the same server, fill in 127.0.0.1. If on different servers, please fill in the actual IP.</p></li><li><p>Backend Port: Situation 1: If SamWaf and the website are on the same server, then the port needs to be changed to something like 81 or other ports. Situation 2: If they are on different servers, you can keep the original port.</p></li>',6),S=i('<h2 id="_3-load-balancing" tabindex="-1"><a class="header-anchor" href="#_3-load-balancing" aria-hidden="true">#</a> 3 Load Balancing:</h2><p>Load balancing supports: Weighted Round Robin (WRR), IP Hash.</p><ul><li><p>Weighted Round Robin (WRR): Distributes requests to different servers in order based on the weights of the backend servers. Servers with higher weights are polled more frequently (higher probability).</p></li><li><p>IP Hash: Uses the source IP address of the request to find the corresponding server from a hash table, ensuring that the same IP always accesses the same server.</p></li></ul><h3 id="_3-1-load-balancing-configuration" tabindex="-1"><a class="header-anchor" href="#_3-1-load-balancing-configuration" aria-hidden="true">#</a> 3.1 Load Balancing Configuration</h3><p>Click on the protected website to enable &quot;Load Balancing.&quot;</p><p><img src="'+u+'" alt="Load Balancing List" loading="lazy">.</p><h3 id="_3-2-add-backend-load" tabindex="-1"><a class="header-anchor" href="#_3-2-add-backend-load" aria-hidden="true">#</a> 3.2 Add Backend Load</h3><p><img src="'+h+'" alt="Load Configuration" loading="lazy">.</p><ul><li>IP: Enter the backend IP that can be accessed.</li><li>Port: Enter the backend port that can be accessed.</li><li>Weight: Enter the weight; for the Weighted Round Robin (WRR) mode, this increases the chance of customer access to that server.</li></ul>',9);function I(k,B){const n=r("RouterLink"),o=r("Mermaid");return f(),m("div",null,[g,e("div",y,[_,e("p",null,[t("Important: Deploying on the same server may encounter situations where ports 80 and 443 are already in use. Please perform operations when the machine or website business is not busy. "),a(n,{to:"/en/guide/Question.html#_1-%E7%AB%AF%E5%8F%A380-%E8%A2%AB%E5%8D%A0%E7%94%A8%E6%83%85%E5%86%B5"},{default:s(()=>[t("Modify and view common issues")]),_:1})])]),a(o,{id:"mermaid-17",code:"eJwtjDEOwjAMRef4FB7LkIGVASkJNwCpA2JIqUsqhaRyAxW3x03rwfqW3/taayhjiXTCC00x/6jHnLAEwqt/yyL+EsOKDTEvz+C54M0Cypi7iyOlgpbzMhM/QNlGrNYPB1CuaanbfTkNan1GiyhQjQbU/Ole7KewU8faun1dzW6TaqbUwx+b3y8N"}),w,v,a(o,{id:"mermaid-24",code:"eJxlzbEOgjAQBuCZe4obceigo4MJLW+ACYNxKHIVkkrJtUp8e9sCk7dcLvfdf0IICGOwdMaaZuu+1KObsB6NIaYpYEP8IfaQoLFueQyaA14lYKzqpuyYlGS3eOI7FLJs9KvV5gCFKlvqtoA4VijEBSUiFP7dPVnPw7Y85jCJudHUJyKzVn/2tCq12/hmzd1PKoQfbpo5dA=="}),A,e("ul",null,[x,e("li",null,[C,e("ul",null,[e("li",null,[t("Enter the port of the website that needs protection. http is 80 and https is 443. (If you have already installed Baota, Nginx, IIS, etc., you need to manually change the port to a non-80 or non-443 port.) "),a(n,{to:"/en/guide/Question.html#_1-%E7%AB%AF%E5%8F%A380-%E8%A2%AB%E5%8D%A0%E7%94%A8%E6%83%85%E5%86%B5"},{default:s(()=>[t("Modify and view common issues")]),_:1})])])]),E]),S])}const N=p(b,[["render",I],["__file","Host.html.vue"]]);export{N as default};
