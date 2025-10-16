#!/bin/bash
# ローカルサーバー起動スクリプト

echo "=========================================="
echo "  AI副業おすすめ比較サイト ローカルサーバー"
echo "=========================================="
echo ""

cd "$(dirname "$0")"

# Pythonのバージョンを確認
if command -v python3 &> /dev/null; then
    echo "Python 3でサーバーを起動します..."
    echo "ブラウザで以下にアクセスしてください："
    echo "  → http://localhost:8000/"
    echo ""
    echo "終了するには Ctrl+C を押してください"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Python 2でサーバーを起動します..."
    echo "ブラウザで以下にアクセスしてください："
    echo "  → http://localhost:8000/"
    echo ""
    echo "終了するには Ctrl+C を押してください"
    echo ""
    python -m SimpleHTTPServer 8000
else
    echo "エラー: Pythonがインストールされていません"
    echo ""
    echo "以下のいずれかをインストールしてください："
    echo "  - Python 3: https://www.python.org/"
    echo "  - Node.js (http-server): https://nodejs.org/"
    exit 1
fi
