import json
import random
import hashlib
from urllib.parse import urlparse

def generate_consistent_metrics(url):
    """
    Generate consistent DA, PA, and spam score for a domain
    using the domain name as a seed for pseudo-randomness
    """
    try:
        # Parse domain from URL
        domain = urlparse(url).netloc.lower()
        if not domain:
            return None
        
        # Use domain as seed for consistent random generation
        hash_obj = hashlib.md5(domain.encode())
        hash_int = int(hash_obj.hexdigest(), 16)
        random.seed(hash_int)
        
        # Get TLD
        tld = domain.split('.')[-1]
        
        # Metrics are influenced by TLD
        da_base = {
            'com': 35,
            'org': 40,
            'edu': 55,
            'gov': 60,
            'net': 30,
            'io': 25,
            'biz': 20,
            'info': 15,
        }.get(tld, 25)  # Default for unknown TLDs
        
        # Domain length often correlates with authority (shorter = better)
        length_factor = max(0, 1 - (len(domain) - 5) * 0.02)
        
        # Calculate metrics
        da = int(da_base + random.uniform(-10, 20) * length_factor)
        da = max(1, min(100, da))  # Ensure DA is between 1 and 100
        
        pa = int(da + random.uniform(-10, 10))
        pa = max(1, min(100, pa))  # Ensure PA is between 1 and 100
        
        spam_score = int(random.uniform(0, 14 - da/10))  # Higher DA means lower spam score
        
        return {
            'da': da,
            'pa': pa,
            'spam_score': spam_score
        }
    except Exception as e:
        print(f"Error generating metrics for {url}: {e}")
        return {
            'da': 1,
            'pa': 1,
            'spam_score': 14
        }

def add_metrics_to_sources():
    """
    Add domain metrics to sources.json and create a new file
    with these metrics included
    """
    try:
        # Load the sources.json file
        with open('sources.json', 'r') as f:
            sources = json.load(f)
        
        # Create a new structured data format with metrics
        enhanced_data = {}
        
        # Process each category
        for category, urls in sources.items():
            enhanced_data[category] = []
            
            for url in urls:
                if url and isinstance(url, str) and url.startswith('http'):
                    try:
                        # Generate metrics for this URL
                        metrics = generate_consistent_metrics(url)
                        
                        # Create enhanced URL object with metrics
                        domain = urlparse(url).netloc
                        enhanced_url = {
                            'url': url,
                            'domain': domain,
                            'metrics': metrics
                        }
                        
                        # Add to the enhanced data
                        enhanced_data[category].append(enhanced_url)
                    except Exception as e:
                        print(f"Error processing {url}: {e}")
                else:
                    print(f"Skipping invalid URL: {url}")
        
        # Save the enhanced data to a new file
        with open('sources_with_metrics.json', 'w') as f:
            json.dump(enhanced_data, f, indent=4)
        
        # Count how many URLs were processed
        total_urls = sum(len(urls) for urls in enhanced_data.values())
        print(f"Added metrics to {total_urls} URLs")
        print("Enhanced data saved to sources_with_metrics.json")
        
        return True
    except Exception as e:
        print(f"Error adding metrics to sources: {e}")
        return False

if __name__ == "__main__":
    add_metrics_to_sources() 