#!/bin/bash

# This script prepares the site for GitHub Pages hosting

echo "Preparing backlink finder for GitHub Pages hosting..."

# Make sure we have the required Python packages
pip3 install beautifulsoup4 requests python-dotenv

# Generate the mock metrics data
echo "Generating mock metrics data..."
python3 mock_metrics.py

# Create a docs directory for GitHub Pages
echo "Creating docs directory for GitHub Pages..."
mkdir -p docs

# Copy the necessary files to the docs directory
echo "Copying files to docs directory..."
cp index.html docs/
cp sources_with_real_metrics.json docs/
cp -f count.html docs/ 2>/dev/null || echo "count.html not found, skipping"
cp -f CNAME docs/ 2>/dev/null || echo "CNAME not found, skipping"

# Create a GitHub Pages specific README in the docs folder
cat > docs/README.md << 'EOF'
# Backlink Opportunity Finder

This is the GitHub Pages deployment of the Backlink Opportunity Finder tool.

The tool helps you find legitimate websites where you can create profiles and obtain valuable backlinks.

## Features

- Web interface showing 1000+ websites organized by category
- Domain Authority (DA), Page Authority (PA), and Spam Score metrics for each website
- Filter by category, search by domain name, and sort by metrics
- Simple and clean UI built with Tailwind CSS

## Source Code

The source code for this project is available in the main repository.

## License

MIT License
EOF

# Create a .nojekyll file to prevent GitHub Pages from using Jekyll
touch docs/.nojekyll

echo "Done! The site is now ready for GitHub Pages."
echo ""
echo "To deploy to GitHub Pages:"
echo "1. Create a GitHub repository (if you haven't already)"
echo "2. Push your code to GitHub"
echo "3. Go to your repository settings"
echo "4. Scroll down to the GitHub Pages section"
echo "5. Select the 'docs' folder as the source"
echo "6. Your site will be available at https://yourusername.github.io/your-repo-name/"
echo "" 