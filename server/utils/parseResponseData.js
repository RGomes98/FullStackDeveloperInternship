import * as cheerio from 'cheerio';

export const parseResponseData = (response) => {
  const data = [];
  const $ = cheerio.load(response);
  const products = $('[data-component-type=s-search-result]').has('.a-icon-alt');

  products.each((index, product) => {
    const title = $(product).find('[data-cy=title-recipe]').find('h2').text();
    const rating = $(product).find('.a-icon-alt').text();
    const review = $(product).find('[data-csa-c-slot-id=alf-reviews]').find('a').find('span').text();
    const image = $(product).find('[data-component-type=s-product-image]').find('img').prop('src');

    data.push({ title, rating, review, image });
  });

  return data;
};
