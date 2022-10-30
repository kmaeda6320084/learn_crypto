---
title: RSA暗号
tags: crypto rsa
last_modified: 2022-10-30
---

# RSA暗号の定義
RSA暗号は[公開鍵暗号]({% post_url 2022-10-26-crypto-basis %}#commonkey_crypto)の一種であり，鍵生成関数<p>$g$</p>, 暗号化関数<p>$e$</p>，復号関数<p>$d$</p>の3つ組<p>$(g, e, d)$</p>で定義される．

# 鍵生成関数

鍵生成関数<p>$g$</p>はセキュリティパラメータとして鍵ビット数<p>$k \in \mathbb{N}$</p>を入力として受け取り，公開鍵と秘密鍵のペア<p>$(p_k, s_k) \in \mathbb{N}^2$</p>を返す．

## <p>$g$</p>のアルゴリズム

1. <p>$k$</p>ビットの素数<p>$p, q$</p>を計算する．
2. <p>$N = pq$</p>を計算する．
3. <p>$1 < e < \phi(N)$</p>かつ<p>$\phi(N)$</p>と互いに素である整数<p>$e$</p>をランダムに選ぶ．<br>このとき<p>$N = pq$</p>より<p>$\phi(N) = (p - 1)(q - 1)$</p>である．
4. <p>$ed = 1 \mod \phi(N)$</p>を満たす<p>$d > 0$</p>を計算する．
5. <p>$p_k = (N, e), s_k = d$</p>とし<p>$(p_k, s_k)$</p>を出力する．

ここで<p>$\phi$</p>はオイラー関数とする．

# 暗号化関数
暗号化関数<p>$1$</p>は公開鍵<p>$1$</p>を受け取り暗号化オラクル<p>$e^\prime : \mathbb{N}_{<N} \rightarrow \mathbb{N}_{<N}$</p>を返す関数である．
ただし，<p>$\mathbb{N}_{<N} = \{n \in \mathbb{N} ~|~ 0 \leq n < N \}$</p>とする．

## <p>$e^\prime$</p>のアルゴリズム
<p>$(N, e) = p_k$</p>とし，平文を<p>$m \in \mathbb{N}_{<N}$</p>とする．

1. <p>$m^e \mod N$</p>を出力する．


# 復号関数
復号関数<p>$d$</p>は復号鍵<p>$s_k$</p>を受け取り復号オラクル<p>$d^\prime : \mathbb{N}_{<N} \rightarrow \mathbb{N}_{<N}$</p>を返す関数である．
ただし，<p>$\mathbb{N}_{<N} = \{n \in \mathbb{N} ~|~ 0 \leq n < N \}$</p>とする．

## <p>$e^\prime$</p>のアルゴリズム
<p>$(N, e) = p_k$</p>とし，暗号文を<p>$c \in \mathbb{N}_{<N}$</p>とする．

1. <p>$c^{s_k} \mod N$</p>を出力する．

