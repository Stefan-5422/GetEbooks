const puppeteer = require("puppeteer");
const mergepdf = require("pdf-merger-js");
const fs = require("fs");
require("dotenv").config();

const url = "";
const id = 0;

(async () => {
  const browser = await puppeteer.launch({ headless: true, slowMo: 0 });
  const page = await browser.newPage();

  await page.goto("https://" + url, {
    waitUntil: "networkidle2",
  });

  await (await page.$("#email")).focus();
  await page.keyboard.type(process.env.EMAIL);
  await page.keyboard.press("Tab");
  await page.keyboard.type(process.env.PASSWORD);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

  await page.waitForTimeout(1000, () => {});

  let index = 1;
  let response = {};
  let merger = new mergepdf();

  if (!fs.existsSync("pdf/" + id)) fs.mkdirSync("pdf/" + id);

  while (true) {
    response = await page.goto(`https://a.${url}/ebook/${id}/1/${index}.svg`, {
      waitUntil: "networkidle2",
    });
    //console.log(response.headers());
    if (response.headers()["content-type"] != "image/svg+xml") break;

    await page.pdf({
      path: `pdf/${id}/${index}.pdf`,
      format: "a4",
    });
    merger.add(`pdf/${id}/${index}.pdf`);
    index++;
  }

  await merger.save(`pdf/${id}.pdf`);

  await browser.close();
})();
