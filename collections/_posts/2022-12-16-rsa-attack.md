---
title: RSA暗号
tags: crypto rsa attack
last_modified: 2022-12-16
---

# 共通法攻撃 (Common Modulus Attack)

RSAは鍵生成において，ランダムな素数のペア`p, q`から法`N = pq`，`\phi(N) = (p - 1)(q - 1)`と互いに素なランダムな数`e < \phi(N)`，`d = e^{-1} \mod \phi(N)`を計算する．

このとき，素数`p, q`を使いまわして`e, d`のみを変えて複数の通信を行った場合に暗号文を解読できてしまう可能性がある．

この攻撃を共通法攻撃という. (複数の通信で同じ法`N = pq`を利用している)

## 攻撃例

二回の通信を行い，同じ平文`m`を暗号化した場合を考える．

それぞれの通信での暗号文は以下のようになる．

\(
\begin{align*}
c_1 = m^{e_1} \mod N
c_2 = m^{e_2} \mod N
\end{align*}
\)