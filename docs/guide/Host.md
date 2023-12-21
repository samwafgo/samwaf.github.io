# 网站配置
  
## 1 部署架构：

### 1.1 部署在同台服务器（常见）
部署在同台服务器会存在之前80或者443已经占用得情况

```flow:preset

st=>start: 开始|past:>http://www.google.com[blank]
e=>end: 结束|future:>http://www.google.com
op1=>operation: 操作1|past
op2=>operation: 操作2|current
sub1=>subroutine: 子程序|invalid
cond=>condition: 是/否?|approved:>http://www.google.com
c2=>condition: 判断2|rejected
io=>inputoutput: 进行反思...|future

st->op1(right)->cond
cond(yes, right)->c2
cond(no)->sub1(left)->op1
c2(yes)->io->e
c2(no)->op2->e

```

### 1.2 部署在不同服务器
此部署方式适合服务器资源丰富将SamWaf单独部署，后面接入各各网站服务器，只暴露SamWaf所在服务器