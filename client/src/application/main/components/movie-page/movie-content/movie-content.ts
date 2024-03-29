import './movie-content.scss';
import ButtonElement from '../../../../shared/components/base-elements/button-element';
import DOMElement from '../../../../shared/components/base-elements/dom-element';
import { IReview, IReviewsData } from '../../../../shared/models/response-data';
import UserReview from './user-review';
import ReviewForm from './review-form/review-form';
import LinkElement from '../../../../shared/components/base-elements/link-element';
import formServices from './review-form/review-form.services';
import state from '../../../../shared/services/state';

export default class MovieContent {
  private userReview: UserReview | null = null;

  private reviewForm: ReviewForm | null = null;

  private contentColumn1: DOMElement;

  private usersReviews: DOMElement;

  private usersReviewsTitle: DOMElement;

  private usersReviewsAdd: DOMElement;

  private AddReviewLink: LinkElement;

  private usersReviewsContent: DOMElement;

  private usersReviewsReviews: DOMElement;

  private usersReviewsInfo: DOMElement;

  private usersReviewsTotal: DOMElement;

  private usersReviewsTotalP: DOMElement;

  private usersReviewsTotalS: DOMElement;

  private usersReviewsPositive: DOMElement;

  private usersReviewsPositiveP: DOMElement;

  private usersReviewsPositiveS: DOMElement;

  private usersReviewsNeutral: DOMElement;

  private usersReviewsNeutralP: DOMElement;

  private usersReviewsNeutralS: DOMElement;

  private usersReviewsNegative: DOMElement;

  private usersReviewsNegativeP: DOMElement;

  private usersReviewsNegativeS: DOMElement;

  private reviewsData: IReview[];

  private reviews: IReviewsData;

  constructor(container: HTMLElement) {
    this.reviews = state.allData.movieReviews;
    this.reviewsData = this.reviews.items.slice(0, 6);

    this.contentColumn1 = new DOMElement(container, {
      tagName: 'h3',
      classList: ['movie-content__column1'],
    });

    this.usersReviews = new DOMElement(this.contentColumn1.node, {
      tagName: 'div',
      classList: ['users-reviews'],
    });

    this.usersReviewsTitle = new DOMElement(this.usersReviews.node, {
      tagName: 'h3',
      classList: ['users-reviews__title'],
      content: 'Рецензии зрителей',
    });

    this.usersReviewsAdd = new ButtonElement(this.usersReviews.node, {
      tagName: 'button',
      classList: ['users-reviews__write-review-btn'],
      // content: 'Написать рецензию',
    });

    this.AddReviewLink = new LinkElement(this.usersReviewsAdd.node, {
      tagName: 'a',
      href: '',
      classList: ['review-form__link'],
      content: 'Написать рецензию',
    });

    this.usersReviewsAdd.node.addEventListener('click', () => {
      if (state.allData.account.userData.logged) {
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
          reviewForm.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      } else {
        window.location.hash = '#auth';
      }
    });

    this.usersReviewsContent = new DOMElement(this.usersReviews.node, {
      tagName: 'div',
      classList: ['users-reviews__content'],
    });

    this.usersReviewsReviews = new DOMElement(this.usersReviewsContent.node, {
      tagName: 'div',
      classList: ['users-reviews__reviews'],
    });

    this.usersReviewsInfo = new DOMElement(this.usersReviewsContent.node, {
      tagName: 'div',
      classList: ['users-reviews__info'],
    });

    this.usersReviewsTotal = new DOMElement(this.usersReviewsInfo.node, {
      tagName: 'div',
      classList: ['users-reviews__total', 'active'],
    });

    this.usersReviewsTotalP = new DOMElement(this.usersReviewsTotal.node, {
      tagName: 'p',
      classList: ['users-reviews__amount'],
      content: `${this.reviews.total}`,
    });
    formServices.registredCountTotal(this.usersReviewsTotalP.node);

    this.usersReviewsTotalS = new DOMElement(this.usersReviewsTotal.node, {
      tagName: 'span',
      content: 'Всего',
    });

    this.usersReviewsPositive = new DOMElement(this.usersReviewsInfo.node, {
      tagName: 'div',
      classList: ['users-reviews__positive'],
    });

    this.usersReviewsPositiveP = new DOMElement(this.usersReviewsPositive.node, {
      tagName: 'p',
      classList: ['users-reviews__amount', 'positive'],
      content: `${this.reviews.totalPositiveReviews}`,
    });
    formServices.registredCountPositive(this.usersReviewsPositiveP.node);

    this.usersReviewsPositiveS = new DOMElement(this.usersReviewsPositive.node, {
      tagName: 'span',
      content: 'Положительные',
    });

    this.usersReviewsNeutral = new DOMElement(this.usersReviewsInfo.node, {
      tagName: 'div',
      classList: ['users-reviews__neutral'],
    });

    this.usersReviewsNeutralP = new DOMElement(this.usersReviewsNeutral.node, {
      tagName: 'p',
      classList: ['users-reviews__amount', 'neutral'],
      content: `${this.reviews.totalNeutralReviews}`,
    });
    formServices.registredCountNeutral(this.usersReviewsNeutralP.node);

    this.usersReviewsNeutralS = new DOMElement(this.usersReviewsNeutral.node, {
      tagName: 'span',
      content: 'Нейтральные',
    });

    this.usersReviewsNegative = new DOMElement(this.usersReviewsInfo.node, {
      tagName: 'div',
      classList: ['users-reviews__negative'],
    });

    this.usersReviewsNegativeP = new DOMElement(this.usersReviewsNegative.node, {
      tagName: 'p',
      classList: ['users-reviews__amount', 'negative'],
      content: `${this.reviews.totalNegativeReviews}`,
    });
    formServices.registredCountNegative(this.usersReviewsNegativeP.node);

    this.usersReviewsNegativeS = new DOMElement(this.usersReviewsNegative.node, {
      tagName: 'span',
      content: 'Отрицательные',
    });

    this.renderUserReview();
  }

  public renderUserReview = () => {
    this.reviewsData.forEach((review: IReview) => {
      this.userReview = new UserReview(this.usersReviewsReviews.node, review);
    });
    if (state.allData.account.userData.logged) {
      this.reviewForm = new ReviewForm(this.usersReviewsReviews.node);
    }
  };
}
