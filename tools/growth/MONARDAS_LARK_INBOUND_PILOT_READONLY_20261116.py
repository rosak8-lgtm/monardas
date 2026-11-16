#!/usr/bin/env python3
"""Read-only owner-side Lark inbound audit for MONARDAS founding HVAC pilots.

No SMTP, no writes, no credentials stored, no dependencies beyond Python stdlib.
Scan Lark folders since 13 Nov 2026, without setting the Seen flag (SELECT readonly + BODY.PEEK).
An observed header match is a lead/reply *candidate*, not confirmed interest.
"""
from __future__ import annotations
import argparse
import getpass
import imaplib
import re
import ssl
import sys
from dataclasses import dataclass
from email import policy
from email.parser import BytesParser
from email.utils import getaddresses

HOST = "imap.larksuite.com"
PORT = 993
SINCE = "13-Nov-2026"
FOLDER_RX = re.compile(rb'(?:"(?:\\.|[^"\\])*"|\S+)\s*$')
SENDER_EXACT = frozenset({
    "info@pureairla.com", "info@a-classhvac.com", "hello@liraltd.com",
    "get@grsserviceinc.com", "mihashvac@gmail.com", "info@floheatingandair.com",
    "hvac@arkticair.com", "website@send.monardas.com", "sales@send.monardas.com",
})
SENDER_DOMAIN = frozenset({
    "pureairla.com", "a-classhvac.com", "liraltd.com", "fuse.club",
    "grsserviceinc.com", "mihashvac.com", "floheatingandair.com",
    "arkticair.com", "fuseservice.com", "monardas.com",
})
INTEREST = re.compile(r"(monardas|hvac|estimate|pilot|partnership|referral|proposal|recovery|follow[ -]?up|partner|см[её]т\w*|пилот\w*|сотрудничеств\w*|заявк\w*)", re.I)
BOUNCE = re.compile(r"(mailer-daemon|postmaster|delivery[ -]status|undeliver|failure[ -]notice|mail delivery)",re.I)
MAX_SUBJECT=112


def stop(msg: str, code: int = 2) -> int:
    print("STOP:", msg, flush=True)
    return code


def parse_folder(raw: bytes) -> str | None:
    if not raw or b"\\Noselect".lower() in raw.lower():
        return None
    matched = FOLDER_RX.search(raw)
    if matched is None:
        return None
    try:
        return matched.group().strip().decode("ascii")
    except UnicodeDecodeError:
        return None


def display_folder(folder: str) -> str:
    if folder.startswith('"') and folder.endswith('"'):
        folder = folder[1:-1].replace('\\"', '"')
    return re.sub(r"[\r\n\t]", "_", folder)[:60]


def sanitize(value: str, maxlen: int) -> str:
    return re.sub(r"[\r\n\t]", " ", value).strip()[:maxlen]


@dataclass(frozen=True)
class Header:
    from_addresses: tuple[str, ...]
    to_addresses: tuple[str, ...]
    date: str
    subject: str
    message_id: str


def parse_header(blob: bytes) -> Header:
    m = BytesParser(policy=policy.default).parsebytes(blob, headersonly=True)
    from_addresses = tuple(a.lower() for n, a in getaddresses([str(m.get("From", ""))]) if a)
    to_addresses = tuple(a.lower() for n, a in getaddresses([str(m.get("To", ""))]) if a)
    return Header(from_addresses, to_addresses, sanitize(str(m.get("Date", "")), 75),
                  sanitize(str(m.get("Subject", "")), MAX_SUBJECT),
                  sanitize(str(m.get("Message-ID", "")), 260).lower())


def categorize(m: Header, own: str) -> str | None:
    sender = m.from_addresses
    if not sender:
        return None
    if all(a in {own, "sales@send.monardas.com"} for a in sender):
        return None
    if any(a == "website@send.monardas.com" for a in sender):
        if INTEREST.search(m.subject):
            return "WEBSITE_LEAD_REVIEW"
        return "WEBSITE_OTHER_REVIEW"
    if any(BOUNCE.search(a) for a in sender) or BOUNCE.search(m.subject):
        return "BOUNCE_OR_DSN_REVIEW"
    if any(a in SENDER_EXACT or a.rsplit("@", 1)[-1] in SENDER_DOMAIN for a in sender):
        return "KNOWN_PROSPECT_REPLY_REVIEW"
    if INTEREST.search(m.subject):
        return "OTHER_INBOUND_REVIEW"
    return None


def selftest() -> int:
    assert parse_folder(b'(\\HasNoChildren) "/" "INBOX"') == '"INBOX"'
    assert parse_folder(b'(\\Noselect) "/" "Root"') is None
    assert display_folder('"Junk E-mail"') == "Junk E-mail"
    x = parse_header(b"From: CEO <get@grsserviceinc.com>\r\nSubject: Re: 30-day pilot\r\nMessage-ID: <a@test>\r\n\r\n")
    assert categorize(x,"yurii@monardas.com") == "KNOWN_PROSPECT_REPLY_REVIEW"
    x = parse_header(b"From: Website <website@send.monardas.com>\r\nSubject: MONARDAS HVAC FREE Founding Pilot Application\r\n\r\n")
    assert categorize(x,"yurii@monardas.com") == "WEBSITE_LEAD_REVIEW"
    x = parse_header(b"From: Daemon <mailer-daemon@googlemail.com>\r\nSubject: Delivery Status Notification\r\n\r\n")
    assert categorize(x,"yurii@monardas.com") == "BOUNCE_OR_DSN_REVIEW"
    x = parse_header(b"From: github <notifications@github.com>\r\nSubject: CI build passed\r\n\r\n")
    assert categorize(x,"yurii@monardas.com") is None
    x = parse_header(b"From: Yuri <yurii@monardas.com>\r\nSubject: HVAC pilot\r\n\r\n")
    assert categorize(x,"yurii@monardas.com") is None
    assert sanitize('hello\r\nworld',20)=="hello  world"
    print("SELFTEST_PASS: 7 checks, zero network or mailbox changes")
    return 0


