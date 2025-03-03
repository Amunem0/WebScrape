// scraper.js
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

/**
 * Helper: Safely get the text content of the first element matching a CSS selector.
 * Returns an empty string if not found.
 */
async function safeGetText(context, selector) {
  try {
    const elements = await context.findElements(By.css(selector));
    if (elements.length > 0) {
      return await elements[0].getText();
    }
  } catch (e) {
    // Ignore errors and return empty string
  }
  return '';
}

/**
 * Helper: Safely get the attribute of the first element matching a CSS selector.
 * Returns an empty string if not found.
 */
async function safeGetAttribute(context, selector, attribute) {
  try {
    const elements = await context.findElements(By.css(selector));
    if (elements.length > 0) {
      return await elements[0].getAttribute(attribute);
    }
  } catch (e) {
    // Ignore errors and return empty string
  }
  return '';
}

export async function scrapeBBCNews() {
  // Set up Chrome options (headless mode with unsafe swiftshader flag)
  let options = new chrome.Options();
  options.addArguments(
    'headless',
    'disable-gpu',
    'no-sandbox',
    '--enable-unsafe-swiftshader'
  );

  // Create the WebDriver instance
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    // Navigate to the BBC homepage and wait for the main content
    await driver.get('https://www.bbc.com/');
    await driver.wait(until.elementLocated(By.css('main#main-content')), 15000);

    // Get all headline elements (using the data-testid attribute)
    const headlineElements = await driver.findElements(By.css('[data-testid="card-headline"]'));
    console.log(`Found ${headlineElements.length} headline elements.\n`);

    // Array to store the scraped article details
    let results = [];

    for (let i = 0; i < headlineElements.length; i++) {
      try {
        const headlineEl = headlineElements[i];

        // Get headline text from the element
        const headline = await headlineEl.getText();

        // Get the closest anchor (<a>) element containing the article link
        const anchorCandidates = await headlineEl.findElements(By.xpath('./ancestor::a'));
        if (anchorCandidates.length === 0) continue;
        const parentAnchor = anchorCandidates[0];
        const link = await parentAnchor.getAttribute('href');

        // Skip article if its URL suggests it's a video
        if (link.includes('/video/') || link.includes('/av/')) {
          console.log(`Skipping video article ${i + 1}: ${link}`);
          continue;
        }

        // Try to extract the description (or summary) using two possible selectors
        let description = await safeGetText(parentAnchor, '[data-testid="card-description"]');
        if (!description) {
          description = await safeGetText(parentAnchor, '.gs-c-promo-summary');
        }

        // Attempt to get the image URL from the homepage
        let imageUrl = await safeGetAttribute(parentAnchor, 'img', 'src');

        // Extract last updated timestamp and categories if available
        const lastUpdated = await safeGetText(parentAnchor, 'span[data-testid="card-metadata-lastupdated"]');
        const categories = await safeGetText(parentAnchor, 'span[data-testid="card-metadata-tag"]');

        // Attempt to get the author from the homepage
        let author = await safeGetText(parentAnchor, '.sc-b42e7a8f-7.kItaYD');

        // If the image URL is missing, open the article page in a new tab
        if (!imageUrl || imageUrl.trim() === '') {
          try {
            // Open a new tab and switch to it
            await driver.executeScript("window.open()");
            const handles = await driver.getAllWindowHandles();
            const mainHandle = handles[0];
            const newTabHandle = handles[handles.length - 1];
            await driver.switchTo().window(newTabHandle);

            // Navigate to the article page
            await driver.get(link);

            // Wait (briefly) for an image element to appear; ignore if timeout occurs
            try {
              await driver.wait(until.elementLocated(By.css('img')), 10000);
            } catch (waitErr) {
              // Do nothing if wait times out
            }

            // Extract the article image URL, author, and summary if missing
            imageUrl = await safeGetAttribute(driver, 'img', 'src');
            author = await safeGetText(driver, '.sc-b42e7a8f-7.kItaYD');
            if (!description || description.trim() === '') {
              description = await safeGetText(driver, 'article p');
            }

            // Close the new tab and switch back to the main page
            await driver.close();
            await driver.switchTo().window(mainHandle);
          } catch (newTabErr) {
            console.error(`Error extracting image/author/summary from article page for article ${i + 1}:`, newTabErr);
          }
        }

        // If summary is still empty (and image URL is available), try to extract it separately
        if ((!description || description.trim() === '') && imageUrl) {
          try {
            await driver.executeScript("window.open()");
            const handles = await driver.getAllWindowHandles();
            const mainHandle = handles[0];
            const newTabHandle = handles[handles.length - 1];
            await driver.switchTo().window(newTabHandle);
            await driver.get(link);
            // Wait for the first paragraph element in the article
            try {
              await driver.wait(until.elementLocated(By.css('article p')), 10000);
            } catch (e) {}
            description = await safeGetText(driver, 'article p');
            await driver.close();
            await driver.switchTo().window(mainHandle);
          } catch (sumPageErr) {
            console.error(`Error extracting summary from article page for article ${i + 1}:`, sumPageErr);
          }
        }

        // If after all attempts the image URL is still empty, skip the article
        if (!imageUrl || imageUrl.trim() === '') {
          console.log(`Skipping article ${i + 1} as it has no image.`);
          continue;
        }

        // Save the extracted details (mapping description to summary for frontend consistency)
        results.push({
          headline,
          link,
          description,
          imageUrl,
          lastUpdated,
          categories,
          author,
          summary: description,
        });

        // Log article details
        console.log(`Article ${i + 1}:`);
        console.log(`Headline: ${headline}`);
        console.log(`Link: ${link}`);
        console.log(`Description: ${description}`);
        console.log(`Image URL: ${imageUrl}`);
        console.log(`Last Updated: ${lastUpdated}`);
        console.log(`Categories: ${categories}`);
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
    await driver.quit();
  }
}
