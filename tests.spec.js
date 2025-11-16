import exp from 'constants';

// @ts-check
const{test, expect} = require('@playwright/test');

const websiteURL = 'http://127.0.0.1:5500/vehicle-search.html';

test.beforeEach(async ({ page }) => {
   await page.goto(websiteURL);
});

// # html tests

test('homepage heading', async ({ page }) => {

   // Expect a heading 'Vehicle Search"
   await expect(page.getByRole('heading', { name: 'Vehicle Search' })).toBeVisible();

});

test('link - people search', async ({ page }) => {

   // Click the 'people search' link.
   await page.getByRole('link', { name: 'People search' }).click();

   // Expects page to have a heading 'People search'.
   await expect(page.getByRole('heading', { name: 'People Search' })).toBeVisible();
});

// head
test('should set the language to English', async ({ page }) => {
   const htmlElement = await page.locator('html');
   await expect(htmlElement).toHaveAttribute('lang','en');
});

// semantic structure elements
test('there is a <header> element', async ({ page }) => {
   const headerNum = await page.locator('header').count()
   expect(headerNum).toBeGreaterThan(0)
})

// ul for navigation link
test('there is a <ul> inside <header> for navigation links', async ({ page }) => {

   const ulNum = await page.locator('header').locator('ul').count()
   expect(ulNum).toBeGreaterThan(0)

})

test('there are three navigation links (<li>)', async ({ page }) => {
   const liNum = await page.locator('header').locator('ul').locator('li').count()
   // console.log(`liNum: ${liNum}`)
   expect(liNum).toBeGreaterThan(2)
})

// there is an image or video in side bar
test('html - image or video', async ({ page }) => {
   const imageNum = await page.locator('aside').locator('img').count()
   const videoNum = await page.locator('aside').locator('video').count()
   expect(imageNum + videoNum).toBeGreaterThan(0)
})

// # CSS tests

test('same external css for all html pages', async ({ page }) => {
   
   const cssFile = await page.locator('link').getAttribute('href')

   await page.getByRole('link', { name: 'People search' }).click();
   await expect(page.locator('link')).toHaveAttribute('href', cssFile);

   await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await expect(page.locator('link')).toHaveAttribute('href', cssFile);
})

// css flex for navigation links

test('use css flex to place navigation links horizontally', async ({ page }) => {

   await expect(page.locator('header').locator('ul')).toHaveCSS('display', 'flex')

   await expect(page.getByRole('link', { name: 'People search' })).toHaveCSS('flex', '0 1 auto')

})

// border margin padding

test('header should have padding 10px, margin 10px, and border 1px solid black', async ({ page }) => {
   
   const space = '10px'
   const border = '1px solid rgb(0, 0, 0)'

   await expect(page.locator('header')).toHaveCSS('padding', space)
   await expect(page.locator('header')).toHaveCSS('margin', space)
   await expect(page.locator('header')).toHaveCSS('border', border)
})

// CSS grid

test ('CSS grid is used to layout the page components', async({page}) => {
   await expect(page.locator('#container')).toHaveCSS('display','grid')
})

// # JavaScript Tests
//vehicle page
test('search "NG51PKO" should return Ford and owner = 1', async ({page}) => {
    await page.locator('#rego').fill('NG51PKO')
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#results')).toContainText('Ford')
    await expect(page.locator('#results')).toContainText('1')
    await expect(page.locator('#results').locator('div')).toHaveCount(1)
    await expect(page.locator('#message')).toContainText('Search successful')
 })

test('search "KWK24JI" should return tesla but no owner', async ({page}) => {
    await page.locator('#rego').fill('KWK24JI')
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#results')).toContainText('Tesla')
    await expect(page.locator('#results').locator('div')).toHaveCount(1)
    await expect(page.locator('#message')).toContainText('Search successful')
})

test('no input should return error message', async ({page}) => {
    await page.locator('#rego').fill('')
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#message')).toContainText('Error')
})

//add a vehicle page
test('try to add vehicle but dont fill out all sections', async ({page}) => {
    await page.getByRole('link', { name: 'Add a vehicle' }).click();
    await page.locator('#rego').fill('1')
    await page.locator('#make').fill('2')
    await page.locator('#model').fill('3')
    await page.getByRole('button', { name: 'Add vehicle' }).click();
    await expect(page.locator('#results').locator('div')).toHaveCount(0)
    await expect(page.locator('#message')).toContainText('Error')
})

test('try to add vehicle but fill out no sections', async ({page}) => {
    await page.getByRole('link', { name: 'Add a vehicle' }).click();
    await page.getByRole('button', { name: 'Add vehicle' }).click();
    await expect(page.locator('#results').locator('div')).toHaveCount(0)
    await expect(page.locator('#message')).toContainText('Error')
})

test('try to add vehicle and fill out all sections with non-existent owner', async ({page}) => {
    await page.getByRole('link', { name: 'Add a vehicle' }).click();
    await page.locator('#rego').fill('reg')
    await page.locator('#make').fill('make')
    await page.locator('#model').fill('model')
    await page.locator('#colour').fill('colour')
    await page.locator('#owner').fill('new owner')
    await page.getByRole('button', { name: 'Add vehicle' }).click();
    await expect(page.locator('#message')).toContainText('Owner doesnt exist. Please register.')
})

test('try to add vehicle and fill out all sections with non-existent owner, then add person and vehicle', async ({page}) => {
   await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await page.locator('#rego').fill('reg')
   await page.locator('#make').fill('make')
   await page.locator('#model').fill('model')
   await page.locator('#colour').fill('colour')
   await page.locator('#owner').fill('Jack')
   await page.getByRole('button', { name: 'Add vehicle' }).click();
   await expect(page.locator('#message')).toContainText('Owner doesnt exist')
   await page.locator('#personid').fill('10')
   await page.locator('#name').fill('Jack')
   await page.locator('#address').fill('NG7 8ET')
   await page.locator('#dob').fill('01/02/2003')
   await page.locator('#license').fill('No6789')
   await page.locator('#expire').fill('01/02/2024')
   await page.getByRole('button', { name: 'Add owner' }).click();
   await expect(page.locator('#message')).toContainText('Vehicle added successfully')
   await page.getByRole('link', { name: 'People Search' }).click();
   await page.locator('#name').fill('jack')
   await page.getByRole('button', { name: 'Submit' }).click();
   await expect(page.locator('#results')).toContainText('No6789')
   await expect(page.locator('#results')).toContainText('01/02/2003')
   await expect(page.locator('#results').locator('div')).toHaveCount(1)
   await expect(page.locator('#message')).toContainText('Search successful')
})

test('try to add vehicle and fill out all sections with existent owner', async ({page}) => {
    await page.getByRole('link', { name: 'Add a vehicle' }).click();
    await page.locator('#rego').fill('reg')
    await page.locator('#make').fill('make')
    await page.locator('#model').fill('model')
    await page.locator('#colour').fill('colour')
    await page.locator('#owner').fill('Rachel')
    await page.getByRole('button', { name: 'Add vehicle' }).click();
    await expect(page.locator('#message')).toContainText('Vehicle added successfully')
})


