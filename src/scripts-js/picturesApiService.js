import axios from 'axios';

export default class PicturesApiService {
  constructor() {
    this.page = 1;
    this.query = '';
    this.imgPerPage = 40;
    this.totalImg = 0;
    this.totalHits = 0;
  }

  async getPictures() {
    const URL = `https://pixabay.com/api/?key=33885269-090adf138bc0970f2f6b8731c&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.imgPerPage}`;

    const response = await axios.get(URL);
    this.nextPage();
    this.getTotalImg();
    this.totalHits = response.data.totalHits;

    return response.data.hits;

    //  return axios.get(URL).then(({ data }) => {
    //      this.nextPage();
    //      return data.hits;
    //   })
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  getTotalImg() {
    this.totalImg += this.imgPerPage;
  }
  resetTotalImg() {
    this.totalImg = 0;
  }
}
