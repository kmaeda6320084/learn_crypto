---
title: RSA暗号の攻撃
tags: crypto rsa attack
last_modified: 2022-12-16
---

# 共通法攻撃 (Common Modulus Attack)

RSAは鍵生成において，ランダムな素数のペア$p, q$から法$N = pq$，$\phi(N) = (p - 1)(q - 1)$と互いに素なランダムな数$e < \phi(N)$，$d = e^{-1} \mod \phi(N)$を計算する．

このとき，素数$p, q$を使いまわして$e, d$のみを変えて複数の通信を行った場合に暗号文を解読できてしまう可能性がある．

この攻撃を共通法攻撃という. (複数の通信で同じ法$N = pq$を利用している)

## 平文の解読

二回の通信を行い，同じ平文$m$を暗号化した場合を考える．

それぞれの通信での暗号文は以下のようになる．

$$
\begin{align*}
c_1 &= m^{e_1} \mod N\\
c_2 &= m^{e_2} \mod N
\end{align*}
$$

$e_1$と$e_2$が互いに素であるとき，$ue_1 + ve_2 = 1$を満たす整数$u, v$が存在し，拡張ユークリッドの互除法で求めることができる．

$e_1, e_2 > 1$より，$u, v$はどちらかが正でもう一方は負になる．
以降は$u > 0, v < 0$とする．


