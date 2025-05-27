import os
import json
import time
from typing import List, Dict, Optional
import click
import requests
from bs4 import BeautifulSoup
from rich.console import Console
from rich.progress import Progress
from fake_useragent import UserAgent
from rich.table import Table
from pathlib import Path
import concurrent.futures
import asyncio
import aiohttp
from tqdm import tqdm
import pandas as pd
from urllib.parse import urlparse, urljoin

# Initialize Rich console for better CLI output
console = Console()

# Available niches for filtering
NICHES = [
    "Technology",
    "Business",
    "Marketing",
    "Health",
    "Education",
    "Finance",
    "Gaming",
    "Sports",
    "Entertainment",
    "Science",
]

class SourceManager:
    """Manages different sources for backlink opportunities"""
    
    def __init__(self):
        self.delay = 2  # Delay between requests in seconds
        self.max_concurrent = 5  # Maximum concurrent requests
        self.sources = self.load_sources()
    
    def load_sources(self) -> Dict[str, List[str]]:
        """Load sources from sources.json"""
        try:
            with open('sources.json', 'r') as f:
                return json.load(f)
        except Exception as e:
            console.print(f"[red]Error loading sources: {str(e)}")
            return {}
    
    async def is_dofollow(self, session: aiohttp.ClientSession, soup: BeautifulSoup, link: str) -> bool:
        """Check if a link is dofollow"""
        try:
            link_tag = soup.find('a', href=link)
            if not link_tag:
                return False
            return 'nofollow' not in link_tag.get('rel', [])
        except Exception:
            return False

    async def fetch_with_delay(self, session: aiohttp.ClientSession, url: str, semaphore: asyncio.Semaphore) -> Optional[str]:
        """Fetch URL content with rate limiting"""
        async with semaphore:
            try:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                }
                await asyncio.sleep(self.delay)
                async with session.get(url, headers=headers, timeout=30) as response:
                    if response.status == 200:
                        return await response.text()
            except Exception as e:
                console.print(f"[red]Error fetching {url}: {str(e)}")
        return None

    async def check_dofollow_status(self, session: aiohttp.ClientSession, url: str, semaphore: asyncio.Semaphore) -> Dict:
        """Check if a URL provides dofollow links"""
        content = await self.fetch_with_delay(session, url, semaphore)
        if not content:
            return None
        
        soup = BeautifulSoup(content, 'html.parser')
        result = {
            'url': url,
            'title': soup.title.string if soup.title else url,
            'is_dofollow': await self.is_dofollow(session, soup, url),
            'domain': urlparse(url).netloc,
            'type': self.categorize_site(url)
        }
        return result

    def categorize_site(self, url: str) -> str:
        """Categorize the type of website"""
        domain = urlparse(url).netloc.lower()
        
        if '.edu' in domain:
            return 'Educational'
        elif '.gov' in domain:
            return 'Government'
        elif any(forum in domain for forum in ['forum', 'community', 'discuss']):
            return 'Forum'
        elif any(blog in domain for blog in ['blog', 'wordpress', 'medium']):
            return 'Blog'
        elif any(social in domain for social in ['linkedin', 'facebook', 'twitter']):
            return 'Social'
        else:
            return 'General'

