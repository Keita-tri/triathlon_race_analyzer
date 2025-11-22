#!/bin/sh
set -e

# 既存のdistディレクトリを削除
rm -rf dist

# ビルド
npm run build

# distディレクトリに移動
cd dist

# gitリポジトリを初期化
git init

# すべてのファイルを追加してコミット
git add .
git commit -m 'deploy'

# gh-pagesブランチとしてプッシュ
git push -f https://github.com/Keita-tri/triathlon_race_analyzer.git HEAD:gh-pages

# 元のディレクトリに戻る
cd -
