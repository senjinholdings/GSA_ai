#!/usr/bin/env python3
"""
HTTP server with Gzip compression and caching headers
Port: 3000 (production-like setup)
"""

import http.server
import socketserver
import gzip
import io
import os
from urllib.parse import unquote

PORT = 9000

class CompressedHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with gzip compression and cache headers"""

    def end_headers(self):
        # Add cache headers based on file type
        path = self.translate_path(self.path)

        # Static assets - 1 year cache
        if any(path.endswith(ext) for ext in ['.webp', '.jpg', '.jpeg', '.png', '.gif', '.ico', '.svg',
                                                '.woff', '.woff2', '.ttf', '.otf', '.eot',
                                                '.css', '.js']):
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')

        # HTML - 1 hour cache
        elif path.endswith('.html') or path.endswith('/'):
            self.send_header('Cache-Control', 'public, max-age=3600, must-revalidate')

        # CSV - no cache (dynamic content)
        elif path.endswith('.csv'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')

        # Security headers
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-XSS-Protection', '1; mode=block')

        super().end_headers()

    def do_GET(self):
        # Get the file path
        path = self.translate_path(self.path)

        # Check if file exists
        if not os.path.exists(path):
            super().do_GET()
            return

        # Check if client accepts gzip
        accept_encoding = self.headers.get('Accept-Encoding', '')

        # Compressible types
        compressible = any(path.endswith(ext) for ext in
                          ['.html', '.css', '.js', '.json', '.xml', '.svg', '.csv', '.txt'])

        if 'gzip' in accept_encoding and compressible and os.path.isfile(path):
            # Read file
            try:
                with open(path, 'rb') as f:
                    content = f.read()

                # Compress
                out = io.BytesIO()
                with gzip.GzipFile(fileobj=out, mode='wb', compresslevel=6) as gz:
                    gz.write(content)
                compressed = out.getvalue()

                # Only use compression if it actually reduces size
                if len(compressed) < len(content):
                    # Send compressed response
                    self.send_response(200)
                    self.send_header('Content-Type', self.guess_type(path))
                    self.send_header('Content-Encoding', 'gzip')
                    self.send_header('Content-Length', len(compressed))
                    self.send_header('Vary', 'Accept-Encoding')
                    self.end_headers()
                    self.wfile.write(compressed)
                    return
            except Exception as e:
                # Fall back to uncompressed on error
                print(f"Compression error: {e}")

        # Fall back to default handler (uncompressed)
        super().do_GET()

# Change to the ai001 directory
os.chdir('/Users/hattaryoga/Desktop/GoogleSearchAdsSite/AI副業おすすめ比較/ai001')

with socketserver.TCPServer(("", PORT), CompressedHTTPRequestHandler) as httpd:
    print("=" * 50)
    print("  AI副業おすすめ比較サイト 圧縮サーバー")
    print("=" * 50)
    print()
    print(f"Gzip圧縮が有効なサーバーをポート {PORT} で起動します...")
    print(f"ブラウザで以下にアクセスしてください：")
    print(f"  → http://localhost:{PORT}/")
    print()
    print("終了するには Ctrl+C を押してください")
    print()
    httpd.serve_forever()
