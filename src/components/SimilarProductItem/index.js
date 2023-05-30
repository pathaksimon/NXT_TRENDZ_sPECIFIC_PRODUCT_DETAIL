import {Component} from 'react'
import './index.css'

class SimilarProductItem extends Component {
  render() {
    const {first1} = this.props
    const {img2, title, brand, price, rating} = first1
    return (
      <li className="lista">
        <img src={img2} className="bottom-photo" alt="similar product" />
        <p>{title}</p>
        <p>by {brand}</p>
        <div className="lefi">
          <p>Rs {price}</p>
          <p>{rating}</p>
        </div>
      </li>
    )
  }
}

export default SimilarProductItem
