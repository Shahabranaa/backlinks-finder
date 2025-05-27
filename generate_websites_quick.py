import json
import random
from typing import Dict, List

# Generate domains more efficiently by pre-generating combinations
def generate_bulk_domains(count: int = 1000):
    """Generate a large number of domains quickly"""
    
    # Load existing sources
    try:
        with open('sources.json', 'r') as f:
            sources = json.load(f)
    except Exception as e:
        print(f"Error loading sources.json: {e}")
        sources = {}
    
    # Define categories if they don't exist
    categories = [
        "directories", "forums", "edu_domains", "blog_platforms", 
        "social_bookmarking", "qa_sites", "local_directories",
        "industry_directories", "review_sites", "web_2_profiles", 
        "news_sites"
    ]
    
    # Ensure all categories exist
    for category in categories:
        if category not in sources:
            sources[category] = []
    
    # Count existing domains
    existing_count = sum(len(domains) for domains in sources.values())
    print(f"Found {existing_count} existing domains")
    
    # Calculate how many domains to add per category
    domains_per_category = count // len(categories) + 1
    
    # Add domains to each category
    added_count = 0
    for category in categories:
        # Base parts for domain construction
        prefixes = ["my", "the", "best", "top", "pro", "all", "free", "online", "digital", "web", 
                  "world", "global", "united", "info", "meta", "tech", "expert", "smart", "easy"]
        
        if category == "directories":
            keywords = ["directory", "list", "catalog", "index", "guide", "lookup", "registry"]
        elif category == "forums":
            keywords = ["forum", "community", "discuss", "board", "talk", "conversation", "chat"]
        elif category == "edu_domains":
            keywords = ["university", "college", "school", "academy", "institute", "education"]
        elif category == "blog_platforms":
            keywords = ["blog", "write", "post", "article", "journal", "diary", "content"]
        elif category == "social_bookmarking":
            keywords = ["bookmark", "save", "share", "recommend", "favorite", "curate", "collect"]
        elif category == "qa_sites":
            keywords = ["questions", "answers", "ask", "query", "solution", "help", "support"]
        elif category == "local_directories":
            keywords = ["local", "city", "region", "area", "town", "location", "place"]
        elif category == "industry_directories":
            keywords = ["industry", "business", "trade", "sector", "niche", "professional"]
        elif category == "review_sites":
            keywords = ["review", "rating", "feedback", "opinion", "experience", "testimonial"]
        elif category == "web_2_profiles":
            keywords = ["profile", "account", "bio", "portfolio", "member", "user", "identity"]
        else:  # news_sites
            keywords = ["news", "media", "publication", "press", "journal", "gazette", "times"]
        
        tlds = ['.com', '.org', '.net', '.info', '.biz']
        
        # Create domains for this category
        new_domains = []
        for _ in range(domains_per_category):
            prefix = random.choice(prefixes)
            keyword = random.choice(keywords)
            tld = random.choice(tlds)
            
            # 30% chance to have a compound domain
            if random.random() < 0.3:
                second_keyword = random.choice(keywords)
                domain = f"https://www.{prefix}{keyword}{second_keyword}{tld}"
            else:
                domain = f"https://www.{prefix}{keyword}{tld}"
            
            if domain not in sources[category] and domain not in new_domains:
                new_domains.append(domain)
        
        # Special handling for edu_domains
        if category == "edu_domains":
            edu_names = ["state", "central", "national", "american", "international", 
                        "western", "eastern", "northern", "southern", "metropolitan"]
            edu_suffixes = ["university", "college", "institute", "school"]
            
            # Replace some domains with .edu domains
            for i in range(min(len(new_domains), 30)):
                name_part = random.choice(edu_names)
                suffix_part = random.choice(edu_suffixes)
                edu_domain = f"https://www.{name_part}{suffix_part}.edu"
                if edu_domain not in sources[category]:
                    new_domains[i] = edu_domain
        
        # Add new domains to the category
        sources[category].extend(new_domains)
        added_count += len(new_domains)
    
    # Save updated sources
    with open('sources.json', 'w') as f:
        json.dump(sources, f, indent=4)
    
    print(f"Added {added_count} new domains")
    print(f"Total domains: {existing_count + added_count}")
    
    # Print summary
    for category in categories:
        print(f"{category}: {len(sources[category])} websites")

if __name__ == "__main__":
    generate_bulk_domains(1000) 