def main() -> int:
    ap=argparse.ArgumentParser(description="Read-only Lark IMAP HVAC inbound header scan (no body/SMTP/writes)")
    ap.add_argument("--self-test",action="store_true")
    ap.add_argument("--mailbox",default="yurii@monardas.com")
    ap.add_argument("--max-folders",type=int,default=30)
    ap.add_argument("--max-headers-per-folder",type=int,default=175)
    ap.add_argument("--max-displayed",type=int,default=45)
    args=ap.parse_args()
    if args.self_test:return selftest()
    if not re.fullmatch(r"[A-Za-z0-9._+-]+@monardas\.com",args.mailbox):
        return stop("MAILBOX_MUST_BE_MONARDAS_DOT_COM")
    if not (1<=args.max_folders<=80 and 1<=args.max_headers_per_folder<=1000 and 1<=args.max_displayed<=200):
        return stop("INVALID_SCAN_LIMITS")
    pw=getpass.getpass(f"Lark IMAP app password for {args.mailbox} (not stored): ")
    if not pw:return stop("EMPTY_PASSWORD")
    conn=None
    matched=0
    displayed=0
    total_headers=0
    folder_errors=0
    truncated=0
    folders_scanned=0
    seen=set()
    try:
        ctx=ssl.create_default_context()
        conn=imaplib.IMAP4_SSL(HOST, PORT, ssl_context=ctx,timeout=25)
        conn.login(args.mailbox,pw)
        pw=""
        status,values=conn.list()
        if status!="OK" or not values: return stop("FOLDER_LIST_FAILED")
        folders=[name for name in (parse_folder(x) for x in values if isinstance(x,bytes)) if name]
        if len(folders)>args.max_folders:
            truncated+=len(folders)-args.max_folders
            folders=folders[:args.max_folders]
        for folder in folders:
            try:
                typ,_=conn.select(folder,readonly=True)
                if typ!="OK":folder_errors+=1;continue
                folders_scanned+=1
                typ,found=conn.uid("SEARCH",None,"SINCE",SINCE)
                if typ!="OK" or not found:folder_errors+=1;continue
                uids=(found[0] or b"").split()
                if len(uids)>args.max_headers_per_folder:
                    truncated+=len(uids)-args.max_headers_per_folder
                    uids=uids[-args.max_headers_per_folder:]
                for uid in uids:
                    typ,records=conn.uid("FETCH",uid,"(BODY.PEEK[HEADER.FIELDS (FROM TO DATE SUBJECT MESSAGE-ID)])")
                    if typ!="OK" or not records:folder_errors+=1;continue
                    parts=[r[1] for r in records if isinstance(r,tuple) and len(r)>1 and isinstance(r[1],bytes)]
                    if not parts:folder_errors+=1;continue
                    total_headers+=1
                    try:h=parse_header(parts[0])
                    except (ValueError,UnicodeError):folder_errors+=1;continue
                    key=h.message_id or (folder+":"+uid.decode("ascii","ignore"))
                    if key in seen:continue
                    seen.add(key)
                    kind=categorize(h,args.mailbox.lower())
                    if not kind:continue
                    matched+=1
                    if displayed<args.max_displayed:
                        print("POSSIBLE_INBOUND",kind,
                              "FROM="+sanitize(",".join(h.from_addresses),150),
                              "DATE="+h.date,
                              "SUBJECT="+h.subject,
                              "FOLDER="+display_folder(folder))
                        displayed+=1
                    else:truncated+=1
            except (imaplib.IMAP4.error,OSError,ValueError) as e:
                folder_errors+=1
                print("WARN: FOLDER_SCAN_FAILED",type(e).__name__)
        print("LARK_READONLY_SCAN_COMPLETE", "MAILBOX="+args.mailbox,
              "FOLDERS_CHECKED="+str(folders_scanned),
              "HEADERS_SCANNED="+str(total_headers),
              "POSSIBLE_INBOUND="+str(matched),
              "FOLDER_ERRORS="+str(folder_errors),
              "TRUNCATED="+str(truncated))
        if folder_errors or truncated:
            print("LARK_PARTIAL_SCAN_REVIEW_REQUIRED")
            return 1
        if matched:
            print("LARK_POSSIBLE_RESPONSES_REVIEW_HEADERS_ONLY_NOT_CONFIRMED")
        else:
            print("LARK_NO_MATCHED_HEADERS_WITHIN_SCANNED_WINDOW")
        return 0
    except (imaplib.IMAP4.error,OSError,ssl.SSLError) as e:
        print("STOP: LARK_CONNECTION_OR_AUTH_FAILED",type(e).__name__)
        return 2
    finally:
        pw=""
        if conn is not None:
            try:conn.logout()
            except (imaplib.IMAP4.error,OSError):pass

if __name__=="__main__":
    sys.exit(main())