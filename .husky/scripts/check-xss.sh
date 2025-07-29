#!/bin/bash
for file in "$@"; do
  if grep -E 'dangerouslySetInnerHTML\s*=\s*{{\s*__html' "$file"; then
    echo "Error: Potential XSS vulnerability in $file: dangerouslySetInnerHTML detected!"
    exit 1
  fi
done