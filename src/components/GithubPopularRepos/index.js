import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

class GithubPopularRepos extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    activeLanguageFiltersData: languageFiltersData[0].id,
    repositioriesData: [],
  }

  componentDidMount() {
    this.getRepositoryData()
  }

  getRepositoryData = async () => {
    const {activeLanguageFiltersData} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeLanguageFiltersData}`
    const response = await fetch(apiUrl)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.popular_repos.map(eachRepos => ({
        id: eachRepos.id,
        name: eachRepos.name,
        imageUrl: eachRepos.avatar_url,
        issuesCount: eachRepos.issues_count,
        forksCount: eachRepos.forks_count,
        starsCount: eachRepos.stars_count,
      }))
      this.setState(
        {repositioriesData: updatedData},
        {apiStatus: apiStatusConstants.success},
      )
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>No View it's a failure view please check them.</h1>
    </div>
  )

  renderSuccessView = () => {
    const {repositioriesData} = this.state
    return (
      <ul>
        {repositioriesData.map(eachRepos => (
          <RepositoryItem key={eachRepos.id} repositoryDetails={eachRepos} />
        ))}
      </ul>
    )
  }

  renderRepositoryId = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  setActiveLanguageFilterId = newFilter => {
    this.setState({languageFiltersData: newFilter}, this.getRepositoryData)
  }

  renderLanguageFilterId = () => {
    const {activeLanguageFiltersData} = this.state
    return (
      <ul>
        {languageFiltersData.map(eachLanguage => (
          <LanguageFilterItem
            key={eachLanguage.id}
            isActive={eachLanguage.id === activeLanguageFiltersData}
            languageFilterDetails={eachLanguage}
            setActiveLanguageFilterId={this.setActiveLanguageFilterId}
          />
        ))}
      </ul>
    )
  }

  render() {
    return (
      <div>
        <h1>My World</h1>
        <div>
          {this.renderLanguageFilterId()}
          {this.renderRepositoryId()}
        </div>
      </div>
    )
  }
}
export default GithubPopularRepos
