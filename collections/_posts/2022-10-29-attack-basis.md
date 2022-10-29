---
title: 攻撃の基本
tags: crypto
---

# 攻撃モデル

# 攻撃の手法
## リプレイ攻撃(replay attack){: #replay_attack }
以前に流出した復号鍵を利用して以降の通信を盗聴する攻撃のこと．

暗号化に同じ鍵を複数回利用するとこの攻撃を利用されることになる．

ユーザーが設定した鍵に乱数を混ぜ，それを暗号化に利用することでリプレイ攻撃を防止することができる．この時に使われる乱数を[ノンス]({% post_url 2022-10-26-crypto-basis %}#nonce)という．