# Backlink Opportunity Finder

A tool to help you find legitimate websites where you can create profiles and obtain valuable backlinks.

## Features

- Web interface showing 1000+ websites organized by category
- Domain Authority (DA), Page Authority (PA), and Spam Score metrics for each website
- Filter by category, search by domain name, and sort by metrics
- Simple and clean UI built with Tailwind CSS

## Getting Started

### Option 1: Using the Online Version (GitHub Pages)

The easiest way to use this tool is to access the online version hosted on GitHub Pages:
- Create your own copy by forking this repository
- Run the `setup_github_repo.sh` script to set up your own GitHub Pages site
- Access your site at `https://yourusername.github.io/your-repo-name/`

### Option 2: Running Locally

1. Make sure you have Python 3.x installed
2. Clone this repository
3. Start the HTTP server:

```bash
python3 -m http.server 8000
```

4. Open your browser and go to http://localhost:8000

## Using Domain Metrics

By default, the application uses simulated metrics. You have a few options for metrics:

#### Option 1: Use Mock Metrics (Recommended)

This generates realistic metrics without requiring any API keys or external services:

```bash
python3 mock_metrics.py
```

This will create metrics based on domain characteristics that are deterministic and realistic. Domains like Google.com will always get high metrics, while low quality or spammy domains will get lower scores.

#### Option 2: Try Free APIs (Less Reliable)

If you want to attempt to get real metrics from free APIs:

1. Install the required Python packages:

```bash
pip3 install python-dotenv requests beautifulsoup4
```

2. Run the free metrics script:

```bash
python3 free_metrics.py
```

This will attempt to get metrics from various free sources, and fall back to generated metrics if none of the APIs work.

#### Option 3: Use Premium APIs (Paid)

For more reliable metrics, you can use premium APIs:

1. Open the `.env` file in the root directory and add your API keys. You can sign up for free trials at:
   - [DataForSEO](https://dataforseo.com/) - Most reliable option with a free trial
   - [SEODataAPI](https://www.seodataapi.com/) - Alternative option with free tier
   - [DomCop](https://www.domcop.com/) - Another alternative with free trial

2. Run the metrics fetcher script:

```bash
python3 real_metrics.py
```

## Hosting on GitHub Pages

To host this tool on GitHub Pages so it's accessible online:

1. Run the setup script:

```bash
./setup_github_repo.sh
```

2. Follow the instructions provided by the script to:
   - Create a GitHub repository
   - Push your code
   - Set up GitHub Pages

3. Once deployed, your site will be available at `https://yourusername.github.io/your-repo-name/`

## Understanding Domain Metrics

- **Domain Authority (DA)**: A score from 1-100 predicting how well a website will rank on search engines. Higher is better.
- **Page Authority (PA)**: Similar to DA, but at the page level rather than domain level. Higher is better.
- **Spam Score**: A score from 0-14 indicating how likely a site is to be penalized by search engines. Lower is better.

## Ethical Use

This tool is designed to help you find legitimate backlink opportunities, not to automate backlink creation or engage in spammy practices. Always:

1. Create high-quality profiles with relevant information
2. Follow each website's terms of service
3. Add value to each platform you join
4. Create backlinks naturally and in moderation

## License

MIT License
