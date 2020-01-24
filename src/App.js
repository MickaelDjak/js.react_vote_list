import React, { Component } from "react";
import "./styles.css";

class Card extends Component {
  up = () => {
    this.props.up(this.props.id);
  };

  down = () => {
    this.props.down(this.props.id);
  };

  render() {
    const { title, description, votes, position, isWinner } = this.props;

    const styleClas = isWinner ? "card text-white bg-success" : "card";

    return (
      <div className={styleClas}>
        <div className="card-header bg-transparent ">Position #{position}</div>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
        </div>
        <div className="card-footer">
          <button className="btn btn-success" onClick={this.up}>
            up
          </button>
          <span className="mr-3 ml-3">{votes}</span>
          <button className="btn btn-danger" onClick={this.down}>
            down
          </button>
        </div>
      </div>
    );
  }
}

class CardList extends Component {
  state = {
    products: []
  };

  componentDidMount() {
    this.setState({
      products: window.Seed.products
    });
  }

  up = id => {
    this.processing(id, 1);
  };

  down = id => {
    this.processing(id, -1);
  };

  processing = (id, delta) => {
    const { products } = this.state;
    const index = products.findIndex(el => el.id === id);
    const targetProduct = products[index];
    const nextProduct = {
      ...targetProduct,
      votes: targetProduct.votes + delta
    };

    if (nextProduct.votes < 10) {
      this.setState({
        products: [...products.slice(0, index), ...products.slice(index + 1)]
      });
    } else if (nextProduct.votes >= 60) {
      this.setState({
        products: [
          ...products.slice(0, index),
          {
            ...nextProduct,
            isWinner: true
          },
          ...products.slice(index + 1)
        ]
      });
    } else {
      this.setState({
        products: [
          ...products.slice(0, index),
          {
            ...nextProduct,
            isWinner: false
          },
          ...products.slice(index + 1)
        ]
      });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          {this.state.products
            .sort((a, b) => {
              return b.votes - a.votes;
            })
            .map((product, key) => {
              return (
                <div key={product.id} className="col-sm-12 pt-2 pb-2">
                  <Card
                    {...product}
                    up={this.up}
                    down={this.down}
                    position={key + 1}
                  />
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default function App() {
  return <CardList />;
}
