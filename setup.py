import subprocess
import sys
import os

def install_dependencies():
    """
    Install all required dependencies for the backlink finder tools
    """
    print("Installing required dependencies...\n")
    
    # Check if pip is available
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "--version"])
    except subprocess.CalledProcessError:
        print("Error: pip is not installed or not working properly.")
        print("Please install pip and try again.")
        return False
    
    # List of required packages
    requirements = [
        "python-dotenv>=1.0.0",
        "requests>=2.25.0",
        "beautifulsoup4>=4.9.0",
        "tqdm>=4.66.2"
    ]
    
    # Install each package
    for package in requirements:
        print(f"Installing {package}...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✓ Successfully installed {package}")
        except subprocess.CalledProcessError:
            print(f"× Failed to install {package}")
            return False
    
    print("\nAll dependencies successfully installed!")
    
    # Create .env file if it doesn't exist
    if not os.path.exists('.env'):
        print("\nCreating .env template file...")
        with open('.env', 'w') as f:
            f.write("""# API Keys for premium SEO metrics (optional)

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
        print("✓ Created .env template file")
    
    print("\n=====================================================")
    print("SETUP COMPLETE! WHAT TO DO NEXT:")
    print("1. Run the mock metrics generator to create realistic metrics:")
    print("   python3 mock_metrics.py")
    print("2. Start the web server:")
    print("   python3 -m http.server 8000")
    print("3. Open your browser and go to http://localhost:8000")
    print("=====================================================")
    
    return True

if __name__ == "__main__":
    install_dependencies() 