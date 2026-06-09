# nethakase
ネットリテラシーを親子で学ぶためのWebサイト

## GitHub Pages

このサイトは GitHub Pages で公開しています。

- 公開元: `main` ブランチのリポジトリ直下 `/`
- 独自ドメイン: `nethakase.com`

## Xserverで設定するDNSレコード

XserverのDNSレコード設定で、以下を追加します。

### Aレコード

| ホスト名 | 種別 | 内容 |
| --- | --- | --- |
| nethakase.com | A | 185.199.108.153 |
| nethakase.com | A | 185.199.109.153 |
| nethakase.com | A | 185.199.110.153 |
| nethakase.com | A | 185.199.111.153 |

### CNAME

| ホスト名 | 種別 | 内容 |
| --- | --- | --- |
| www.nethakase.com | CNAME | sz3577.github.io |

DNSの反映には時間がかかることがあります。既存のAレコードやCNAMEがある場合は、上記と競合しないように確認してください。
