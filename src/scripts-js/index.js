import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '../css/styles.css';
import PicturesApiService from './picturesApiService.js';
import LoadMoreBtn from './LoadMoreBtn';

const formEl = document.getElementById('search-form');
const galleryEl = document.querySelector('.gallery');

const picturesApiService = new PicturesApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

var lightbox = new SimpleLightbox('.gallery a');

formEl.addEventListener('submit', onSubmit);
loadMoreBtn.btn.addEventListener('click', onLoadMoreBtn);

function onSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const value = form.elements.searchQuery.value.trim();
  picturesApiService.query = value;

  picturesApiService.resetPage();
  picturesApiService.resetTotalImg();
  clearMarkup();

  fetchPictures().finally(() => {
    form.reset();
    if (picturesApiService.totalHits > 0) {
      Notiflix.Notify.success(
        `Hooray! We found ${picturesApiService.totalHits} images.`
      );
    }
  });
  // loadMoreBtn.showBtn();
}

async function onLoadMoreBtn() {
  await fetchPictures();
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function fetchPictures() {
  // loadMoreBtn.disable();
  loadMoreBtn.hideBtn();
  try {
    const picturesResponse = await picturesApiService.getPictures();

    const picturesTotalNumber = picturesApiService.totalHits;

    if (!picturesResponse.length) throw new Error(response.statusText);

    const markup = picturesResponse.reduce(
      (markup, hits) => createMarkup(hits) + markup,
      ''
    );
    renderMarkup(markup);
    // loadMoreBtn.enable();
    loadMoreBtn.showBtn();

    lightbox.refresh();

    if (picturesApiService.totalImg >= picturesTotalNumber) {
      loadMoreBtn.hideBtn();
      setTimeout(() => {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }, 1000);
      return;
    }
  } catch (err) {
    loadMoreBtn.hideBtn();
    console.log(err);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  // return  picturesApiService.getPictures().then( hits  => {
  //       if (hits.length === 0) throw new Error(response.statusText);
  //       return hits.reduce((markup, hits) => createMarkup(hits) + markup, "");
  // }).then(markup => {
  //   renderMarkup(markup);
  //   loadMoreBtn.enable();
  // }).catch(err => { console.log(err); loadMoreBtn.hideBtn(); })
}

function clearMarkup() {
  galleryEl.innerHTML = '';
}

function renderMarkup(markup) {
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <div class="thumb">
  <a href="${largeImageURL}">
  <img  src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  </div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes} 
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`;
}

//  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
