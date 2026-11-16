#!/usr/bin/env python3
"""MONARDAS: staged, read-only Lark IMAP diagnosis.

One local login attempt after a password prompt. No credentials are written,
no message bodies are fetched, no flags or folders are modified, no SMTP.
Result reports DNS/TLS+IMAP connection, login, LIST, readonly INBOX SELECT,
UID SEARCH, and at most one HEADER-only UID FETCH stage. No email data printed.
"""
from __future__ import annotations

import argparse
import getpass
import imaplib
import re
import ssl
import sys

HOST = "imap.larksuite.com"
PORT = 993
MAILBOX = "yurii@monardas.com"
SINCE = "13-Nov-2026"
TIMEOUT = 15


def outcome(stage: str, error: BaseException) -> int:
    typ = type(error).__name__
    if isinstance(error, TimeoutError):
        print("STOP_TIMEOUT_AT=" + stage, "EXCEPTION=" + typ, flush=True)
    elif isinstance(error, imaplib.IMAP4.error):
        print("STOP_IMAP_ERROR_AT=" + stage, "EXCEPTION=" + typ, flush=True)
    elif isinstance(error, (OSError, ssl.SSLError)):
        print("STOP_TRANSPORT_ERROR_AT=" + stage, "EXCEPTION=" + typ, flush=True)
    else:
        print("STOP_UNEXPECTED_AT=" + stage, "EXCEPTION=" + typ, flush=True)
    print("NO_CHANGES_NO_SEND_NO_RETRY", flush=True)
    return 2


def self_test() -> int:
    assert HOST == "imap.larksuite.com" and PORT == 993
    assert SINCE == "13-Nov-2026"
    assert TIMEOUT <= 20
    assert re.fullmatch(r"[\w.+-]+@monardas\.com", MAILBOX)
    assert isinstance(TimeoutError(), OSError)
    print("SELFTEST_PASS_NO_NETWORK_NO_CREDENTIALS", flush=True)
    return 0


def run() -> int:
    print("MONARDAS_LARK_STAGE_DIAGNOSTIC_V1", flush=True)
    print("NO_SMTP_NO_MESSAGE_BODIES_NO_FLAG_CHANGES_NO_CREDENTIAL_STORAGE", flush=True)
    stage = "PASSWORD_PROMPT"
    pw = getpass.getpass("Lark IMAP application password for " + MAILBOX + " (not stored): ")
    if not pw:
        print("STOP_EMPTY_PASSWORD", flush=True)
        return 2
    conn = None
    try:
        stage = "SSL_IMAP_CONNECT"
        print("STAGE_CONNECT_START", flush=True)
        conn = imaplib.IMAP4_SSL(HOST, PORT, ssl_context=ssl.create_default_context(), timeout=TIMEOUT)
        print("STAGE_CONNECT_PASS", flush=True)

        stage = "LOGIN"
        print("STAGE_LOGIN_START", flush=True)
        status, _ = conn.login(MAILBOX, pw)
        pw = ""
        if status != "OK":
            print("STOP_LOGIN_NOT_OK", flush=True)
            return 2
        print("STAGE_LOGIN_PASS", flush=True)

        stage = "LIST"
        print("STAGE_LIST_START", flush=True)
        status, folders = conn.list()
        if status != "OK":
            print("STOP_LIST_NOT_OK", flush=True)
            return 2
        print("STAGE_LIST_PASS", "FOLDERS=" + str(len(folders or [])), flush=True)

        stage = "INBOX_READONLY_SELECT"
        print("STAGE_INBOX_START", flush=True)
        status, count = conn.select("INBOX", readonly=True)
        if status != "OK":
            print("STOP_INBOX_NOT_OK", flush=True)
            return 2
        print("STAGE_INBOX_READONLY_PASS", flush=True)

        stage = "UID_SEARCH"
        print("STAGE_SEARCH_START", flush=True)
        status, found = conn.uid("SEARCH", None, "SINCE", SINCE)
        if status != "OK":
            print("STOP_SEARCH_NOT_OK", flush=True)
            return 2
        uids = (found[0] or b"").split() if found else []
        print("STAGE_SEARCH_PASS", "RECENT_COUNT=" + str(len(uids)), flush=True)

        if uids:
            stage = "SINGLE_HEADER_PEEK"
            print("STAGE_HEADER_PEEK_START", flush=True)
            status, rows = conn.uid(
                "FETCH", uids[-1],
                "(BODY.PEEK[HEADER.FIELDS (FROM DATE SUBJECT MESSAGE-ID)])"
            )
            if status != "OK" or not any(
                isinstance(row, tuple) and len(row) > 1 and isinstance(row[1], bytes)
                for row in (rows or [])
            ):
                print("STOP_HEADER_PEEK_UNAVAILABLE", flush=True)
                return 2
            print("STAGE_HEADER_PEEK_PASS", flush=True)
        else:
            print("STAGE_HEADER_PEEK_SKIPPED_NO_RECENT_INBOX_MESSAGES", flush=True)

        print("LARK_AUTH_AND_INBOX_READONLY_PASS", flush=True)
        print("NEXT_FULL_INBOUND_AUDIT_STILL_REQUIRED", flush=True)
        return 0
    except (imaplib.IMAP4.error, OSError, ssl.SSLError) as err:
        return outcome(stage, err)
    finally:
        pw = ""
        if conn is not None:
            try:
                conn.logout()
            except (imaplib.IMAP4.error, OSError, ssl.SSLError):
                print("WARN_LOGOUT_NOT_CONFIRMED", flush=True)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    return self_test() if args.self_test else run()


if __name__ == "__main__":
    sys.exit(main())
