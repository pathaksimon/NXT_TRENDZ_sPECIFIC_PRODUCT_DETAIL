import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    isloading: apiStatusConstants.initial,
    data1: {},
    count: 0,
    data2: [],
  }

  componentDidMount() {
    this.getItemData()
  }

  getItemData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const api = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(api, options)
    this.setState({isloading: apiStatusConstants.inProgress})

    if (response.ok) {
      const data = await response.json()
      const change = {
        imgUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        availability: data.availability,
        brand: data.brand,
        Similarproducts: data.similar_products,
        totalreviews: data.total_reviews,
      }
      this.setState({data1: change})
      const change2 = data.similar_products.map(keech => ({
        img2: keech.image_url,
        title: keech.title,
        rating: keech.rating,
        price: keech.price,
        id: keech.id,
        brand: keech.brand,
      }))
      this.setState({data2: change2})
      this.setState({isloading: apiStatusConstants.success})
    } else if (response.status === 404) {
      this.setState({
        isloading: apiStatusConstants.failure,
      })
    }
  }

  plusing = () => {
    const {count} = this.state
    this.setState({count: count + 1})
  }

  minusing = () => {
    const {count} = this.state
    this.setState({count: count - 1})
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  counting = () => {
    const {count} = this.state
    if (count <= 0) {
      return '0'
    }
    return count
  }

  renderPrimeDealsList = () => {
    const {data1, count, data2, isloading} = this.state
    const {
      imgUrl,
      title,
      price,
      description,
      availability,
      brand,
      Similarproducts,
    } = data1
    return (
      <div>
        <Header />
        <div className="card2">
          <div className="image-card">
            <img src={imgUrl} alt="product" className="photo" />

            <div className="details-card">
              <h1>{title}</h1>
              <p>Rs {price}</p>
              <p>{description}</p>
              <p>Available: {availability}</p>
              <p>Brand: {brand}</p>
              <hr className="hori" />
              <div className="plus-minus">
                <button data-testid="minus" onClick={this.minusing}>
                  -
                </button>
                <p>{this.counting()}</p>
                <button data-testid="plus" onClick={this.plusing}>
                  +
                </button>
              </div>
              <button>ADD TO CART</button>
            </div>
          </div>
        </div>

        <div className="card3">
          <div className="similar-products-card">
            <h1>Similar Products</h1>
            <ul className="ulu">
              {data2.map(each1 => (
                <SimilarProductItem first1={each1} key={each1.id} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderPrimeDealsFailureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        alt="failure view"
        className="register-prime-image"
      />
      <h1>Product not found</h1>
      <Link to="/products">
        <button>Continue Shopping</button>
      </Link>
    </>
  )

  render() {
    const {data1, count, data2, isloading} = this.state
    console.log(data2)

    switch (isloading) {
      case apiStatusConstants.success:
        return this.renderPrimeDealsList()
      case apiStatusConstants.failure:
        return this.renderPrimeDealsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
