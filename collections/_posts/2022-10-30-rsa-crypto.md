---
title: RSA暗号
tags: crypto rsa
last_modified: 2022-12-16
---

# RSA暗号の定義
RSA暗号は[公開鍵暗号]({% post_url 2022-10-26-crypto-basis %}#commonkey_crypto)の一種であり，鍵生成関数$g$, 暗号化関数$e$，復号関数$d$の3つ組$(g, e, d)$で定義される．

# 鍵生成関数

鍵生成関数$g$はセキュリティパラメータとして鍵ビット数$k \in \mathbb{N}$を入力として受け取り，公開鍵と秘密鍵のペア$(p_k, s_k) \in \mathbb{N}^2$を返す．

## $g$のアルゴリズム

1. $k$ビットの素数$p, q$を計算する．
2. $N = pq$を計算する．
3. $1 < e < \phi(N)$かつ$\phi(N)$と互いに素である整数$e$をランダムに選ぶ．<br>このとき$N = pq$より$\phi(N) = (p - 1)(q - 1)$である．
4. $ed = 1 \mod \phi(N)$を満たす$d > 0$を計算する．
5. $p_k = (N, e), s_k = d$とし$(p_k, s_k)$を出力する．

ここで$\phi$はオイラー関数とする．

# 暗号化関数
暗号化関数$e$は公開鍵$p_k$を受け取り暗号化オラクル`e^\prime : \mathbb{N}_{\lt N} \rightarrow \mathbb{N}_{\lt N}`を返す関数である．
ただし，`\mathbb{N}_{\lt N} = \{n \in \mathbb{N} ~|~ 0 \leq n \lt N \}`とする．

## $e^\prime$のアルゴリズム
$(N, e) = p_k$とし，平文を$m \in \mathbb{N}_{\lt N}$とする．

1. $m^e \mod N$を出力する．


# 復号関数

復号関数$d$は復号鍵$s_k$を受け取り復号オラクル`d^\prime : \mathbb{N}_{\lt N} \rightarrow \mathbb{N}_{\lt N}`を返す関数である．
ただし，`\mathbb{N}_{\lt N} = \{n \in \mathbb{N} ~|~ 0 \leq n \lt N \}`とする．

## $d^\prime$のアルゴリズム
$(N, e) = p_k$とし，暗号文を$c \in \mathbb{N}_{\lt N}$とする．

1. $c^{s_k} \mod N$を出力する．

# 脆弱性
## 弱い平文

暗号化関数が$m^e \mod N$であるとする。

このとき、$m \leq \sqrt[e]{N}$であると、$m ^ e \leq N$より$m ^ e \mod N = m^e$である。

このとき、$e$は公開されているから暗号文の根を取るだけで解読できてしまう。

### 対策
暗号化関数の形を変え、$f(m)^e \mod N$とする。
この時、$f$は$f(m) > \sqrt[e]{N}$であり容易に逆関数を求められる関数である。

一般的に$f$はビットorであり十分桁が大きいビットを立てる。

# RSAへの攻撃
[別ページ]({{ site.baseurl }}{% post_url 2022-12-16-rsa-attack %})
