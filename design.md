Triathlon World Cup Analyzer 総合設計仕様書

1. プロジェクト概要

本プロジェクトは、トライアスロン（ワールドカップ・WTCS）のレース結果データを分析し、選手やコーチが次に出場すべきレースを選定するための支援ツールを開発することを目的とする。
過去の膨大なスタッツデータを可視化し、直感的なUIで「自分に有利なレース傾向」を発見できるシステムを構築する。

2. システム要件定義

2.1. コアコンセプト

データ駆動 (Data-Driven): プログラムコードを変更することなく、CSVファイルを差し替えるだけで分析指標や定義を更新できること。

クライアントサイド完結: サーバーサイド処理を必要とせず、ブラウザ上で高速に動作すること。

ユーザーフレンドリー: 専門的な統計データを、色や言葉で直感的に理解できるようにすること。

2.2. 機能一覧

機能区分

機能ID

機能名称

詳細要件

データ管理

D-01

自動データロード

アプリ起動時、所定のCSVファイル（データ・定義書）を自動的に読み込む。



D-02

手動アップロード

ローカル環境等でファイル選択ダイアログからCSVを読み込めるようにする。



D-03

動的マッピング

データCSVのヘッダーと定義書CSVを照合し、表示設定を動的に生成する。

表示・操作

V-01

データテーブル

レースデータを表形式で表示。列の固定（大会名）、ヘッダー固定に対応。



V-02

並び替え (Sort)

ヘッダー項目名のクリックで昇順・降順を切り替える。



V-03

列移動 (DnD)

ヘッダー内のハンドルアイコンをドラッグして列の順序を変更する。



V-04

ヒートマップ

値の良し悪しに応じてセルの背景色（Cyan系）の濃淡を自動調整する。

フィルタ

F-01

キーワード検索

大会名、開催地に対するインクリメンタル検索（部分一致）。



F-02

マルチセレクト

「開催年」「大会クラス」をチェックボックスで複数選択して絞り込む。



F-03

プリセット分析

「初心者向け」「Swim勝負」などのボタンで、表示項目とソート順を一括適用する。



F-04

全クリア

全てのフィルタ、ソート、表示項目設定を初期状態に戻す。

ガイド

G-01

サイドバー

カテゴリごとに指標をグループ化して表示。チェックボックスで表示切替。



G-02

詳細パネル

選択中の指標に関する詳細説明、判断基準、計算式をフッターに表示（開閉可能）。



G-03

ツールチップ

マウスオーバー時に簡易説明を表示。

3. データアーキテクチャ

システムは2つのCSVファイルを入力として動作します。

3.1. レースデータソース (trianalysisV3.csv)

形式: 標準的なCSV（カンマ区切り、ヘッダーあり）。

内容: 1行につき1レースのスタッツデータ。

主要カラム:

event_title: ユニークキーの役割。

finish_rate_pct, swim_winner_deficit, bike_expansion_ratio 等の数値データ。

その他、定義書に記載のないカラムも許容し、自動的に「その他」カテゴリとして扱う。

3.2. 指標定義マスタ (指標定義書v6.csv)

分析ロジックの「脳」となるメタデータです。

カラム名

役割

値の例

カテゴリ

サイドバーでの分類グループ

基本, スイム, バイク

カラム名

データソースとの結合キー

finish_rate_pct

日本語指標名

UI表示用ラベル

完走率

指標説明

ガイドパネル用テキスト

コースの過酷さを示します。

判断基準

ヒートマップと評価のロジック

Positive (大=良), Negative (小=良), Depends

計算方法

ユーザーへの根拠提示

Fin / Start

4. 詳細ロジック仕様

4.1. ヒートマップ色分けロジック

各列の数値データに対し、以下のアルゴリズムで背景色の透明度（Alpha値）を決定する。

Min/Max算出: 表示中のデータから、その列の最小値(min)と最大値(max)を特定。

正規化: 値 v の位置 pct = (v - min) / (max - min) を計算（0.0～1.0）。

判断基準の適用:

定義が Negative（小さい方が良い）の場合: pct = 1 - pct で反転。

定義が Positive（大きい方が良い）の場合: そのまま。

定義が Depends または数値以外: 色付けなし。

