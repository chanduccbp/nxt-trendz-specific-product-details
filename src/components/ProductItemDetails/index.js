// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

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
    apiStatus: apiStatusConstants.initial,
    productDetails: {},
    similarProductsList: [],
    productCount: 1,
  }

  componentDidMount() {
    this.getProduct()
  }

  getProduct = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products,
      }

      const {similarProducts} = updatedData
      const similarProductsList = similarProducts.map(eachProduct => ({
        id: eachProduct.id,
        imageUrl: eachProduct.image_url,
        title: eachProduct.title,
        style: eachProduct.style,
        price: eachProduct.price,
        description: eachProduct.description,
        brand: eachProduct.brand,
        totalReviews: eachProduct.total_reviews,
        rating: eachProduct.rating,
        availability: eachProduct.availability,
      }))

      this.setState({
        similarProductsList,
        productDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onDecrement = () => {
    const {productCount} = this.state

    if (productCount > 1) {
      this.setState(prevState => ({productCount: prevState.productCount - 1}))
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({productCount: prevState.productCount + 1}))
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <>
      <Header />
      <div className="fv-cont">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="fv-pic"
        />
        <h1>Product Not Found</h1>
        <Link to="/products" className="cs-link-item">
          <button type="button" className="cs-butt">
            Continue Shopping
          </button>
        </Link>
      </div>
    </>
  )

  renderProductDetails = () => {
    const {productDetails, similarProductsList, productCount} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      brand,
      description,
      availability,
    } = productDetails

    return (
      <>
        <Header />
        <div className="pd-cont">
          <div className="product-details-cont">
            <img src={imageUrl} alt="product" className="product-img" />
            <div className="p-des">
              <h1 className="p-title">{title}</h1>
              <p className="p-price">RS {price}/- </p>
              <div className="rr-cont">
                <div className="rating">
                  <p>{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star-pic"
                  />
                </div>
                <p className="reviews">{totalReviews} Reviews</p>
              </div>
              <p className="des">{description}</p>
              <p className="add-details-label">
                Available: <span className="add-details">{availability}</span>
              </p>
              <p className="add-details-label">
                Brand: <span className="add-details">{brand}</span>
              </p>
              <hr className="line" />
              <div className="count-cont">
                <button
                  type="button"
                  className="count-butt"
                  onClick={this.onDecrement}
                  data-testid="minus"
                >
                  {/* {'minus'} */}
                  <BsDashSquare />
                </button>
                <p className="count-para">{productCount}</p>
                <button
                  type="button"
                  className="count-butt"
                  onClick={this.onIncrement}
                  data-testid="plus"
                >
                  {/* {'plus'} */}
                  <BsPlusSquare />
                </button>
              </div>
              <button className="atc-butt" type="button">
                ADD TO CART
              </button>
            </div>
          </div>
          <div className="sp-cont">
            <h1 className="sp-head">Similar Products</h1>
            <ul className="sp-list">
              {similarProductsList.map(product => (
                <SimilarProductItem productData={product} key={product.id} />
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }
}

export default ProductItemDetails
