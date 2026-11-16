#!/usr/bin/env python3
"""Read-only, NO authentication: distinguish DNS/TCP/TLS/IMAP greeting failures for Lark."""
from __future__ import annotations
import socket
import ssl
import sys
import time

HOST = 'imap.larksuite.com'
PORT = 993
TIMEOUT = 8.0


def main() -> int:
    print('MONARDAS_LARK_CONNECTIVITY_DIAGNOSTIC_V1')
    print('NO_PASSWORD_NO_LOGIN_NO_MAIL_READ_NO_SEND_NO_WRITES')
    started = time.monotonic()
    try:
        results = socket.getaddrinfo(HOST, PORT, type=socket.SOCK_STREAM)
    except (OSError, socket.gaierror) as err:
        print('DNS_FAIL', type(err).__name__)
        return 2
    candidates = []
    for family, socktype, proto, _, sockaddr in results:
        if family not in (socket.AF_INET, socket.AF_INET6):
            continue
        if family not in [a[0] for a in candidates]:
            candidates.append((family, socktype, proto, sockaddr))
    print('DNS_PASS', 'IPV4='+str(any(a[0] == socket.AF_INET for a in candidates)),
          'IPV6='+str(any(a[0] == socket.AF_INET6 for a in candidates)),
          'ELAPSED_SEC='+str(round(time.monotonic()-started, 1)))
    if not candidates:
        print('STOP_NO_ADDRESSES')
        return 2
    ctx = ssl.create_default_context()
    all_failed = True
    for family, kind, proto, address in candidates:
        label = 'IPV4' if family == socket.AF_INET else 'IPV6'
        try:
            with socket.socket(family, kind, proto) as raw:
                raw.settimeout(TIMEOUT)
                raw.connect(address)
                print('TCP_PASS', label, 'PORT=993')
                with ctx.wrap_socket(raw, server_hostname=HOST) as tls:
                    tls.settimeout(TIMEOUT)
                    print('TLS_PASS', label, 'VERSION='+str(tls.version()), 'CERT_VERIFIED=YES')
                    greeting = b''
                    while not greeting.endswith(b'\n') and len(greeting) < 1024:
                        part = tls.recv(1)
                        if not part:
                            break
                        greeting += part
                    if greeting.upper().startswith((b'* OK', b'* PREAUTH')):
                        print('IMAP_GREETING_PASS', label)
                        print('NETWORK_PATH_READY', 'AUTHENTICATION_NOT_TESTED')
                        return 0
                    if greeting:
                        print('IMAP_GREETING_UNEXPECTED', label, 'PREFIX='+repr(greeting[:24]))
                    else:
                        print('IMAP_GREETING_EMPTY', label)
                    all_failed = False
        except (TimeoutError, OSError, ssl.SSLError) as err:
            print('NETWORK_STAGE_FAIL', label, type(err).__name__)
    print('RESULT=NETWORK_OR_GREETING_NOT_READY' if all_failed else 'RESULT=IMAP_GREETING_NOT_READY')
    print('DO_NOT_RETRY_LOGIN_WITHOUT_REVIEW')
    return 1


if __name__ == '__main__':
    sys.exit(main())
