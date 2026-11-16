#!/usr/bin/env bash
# MONARDAS | One-off corporate OCI 2-recipient English sender, for 21:05 Tbilisi Nov 16 2026.
# Scheduling performs NO sends. The real sender rechecks ledger, quotas, suppression and US local time.
set -Eeuo pipefail
umask 077

ACTION="${1:-schedule}"
case "$ACTION" in schedule|status|run) ;; *) echo 'USAGE: bash SCRIPT [schedule|status|run]'; exit 2;; esac
SENDER="$HOME/Загрузки/MONARDAS_HVAC_ENGLISH_SEND_2_20261116.sh"
EXPECTED_SHA='a3a9d6d5898bd155ffee1775da636c80bf1e87aa57f07da295dbe5132d3dbba6'
UNIT='monardas-hvac-english2-20261116-2105'
CAL='2026-11-16 17:05:00 UTC'
TARGET_EPOCH=1794848700
DIR="$HOME/.local/share/monardas-hvac-english2-once"
CLAIM="$DIR/one-attempt-20261116.claim"
LOG="$DIR/send-20261116.log"
verify_sender() {
  [[ -f "$SENDER" && ! -L "$SENDER" ]] || { echo 'STOP: SENDER_MISSING_OR_LINK'; exit 2; }
  local actual
  actual="$(sha256sum "$SENDER" | awk '{print $1}')"
  [[ "$actual" == "$EXPECTED_SHA" ]] || { echo 'STOP: SENDER_SHA256_MISMATCH'; exit 2; }
}
case "$ACTION" in
status)
  echo "UTC_TARGET=$CAL"
  echo "USER_TIMER=$UNIT.timer"
  systemctl --user list-timers --all --no-pager "$UNIT.timer" 2>&1 || true
  if [[ -d "$CLAIM" ]]; then echo 'ONE_ATTEMPT_CLAIM=EXISTS'; else echo 'ONE_ATTEMPT_CLAIM=ABSENT'; fi
  if [[ -f "$LOG" ]]; then
    echo '=== PRIVATE_LOG_LAST_LINES ==='
    tail -n 40 "$LOG"
  else
    echo 'NO_EXECUTION_LOG_YET'
  fi
  exit 0;;
run)
  [[ -n "${INVOCATION_ID:-}" ]] || { echo 'STOP: RUN_REQUIRES_SYSTEMD_SERVICE'; exit 2; }
  now="$(date -u +%s)"
  if (( now < TARGET_EPOCH || now > TARGET_EPOCH + 1200 )); then
    echo 'STOP: MISSED_ONE_TIME_WINDOW_NO_SEND'
    exit 2
  fi
  verify_sender
  install -d -m 700 "$DIR"
  if ! mkdir -m 700 "$CLAIM" 2>/dev/null; then
    echo 'STOP: ONE_ATTEMPT_ALREADY_CLAIMED_NO_RETRY'
    exit 0
  fi
  # Claim persists even on error: never retry SMTP with an ambiguous outcome.
  {
    echo "MONARDAS_START_UTC=$(date -u +%FT%TZ)"
    echo 'SENDER_SHA256=PASS'
    bash "$SENDER" send
    rc=$?
    echo "MONARDAS_END_UTC=$(date -u +%FT%TZ) EXIT_CODE=$rc"
  } > "$LOG" 2>&1
  exit 0;;
schedule)
  verify_sender
  [[ -x /usr/bin/systemd-run || -n "$(command -v systemd-run || true)" ]] || { echo 'STOP: SYSTEMD_RUN_UNAVAILABLE'; exit 2; }
  [[ -n "$(command -v systemctl || true)" ]] || { echo 'STOP: SYSTEMCTL_UNAVAILABLE'; exit 2; }
  now="$(date -u +%s)"
  if (( now >= TARGET_EPOCH - 90 )); then
    echo 'STOP: TOO_LATE_TO_SCHEDULE_ONE_SHOT'
    exit 2
  fi
  install -d -m 700 "$DIR"
  [[ ! -d "$CLAIM" ]] || { echo 'STOP: ONE_ATTEMPT_ALREADY_CLAIMED'; exit 2; }
  loaded="$(systemctl --user show "$UNIT.timer" -p LoadState --value 2>/dev/null || true)"
  [[ "$loaded" != loaded ]] || { echo 'STOP: TIMER_ALREADY_REGISTERED'; exit 2; }
  echo "SCHEDULE_AT_UTC=$CAL"
  echo 'SCHEDULE_AT_TBILISI=2026-11-16T21:05:00+04:00'
  systemd-run --user --unit="$UNIT" --on-calendar="$CAL" \
    --property=Type=oneshot --setenv="HOME=$HOME" \
    /bin/bash "$0" run
  echo 'ONE_SHOT_TIMER_REGISTERED_IF_SYSTEMD_EXITED_SUCCESSFULLY'
  echo 'NO_EMAIL_SENT_BY_SCHEDULE_ACTION'
  echo "TO_CHECK: bash $0 status"
  exit 0;;
esac
