const puppeteer = require("puppeteer");
const { cookie } = require("./data/data.import");
const { copyStringToClipboard } = require("./functions/support");

/**
 * Post To Facebook
 * @param {*} type 0: Profile, 1: Group, 2: Page
 */
const PTFB = async ( id, imagesList, type ) => {
  // Open browser
  const browser = await puppeteer.launch({ headless: false });

  try {
      // Open a new tab
      const page = await browser.newPage();

      // Define turn off notification popup
      const context = browser.defaultBrowserContext();
      await context.overridePermissions('https://www.facebook.com', ['notifications']);

      // set viewport
      await page.setViewport({ width: 1366, height: 768 });

      // Set cookie before access to facebook
      await Promise.all(
          cookie.map(element => {
              page.setCookie(element);
          })
      );
      await page.waitFor(1000);

      // Go to m.facebook.com
      await page.goto(`https://www.facebook.com/${id}`);

      // click to open popup
      await page.click('div[role="region"]');
      await page.waitForSelector('div[data-testid="react-composer-root"]');

      // Click element to type text
      await page.waitForSelector('div[data-testid="react-composer-root"] div[contenteditable="true"]');
      // const editContent = await page.$('div[data-testid="react-composer-root"] div[contenteditable="true"]');
      // await editContent.type('Test tool thôi nhé các bạn nhỏ!');

      await page.evaluate(() => {
          // Create new element
          const el = document.createElement('textarea');
          // Set value (string to be copied)
          el.value = 'Test tool thôi nhé các bạn nhỏ!';
          // Set non-editable to avoid focus and move outside of view
          el.setAttribute('readonly', '');
          el.style = {
              position: 'absolute',
              left: '-9999px'
          };
          document.body.appendChild(el);
          // Select text inside element
          el.select();
          // Copy text to clipboard
          document.execCommand('copy');
          // Remove temporary element
          document.body.removeChild(el);
      });
      await page.click('div[data-testid="react-composer-root"] div[contenteditable="true"]');
      await page.keyboard.down('Ctrl');
      await page.keyboard.down('KeyV');

      // Upload file using dialog
      for(let i = 0; i < imagesList.length; i++) {
          if (type === 0 || type === 1) {
              const input = await page.$('input[data-testid="media-sprout"]');
              await input.uploadFile(imagesList[i]);
          } else if (type === 2) {
              if ( i < 1 ) {
                  await page.click('div[data-testid="photo-video-button"]');
                  await page.waitForSelector('input[name="composer_photo"]');
                  const input = await page.$('input[name="composer_photo"]');
                  await input.uploadFile(imagesList[i]);
              } else {
                  const input = await page.$('input[data-testid="media-sprout"]');
                  await input.uploadFile(imagesList[i]);
              }
          }

          // Handle wait finnish upload attachement
          await page.waitForSelector('div.fbScrollableArea');
          await page.waitForSelector('div.fbScrollableAreaContent div[data-testid="media-attachment-photo"]')
      }

      // Handle wait button able to click
      // await page.waitForSelector('div[data-testid="react-composer-root"] button[disabled]') ;
      await page.waitForFunction(`document.querySelector('div[data-testid="react-composer-root"] button[data-testid="react-composer-post-button"]').disabled === false`);

      // Handle button submit to feed
      const btnSubmit = await page.$('div[data-testid="react-composer-root"] button[data-testid="react-composer-post-button"]');
      await btnSubmit.click();

      await page.waitForSelector( 'div[data-ft*="mf_story_key"]' );

      const previewInfo = await page.$eval( 'div[data-ft*="mf_story_key"]', div => div.getAttribute( 'data-ft' ) ),
          start = '"mf_story_key":"',
          end = '"';

      console.log( previewInfo.substring(
          previewInfo.indexOf( start ) + start.length,
          previewInfo.indexOf(end, previewInfo.indexOf(start) + start.length)
      ) )
  } catch (e) {
      await browser.close();
      console.log(e)
  }
};

(async () => {
  const imagesList = [
    "/Users/skyalbert/Desktop/Images/1.png",
    "/Users/skyalbert/Desktop/Images/2.jpg",
    "/Users/skyalbert/Desktop/Images/3.jpg",
    "/Users/skyalbert/Desktop/Images/4.jpg"
  ];

  await PTFB("trantoan.960", imagesList, 0);
})();
