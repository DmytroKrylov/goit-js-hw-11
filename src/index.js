const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const API_KEY = '17074451-935a1dfdbcca0fa80856ea2a8';
const BASE_URL = 'https://pixabay.com/api/';

let page = 1;
let searchQuery = '';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  searchQuery = event.target.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  page = 1;
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40
      }
    });

    const images = response.data.hits;

    if (images.length === 0) {
      showNoResultsMessage();
      return;
    }

    renderImages(images);
    checkLoadMoreButtonVisibility(response.data.totalHits);
  } catch (error) {
    console.log('Error:', error);
    showErrorNotification();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page++;

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40
      }
    });

    const images = response.data.hits;

    if (images.length === 0) {
      showNoResultsMessage();
      return;
    }

    renderImages(images);
    checkLoadMoreButtonVisibility(response.data.totalHits);
  } catch (error) {
    console.log('Error:', error);
    showErrorNotification();
  }
});

function renderImages(images) {
  const fragment = document.createDocumentFragment();

  images.forEach((image) => {
    const card = createImageCard(image);
    fragment.appendChild(card);
  });

  gallery.appendChild(fragment);
}

function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = createInfoItem('Likes', image.likes);
  const views = createInfoItem('Views', image.views);
  const comments = createInfoItem('Comments', image.comments);
  const downloads = createInfoItem('Downloads', image.downloads);

  info.appendChild(likes);
  info.appendChild(views);
  info.appendChild(comments);
  info.appendChild(downloads);

  card.appendChild(img);
  card.appendChild(info);

  return card;
}

function createInfoItem(label, value) {
  const item = document.createElement('p');
  item.classList.add('info-item');
  item.innerHTML = `<b>${label}:</b> ${value}`;
  return item;
}

function checkLoadMoreButtonVisibility(totalHits) {
  const remainingImages = totalHits - page * 40;
  if (remainingImages > 0) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
    showEndOfResultsMessage();
  }
}

function showNoResultsMessage() {
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function showEndOfResultsMessage() {
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}

function showErrorNotification() {
  Notiflix.Notify.failure('An error occurred while fetching the images. Please try again later.');
}
