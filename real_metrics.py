import json
import requests
import time
import os
import base64
import argparse
from urllib.parse import urlparse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_seodataapi_metrics(domain):
    """
    Get domain metrics using SEODataAPI.com's free API.
    You'll need to sign up for a free API key at https://www.seodataapi.com/
    """
    api_key = os.getenv("SEODATAAPI_KEY")
    
    if not api_key:
        print("No SEODataAPI key found. Please set SEODATAAPI_KEY in your .env file.")
        return None
    
    url = f"https://api.seodataapi.com/domain-authority"
    
    params = {
        "api_key": api_key,
        "domain": domain
    }
    
    try:
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            return {
                "da": data.get("domain_authority", 0),
                "pa": data.get("page_authority", 0),
                "spam_score": data.get("spam_score", 0)
            }
        else:
            print(f"Error fetching metrics for {domain}: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Exception fetching metrics for {domain}: {e}")
        return None

def get_domcop_api_metrics(domain):
    """
    Get domain metrics using the DomCop API (free trial available)
    You'll need to sign up for an API key at https://www.domcop.com/
    """
    api_key = os.getenv("DOMCOP_API_KEY")
    
    if not api_key:
        print("No DomCop API key found. Please set DOMCOP_API_KEY in your .env file.")
        return None
    
    url = f"https://api.domcop.com/api/v1/domain/{domain}"
    
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            return {
                "da": data.get("moz_da", 0),
                "pa": data.get("moz_pa", 0),
                "spam_score": data.get("moz_spam_score", 0)
            }
        else:
            print(f"Error fetching metrics for {domain}: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Exception fetching metrics for {domain}: {e}")
        return None

def get_webcheck_metrics(domain):
    """
    Get domain metrics using WebCheck.io's completely free API.
    No API key required!
    """
    url = f"https://api.webcheck.io/v1/domain-authority"
    
    params = {
        "domain": domain
    }
    
    try:
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            
            # Extract metrics from response
            da = int(data.get("domain_authority", 0))
            pa = int(data.get("page_authority", 0))
            
            # WebCheck doesn't provide spam score directly, 
            # so we'll calculate a simple approximation based on other metrics
            spam_factors = data.get("spam_factors", [])
            spam_score = len(spam_factors) if isinstance(spam_factors, list) else 0
            
            # Adjust spam score to be on a scale of 0-14
            spam_score = min(14, spam_score * 2)
            
            return {
                "da": da,
                "pa": pa,
                "spam_score": spam_score
            }
        else:
            print(f"Error fetching WebCheck metrics for {domain}: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Exception fetching WebCheck metrics for {domain}: {e}")
        return None

def get_dataforseo_metrics(domain):
    """
    Get domain metrics using DataForSEO API.
    Requires DataForSEO account: https://dataforseo.com/
    They offer a free trial with some credits.
    """
    username = os.getenv("DATAFORSEO_LOGIN")
    password = os.getenv("DATAFORSEO_PASSWORD")
    
    if not username or not password:
        print("No DataForSEO credentials found. Please set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD in your .env file.")
        return None
    
    url = "https://api.dataforseo.com/v3/domain_analytics/domain_info"
    
    # Prepare authentication
    auth_string = f"{username}:{password}"
    auth_bytes = auth_string.encode('ascii')
    auth_b64 = base64.b64encode(auth_bytes).decode('ascii')
    
    headers = {
        "Authorization": f"Basic {auth_b64}",
        "Content-Type": "application/json"
    }
    
    # Prepare request data
    data = {
        "target": domain,
        "include_subdomains": False
    }
    
    try:
        response = requests.post(url, headers=headers, json=[data])
        
        if response.status_code == 200:
            result = response.json()
            
            if result.get("status_code") == 20000:
                tasks = result.get("tasks", [])
                if tasks and len(tasks) > 0:
                    result_data = tasks[0].get("result", [])
                    if result_data and len(result_data) > 0:
                        metrics_data = result_data[0]
                        
                        # Extract metrics - approximate DA/PA from DataForSEO metrics
                        backlinks = metrics_data.get("backlinks_info", {}).get("backlinks", 0)
                        referring_domains = metrics_data.get("backlinks_info", {}).get("referring_domains", 0)
                        
                        # Calculate a DA approximation based on backlinks and referring domains
                        if backlinks > 0 and referring_domains > 0:
                            # Logarithmic scale to simulate DA
                            import math
                            da = min(100, int(20 * math.log10(1 + referring_domains)))
                            pa = min(100, int(15 * math.log10(1 + backlinks)))
                            
                            # Calculate spam score (inverted quality score)
                            toxic_score = metrics_data.get("toxic_score", 0)
                            spam_score = min(14, int(toxic_score / 7))  # Scale to 0-14
                            
                            return {
                                "da": da,
                                "pa": pa,
                                "spam_score": spam_score
                            }
            
            print(f"Error in DataForSEO response for {domain}: {result.get('status_message', 'Unknown error')}")
            return None
        else:
            print(f"Error fetching DataForSEO metrics for {domain}: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Exception fetching DataForSEO metrics for {domain}: {e}")
        return None

