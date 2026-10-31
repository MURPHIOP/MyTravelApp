#!/bin/sh
# Continuous-Learning Git Pre-Commit Hook
# Enforces ecc-evolution.json and route verification

node scripts/pre-commit-verify.mjs "$@"

