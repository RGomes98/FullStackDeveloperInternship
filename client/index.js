let isLoading = false;
const main = document.getElementById('main');

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('form').addEventListener('submit', handleFormSubmit);
});

function handleFormSubmit(event) {
  event.preventDefault();

  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.onreadystatechange = () => {
    handleLoadingState().setLoadingStateEnabled();

    const requestDone = xhr.readyState === 4;
    const errorResponse = requestDone && xhr.status >= 400 && xhr.status <= 599;
    const successfulResponse = requestDone && xhr.status >= 200 && xhr.status <= 299;

    if (errorResponse) displayError(xhr.response?.error);
    if (successfulResponse) displayProducts(xhr.response);
  };

  const form = event.target;
  const query = new FormData(event.target).get('query');
  const method = form.getAttribute('method');
  const url = form.getAttribute('action');

  xhr.open(method, `${url}scrape?keyword=${query}`);
  xhr.send();
}

function handleLoadingState() {
  const button = document.getElementById('button');

  return {
    setLoadingStateEnabled: () => {
      isLoading = true;
      button.innerHTML = 'Loading...';
    },
    setLoadingStateDisabled: () => {
      isLoading = false;
      button.innerHTML = 'Search';
    },
  };
}

function displayProducts(response) {
  handleLoadingState().setLoadingStateDisabled();

  if (response.length === 0) {
    return (main.innerHTML = '<span class="empty">No products were found.</span>');
  }

  const products = response.map(({ title, rating, review, image }) => {
    return `<div class="product-wrapper">
        <span class="title">${title}</span>
          <div class="text-wrapper">
            <span class="rating"><b>Rating:</b> ${rating}</span>
            <span class="review"><b>Reviews:</b> ${review}</span>
          </div>
        <img class="image" src="${image}" alt="${title}"/>
      </div>`;
  });

  main.innerHTML = products.join('');
}

function displayError(error) {
  handleLoadingState().setLoadingStateDisabled();
  main.innerHTML = `<span class="error">${error}</span>`;
}