def fetch_and_update_metrics(limit=None):
    """
    Fetch real metrics for domains in sources_with_metrics.json
    and update with real data where possible
    
    Args:
        limit: Optional limit on how many domains to process (for testing)
    """
    try:
        # Load existing data
        with open('sources_with_metrics.json', 'r') as f:
            data = json.load(f)
        
        total_domains = 0
        updated_domains = 0
        processed_domains = 0
        
        # Create a dictionary to cache metrics for domains we've already checked
        # to avoid redundant API calls for the same domain
        domain_metrics_cache = {}
        
        # Process each category
        for category, items in data.items():
            print(f"Processing category: {category} ({len(items)} items)")
            
            for i, item in enumerate(items):
                if not item.get('url') or not item.get('domain'):
                    continue
                
                domain = item['domain']
                total_domains += 1
                
                # Skip if we've already processed this domain
                if domain in domain_metrics_cache:
                    print(f"Using cached metrics for {domain}")
                    item['metrics'] = domain_metrics_cache[domain]
                    updated_domains += 1
                    continue
                
                # Check if we've hit the limit
                processed_domains += 1
                if limit and processed_domains > limit:
                    print(f"Reached limit of {limit} domains, stopping")
                    break
                
                # Try to get real metrics
                print(f"Fetching metrics for {domain}... ({i+1}/{len(items)})")
                
                # Try each API in order of preference
                metrics = None
                
                # Try DataForSEO first if credentials are available
                if os.getenv("DATAFORSEO_LOGIN") and os.getenv("DATAFORSEO_PASSWORD"):
                    metrics = get_dataforseo_metrics(domain)
                
                # Try WebCheck if DataForSEO failed
                if not metrics:
                    metrics = get_webcheck_metrics(domain)
                
                # Try SEODataAPI if WebCheck failed
                if not metrics and os.getenv("SEODATAAPI_KEY"):
                    metrics = get_seodataapi_metrics(domain)
                
                # Try DomCop if all others failed
                if not metrics and os.getenv("DOMCOP_API_KEY"):
                    metrics = get_domcop_api_metrics(domain)
                
                # If we got metrics, update the item
                if metrics:
                    item['metrics'] = metrics
                    domain_metrics_cache[domain] = metrics
                    updated_domains += 1
                    print(f"✓ Updated metrics for {domain}: DA={metrics['da']}, PA={metrics['pa']}, Spam={metrics['spam_score']}")
                else:
                    print(f"× Failed to get metrics for {domain}, keeping simulated metrics")
                
                # Add a small delay to avoid hitting API rate limits
                time.sleep(1)
            
            # Break out of the categories loop if we've hit the limit
            if limit and processed_domains >= limit:
                break
        
        # Save the updated data
        with open('sources_with_real_metrics.json', 'w') as f:
            json.dump(data, f, indent=4)
        
        print(f"\nDone! Updated {updated_domains} out of {processed_domains} domains processed.")
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
        print(f"Error updating metrics: {e}")
        return False

def create_env_template():
    """Create a template .env file if it doesn't exist"""
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write("""# API Keys for SEO metrics

# WebCheck.io - No API key required!

# DataForSEO - Most reliable option (free trial available)
# Sign up at https://dataforseo.com/
DATAFORSEO_LOGIN=your_login_here
DATAFORSEO_PASSWORD=your_password_here

# SEODataAPI - Alternative option
# Sign up at https://www.seodataapi.com/ for a free API key
SEODATAAPI_KEY=your_key_here

# DomCop - Another alternative
# Sign up at https://www.domcop.com/ for a free API key
DOMCOP_API_KEY=your_key_here
""")
        print("Created .env template file. Please add your API keys.")

if __name__ == "__main__":
    # Set up command line arguments
    parser = argparse.ArgumentParser(description='Fetch real SEO metrics for domains')
    parser.add_argument('--limit', type=int, help='Limit the number of domains to process (for testing)')
    args = parser.parse_args()
    
    create_env_template()
    
    # Try to fetch metrics, even if we don't have API keys
    # We'll use WebCheck.io which doesn't require a key
    fetch_and_update_metrics(limit=args.limit) 