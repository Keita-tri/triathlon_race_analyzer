#!/bin/sh
set -e

# ビルド
npm run build

# distディレクトリに移動
cd dist

# gitリポジトリを初期化し、gh-pagesブランチを作成
git init
git checkout -b gh-pages

# すべてのファイルを追加してコミット
git add .
git commit -m 'deploy'

# GitHubにプッシュ
git push -f https://github.com/Keita-tri/triathlon_race_analyzer.git gh-pages

# 元のディレクトリに戻る
cd -