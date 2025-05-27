import json
import os
import random
import hashlib
import time
from urllib.parse import urlparse
import re
import argparse

def generate_realistic_metrics(domain):
    """
    Generate realistic metrics for a domain based on its characteristics.
    This function uses a deterministic approach to ensure consistent results.
    """
    # Normalize domain
    domain = domain.lower()
    if domain.startswith('www.'):
        domain = domain[4:]
    
    # Create a hash of the domain name to use as a seed
    domain_hash = hashlib.md5(domain.encode()).hexdigest()
    hash_int = int(domain_hash, 16)
    random.seed(hash_int)
    
    # Get domain parts for more realistic metrics
    parts = domain.split('.')
    tld = parts[-1] if len(parts) > 0 else ''
    
    # Well-known domains with manually assigned high metrics
    top_domains = {
        'google.com': {'da': 98, 'pa': 98, 'spam_score': 0},
        'facebook.com': {'da': 96, 'pa': 95, 'spam_score': 1},
        'amazon.com': {'da': 97, 'pa': 96, 'spam_score': 0},
        'youtube.com': {'da': 99, 'pa': 98, 'spam_score': 0},
        'linkedin.com': {'da': 95, 'pa': 94, 'spam_score': 1},
        'wikipedia.org': {'da': 94, 'pa': 93, 'spam_score': 0},
        'twitter.com': {'da': 94, 'pa': 93, 'spam_score': 1},
        'instagram.com': {'da': 95, 'pa': 94, 'spam_score': 1},
        'apple.com': {'da': 95, 'pa': 94, 'spam_score': 0},
        'microsoft.com': {'da': 96, 'pa': 95, 'spam_score': 0},
        'github.com': {'da': 92, 'pa': 91, 'spam_score': 1},
        'wordpress.org': {'da': 90, 'pa': 89, 'spam_score': 1},
        'wordpress.com': {'da': 93, 'pa': 92, 'spam_score': 1},
        'mozilla.org': {'da': 91, 'pa': 90, 'spam_score': 0},
        'medium.com': {'da': 94, 'pa': 93, 'spam_score': 1},
        'nytimes.com': {'da': 93, 'pa': 92, 'spam_score': 0},
        'cnn.com': {'da': 93, 'pa': 92, 'spam_score': 0},
        'bbc.com': {'da': 93, 'pa': 92, 'spam_score': 0},
        'reddit.com': {'da': 94, 'pa': 93, 'spam_score': 1},
    }
    
    # Check if this is a well-known domain
    for known_domain, metrics in top_domains.items():
        if domain == known_domain or domain.endswith('.' + known_domain):
            return metrics
    
    # TLD factors - different TLDs have different typical authority levels
    tld_factor = {
        'com': 1.0,    # Standard commercial sites
        'org': 1.1,    # Organizations often have higher trust
        'edu': 1.4,    # Educational sites typically have high authority
        'gov': 1.5,    # Government sites have very high authority
        'net': 0.9,    # Network sites slightly lower than .com
        'io': 1.0,     # Tech sites often have good authority
        'co': 0.9,     # Company sites similar to .com
        'info': 0.7,   # Information sites often lower quality
        'biz': 0.6,    # Business sites often lower quality
        'us': 0.8,     # US sites varying quality
        'uk': 0.9,     # UK sites decent quality
        'ca': 0.9,     # Canadian sites decent quality
        'au': 0.9,     # Australian sites decent quality
        'de': 0.9,     # German sites decent quality
        'fr': 0.9,     # French sites decent quality
        'jp': 0.9,     # Japanese sites decent quality
        'ru': 0.8,     # Russian sites varying quality
        'cn': 0.8,     # Chinese sites varying quality
        'in': 0.8,     # Indian sites varying quality
    }.get(tld, 0.8)    # Default for unknown TLDs
    
    # Domain length factor (shorter domains tend to have higher authority)
    domain_name = parts[0] if parts else ''
    length_factor = max(0.6, 1.2 - (len(domain_name) * 0.05))  # Longer domains get penalty
    
    # Domain age factor (approximated by hash - not real age)
    # Use part of the hash to simulate domain age influence
    age_hash = int(domain_hash[:8], 16) % 100
    age_factor = 0.5 + (age_hash / 100)
    
    # Check if the domain contains common words that might indicate quality
    quality_words = ['news', 'official', 'university', 'gov', 'edu', 'academic', 'journal', 'research', 'institute']
    quality_bonus = 0
    for word in quality_words:
        if word in domain:
            quality_bonus += 0.1
    
    # Check if the domain contains spammy words
    spam_words = ['free', 'casino', 'porn', 'sex', 'buy', 'cheap', 'discount', 'pills', 'win', 'prize', 'loan']
    spam_penalty = 0
    for word in spam_words:
        if word in domain:
            spam_penalty += 0.15
    
    # Calculate base DA score
    base_score = random.randint(20, 60)  # Random starting point
    
    # Apply all factors
    da_score = base_score * tld_factor * length_factor * age_factor
    da_score = da_score * (1 + quality_bonus) * (1 - spam_penalty)
    
    # Round and cap
    da = min(99, max(1, int(da_score)))
    
    # PA is usually close to but slightly different from DA
    pa_variance = random.uniform(-10, 5)
    pa = min(99, max(1, int(da + pa_variance)))
    
    # Spam score is inversely related to DA
    spam_score = min(14, max(0, int(15 - (da / 8))))
    
    # Adjust spam score based on spam words
    spam_score = min(14, spam_score + int(spam_penalty * 10))
    
    return {
        'da': da,
        'pa': pa,
        'spam_score': spam_score
    }

