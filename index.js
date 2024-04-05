const {
  instantiateAutoInstrumentation,
  runSyntheticHandler,
} = require("@google-cloud/synthetics-sdk-api");
instantiateAutoInstrumentation();

const functions = require("@google-cloud/functions-framework");
const puppeteer = require("puppeteer");

const { getDocument, queries: { getByRole, getByPlaceholderText, findByTitle, findByRole } } = require("pptr-testing-library");

functions.http(
  "ZenikaTrainingSyntheticTest",
  runSyntheticHandler(async ({ logger, executionId }) => {

    const browser = await puppeteer.launch({ headless: "new" });

    const page = await browser.newPage();
    const timeout = 10000;
    const URL = "https://training.zenika.com"
    page.setDefaultTimeout(timeout);
    page.setJavaScriptEnabled(true);

    {
      // Navigate on the homepage
      await page.goto(URL, { waitUntil: "load" });
      const $document = await getDocument(page)

      await getByRole($document, "heading", { name: "Train with us", level: 2 })

      logger.info(`Rendered home page ${executionId}`);
    }{
      // Type in the search bar for a CKA training
      const targetPage = page;
      const $document = await getDocument(targetPage)

      const searchbar = await getByPlaceholderText($document, "Find your training");
      await searchbar.type("cka");
      await targetPage.keyboard.press("Enter");
      await targetPage.waitForNavigation();
    }{
      // Consult a search result page and choose the first result
      const targetPage = page;
      const $document = await getDocument(targetPage)
      logger.info(`Rendered search page ${executionId}`);
      const training = await findByTitle($document, "Préparation à l'examen CKA (incluant le voucher CKA 🎟️)")
      await training.click();

      const trainingLink = await findByRole($document, "link", { name: "Discover the training" })
      await trainingLink.click();
      await targetPage.waitForNavigation();
    }{
      // Show be redirected to the training detail page.
      const targetPage = page;
      const $document = await getDocument(targetPage)
      logger.info(`Rendered detail page ${executionId}`);

      await getByRole($document, "heading", { name: "Atelier de coaching pour la Certified Kubernetes Administrator", level: 2 })
    }

    // Close the browser
    await browser.close();
  })
);
