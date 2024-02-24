const main = document.getElementById('main');

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('form').addEventListener('submit', handleFormSubmit);
});

function handleFormSubmit(event) {
  event.preventDefault();

  // Create a new XMLHttpRequest object to make a request to the server
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json'; // Set the response type to JSON

  xhr.onreadystatechange = () => {
    // Update the loading state
    handleLoadingState().setLoadingStateEnabled();

    // Check if the request is done
    const requestDone = xhr.readyState === 4;
    // Check if the response indicates an error
    const errorResponse = requestDone && xhr.status >= 400 && xhr.status <= 599;
    // Check if the response is successful
    const successfulResponse = requestDone && xhr.status >= 200 && xhr.status <= 299;

    if (errorResponse) displayError(xhr.response?.error);
    if (successfulResponse) displayProducts(xhr.response);
  };

  // Get form data and attributes
  const form = event.target;
  const query = new FormData(event.target).get('query');
  const method = form.getAttribute('method');
  const url = form.getAttribute('action');

  // Open the request with the specified method and URL
  xhr.open(method, `${url}scrape?keyword=${query}`);
  // Send the request
  xhr.send();
}

function handleLoadingState() {
  const button = document.getElementById('button');

  // Return an object with methods to enable/disable loading state
  return {
    setLoadingStateEnabled: () => {
      button.innerHTML = 'Loading...'; // Change button text to indicate loading
    },
    setLoadingStateDisabled: () => {
      button.innerHTML = 'Search'; // Change button text back to default
    },
  };
}

function displayProducts(response) {
  // Update the loading state
  handleLoadingState().setLoadingStateDisabled();

  // If no products were found, display a message
  if (response.length === 0) {
    return (main.innerHTML = '<span class="empty">No products were found.</span>');
  }

  // Map the response data to HTML for each product
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
  // Update the loading state
  handleLoadingState().setLoadingStateDisabled();
  main.innerHTML = `<span class="error">${error}</span>`;
}