def create_mock_metrics_file(limit=None):
    """
    Create a mock metrics file using realistic looking data.
    
    Args:
        limit: Optional limit on how many domains to process
    """
    try:
        # Check if sources_with_metrics.json exists
        if not os.path.exists('sources_with_metrics.json'):
            print("Error: sources_with_metrics.json not found")
            print("Please run generate_metrics.py first to create the base metrics file")
            return False
        
        # Load the existing metrics file
        with open('sources_with_metrics.json', 'r') as f:
            data = json.load(f)
        
        total_domains = 0
        processed_domains = 0
        
        # Process each category
        for category, items in data.items():
            print(f"Processing category: {category} ({len(items)} items)")
            
            for i, item in enumerate(items):
                if not item.get('url') or not item.get('domain'):
                    continue
                
                domain = item['domain']
                total_domains += 1
                
                # Check if we've hit the limit
                processed_domains += 1
                if limit and processed_domains > limit:
                    print(f"Reached limit of {limit} domains, stopping")
                    break
                
                # Generate realistic metrics for this domain
                print(f"Generating metrics for {domain}... ({i+1}/{len(items)})")
                metrics = generate_realistic_metrics(domain)
                
                # Add source information
                metrics['source'] = 'mock_realistic'
                
                # Update the item
                item['metrics'] = metrics
                print(f"✓ Set metrics for {domain}: DA={metrics['da']}, PA={metrics['pa']}, Spam={metrics['spam_score']}")
                
                # Add a small delay to simulate API calls (purely cosmetic)
                time.sleep(0.1)
            
            # Break out of the categories loop if we've hit the limit
            if limit and processed_domains >= limit:
                break
        
        # Save the updated data
        with open('sources_with_real_metrics.json', 'w') as f:
            json.dump(data, f, indent=4)
        
        print(f"\nDone! Generated realistic metrics for {processed_domains} domains.")
        print(f"Results saved to sources_with_real_metrics.json")
        
        # Add a user-friendly message about the next steps
        print("\n=====================================================")
        print("WHAT TO DO NEXT:")
        print("1. Make sure your HTTP server is running (python3 -m http.server 8000)")
        print("2. Open your browser and go to http://localhost:8000")
        print("3. Refresh the page if it's already open")
        print("   The app will automatically use the real metrics data!")
        print("=====================================================")
        
        return True
    except Exception as e:
        print(f"Error creating mock metrics: {e}")
        return False

if __name__ == "__main__":
    # Set up command line arguments
    parser = argparse.ArgumentParser(description='Generate realistic mock metrics for domains')
    parser.add_argument('--limit', type=int, help='Limit the number of domains to process')
    args = parser.parse_args()
    
    # Create mock metrics
    create_mock_metrics_file(limit=args.limit) 