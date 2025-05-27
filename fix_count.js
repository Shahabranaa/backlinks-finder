// This script checks the actual number of websites in sources_with_metrics.json
// and ensures the webpage displays the correct count

// Function to fetch the sources_with_metrics.json file and count the websites
async function countWebsites() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`sources_with_metrics.json?t=${timestamp}`);
        if (!response.ok) {
            throw new Error(`Error loading sources_with_metrics.json: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Count total websites and calculate metric averages
        let total = 0;
        let validTotal = 0;
        let daSum = 0;
        let paSum = 0;
        let spamSum = 0;
        const categoryStats = [];
        
        // Process each category
        for (const [category, items] of Object.entries(data)) {
            let categoryCount = items.length;
            let validCount = 0;
            let categoryDaSum = 0;
            let categoryPaSum = 0; 
            let categorySpamSum = 0;
            
            // Count valid items with metrics
            for (const item of items) {
                if (item && item.url && typeof item.url === 'string' && item.url.startsWith('http') && item.metrics) {
                    validCount++;
                    categoryDaSum += item.metrics.da;
                    categoryPaSum += item.metrics.pa;
                    categorySpamSum += item.metrics.spam_score;
                }
            }
            
            total += categoryCount;
            validTotal += validCount;
            daSum += categoryDaSum;
            paSum += categoryPaSum;
            spamSum += categorySpamSum;
            
            // Calculate category averages
            const avgDa = validCount > 0 ? Math.round(categoryDaSum / validCount) : 0;
            const avgPa = validCount > 0 ? Math.round(categoryPaSum / validCount) : 0;
            const avgSpam = validCount > 0 ? Math.round(categorySpamSum / validCount * 10) / 10 : 0;
            
            categoryStats.push({
                name: category,
                total: categoryCount,
                valid: validCount,
                avgDa,
                avgPa,
                avgSpam
            });
        }
        
        // Calculate overall averages
        const avgDa = validTotal > 0 ? Math.round(daSum / validTotal) : 0;
        const avgPa = validTotal > 0 ? Math.round(paSum / validTotal) : 0;
        const avgSpam = validTotal > 0 ? Math.round(spamSum / validTotal * 10) / 10 : 0;
        
        // Sort categories by size
        categoryStats.sort((a, b) => b.valid - a.valid);
        
        console.log(`Total websites found: ${total}`);
        console.log(`Valid websites found: ${validTotal}`);
        
        // Display result
        document.body.innerHTML = `
            <div style="font-family: sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h1>Website Count Check</h1>
                <p>Total websites in sources_with_metrics.json: <strong>${total}</strong></p>
                <p>Valid websites (with metrics): <strong>${validTotal}</strong></p>
                
                <h2>Overall Metrics</h2>
                <ul>
                    <li>Average Domain Authority: <strong>${avgDa}</strong></li>
                    <li>Average Page Authority: <strong>${avgPa}</strong></li>
                    <li>Average Spam Score: <strong>${avgSpam}</strong></li>
                </ul>
                
                <h2>Websites by Category</h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Category</th>
                            <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Count</th>
                            <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Avg DA</th>
                            <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Avg PA</th>
                            <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Avg Spam</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${categoryStats.map(cat => `
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;">${cat.name.replace(/_/g, ' ')}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${cat.valid} / ${cat.total}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${cat.avgDa}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${cat.avgPa}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${cat.avgSpam}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div style="margin-top: 30px;">
                    <button onclick="location.reload()" style="padding: 10px 20px; background: #4a90e2; color: white; border: none; border-radius: 4px; cursor: pointer;">Refresh</button>
                    <a href="/" style="margin-left: 10px; padding: 10px 20px; background: #5cb85c; color: white; text-decoration: none; border-radius: 4px;">Go to Website List</a>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 4px;">
                    <p><strong>Instructions:</strong></p>
                    <ol>
                        <li>If the count shows 1000+ websites, your sources_with_metrics.json file is correctly loaded.</li>
                        <li>If the count is still low, try clearing your browser cache (Ctrl+F5 or Cmd+Shift+R).</li>
                        <li>Make sure you're using the "Go to Website List" button to return to the main page.</li>
                    </ol>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        document.body.innerHTML = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h1>Error</h1>
                <p>${error.message}</p>
                <button onclick="location.reload()" style="padding: 10px 20px; background: #4a90e2; color: white; border: none; border-radius: 4px; cursor: pointer;">Try Again</button>
                <a href="/" style="margin-left: 10px; padding: 10px 20px; background: #5cb85c; color: white; text-decoration: none; border-radius: 4px;">Go to Website List</a>
            </div>
        `;
    }
}

// Run the count
countWebsites(); 