import json
import asyncio
import aiohttp
from bs4 import BeautifulSoup
from typing import List, Dict
from urllib.parse import urljoin, urlparse
import pandas as pd
from rich.console import Console
from rich.progress import Progress

console = Console()

class SourceExpander:
    def __init__(self):
        self.delay = 2
        self.max_concurrent = 5
        self.sources = self.load_sources()
            
    def load_sources(self) -> Dict[str, List[str]]:
        try:
            with open('sources.json', 'r') as f:
                return json.load(f)
        except Exception as e:
            console.print(f"[red]Error loading sources: {str(e)}")
            return {}
            
    def save_sources(self):
        with open('sources.json', 'w') as f:
            json.dump(self.sources, f, indent=4)
            
    async def fetch_with_delay(self, session: aiohttp.ClientSession, url: str, semaphore: asyncio.Semaphore) -> str:
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
        return ""

    async def find_edu_domains(self, session: aiohttp.ClientSession, semaphore: asyncio.Semaphore) -> List[str]:
        """Find .edu domains from various sources"""
        edu_urls = []
        
        # List of sources for finding .edu domains
        sources = [
            "https://en.wikipedia.org/wiki/List_of_state_universities_in_the_United_States",
            "https://en.wikipedia.org/wiki/List_of_private_colleges_and_universities_in_the_United_States",
            "https://en.wikipedia.org/wiki/List_of_land-grant_universities"
        ]
        
        for url in sources:
            content = await self.fetch_with_delay(session, url, semaphore)
            if content:
                soup = BeautifulSoup(content, 'html.parser')
                for link in soup.find_all('a'):
                    href = link.get('href', '')
                    if '.edu' in href and href.startswith('http'):
                        edu_urls.append(href)
                    elif '.edu' in href and href.startswith('//'):
                        edu_urls.append(f"https:{href}")
                    
        return list(set(edu_urls))

    async def find_forum_sites(self, session: aiohttp.ClientSession, semaphore: asyncio.Semaphore) -> List[str]:
        """Find forum sites from various sources"""
        forum_urls = []
        
        # List of sources for finding forums
        sources = [
            "https://www.google.com/search?q=list+of+forums+by+category",
            "https://www.google.com/search?q=popular+discussion+forums",
            "https://www.google.com/search?q=niche+specific+forums",
            "https://www.google.com/search?q=professional+forums+list"
        ]
        
        for url in sources:
            content = await self.fetch_with_delay(session, url, semaphore)
            if content:
                soup = BeautifulSoup(content, 'html.parser')
                for link in soup.find_all('a'):
                    href = link.get('href', '')
                    if any(term in href.lower() for term in ['forum', 'community', 'discuss']):
                        if href.startswith('http'):
                            forum_urls.append(href)
                        
        return list(set(forum_urls))

    async def find_blog_platforms(self, session: aiohttp.ClientSession, semaphore: asyncio.Semaphore) -> List[str]:
        """Find blog platforms and directories"""
        blog_urls = []
        
        # List of sources for finding blog platforms
        sources = [
            "https://www.google.com/search?q=list+of+blog+platforms",
            "https://www.google.com/search?q=blog+directories+list",
            "https://www.google.com/search?q=submit+guest+post+blogs"
        ]
        
        for url in sources:
            content = await self.fetch_with_delay(session, url, semaphore)
            if content:
                soup = BeautifulSoup(content, 'html.parser')
                for link in soup.find_all('a'):
                    href = link.get('href', '')
                    if any(term in href.lower() for term in ['blog', 'wordpress', 'medium', 'tumblr']):
                        if href.startswith('http'):
                            blog_urls.append(href)
                        
        return list(set(blog_urls))

    async def expand_sources(self):
        """Expand sources for each category"""
        console.print("[cyan]Starting source expansion...")
        
        async with aiohttp.ClientSession() as session:
            semaphore = asyncio.Semaphore(self.max_concurrent)
            
            # Expand .edu domains
            edu_domains = await self.find_edu_domains(session, semaphore)
            self.sources['edu_domains'].extend(edu_domains)
            self.sources['edu_domains'] = list(set(self.sources['edu_domains']))
            console.print(f"[green]Found {len(edu_domains)} new .edu domains")
            
            # Expand forum sites
            forum_sites = await self.find_forum_sites(session, semaphore)
            self.sources['forums'].extend(forum_sites)
            self.sources['forums'] = list(set(self.sources['forums']))
            console.print(f"[green]Found {len(forum_sites)} new forum sites")
            
            # Expand blog platforms
            blog_sites = await self.find_blog_platforms(session, semaphore)
            self.sources['blog_platforms'].extend(blog_sites)
            self.sources['blog_platforms'] = list(set(self.sources['blog_platforms']))
            console.print(f"[green]Found {len(blog_sites)} new blog platforms")
            
            # Save updated sources
            self.save_sources()
            
            total_new = len(edu_domains) + len(forum_sites) + len(blog_sites)
            console.print(f"[green]Added {total_new} new sources in total")

async def main():
    expander = SourceExpander()
    await expander.expand_sources()

if __name__ == "__main__":
    asyncio.run(main()) 