import './card.scss';
import DOMElement from '../../../../shared/components/base-elements/dom-element';
import ImageElement from '../../../../shared/components/base-elements/image-element';
import LinkElement from '../../../../shared/components/base-elements/link-element';
import SVG from '../../../../shared/components/svg-icons';
import { ITopFilm } from '../../../../shared/models/response-data';
import valueCheck from '../../../services/search-page/value-check/value-check.service';
import ButtonElement from '../../../../shared/components/base-elements/button-element';
import likeFilmsService from '../../../services/account-page/liked-films/liked-films.service';
import storage from '../../../../shared/components/local-storage';
import state from '../../../../shared/services/state';

export default class SearchListCard extends DOMElement {
  private link: LinkElement;

  private count: DOMElement;

  private image: ImageElement;

  private info: DOMElement;

  private desc: DOMElement;

  private title: DOMElement;

  private buttons: DOMElement;

  private firstRowInfo: DOMElement;

  private secondRowInfo: DOMElement;

  private thirdRowInfo: DOMElement;

  private ratingContainer: DOMElement;

  private rating: DOMElement;

  private leftBranch: DOMElement;

  private rightBranch: DOMElement;

  private ratingCount: DOMElement;

  private accountButtons: DOMElement;

  private lookLaterBtn: ButtonElement;

  private likeButton: ButtonElement;

  constructor(parentNode: HTMLElement, data: ITopFilm, count: number) {
    super(parentNode, {
      tagName: 'li',
      classList: ['search-card'],
    });

    this.link = new LinkElement(this.node, {
      tagName: 'a',
      classList: ['search-card__link'],
      href: `#movie/${data.filmId}`,
    });
    this.link.node.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const target = e.target as HTMLLinkElement;
      if (target !== this.lookLaterBtn.node && !target.closest('.search-card__account-button-like')) {
        window.location.hash = `#movie/${data.filmId}`;
        const movie = { filmId: data.filmId, posterUrlPreview: data.posterUrlPreview, nameRu: data.nameRu };
        storage.putMovies(movie);
      }
    });

    this.count = new DOMElement(this.link.node, {
      tagName: 'span',
      classList: ['search-card__count'],
      content: valueCheck.getListCount(count),
    });

    this.image = new ImageElement(this.link.node, {
      tagName: 'img',
      classList: ['search-card__image'],
      src: data.posterUrlPreview,
    });

    this.info = new DOMElement(this.link.node, {
      tagName: 'div',
      classList: ['search-card__info'],
    });

    this.desc = new DOMElement(this.info.node, {
      tagName: 'div',
      classList: ['search-card__desc'],
    });

    this.title = new DOMElement(this.desc.node, {
      tagName: 'h3',
      classList: ['search-card__film-title'],
      content: valueCheck.isNameRU(data),
    });

    this.firstRowInfo = new DOMElement(this.desc.node, {
      tagName: 'p',
      classList: ['search-card__year-time'],
      content: valueCheck.getEngnameYearTotalTime(data),
    });

    this.secondRowInfo = new DOMElement(this.desc.node, {
      tagName: 'p',
      classList: ['search-card__type-country'],
      content: valueCheck.getTypeCountry(data),
    });

    this.thirdRowInfo = new DOMElement(this.desc.node, {
      tagName: 'p',
      classList: ['search-card__genres'],
      content: valueCheck.getGenres(data),
    });

    this.buttons = new DOMElement(this.info.node, {
      tagName: 'div',
      classList: ['search-card__buttons'],
    });

    this.ratingContainer = new DOMElement(this.buttons.node, {
      tagName: 'div',
      classList: ['search-card__rating-container'],
    });

    this.leftBranch = new DOMElement(this.ratingContainer.node, {
      tagName: 'div',
      classList: ['search-card__left-branch'],
    });
    this.leftBranch.node.innerHTML = SVG.leftGoldBranch;

    this.rating = new DOMElement(this.ratingContainer.node, {
      tagName: 'div',
      classList: ['search-card__rating'],
      content: valueCheck.getRating(data),
    });

    this.rightBranch = new DOMElement(this.ratingContainer.node, {
      tagName: 'div',
      classList: ['search-card__right-branch'],
    });
    this.rightBranch.node.innerHTML = SVG.rightGoldBranch;

    this.ratingCount = new DOMElement(this.buttons.node, {
      tagName: 'div',
      classList: ['search-card__rating-count'],
      content: data.ratingVoteCount !== null ? data.ratingVoteCount.toLocaleString('ru') : '-',
    });

    this.accountButtons = new DOMElement(this.buttons.node, {
      tagName: 'div',
      classList: ['search-card__account-buttons'],
    });

    this.lookLaterBtn = new ButtonElement(this.accountButtons.node, {
      tagName: 'button',
      classList: likeFilmsService.checkWatchLaterList(data.filmId)
        ? ['search-card__account-button-later', 'search-card__account-button-later--active']
        : ['search-card__account-button-later'],
      content: 'Буду смотреть',
    });
    this.lookLaterBtn.node.addEventListener('click', () => {
      if (state.allData.account.userData.logged) {
        if (likeFilmsService.checkWatchLaterList(data.filmId)) {
          likeFilmsService.removeWatchLaterValue(data.filmId);
          this.lookLaterBtn.node.classList.remove('search-card__account-button-later--active');
        } else {
          likeFilmsService.appendWatchLaterValue(data.filmId);
          this.lookLaterBtn.node.classList.add('search-card__account-button-later--active');
        }
      } else {
        window.location.hash = '#auth';
      }
    });

    this.likeButton = new ButtonElement(this.accountButtons.node, {
      tagName: 'button',
      classList: likeFilmsService.checkLikedFilmsList(data.filmId)
        ? ['search-card__account-button-like', 'search-card__account-button-like--active']
        : ['search-card__account-button-like'],
    });
    this.likeButton.node.innerHTML = SVG.starRating;
    this.likeButton.node.addEventListener('click', () => {
      if (state.allData.account.userData.logged) {
        if (likeFilmsService.checkLikedFilmsList(data.filmId)) {
          likeFilmsService.removeLikedFilmsValue(data.filmId);
          this.likeButton.node.classList.remove('search-card__account-button-like--active');
        } else {
          likeFilmsService.appendLikedFilmsValue(data.filmId);
          this.likeButton.node.classList.add('search-card__account-button-like--active');
        }
      } else {
        window.location.hash = '#auth';
      }
    });
  }
}
