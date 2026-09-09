"""Local review server. Ctrl+C closes the server and its socket."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--open', action='store_true', help='Open the local page in your browser')
    parser.add_argument('--port', type=int, default=4173)
    parser.add_argument('--test-model-failure', action='store_true', help='QA only: serve the model as HTTP 503')
    parser.add_argument('--test-streamline-failure', action='store_true', help='QA only: fail the first CC detail request, then allow retry')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1] / 'dist'
    if not (root / 'index.html').exists():
        parser.error('Build output missing. Run npm run build first.')

    class Handler(SimpleHTTPRequestHandler):
        extensions_map = {**SimpleHTTPRequestHandler.extensions_map, '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.js': 'text/javascript'}
        failed_streamline = False

        def do_GET(self):
            if args.test_streamline_failure and not Handler.failed_streamline and self.path.split('?')[0] == '/tractography/CC.bin.gz':
                Handler.failed_streamline = True
                self.send_error(503, 'Intentional first streamline-load failure for QA')
                return
            if args.test_model_failure and self.path.split('?')[0] == '/models/brain.glb':
                self.send_error(503, 'Intentional model-load failure for QA')
                return
            super().do_GET()

    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), partial(Handler, directory=str(root)))
    except OSError as error:
        parser.error(f'Cannot listen on port {args.port}: {error}')
    with server:
        url = f'http://127.0.0.1:{args.port}/'
        print(f'Brain Atlas: {url}\nPress Ctrl+C to stop.', flush=True)
        if args.open:
            webbrowser.open(url)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print('\nBrain Atlas server stopped.')


if __name__ == '__main__':
    main()
