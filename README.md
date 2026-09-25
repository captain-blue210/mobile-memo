# Mobile Memo

[![Release workflow](https://github.com/captain-blue210/mobile-memo/actions/workflows/release.yaml/badge.svg)](https://github.com/captain-blue210/mobile-memo/actions/workflows/release.yaml)

![Mobile Memo](https://raw.githubusercontent.com/captain-blue210/mobile-memo/main/image.png)

Mobile Memo は、Obsidian のデイリーノートをモバイル向けのタイムライン UI で扱うプラグインです。メモとタスクをすばやく追加し、日付ごとの内容を軽量に確認できます。

- 選択中の 1 日分だけを読み込むタイムライン
- Markdown 対応のメモ投稿
- Web ページ、画像、X（旧 Twitter）URL のプレビュー
- タスクの追加と完了・未完了の切り替え
- 日付移動、今日へ戻る操作、デイリーノートを直接開く操作
- PC とモバイルで個別に指定できる表示位置
- iOS を含むモバイルキーボードを考慮した入力 UI

内部のプラグイン ID は `obsidian-mobile-memo`、必要な Obsidian の最小バージョンは `1.2.8` です。デスクトップ専用ではありません。

## インストール

このプラグインは Obsidian のコミュニティプラグイン一覧には登録されていません。

### BRAT

[BRAT]で次のリポジトリを追加し、Obsidian の「コミュニティプラグイン」から Mobile Memo を有効にします。

```text
captain-blue210/mobile-memo
```

GitHub Releases に配布ファイルがまだない場合は、次の手動インストールを利用してください。

### 手動インストール

1. [Bun]をインストールします。
2. このリポジトリをクローンし、依存関係のインストールとビルドを実行します。

   ```bash
   git clone https://github.com/captain-blue210/mobile-memo.git
   cd mobile-memo
   bun install
   bun run build
   ```

3. 次の 3 ファイルを Vault 内の `.obsidian/plugins/obsidian-mobile-memo/` に配置します。

   - `main.js`
   - `manifest.json`
   - `styles.css`

4. Obsidian を再読み込みし、「設定」→「コミュニティプラグイン」から Mobile Memo を有効にします。

## 使い方

### 開く

次のどちらかで Mobile Memo を開きます。

- リボンの鉛筆アイコン「Mobile Memo」をクリックする
- コマンドパレットで `Mobile Memo: Mobile Memoを開く` を実行する

表示先は PC とモバイルで個別に設定できます。初期値はいずれも左サイドリーフです。

### 日付を選ぶ

画面上部で対象日を切り替えます。

- 左右の矢印: 前日・翌日へ移動
- 「今日」: 今日へ戻る
- 日付入力: 任意の日を選択
- 右上の外部リンクアイコン: 対象日のデイリーノートを Obsidian で開く

対象日のデイリーノートが存在しない場合は、最初の投稿時または外部リンクアイコンを押したときに作成されます。

### メモを投稿する

1. 入力欄の左下をメモモード（吹き出しアイコン）にします。
2. Markdown で内容を入力します。
3. 「送信」を押します。PC では `Ctrl+Enter` でも送信できます。

投稿は新しい順に表示されます。投稿カードでは次の操作ができます。

- 投稿日時をクリックして、元のデイリーノート内の該当位置を開く
- `copy` をクリックして投稿本文をクリップボードへコピーする
- 本文中の Web ページ、画像、X（旧 Twitter）の URL をプレビューする

投稿の編集や削除は、元のデイリーノートを直接編集してください。ファイル変更は Mobile Memo の表示へ反映されます。

### タスクを扱う

1. 入力欄の左下をタスクモード（チェックアイコン）にします。
2. タスク名を入力して「タスク追加」を押します。
3. 一覧のチェックボックスで完了・未完了を切り替えます。

タスクはデイリーノートへ `- [ ] タスク名` の形式で追加されます。未完了と完了済みは分けて表示されます。

## 設定

設定は Obsidian の「設定」→「Mobile Memo」から変更します。

### 投稿形式

初期値: `コードブロック`

メモの保存形式と、タイムラインで読み込む形式を選びます。

| 設定値               | 保存形式                                     |
| -------------------- | -------------------------------------------- |
| コードブロック       | 日時をメタ情報に持つ `fw` コードブロック     |
| `見出し1`〜`見出し6` | 日時を見出し、投稿本文を見出し本文として保存 |
| リスト               | `- 日時 本文` の 1 行リスト                  |

投稿形式を変更すると、選択した形式に一致する投稿が表示対象になります。リスト形式の投稿をタイムラインへ読み込むには「追記先の見出し」も設定してください。

### デイリーノートのディレクトリ

初期値: 空

Vault 相対の保存先フォルダを指定します。

- 空の場合: Obsidian の Daily Notes 設定にあるフォルダ、ファイル名形式、テンプレートを使用します。
- 指定した場合: Daily Notes のファイル名形式を使い、指定フォルダへ作成します。必要な親フォルダも自動作成します。

例:

```text
Journal/Daily
```

ディレクトリを指定した場合、新しいデイリーノートは空ファイルとして作成され、Daily Notes のテンプレートは適用されません。

### 追記先の見出し

初期値: 空

投稿を追加するセクションを、見出し記号を含めて指定します。

```text
## つぶやき
```

- 空の場合はファイル末尾へ追記します。
- 指定した見出しがない場合は、ファイル末尾に見出しを作成してから投稿します。
- 見出しがある場合は、同レベル以上の次の見出しの直前までを対象セクションとします。

### 追記区切り

初期値: 空

「追記先の見出し」から、この文字列が現れる位置までを投稿先として扱います。区切りが対象セクション内に見つからない場合は、セクション末尾へ追記します。

### 投稿日時フォーマット

初期値: `YYYY-MM-DD HH:mm`

投稿に付与する日時を Moment.js 形式で指定します。既存投稿の読み込みにも同じ形式を使うため、変更後は以前の形式で保存した投稿が表示されなくなる場合があります。

### 投稿見出しを自動で段下げ

初期値: オン

見出し形式で投稿し、「追記先の見出し」を設定している場合、投稿見出しが追記先より下位になるよう自動調整します。たとえば追記先が `##` で、投稿形式が `見出し1` の場合、実際の投稿は `###` になります。

オフにすると、選択した投稿形式の見出しレベルをそのまま使用します。

### 表示リーフ（PC）／表示リーフ（モバイル）

初期値: `left`

PC とモバイルで Mobile Memo を開く場所を個別に指定します。

| 設定値    | 表示先                 |
| --------- | ---------------------- |
| `left`    | 左サイドリーフ         |
| `right`   | 右サイドリーフ         |
| `current` | 現在アクティブなリーフ |

すでに Mobile Memo が開いている場合は既存のビューを再利用します。`current` を選んだ場合は、必要に応じて現在のリーフへ移動します。

### Obsidian 起動時に自動起動・アクティブにする

初期値: オフ

Obsidian のレイアウト準備後に Mobile Memo を開き、アクティブにします。既存のビューがあれば再利用し、なければプラットフォーム別の表示リーフ設定に従って作成します。

### モバイル起動時に入力フォームを自動表示

初期値: オフ

モバイルで Obsidian を起動したとき、またはバックグラウンドから復帰したときに Mobile Memo を開き、通常の入力フォームへフォーカスします。モーダルは使用しません。

## 現在の仕様と注意点

- 一度に読み込むのは、画面で選択している 1 日分のデイリーノートだけです。
- 投稿形式や日時フォーマットと一致しない既存コンテンツは、投稿一覧には表示されません。
- タスクモードでは、対象のデイリーノート内にあるすべての Markdown タスクを表示します。
- URL プレビューの取得にはネットワーク接続が必要です。対象サイトの応答形式や制限によってはプレビューできません。
- 表示対象のデイリーノートを削除すると、画面上の投稿とタスクもクリアされます。

## 開発

### 必要環境

- [Bun]
- Node.js 互換の開発環境
- 開発時の動作確認に使用する Obsidian Vault

### セットアップ

```bash
git clone https://github.com/captain-blue210/mobile-memo.git
cd mobile-memo
bun install
git config core.hooksPath hooks
```

### 開発用 Vault の設定

プロジェクト直下に `.env` を作成し、Vault の絶対パスを指定します。

```dotenv
VAULT_DIR=/absolute/path/to/your/ObsidianVault
```

`bun run dev` はソースを監視してビルドし、`main.js`、`manifest.json`、`styles.css` を次の場所へコピーします。

```text
<VAULT_DIR>/.obsidian/plugins/obsidian-mobile-memo/
```

また、開発用の `.hotreload` ファイルも作成します。

### コマンド

| コマンド        | 内容                                   |
| --------------- | -------------------------------------- |
| `bun run dev`   | 監視ビルドと開発用 Vault へのコピー    |
| `bun run build` | TypeScript の型チェックと本番バンドル  |
| `bun run test`  | Jest テストの実行                      |
| `bun run ci`    | 依存関係のインストール、ビルド、テスト |

テストは Jest、`esbuild-jest`、jsdom を使用します。Obsidian API のテスト用モックは `src/__mocks__/obsidian.ts` にあります。

### リリース

`main` ブランチへの push または手動実行で[Release workflow]が起動します。リリース判定とバージョン更新には semantic-release を使用し、`main.js`、`styles.css`、`manifest.json` を GitHub Release へ添付します。

コミットメッセージは Conventional Commits 形式です。

```text
<type>(<scope>)?: <description>
```

利用できる type は `feat`、`fix`、`style`、`docs`、`refactor`、`test`、`ci`、`build`、`dev`、`chore` です。

## プロジェクトの由来

Mobile Memo は、[tadashi-aikawa/mobile-first-daily-interface]を起点として開発されています。また、タイムライン型のデイリーノート UI という発想は[Obsidian Memos]（現在の[Thino]）から強い影響を受けています。

[BRAT]: https://github.com/TfTHacker/obsidian42-brat
[Bun]: https://bun.sh/
[Obsidian Memos]: https://github.com/Quorafind/Obsidian-Memos
[Release workflow]: https://github.com/captain-blue210/mobile-memo/actions/workflows/release.yaml
[Thino]: https://github.com/Quorafind/Obsidian-Thino
[tadashi-aikawa/mobile-first-daily-interface]: https://github.com/tadashi-aikawa/mobile-first-daily-interface
