import * as cheerio from 'cheerio';

export const parseResponseData = (response) => {
  const data = [];

  // Load the HTML response into Cheerio
  const $ = cheerio.load(response);

  // Select all products with the attribute 'data-component-type' equal to 's-search-result' that contain an element with class 'a-icon-alt'.
  // This is done to filter out only the product listings that have a rating. Some listings on the Amazon page might be 'featured' and lack a rating, so we ensure consistency by selecting only those with all necessary values.
  const products = $('[data-component-type=s-search-result]').has('.a-icon-alt');

  products.each((index, product) => {
    // Extract title, rating, review, and image information from each product element
    const title = $(product).find('[data-cy=title-recipe]').find('h2').text();
    const rating = $(product).find('.a-icon-alt').text();
    const review = $(product).find('[data-csa-c-slot-id=alf-reviews]').find('a').find('span').text();
    const image = $(product).find('[data-component-type=s-product-image]').find('img').prop('src');

    // Push an object containing the extracted information into the data array
    data.push({ title, rating, review, image });
  });

  return data;
};