class BacklinkFinder:
    def __init__(self):
        self.ua = UserAgent()
        self.data_file = "backlink_sites.json"
        self.sites_data = self.load_existing_data()
        self.source_manager = SourceManager()

    def load_existing_data(self) -> List[Dict]:
        """Load existing data from JSON file if it exists."""
        if os.path.exists(self.data_file):
            with open(self.data_file, 'r') as f:
                return json.load(f)
        return []

    def save_data(self):
        """Save scraped data to JSON file."""
        with open(self.data_file, 'w') as f:
            json.dump(self.sites_data, f, indent=2)

    def get_headers(self):
        """Generate random headers for requests."""
        return {
            'User-Agent': self.ua.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
        }

    def scrape_github(self) -> List[Dict]:
        """Scrape GitHub for potential profile backlink opportunities."""
        results = []
        try:
            # Search for organizations and repositories
            url = "https://api.github.com/search/repositories?q=stars:>1000&sort=stars"
            response = requests.get(url, headers=self.get_headers())
            if response.status_code == 200:
                data = response.json()
                for item in data.get('items', []):
                    results.append({
                        'site_name': f"GitHub - {item['full_name']}",
                        'url': item['html_url'],
                        'niche': 'Technology',
                        'type': 'Social Profile',
                        'description': item['description'] or 'No description available'
                    })
        except Exception as e:
            console.print(f"[red]Error scraping GitHub: {str(e)}")
        return results

    def scrape_crunchbase(self) -> List[Dict]:
        """Scrape Crunchbase for company profiles."""
        # Note: This is a placeholder. Real implementation would need Crunchbase API key
        return [{
            'site_name': 'Crunchbase',
            'url': 'https://www.crunchbase.com/',
            'niche': 'Business',
            'type': 'Business Profile',
            'description': 'Create a company profile on Crunchbase'
        }]

    def filter_by_niche(self, niche: str) -> List[Dict]:
        """Filter sites by selected niche."""
        return [site for site in self.sites_data if site['niche'].lower() == niche.lower()]

    async def scrape_web_directories(self) -> List[Dict]:
        """Scrape web directories for dofollow backlink opportunities"""
        directories = [
            'https://www.dmoz-odp.org/',
            'https://dir.yahoo.com/',
            'https://botw.org/',
            'https://www.stateofdigital.com/directory/',
            # Add more directories here
        ]
        
        results = []
        tasks = [self.source_manager.check_dofollow_status(url) for url in directories]
        completed = await asyncio.gather(*tasks)
        
        for result in completed:
            if result and result['is_dofollow']:
                results.append({
                    'site_name': result['title'],
                    'url': result['url'],
                    'niche': 'Directory',
                    'type': result['type'],
                    'description': f"Web directory with dofollow links - {result['domain']}"
                })
        
        return results

    async def scrape_edu_domains(self) -> List[Dict]:
        """Scrape .edu domains for backlink opportunities"""
        edu_sites = [
            # Add list of educational institutions
        ]
        # Implementation similar to web_directories
        pass

    async def scrape_category(self, session: aiohttp.ClientSession, category: str, urls: List[str], semaphore: asyncio.Semaphore) -> List[Dict]:
        """Scrape a category of websites"""
        console.print(f"\n[yellow]Scraping {category}...")
        results = []
        tasks = [self.source_manager.check_dofollow_status(session, url, semaphore) for url in urls]
        completed = await asyncio.gather(*tasks)
        
        for result in completed:
            if result and result.get('is_dofollow'):
                results.append({
                    'site_name': result['title'],
                    'url': result['url'],
                    'niche': category,
                    'type': result['type'],
                    'description': f"{category} site with dofollow links - {result['domain']}"
                })
        
        return results

    async def scrape_all_sources(self, session: aiohttp.ClientSession, semaphore: asyncio.Semaphore) -> List[Dict]:
        """Scrape all sources from all categories"""
        all_results = []
        total_categories = len(self.source_manager.sources)
        
        with Progress() as progress:
            task = progress.add_task("[cyan]Scraping all categories...", total=total_categories)
            
            for category, urls in self.source_manager.sources.items():
                results = await self.scrape_category(session, category, urls, semaphore)
                all_results.extend(results)
                progress.update(task, advance=1)
                
                # Save intermediate results
                self.sites_data = all_results
                self.save_data()
                
                console.print(f"[green]Found {len(results)} dofollow opportunities in {category}")
        
        return all_results

@click.group()
def cli():
    """Backlink Profile Finder CLI"""
    pass

@cli.command()
@click.option('--category', type=click.Choice(['all'] + list(SourceManager().sources.keys())), default='all')
def scrape(category):
    """Scrape websites for backlink opportunities"""
    finder = BacklinkFinder()
    
    async def run_scraper():
        async with aiohttp.ClientSession() as session:
            semaphore = asyncio.Semaphore(finder.source_manager.max_concurrent)
            
            if category == 'all':
                results = await finder.scrape_all_sources(session, semaphore)
            else:
                urls = finder.source_manager.sources.get(category, [])
                results = await finder.scrape_category(session, category, urls, semaphore)
            
            finder.sites_data = results
            finder.save_data()
            console.print(f"\n[green]Successfully scraped {len(finder.sites_data)} sites!")
    
    asyncio.run(run_scraper())

@cli.command()
@click.option('--niche', type=click.Choice(['all'] + list(SourceManager().sources.keys()), case_sensitive=False), prompt='Select your niche')
def find(niche):
    """Find backlink opportunities by niche"""
    finder = BacklinkFinder()
    
    if not finder.sites_data:
        console.print("[yellow]No data available. Please run 'scrape' command first.")
        return
    
    filtered_sites = finder.sites_data if niche == 'all' else [
        site for site in finder.sites_data 
        if site['niche'].lower() == niche.lower()
    ]
    
    if not filtered_sites:
        console.print(f"[yellow]No sites found for niche: {niche}")
        return
    
    table = Table(show_header=True, header_style="bold magenta")
    table.add_column("Site Name")
    table.add_column("URL")
    table.add_column("Type")
    table.add_column("Description")
    
    for site in filtered_sites:
        table.add_row(
            site['site_name'],
            site['url'],
            site['type'],
            site['description']
        )
    
    console.print(table)

if __name__ == '__main__':
    cli() 