$gcd(c_2, N) \neq 1$である場合，$c_2$は[脆弱な暗号文](#weak_code)であり$p, q$を計算できるため，以降は$gcd(c_2, N) = 1$とする．

$gcd(c_2, N) = 1$である場合，$c_2^{-1}$が存在して，拡張ユークリッドの互除法で計算できる．

以上より，$c_1, c_2^{-1}, u, v, N$は既知であるから，次の計算が可能で，

$$
\begin{align*}
    (c_1)^u(c_2^{-1})^{-v} &= (m^{e_1})^u((m^{e_2})^{-1})^{-v}\\
    &= m^{ue_1 + ve_2}\\
    &= m \mod N
\end{align*}
$$
> $v < 0$であるから$-v$を利用する必要がある．

となり，平文$m$を求めることができる．

## 秘密鍵の解読

Alice, Bobの二人のユーザが法$N$を同じとして鍵生成を行ったとする．

Aliceの公開鍵を$(N, e_A)$，秘密鍵を$d_A$とし，Bobの公開鍵を$(N, e_B)$，秘密鍵を$d_B$とする．

いまAliceは$e_Ad_A - 1$を計算でき, Bobの$e_B$を知ることができる．

よって，拡張ユークリッドの互除法で$e_Bx = 1 \mod (e_Ad_A - 1)$を満たす$x$を計算でき，この$x$はBobの秘密鍵の代用として利用できる．

### 証明
平文を$m$, 暗号文を$c = m^{e_B} \mod N$とする．

$x$の定義より$e_Bx = k (e_Ad_A - 1) + 1$となる整数$k$が存在する．

また，RSAの定義より$e_Ad_A = 1 \mod \phi(N)$であるから，$e_Ad_A = l\cdot\phi(N) + 1$となる整数$l$が存在する．

よって

$$
\begin{align*}
    c^x \mod N &= m^{e_Bx} \mod N\\
    &= m^{k(e_Ad_A - 1) + 1} \mod N\\
    &= m^{k(l\cdot\phi(N) + 1 - 1) + 1} \mod N\\
    &= m^{kl\cdot\phi(N) + 1} \mod N\\
    &= m \cdot m^{kl\cdot \phi(N)}\mod N\\
    &= m \mod N \quad (\because m^{\phi(N)} = 1 \mod N)
\end{align*}
$$


{:#weak_code}
# 脆弱な暗号文

法$N = pq$であるとき，暗号文$c$が$p, q$いずれかの倍数であると，容易に$N$から$p, q$を特定できる．

$c$が$p, q$いずれか一方の倍数であるとき，$g = gcd(c, N)$は
$$
\begin{align*}
    gcd(c, N) &= gcd(c, pq)\\
    &= p, q
\end{align*}
$$
となり，$p, q$を容易に特定できてしまう．

脆弱な暗号文が発生する確率は
$$
\frac{1}{p} + \frac{1}{q} - \frac{1}{pq}
$$
であり, $p, q$が大きくなればきわめて確率は小さくなる．

# 脆弱な素数(fermat法)

法$N = pq$であるとき，$\abs{p - q}$が極端に大きい場合と小さな場合の両方で脆弱になる．

1. $\abs{p - q}$が極端に大きい場合.

$N = pq$であるから$p = N / q$, $q = N / p$であり，
$\abs{p - q}$が極端に大きいことは$p, q$の一方が小さいことになり，素因数分解が簡単であることを示している．

2. $\abs{p - q}$が極端に小さい場合．

二次方程式を考える．
$$X^2 - (p + q)X +pq = 0$$
この方程式の解は，解の公式より
$$
\begin{align*}
    X &= \frac{p + q \pm \sqrt{(p + q)^2 - 4pq}}{2}\\
    &= \frac{p + q \pm \sqrt{p^2 - 2pq + q^2}}{2}\\
    &= \frac{p + q \pm \sqrt{(p - q)^2}}{2}\\
    &= \frac{p + q \pm \abs{p - q}}{2}\\
    &= p, q
\end{align*}
$$
であるから，$p + q$を求めることができれば容易に$p, q$を求めることができる．

$$
(p + q)^2 - (p - q)^2 = 4pq
$$
であり，$N= pq$であるから
$$
(p + q)^2 - (p - q)^2 = 4N
$$

$$
(p + q)^2  = 4N + (p - q)^2
$$

$$
p + q  = \sqrt{4N + (p - q)^2}
$$

いま，$p, q$は素数であるから，$p - q$は偶数で，$\abs{p - q}$が小さい場合は$p + q$を容易に求めることができる．

$k$ビットの素数を利用している場合，

$$2^{k - 1} \leq p, q \leq 2^k - 1$$

を満たすから

$$2^{k - 1} \leq p, q \leq 2^k - 1$$

であり，

$$
2^{k - 1} - 2^k + 1 \leq p - q \leq 2^k - 2^{k - 1} - 1
$$

$$
\abs{p - q}\leq \abs{2^k - 2^{k - 1} - 1} = \abs{2^{k - 1} - 1}
$$

となる．

# 低暗号化指数攻撃

異なる法$N$を利用した場合でも，小さな共通の$e$を利用し共通の平文$m$を$e$人に送信した場合$m$が解読できる．

この攻撃を低暗号化指数攻撃，またはHastad Broadcast Attackという．

## 証明
共通の$e$を利用し$e$人に異なる法$N_i~(1 \leq i \leq N)$を利用して平文$m$を送信したとする．

$N_i$が互いに素でない場合，$gcd$を計算して約数を特定できるため，$N_i$は互いに素であるとする．

それぞれの通信での暗号文は
$$
c_i = m^e \mod N_i
$$
であり，$N_i$が互いに素であるとしたから[中国剰余定理]({{ site.baseurl }}{% post_url 2022-10-26-crypto-basis %}#chinese_reminder_theorem)より
$$
(\forall i) ~ x \equiv m^e \mod N_i
$$
を満たす整数$x$が法$N_1N_2\cdots N_e$の下で一意に存在し，計算できる．

RSAの仮定から，$(\forall i) ~ m < N_i$であるから$m^e < N_1N_2 \cdots N_e$であるため，$\mathbb{Z}$上の$e$乗根で$m$を求めることができる．

# 反復暗号化攻撃
暗号を繰り返し暗号化することで闇雲に探索するよりも効率的に復号を試みることができる．

この攻撃を反復暗号化攻撃またはポラードのサイクリング攻撃という．

## RSA暗号の周期
暗号$c$に対して，
$$
c^{e^i} \mod N = c
$$
となる$i$をRSA暗号の周期という．これは暗号文を$i$回暗号化すると元の暗号文が出力されることを表す．

## 攻撃例
暗号文$c = m^e \mod N$に対して，周期が$i$であるとき，
$$
c^{e^i} \mod N = c = m^e \mod N\\
$$
であるから
$$
c^{e^{i - 1}} \mod N = m
$$
となり，$i - 1$回暗号化することで平文を得ることができる．

## 考察
法$N = pq$と指数$e$を公開鍵とするRSA暗号において
$$
c^{e^i} \mod N = c
$$
となる$i$の性質を吟味する．上の式を満たすとき，
$$
c^{e^i - 1} \mod N = 1
$$
である．よって法$N$上の$c$の位数を$ord_N(c)$とすると，
$$
e^i - 1 \equiv 0 \pmod {ord_N(c)}
$$
を満たす．これを満たす最小の$i$は法$ord_N(c)$上の$e$の位数であるから，
$$
i = ord_{ord_N(c)}(e)
$$
とかける．攻撃の際は$i$は小さな値から試して行くため，$ord_{ord_N(c)}(e)$が小さいと解読できてしまう．

# Wiener's Attack

[参考](https://www.cits.ruhr-uni-bochum.de/imperia/md/content/may/krypto2ss08/shortsecretexponents.pdf)

法$N$, 指数$e$を公開鍵とし，$d$を秘密鍵とするRSA暗号において，$d$が十分小さいとき公開鍵から$d$を復元できる．

## 連分数アルゴリズム

ある数$x$と非負実数$\delta$に対して，
$$
x^\prime = x (1 - \delta)
$$
とすると，$\delta$が十分小さいとき$x^\prime$から$x$を復元できるアルゴリズム．

この連分数展開は連分数展開を利用し，元の数に戻るまで展開を続ける．連分数展開とは
$$
\newcommand{\n}{\normalsize}
x = q_0 + \frac{1}{q_1 + \frac{\n 1}{\n\ddots \frac{}{\n q_{m - 1} + \frac{\n 1}{\n q_m}}}}
$$
のように分数を連ねた形に変換することで，上の例のようにあらわされる時，
$$
x = \lang q_0, q_1,\cdots,q_m \rang
$$
と表記する場合もある．

$x^\prime$の連分数展開を$i$回で打ち切ったものを
$$
\lang q_0, q_1,\cdots,q_i \rang
$$
とする．ここで，$n_i, d_i$を
$$
\frac{n_i}{d_i} = \lang q_0, q_1,\cdots,q_i \rang \quad \mathrm{for}
$$
と定義する．このとき
$$
\begin{aligned}
    (n_0, d_0) &= (q_0, ~ 1)\\
    (n_1, d_1) &= (q_0q_1 + 1, ~ q_1)\\
    (n_i, d_i) &= (q_{i}n_{i - 1} + n_{i - 2}, ~ q_{i}d_{i - 1} + d_{i - 2})\\
\end{aligned}
$$
を満たす．$x = \lang q_0, q_1,\cdots,q_m \rang$であるとき，
$$
x = \frac{n_m}{d_m}
$$
となり，連分数展開から$x$に戻すことができる．

ただし，戻すことが可能な$\delta$の範囲は以下のようになる．
$$
\delta \lt \frac{1}{\frac{3}{2}n_md_m}
$$

## 連分数アルゴリズムの実装

1. $x$の$i$回目の連分数展開を$\lang q_0, q_1,\cdots,q_i \rang$とする．

2. $i$が偶数の場合，$\lang q_0, q_1,\cdots,q_i + 1 \rang$を推測値とする．
   
   $i$が奇数の場合，$\lang q_0, q_1,\cdots,q_i \rang$を推測値とする．

3. 推測値が$x$と等しいか確認し，異なれば1に戻る．


別として推測値が正しいかを判別する仕組みが必要であることに注意．

## Wiener's Attackの条件
法$N = pq$，指数$e$，秘密鍵$d$であるRSA暗号への攻撃を示す．

RSAの定義から
$$
    ed \equiv 1 \pmod{\phi(N)}
$$
であるから，ある整数$k$を用いて
$$
\begin{aligned}
    ed &= k \cdot \phi(N) + 1\\
    &= k(p - 1)(q - 1) + 1
\end{aligned}
$$
両辺を$dpq$で割り
$$
\begin{aligned}
    \frac{e}{pq} &= \frac{k(p - 1)(q - 1) + 1}{dpq}\\
    &= \frac{k(pq - q - p + 1) + 1}{dpq}\\
    &= \frac{k}{d}\left(1 - \frac{(p + q - 1 - 1 / j)}{pq}\right)\\
    &= \frac{k}{d}\left(1 - \delta\right)
\end{aligned}
$$
いま，求めたい数は$\frac{k}{d}$であるから，$(n_m, d_m) = (k, d)$であり， 
$$
\delta \lt \frac{1}{\frac{3}{2}n_md_m} = \frac{1}{\frac{3}{2}kd}
$$
を満たす必要がある．よって
$$
\frac{(p + q - 1 - 1 / k)}{pq} = \delta \lt \frac{1}{\frac{3}{2}kd}
$$
$kd$に注目すれば，$kd$は以下を満たす必要がある．
$$
kd \lt \frac{pq}{\frac{3}{2}(p + q - 1 - \frac{1}{k})}
$$
また，
$$
\frac{pq}{\frac{3}{2}(p + q)} \lt \frac{pq}{\frac{3}{2}(p + q - 1 - \frac{1}{k})}
$$
であるから，$kd$は以下を満たせばよい
$$
kd \lt \frac{pq}{\frac{3}{2}(p + q)}
$$

これを満たすような$k, d$は
$$
d \lt \frac{N^{\frac{1}{4}}}{3}
$$
となればよい．

> 元論文では$\phi(N)$の代わりに$lcm(p- 1, q- 1)$を利用していたが，これはRSAの拡張である．
> また，RSAへの適用の式が変わるが元論文の式$(27)$での$k/ g$が上の式での$k$に当たるため問題ない．

## Wiener's Attackの実装

法$N = pq$と$e$を公開鍵とし，$d$を秘密鍵とするRSA暗号に対する攻撃とする．

1. $x^\prime = \frac{e}{N}$として連分数展開アルゴリズムを実行し，$\frac{k}{d}$の候補を列挙する．

2. 候補となる$k, d$から$\phi(N)$の候補$\phi(N) = \frac{ed}{k}$を求める．

3. $(p + q) / 2$の候補$b$を$2b = N - \phi(N) + 1$から求め，$2b$が奇数であったら次の候補に移動する．

4. $(p - q) / 2$の候補$c$を$c^2 = b^2 - N$から求め，$c^2$が平方数出なければ次の候補に移動する．

5. $p = b + c, q = b - c$を出力する．


# Coppersmith's Attack
平文$m$の上位ビットもしくは下位ビットが知られた場合(ビット数の1 - 1 /e程度)，$m$を計算できてしまう．

## 概要
Coppersmithの定理より整数$N$を法として，次数$d$のモニック多項式$f$に対し，$f(x) = 0 \mod N$となる$\abs{x} < N^{1/d - \epsilon}(\epsilon \geq 0)$を効率的に求めることができる．

暗号文を$c$とし，わかっているビット以外を全てゼロで埋めた数$m^\prime$から
$$
f(x) = (m^\prime + x)^e - c \pmod{N}
$$
の解は$m$に一致する．