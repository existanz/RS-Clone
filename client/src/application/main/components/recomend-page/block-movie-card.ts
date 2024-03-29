import ButtonElement from '../../../shared/components/base-elements/button-element';
import DOMElement from '../../../shared/components/base-elements/dom-element';
import ImageElement from '../../../shared/components/base-elements/image-element';
import LinkElement from '../../../shared/components/base-elements/link-element';
import storage from '../../../shared/components/local-storage';
import SVG from '../../../shared/components/svg-icons';
import { ITopFilm } from '../../../shared/models/response-data';
import state from '../../../shared/services/state';
import likeFilmsService from '../../services/account-page/liked-films/liked-films.service';

export default class BlockMovieCard {
  private movieCardFlat: DOMElement;

  private movieCardNumber: DOMElement;

  private movieCardPoster: DOMElement;

  private movieCardPosterImage: ImageElement;

  private movieCardInfo: DOMElement;

  private movieCardLink: DOMElement;

  private movieCardInfoMain: DOMElement;

  private movieCardInfoMainP: DOMElement;

  private movieCardGenre: DOMElement;

  private movieCardRating: DOMElement;

  private movieCardButtons: DOMElement;

  private movieCardButtonToWatch: ButtonElement;

  private movieCardButtonRate: ButtonElement;

  private movieCardButtonRateStar: DOMElement;

  constructor(container: HTMLElement, item: ITopFilm, index: number) {
    const isEn = `${item.nameRu}, ${item.nameEn}, ${item.year}`;
    const noEn = `${item.nameRu}, ${item.year}`;
    const nameRuEn = item.nameEn === null ? noEn : isEn;

    const rating = +item.rating < 7 ? ['movie-card-flat__rating'] : ['movie-card-flat__rating', 'active'];

    let movieGenres = '';

    item.genres.forEach((e) => {
      movieGenres += ` ${e.genre},`;
    });

    movieGenres = movieGenres.slice(0, -1);

    this.movieCardFlat = new DOMElement(container, {
      tagName: 'div',
      classList: ['movie-card-flat'],
    });

    this.movieCardNumber = new DOMElement(this.movieCardFlat.node, {
      tagName: 'p',
      classList: ['movie-card-flat__number'],
      content: `${index + 1}`,
    });

    this.movieCardPoster = new DOMElement(this.movieCardFlat.node, {
      tagName: 'div',
      classList: ['movie-card-flat__poster'],
    });

    this.movieCardPosterImage = new ImageElement(this.movieCardPoster.node, {
      tagName: 'img',
      classList: ['movie-card-flat__poster_img'],
      src: item.posterUrlPreview,
      alt: item.nameRu,
    });

    this.movieCardInfo = new DOMElement(this.movieCardFlat.node, {
      tagName: 'div',
      classList: ['movie-card-flat__info'],
    });

    this.movieCardInfoMain = new DOMElement(this.movieCardInfo.node, {
      tagName: 'div',
      classList: ['movie-card-flat__info-main'],
    });

    this.movieCardLink = new LinkElement(this.movieCardInfoMain.node, {
      tagName: 'a',
      href: `#movie/${item.filmId}`,
      classList: ['movie-card-flat__link'],
      content: `${item.nameRu}`,
    });

    this.movieCardLink.node.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const target = e.target as HTMLLinkElement;
      if (target !== this.movieCardButtonToWatch.node && !target.closest('.movie-card-flat__to-rate-btn')) {
        window.location.hash = `#movie/${item.filmId}`;
        const movie = { filmId: item.filmId, posterUrlPreview: item.posterUrlPreview, nameRu: item.nameRu };
        storage.putMovies(movie);
      }
    });

    this.movieCardInfoMainP = new DOMElement(this.movieCardInfoMain.node, {
      tagName: 'p',
      classList: ['movie-card-flat__info-main'],
      content: nameRuEn,
    });

    this.movieCardGenre = new DOMElement(this.movieCardInfoMain.node, {
      tagName: 'p',
      classList: ['block-movie__card_genre'],
      content: `Жанр: ${movieGenres}`,
    });

    this.movieCardRating = new DOMElement(this.movieCardFlat.node, {
      tagName: 'p',
      classList: rating,
      content: item.rating,
    });

    this.movieCardButtons = new DOMElement(this.movieCardFlat.node, {
      tagName: 'div',
      classList: ['movie-card-flat__buttons'],
    });

    this.movieCardButtonToWatch = new ButtonElement(this.movieCardButtons.node, {
      tagName: 'button',
      classList: likeFilmsService.checkWatchLaterList(item.filmId)
        ? ['movie-card-flat__to-watch-btn', 'movie-card-flat__to-watch-btn--active']
        : ['movie-card-flat__to-watch-btn'],
      content: 'Буду смотреть',
    });
    this.movieCardButtonToWatch.node.addEventListener('click', () => {
      if (state.allData.account.userData.logged) {
        if (likeFilmsService.checkWatchLaterList(item.filmId)) {
          likeFilmsService.removeWatchLaterValue(item.filmId);
          this.movieCardButtonToWatch.node.classList.remove('movie-card-flat__to-watch-btn--active');
        } else {
          likeFilmsService.appendWatchLaterValue(item.filmId);
          this.movieCardButtonToWatch.node.classList.add('movie-card-flat__to-watch-btn--active');
        }
      } else {
        window.location.hash = '#auth';
      }
    });

    this.movieCardButtonRate = new ButtonElement(this.movieCardButtons.node, {
      tagName: 'button',
      classList: likeFilmsService.checkLikedFilmsList(item.filmId)
        ? ['movie-card-flat__to-rate-btn', 'movie-card-flat__to-rate-btn--active']
        : ['movie-card-flat__to-rate-btn'],
    });
    this.movieCardButtonRate.node.addEventListener('click', () => {
      if (state.allData.account.userData.logged) {
        if (likeFilmsService.checkLikedFilmsList(item.filmId)) {
          likeFilmsService.removeLikedFilmsValue(item.filmId);
          this.movieCardButtonRate.node.classList.remove('movie-card-flat__to-rate-btn--active');
        } else {
          likeFilmsService.appendLikedFilmsValue(item.filmId);
          this.movieCardButtonRate.node.classList.add('movie-card-flat__to-rate-btn--active');
        }
      } else {
        window.location.hash = '#auth';
      }
    });

    this.movieCardButtonRateStar = new DOMElement(this.movieCardButtonRate.node, {
      tagName: 'span',
      classList: ['movie-card-flat__star'],
    });
    this.movieCardButtonRateStar.node.innerHTML = SVG.starRating;
  }
}
