import json
import os
import time
from urllib.parse import urlparse

def create_test_metrics_file():
    """
    Create a test sources_with_real_metrics.json file with sample data
    to ensure the website can display real metrics correctly
    """
    print("Creating test metrics file...")
    
    # Check if we have the simulated metrics file
    if not os.path.exists('sources_with_metrics.json'):
        print("Error: sources_with_metrics.json not found.")
        print("Please run generate_metrics.py first to create the base file.")
        return False
    
    # Load the simulated metrics
    with open('sources_with_metrics.json', 'r') as f:
        data = json.load(f)
    
    # Sample domains with realistic metrics for testing
    test_domains = {
        "google.com": {"da": 98, "pa": 99, "spam_score": 0},
        "amazon.com": {"da": 96, "pa": 95, "spam_score": 1},
        "wikipedia.org": {"da": 94, "pa": 92, "spam_score": 0},
        "microsoft.com": {"da": 92, "pa": 91, "spam_score": 1},
        "apple.com": {"da": 91, "pa": 90, "spam_score": 0},
        "facebook.com": {"da": 93, "pa": 93, "spam_score": 2},
        "twitter.com": {"da": 92, "pa": 90, "spam_score": 1},
        "medium.com": {"da": 88, "pa": 87, "spam_score": 2},
        "github.com": {"da": 90, "pa": 89, "spam_score": 1},
        "youtube.com": {"da": 95, "pa": 94, "spam_score": 1},
        "linkedin.com": {"da": 92, "pa": 91, "spam_score": 2},
        "reddit.com": {"da": 91, "pa": 90, "spam_score": 3},
        "wordpress.com": {"da": 87, "pa": 86, "spam_score": 2},
        "blogspot.com": {"da": 85, "pa": 84, "spam_score": 3},
        "wix.com": {"da": 83, "pa": 82, "spam_score": 4},
        "squarespace.com": {"da": 84, "pa": 83, "spam_score": 3},
        "shopify.com": {"da": 88, "pa": 87, "spam_score": 2},
        "tumblr.com": {"da": 85, "pa": 84, "spam_score": 3},
        "pinterest.com": {"da": 90, "pa": 89, "spam_score": 2},
        "instagram.com": {"da": 93, "pa": 92, "spam_score": 1}
    }
    
    # Add some medium-authority domains
    medium_domains = {
        "example.com": {"da": 35, "pa": 38, "spam_score": 5},
        "example.org": {"da": 40, "pa": 42, "spam_score": 4},
        "example.net": {"da": 32, "pa": 34, "spam_score": 6},
        "nytimes.com": {"da": 76, "pa": 74, "spam_score": 2},
        "cnn.com": {"da": 72, "pa": 70, "spam_score": 3},
        "bbc.co.uk": {"da": 74, "pa": 72, "spam_score": 2},
        "washingtonpost.com": {"da": 70, "pa": 68, "spam_score": 3},
        "theguardian.com": {"da": 71, "pa": 69, "spam_score": 2},
        "forbes.com": {"da": 68, "pa": 66, "spam_score": 4},
        "businessinsider.com": {"da": 65, "pa": 63, "spam_score": 4}
    }
    
    # Add some low-authority domains
    low_domains = {
        "lowqualitysite1.com": {"da": 12, "pa": 15, "spam_score": 10},
        "lowqualitysite2.net": {"da": 8, "pa": 10, "spam_score": 12},
        "lowqualitysite3.org": {"da": 5, "pa": 7, "spam_score": 14},
        "newblog1.com": {"da": 18, "pa": 20, "spam_score": 8},
        "newblog2.com": {"da": 15, "pa": 17, "spam_score": 9},
        "smallbusiness1.com": {"da": 25, "pa": 27, "spam_score": 7},
        "smallbusiness2.com": {"da": 22, "pa": 24, "spam_score": 8},
        "localbusiness1.com": {"da": 20, "pa": 22, "spam_score": 8},
        "localbusiness2.com": {"da": 18, "pa": 20, "spam_score": 9},
        "personalsite1.com": {"da": 15, "pa": 17, "spam_score": 10}
    }
    
    # Combine all test domains
    all_test_domains = {}
    all_test_domains.update(test_domains)
    all_test_domains.update(medium_domains)
    all_test_domains.update(low_domains)
    
    # Count how many we updated
    updated_count = 0
    
    # Update metrics for domains in our dataset that match our test domains
    for category, items in data.items():
        for item in items:
            if not item.get('domain'):
                continue
                
            domain = item['domain'].lower()
            
            # Check if this is one of our test domains or contains one of them
            for test_domain, metrics in all_test_domains.items():
                if test_domain in domain:
                    item['metrics'] = metrics
                    updated_count += 1
                    print(f"Updated metrics for {domain}: DA={metrics['da']}, PA={metrics['pa']}, Spam={metrics['spam_score']}")
                    break
    
    # Save the updated data
    with open('sources_with_real_metrics.json', 'w') as f:
        json.dump(data, f, indent=4)
    
    print(f"\nDone! Updated metrics for {updated_count} domains.")
    print("The file 'sources_with_real_metrics.json' has been created.")
    print("\n=====================================================")
    print("WHAT TO DO NEXT:")
    print("1. Make sure your HTTP server is running (python3 -m http.server 8000)")
    print("2. Open your browser and go to http://localhost:8000")
    print("3. Refresh the page if it's already open")
    print("   The app will automatically use the real metrics data!")
    print("=====================================================")
    
    return True

if __name__ == "__main__":
    create_test_metrics_file() 