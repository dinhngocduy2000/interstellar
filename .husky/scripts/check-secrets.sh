#!/bin/bash
# Check for mock API key pattern in staged files
if git diff --staged | grep -E 'AKIA[0-9A-Z]{16}'; then
  echo "Error: Found potential secret (API key) in staged files!"
  exit 1
fi