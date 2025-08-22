#!/bin/bash

# Script to encode PDFs for GitHub Pages protection
# This makes direct access much more difficult

echo "Encoding PDFs for secure delivery..."

cd /Users/krshearman/Dev/revyva-site/protected

for pdf in *.pdf; do
    if [ -f "$pdf" ]; then
        echo "Encoding $pdf..."
        base64 -i "$pdf" -o "${pdf}.b64"
    fi
done

echo "PDF encoding complete!"
echo "Encoded files are ready for secure delivery."
