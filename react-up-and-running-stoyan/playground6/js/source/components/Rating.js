// @flow

import React, { Component } from 'react';

type Props = {
  "defaultValue": number,
  "max": number,
  "readonly": ?Boolean,
  "id": ?string
};

type State = {
  "rating": number,
  "tmpRating": number
};

class Rating extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      rating: props.defaultValue,
      tmpRating: props.defaultValue
    };
  }

  static defaultProps: Object;

  getValue(): number {
    return this.state.rating;
  }

  setTemp(rating: number) {
    this.setState({ tmpRating: rating });
  }

  setRating(rating: number) {
    this.setState({ tmpRating: rating, rating });
  }

  reset() {
    this.setTemp(this.state.rating);
  }

/*
  componentWillReceiveProps(props) {
    this.setRating(props.defaultValue);
  }
*/

  render():Object {
    const stars = [];

    // TODO: bug where the component doesn't reset when mouse leaves the component
    for (let i = 1; i <= this.props.max; i += 1) {
      stars.push(
        <span
          className={ i <= this.state.tmpRating ? 'RatingOn' : null }
          key={i}
          onClick={!this.props.readonly ? this.setRating.bind(this, i) : undefined}
          onMouseOver={!this.props.readonly ? this.setTemp.bind(this, i) : undefined}>
        &#9734;</span>
      );
    }

    return (
      <div className={"Rating" + (this.props.readonly === true? ' RatingReadonly':'')}>
        {stars}
        {this.props.readonly || !this.props.id
          ? null
          : <input type="hidden" id={this.props.id} value={this.state.rating} />
        }
      </div>
    );
  }
}

Rating.defaultProps = {
  max: 5,
  defaultValue: 0
};

export default Rating;
