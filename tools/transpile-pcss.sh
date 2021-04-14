#!/bin/bash

set -e

while IFS= read -r -d '' file; do
  # https://unix.stackexchange.com/questions/217628/cut-string-on-last-delimiter
  file_path_without_ext=$(echo "$file" | rev | cut -d "." -f2- | rev)
  postcss "$file_path_without_ext.pcss" -o "$file_path_without_ext.css" --verbose
  rm "$file_path_without_ext.pcss"
done < <(find output/ -name '*.pcss' -type f -print0)
