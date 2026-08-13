import { chromium } from "playwright-core";

const baseUrl = "https://3000-ipxm0kosne7azfal3k5c6-ea40ec18.us2.manus.computer";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1 });
const result = { viewport: "375x812", navigation: {}, booking: {}, overflow: {} };

await page.goto(`${baseUrl}/auto-service-detail`, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(1200);

const visibleNavButtons = page.locator("nav button:visible");
await visibleNavButtons.first().click();
const mobileServicesButton = page.locator('nav button:visible').filter({ hasText: "УСЛУГИ" });
await mobileServicesButton.click();
result.navigation.servicesLinkVisible = await page.getByRole("link", { name: "АВТОЧАСТИ", exact: true }).isVisible();
result.navigation.roadAssistanceLinkVisible = await page.getByRole("link", { name: "ПЪТНА ПОМОЩ", exact: true }).isVisible();
await mobileServicesButton.click();
await visibleNavButtons.first().click();
result.navigation.menuClosed = !(await page.getByRole("link", { name: "АВТОЧАСТИ", exact: true }).isVisible().catch(() => false));

await page.getByRole("button", { name: "Запази час" }).first().click();
await page.getByPlaceholder("Име").fill("Тест Mobile MTEX");
await page.getByPlaceholder("Телефонен номер").fill("+359888000000");
await page.getByRole("combobox").click();
await page.getByRole("option", { name: "Ремонт на двигатели" }).click();
await page.locator('input[type="date"]').fill("2026-12-31");
await page.locator('input[type="time"]').fill("10:30");
await page.getByPlaceholder("Описание на проблема").fill("Mobile browser booking verification");
await page.getByRole("button", { name: "Запази час" }).last().click();
await page.getByText(/Резервацията е създадена успешно!/).waitFor({ state: "visible", timeout: 15000 });
result.booking.successToastVisible = true;
result.booking.formReset = (await page.getByPlaceholder("Име").inputValue()) === "";

result.overflow.scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
result.overflow.clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
result.overflow.hasHorizontalOverflow = result.overflow.scrollWidth > result.overflow.clientWidth;
await page.screenshot({ path: "/home/ubuntu/browser-booking-mobile-375.png", fullPage: false });
console.log(JSON.stringify(result, null, 2));
await browser.close();
