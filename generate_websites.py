import json
import random
from collections import defaultdict
from typing import Dict, List

# List of top-level domains (TLDs)
tlds = ['.com', '.org', '.net', '.edu', '.gov', '.io', '.co', '.info', '.biz', '.us', '.uk', '.ca', '.de', '.fr', '.au']

# Dictionary of category-specific domains
category_domains = {
    "directories": [
        "directory", "list", "catalog", "index", "guide", "lookup", "registry", "find", 
        "search", "browse", "discover", "listings", "resources", "database"
    ],
    "forums": [
        "forum", "community", "discuss", "board", "talk", "conversation", "chat", "debate",
        "exchange", "discussion", "huddle", "meetup", "gathering", "group"
    ],
    "edu_domains": [
        "university", "college", "school", "academy", "institute", "education", "learn", 
        "study", "academic", "campus", "research", "knowledge", "teaching", "course"
    ],
    "blog_platforms": [
        "blog", "write", "post", "article", "journal", "diary", "column", "content", 
        "publication", "storytelling", "news", "opinion", "perspective", "commentary"
    ],
    "social_bookmarking": [
        "bookmark", "save", "share", "recommend", "favorite", "curate", "collect", 
        "organize", "tag", "social", "discover", "trend", "popular", "viral"
    ],
    "qa_sites": [
        "questions", "answers", "ask", "query", "solution", "help", "support", "solve", 
        "problem", "expertise", "knowledge", "information", "advice", "guidance"
    ]
}

# Additional categories
new_categories = {
    "local_directories": [
        "local", "city", "region", "area", "town", "location", "place", "neighborhood",
        "community", "vicinity", "district", "zone", "quarter", "locale"
    ],
    "industry_directories": [
        "industry", "business", "trade", "sector", "niche", "professional", "commercial",
        "enterprise", "corporate", "specialty", "market", "field", "domain", "vertical"
    ],
    "review_sites": [
        "review", "rating", "feedback", "opinion", "experience", "testimonial", "critique",
        "evaluate", "assessment", "judgment", "appraisal", "recommendation", "verdict"
    ],
    "web_2_profiles": [
        "profile", "account", "bio", "portfolio", "member", "user", "identity", "page",
        "presence", "author", "contributor", "expert", "professional", "individual"
    ],
    "news_sites": [
        "news", "media", "publication", "press", "journal", "gazette", "times", "herald",
        "chronicle", "dispatch", "post", "tribune", "daily", "weekly"
    ]
}

# Create a unified category domains dictionary
all_categories = {**category_domains, **new_categories}

# Common second-level domains
common_domains = [
    "my", "the", "best", "top", "pro", "all", "free", "online", "digital", "web", 
    "world", "global", "united", "net", "info", "data", "meta", "cyber", "tech", 
    "expert", "smart", "easy", "instant", "direct", "fast", "quick", "super", "ultra",
    "mega", "max", "prime", "premier", "elite", "alpha", "omega", "delta", "beta",
    "gamma", "sigma", "lambda", "epsilon", "zeta", "theta", "iota", "kappa", "nu",
    "xi", "omicron", "pi", "rho", "tau", "upsilon", "phi", "chi", "psi"
]

def generate_domain(category: str) -> str:
    """Generate a random domain for a specific category"""
    if category == "edu_domains":
        # .edu domains have specific formats
        edu_names = ["state", "central", "national", "american", "international", "pacific", "atlantic", 
                    "western", "eastern", "northern", "southern", "metropolitan", "regional", "city",
                    "community", "technical", "polytechnic", "liberal", "christian", "catholic"]
        edu_suffixes = ["university", "college", "institute", "school"]
        name_part = random.choice(edu_names)
        suffix_part = random.choice(edu_suffixes)
        return f"https://www.{name_part}{suffix_part}.edu"
    
    elif category == "gov_domains":
        # .gov domains have specific formats
        gov_prefixes = ["city", "county", "state", "department", "office", "bureau", "agency",
                      "division", "admin", "council", "commission", "authority", "board"]
        gov_suffixes = ["gov", "administration", "services", "affairs", "resources", "management"]
        prefix = random.choice(gov_prefixes)
        suffix = random.choice(gov_suffixes)
        return f"https://www.{prefix}of{suffix}.gov"
    
    else:
        # Generate a random domain for other categories
        prefix = random.choice(common_domains)
        domain_word = random.choice(all_categories[category])
        tld = random.choice(tlds)
        if random.random() < 0.3:  # 30% chance to have a compound domain
            second_word = random.choice(all_categories[category])
            return f"https://www.{prefix}{domain_word}{second_word}{tld}"
        else:
            return f"https://www.{prefix}{domain_word}{tld}"

def add_country_domains(domains: List[str]) -> List[str]:
    """Add country-specific versions of some domains"""
    country_tlds = ['.uk', '.ca', '.au', '.de', '.fr', '.es', '.it', '.jp', '.br', '.ru', '.in', '.cn']
    additional_domains = []
    
    for domain in domains[:int(len(domains) * 0.2)]:  # Convert 20% of domains to country versions
        if domain.endswith('.com'):
            country_tld = random.choice(country_tlds)
            new_domain = domain.replace('.com', country_tld)
            additional_domains.append(new_domain)
    
    return domains + additional_domains

def generate_websites(count_per_category: int) -> Dict[str, List[str]]:
    """Generate websites for each category"""
    result = defaultdict(list)
    
    # Load existing sources
    try:
        with open('sources.json', 'r') as f:
            existing_sources = json.load(f)
    except Exception:
        existing_sources = {}
    
    # Generate new domains for each category
    categories = list(all_categories.keys())
    
    for category in categories:
        # Get existing domains for this category
        existing_domains = existing_sources.get(category, [])
        existing_count = len(existing_domains)
        
        # Generate new domains
        new_domains = []
        while len(new_domains) < count_per_category:
            domain = generate_domain(category)
            if domain not in existing_domains and domain not in new_domains:
                new_domains.append(domain)
        
        # Add country-specific versions
        new_domains = add_country_domains(new_domains)
        
        # Add to result
        result[category] = existing_domains + new_domains
    
    return result

def save_sources(sources: Dict[str, List[str]]):
    """Save sources to JSON file"""
    with open('sources.json', 'w') as f:
        json.dump(sources, f, indent=4)

def main():
    # Generate approximately 1000 new websites (about 100 per category)
    websites = generate_websites(100)
    
    # Count total websites
    total = sum(len(domains) for domains in websites.values())
    
    # Save to file
    save_sources(websites)
    
    print(f"Generated {total} websites across {len(websites)} categories")
    
    # Print summary
    for category, domains in websites.items():
        print(f"{category}: {len(domains)} websites")

if __name__ == "__main__":
    main() 