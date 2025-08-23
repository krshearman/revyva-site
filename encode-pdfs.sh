#!/bin/bash

# Script to encode PDFs for GitHub Pages protection
# This makes direct access much more difficult

echo "Encoding PDFs for secure delivery..."

# Change to the revyva-site directory
cd /Users/krshearman/Dev/revyva-site

# Encode workbook PDFs from protected directory
echo "Encoding workbook PDFs..."
cd protected
for pdf in *.pdf; do
    if [ -f "$pdf" ] && [ -s "$pdf" ]; then
        echo "Encoding $pdf..."
        base64 -i "$pdf" -o "${pdf}.b64"
    elif [ -f "$pdf" ]; then
        echo "Skipping empty file: $pdf"
    fi
done

# Encode journal PDFs from journal directory
echo "Encoding journal PDFs..."
cd ../journal
for pdf in *.pdf; do
    if [ -f "$pdf" ] && [ -s "$pdf" ]; then
        echo "Encoding journal/$pdf..."
        base64 -i "$pdf" -o "../protected/${pdf}.b64"
    elif [ -f "$pdf" ]; then
        echo "Skipping empty file: journal/$pdf"
    fi
done

echo "PDF encoding complete!"
echo "Encoded files are ready for secure delivery."