色生成: rgba(6, 182, 212, base + (pct * scale)) を適用。

推奨値: base=0.05, scale=0.3～0.4

4.2. カテゴリ自動分類・アイコンマッピング

CSVから読み込んだカテゴリ文字列を正規化し、UIアイコンを割り当てる。

CSVカテゴリ名 (正規表現)

UI表示名

アイコン

テーマ色

Swim, スイム

Swim

🏊 fa-person-swimming

Blue

Bike, バイク

Bike

🚴 fa-bicycle

Orange

Run, ラン

Run

🏃 fa-person-running

Emerald

Rank, ランク

Rank

🏆 fa-trophy

Violet

Basic, 基本

基本

📅 fa-calendar-day

Slate

その他

その他

📂 fa-folder-open

Pink

4.3. リザルトリンク生成

event_title カラムの値から、公式リザルトページへのURLを動的に生成する。

ロジック: 大会名を小文字化し、スペースをハイフン(-)に置換したものをスラッグとする。

URL形式: https://triathlon.org/events/{slug}/results/{prog_id}

5. UI/UX デザイン仕様

5.1. レイアウト構造

Header: タイトル、ファイル読込ボタン、ステータス表示。

Layout Body (Flex/Grid):

Left Sidebar (Fixed Width): 指標選択アコーディオン。

Main Area (Fluid):

Top Toolbar: 検索窓、フィルタ（Class, Year）、機能ボタン（ヒートマップ切替、全クリア）、プリセットボタン群。

Data Table: スクロール可能なデータ表示領域。stickyヘッダーとsticky第1列（大会名）。

Footer Panel: 詳細ガイド表示エリア（開閉可能）。

5.2. インタラクション詳細

ソート vs ドラッグ:

ヘッダーセルの**「テキスト部分」**クリック → ソート実行。

ヘッダーセルの**「ハンドルアイコン」**ドラッグ → 列移動開始。

詳細パネル連動:

ヘッダーをクリック（ソート）した際、その指標の解説をフッターパネルに即座に表示する。

マルチセレクト:

フィルタのドロップダウンは閉じずに連続選択可能とする。

「すべて選択」「すべて解除」のショートカットを設ける。

6. 実装アーキテクチャ (React推奨構成)

6.1. コンポーネント構成案

App
├── Header
├── MainLayout
│   ├── Sidebar
│   │   └── MetricAccordion
│   │       └── MetricItem (Checkbox, Tooltip)
│   └── ContentArea
│       ├── Toolbar
│       │   ├── SearchInput
│       │   ├── FilterDropdown (MultiSelect)
│       │   └── PresetList
│       ├── DataTable
│       │   ├── TableHead (Sortable, Draggable)
│       │   └── TableBody (Heatmap Cell)
│       └── DetailPanel (Collapsible)
└── GlobalTooltip


6.2. 主要State設計

definitions: MetricDef[] (読み込んだ定義マスタ)

data: RaceData[] (読み込んだレースデータ)

viewState:

visibleColumns: Set<string> (表示中のカラムID)

columnOrder: string[] (列の並び順)

sort: { key: string, order: 'asc'|'desc' }

filters: { year: Set<string>, class: Set<string>, search: string }

focusedMetric: string | null (詳細パネルに表示中の指標ID)

6.3. 拡張性への考慮

未知のカラム対応: trianalysisV3.csv に定義書にないカラムが含まれていた場合、無視せずに自動的に metricsList に「その他」カテゴリとして追加するロジックを実装する（V16の実装を参照）。

7. 開発フェーズごとのゴール

Phase 1 (Data Layer): CSVパーサーの実装、データ構造の定義、基本的な表示。

Phase 2 (Core UI): テーブル描画、ソート、フィルタリングの実装。

Phase 3 (Visualization): ヒートマップロジック、サイドバーの実装。

Phase 4 (UX Polish): 列のドラッグ＆ドロップ、詳細パネルの連動、ツールチップ、プリセット機能の実装。


### 開発者への申し送り
このドキュメントと共に、**完成版プロトタイプ（`triathlon_analyzer_v17_perfect.html`）**をエンジニアに提供してください。
ロジックの細部（特にCSVパースや色の計算式）は、コードそのものが最も正確な仕様となります。
