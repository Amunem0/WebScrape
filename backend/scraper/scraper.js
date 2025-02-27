// scraper.js
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

export async function scrapeBBCNews() {
  // Set up Chrome options (headless mode)
  let options = new chrome.Options();
  options.addArguments('headless', 'disable-gpu', 'no-sandbox');
  
  // Create the WebDriver instance
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    // Navigate to the BBC homepage
    await driver.get('https://www.bbc.com/');

    // Wait for the main content to be present (adjust the timeout as needed)
    await driver.wait(until.elementLocated(By.css('main#main-content')), 15000);

    // Select all headline elements (data-testid="card-headline")
    let headlineElements = await driver.findElements(By.css('[data-testid="card-headline"]'));
    console.log(`Found ${headlineElements.length} headline elements.\n`);

    // Array to store the scraped details
    let results = [];

    for (let i = 0; i < headlineElements.length; i++) {
      try {
        let headlineEl = headlineElements[i];

        // Get headline text
        let headline = await headlineEl.getText();

        // Traverse upward to find the closest anchor (<a>) element
        let parentAnchor = await headlineEl.findElement(By.xpath('./ancestor::a'));
        let link = await parentAnchor.getAttribute('href');

        // Attempt to get description using the first selector
        let description = '';
        try {
          let descEl = await parentAnchor.findElement(By.css('[data-testid="card-description"]'));
          description = await descEl.getText();
        } catch (descErr) {
          // Fallback: try a common BBC summary class
          try {
            let fallbackDescEl = await parentAnchor.findElement(By.css('.gs-c-promo-summary'));
            description = await fallbackDescEl.getText();
          } catch (fallbackErr) {
            description = '';
          }
        }

        // Attempt to get an image URL from the first <img> descendant
        let imageUrl = '';
        try {
          let imgEl = await parentAnchor.findElement(By.css('img'));
          imageUrl = await imgEl.getAttribute('src');
        } catch (imgErr) {
          imageUrl = '';
        }

        // Extract last updated timestamp
        let lastUpdated = '';
        try {
          let lastUpdatedEl = await parentAnchor.findElement(
            By.css('span[data-testid="card-metadata-lastupdated"]')
          );
          lastUpdated = await lastUpdatedEl.getText();
        } catch (err) {
          lastUpdated = '';
        }

        // Extract author (or tag) information
        let author = '';
        try {
          let authorEl = await parentAnchor.findElement(
            By.css('span[data-testid="card-metadata-tag"]')
          );
          author = await authorEl.getText();
        } catch (err) {
          author = '';
        }

        // Store the scraped details. Note: mapping description to summary as the frontend expects.
        results.push({
          headline,
          link,
          description,
          imageUrl,
          lastUpdated,
          author,
          summary: description,
        });

        // Log the article details
        console.log(`Article ${i + 1}:`);
        console.log(`Headline: ${headline}`);
        console.log(`Link: ${link}`);
        console.log(`Description: ${description}`);
        console.log(`Image URL: ${imageUrl}`);
        console.log(`Last Updated: ${lastUpdated}`);
        console.log(`Author: ${author}`);
        console.log('-------------------------------------------');
      } catch (innerErr) {
        console.error(`Error processing article ${i + 1}:`, innerErr);
      }
    }
    return results;
  } catch (err) {
    console.error('Error during scraping:', err);
    throw err;
  } finally {
    // Quit the driver to close the browser
    await driver.quit();
  }
}
