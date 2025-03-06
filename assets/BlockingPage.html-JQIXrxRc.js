import{_ as i}from"./blocking_page-f9H9atCu.js";import{_ as n}from"./plugin-vue_export-helper-x3n3nnut.js";import{o as e,c as d,e as l}from"./app-9DklAFkt.js";const s={},a=l('<h1 id="自定义拦截响应界面" tabindex="-1"><a class="header-anchor" href="#自定义拦截响应界面" aria-hidden="true">#</a> 自定义拦截响应界面</h1><h2 id="_1-自定义拦截响应界面" tabindex="-1"><a class="header-anchor" href="#_1-自定义拦截响应界面" aria-hidden="true">#</a> 1 自定义拦截响应界面</h2><p>自定义拦截响应界面</p><h3 id="_1-1-自定义拦截界面" tabindex="-1"><a class="header-anchor" href="#_1-1-自定义拦截界面" aria-hidden="true">#</a> 1.1 自定义拦截界面</h3><figure><img src="'+i+`" alt="自定义拦截界面" tabindex="0" loading="lazy"><figcaption>自定义拦截界面</figcaption></figure><ul><li>自定义拦截模板页面名称 供自己识别</li><li>网站 正常选择全局网站即可,当然如果每个网站的返回要特殊处理，那么就选择特定的网站。</li><li>响应代码 ，默认403，可以依据实际情况进行编辑</li><li>响应内容 ，给访客返回的内容信息。支持变量：</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>访问ID码：
[[.SAMWAF_REQ_UUID]]

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>响应Header头信息</p><table><thead><tr><th>键名</th><th>描述</th><th>例子值</th></tr></thead><tbody><tr><td><code>Content-Type</code></td><td>表示返回内容的类型。</td><td><code>text/html; charset=UTF-8</code> ， <code>text/json; charset=UTF-8</code></td></tr></tbody></table></li></ul><h3 id="_1-2-html-示例" tabindex="-1"><a class="header-anchor" href="#_1-2-html-示例" aria-hidden="true">#</a> 1.2 HTML 示例</h3><p>如果是正常HTML，可以将Content-Type 设置成：text/html; charset=UTF-8</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;zh-CN&quot;&gt;
&lt;head&gt;
    &lt;meta charset=&quot;UTF-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;
    &lt;title&gt;您的访问被阻止&lt;/title&gt;
    &lt;style&gt;
        /* 基本样式 */
        body {
            font-family: &#39;Arial&#39;, sans-serif;
            background-color: #f4f7fa;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
        }

        /* 页面内容的容器 */
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }

        /* 标题样式 */
        h1 {
            font-size: 2.5em;
            color: #d9534f;
            margin: 0;
        }

        /* 访问识别码样式 */
        h3 {
            font-size: 1.5em;
            color: #5bc0de;
            margin: 20px 0;
        }

        /* 提示文字 */
        .message {
            font-size: 1.1em;
            color: #999;
            margin-bottom: 30px;
        }

        /* 返回首页按钮样式 */
        .back-btn {
            background-color: #5cb85c;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            font-size: 1.1em;
        }

        .back-btn:hover {
            background-color: #4cae4c;
        }

        .back-btn:active {
            background-color: #398439;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .container {
                padding: 30px;
            }

            h1 {
                font-size: 2em;
            }

            h3 {
                font-size: 1.3em;
            }

            .message {
                font-size: 1em;
            }
        }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div class=&quot;container&quot;&gt;
        &lt;h1&gt;您的访问被阻止&lt;/h1&gt;
        &lt;p class=&quot;message&quot;&gt;由于安全策略，您的请求被阻止。&lt;br&gt;如果有疑问，请将下面的访问识别码发给管理员，以便进一步排查。&lt;/p&gt;
        &lt;h3&gt;访问识别码：[[.SAMWAF_REQ_UUID]]&lt;/h3&gt;
    &lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-json-示例" tabindex="-1"><a class="header-anchor" href="#_1-3-json-示例" aria-hidden="true">#</a> 1.3 JSON 示例</h3><p>如果是纯API接口也想用JSON，可以将Content-Type 设置成：text/json; charset=UTF-8</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>{&quot;samwaf_req_uuid&quot;:&quot;[[.SAMWAF_REQ_UUID]]&quot;,&quot;msg&quot;:&quot;访问被拦截&quot;} 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,14),v=[a];function t(r,c){return e(),d("div",null,v)}const o=n(s,[["render",t],["__file","BlockingPage.html.vue"]]);export{o as default};
