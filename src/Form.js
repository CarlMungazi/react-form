import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import './Form.css'

function Alert(props) {
  let message = 'Your details have been submitted!'

  const styles = {
    position: 'fixed',
    top: '0',
    left: '0',
    textAlign: 'center',
    width: '100%',
    padding: '15px',
    backgroundColor: '#458B54',
    color: '#fff'
  }
  return <div style={styles}>{message}</div>
}

class Form extends Component {
  constructor (props) {
    super(props)
    this.state = { 
      name: '', 
      number: '', 
      email: '',
      userTypes: ['Student', 'Guest' ],
      selectedUserType: '',
      formPreview: false,
      formSubmitted: false
    }

    this.valueChange = this.valueChange.bind(this)
    this.formSubmit = this.formSubmit.bind(this)
    this.previewForm = this.previewForm.bind(this)
    this.changeFormDetails = this.changeFormDetails.bind(this)
  }

  valueChange (evt) {
    let target = evt.target 
    let val = evt.target.value

    this.setState({
      [target.name]: val
    })
  }

  formSubmit (evt) {
    evt.preventDefault()
    this.setState({
      formSubmitted: !this.state.formSubmitted
    })
  }

  changeFormDetails () {
    this.setState({
      formPreview: !this.state.formPreview
    })
  }

  previewForm () {
    let isFormValid = true    
    let radioError = document.getElementById("userTypeError")
  
    Object.keys(this.refs).forEach(el =>{
      let input = this.validateForm(el)
      
      if (!input) {
        isFormValid = false;
      }

    })

    // validate radio buttons here because they do not have constraint validation
    if (this.state.selectedUserType === '') {
      radioError.textContent = 'Please select a user type'
      isFormValid = false
    } else {
      radioError.textContent = ''
    }    
    
    if (isFormValid) {
      this.setState({
        formPreview: !this.state.formPreview
      })
    }

  }

  validateForm(refName) {
    const validity = this.refs[refName].validity;
    const label = document.getElementById(`${refName}Label`).textContent;
    const error = document.getElementById(`${refName}Error`);

    if (!validity.valid) {

      if (validity.valueMissing) {
        error.textContent = `${label} is a required field`; 
      } else if (validity.patternMismatch) {
        error.textContent = 'Please enter a valid UK number'
      } else if (validity.typeMismatch) {
        error.textContent = 'Please enter a valid e-mail address' 
      }
      return false
    }
    
    error.textContent = ''
    return true;
  }

  renderRadioOpts () { // could be refactored into a component
    return this.state.userTypes.map((opt, idx) =>
      <div key={opt} className="form-input-radio">
        <input id={`user-${idx}`} type="radio" name="selectedUserType" key={ idx } value={ opt } checked={ this.state.selectedUserType === opt } onChange={ this.valueChange } required/>
        <label htmlFor={`user-${idx}`} key={opt}>
          <div className="custom-check"></div>
          { opt }
        </label>
      </div>
    , this)
  }

  render() {
    // validation patterns taken from http://html5pattern.com/
    const formPreview = (
      <form className="form" onSubmit={this.formSubmit}>
        <div className="form-input">
          <label className="form-label">Name</label>
          <p>{this.state.name}</p>
        </div>
        <div className="form-input">
          <label className="form-label">Phone Number</label>
          <p>{this.state.number}</p>
        </div>
        <div className="form-input">
          <label className="form-label">Email Address</label>
          <p>{this.state.email}</p>
        </div>
        <div className="form-input">
          <label className="form-label">User Type</label>
          <p>{this.state.selectedUserType}</p>
        </div>
        <div className={ this.state.formSubmitted ? "form-buttons__preview hide" : "form-buttons__preview"}>
          <button type="button" className="btn-change" onClick = { this.changeFormDetails }>
            <FontAwesome className="btn-undo" name="undo" size="lg"/>
            Change Details
          </button>
          <button type="button" onClick = { this.formSubmit }>
            <FontAwesome className="btn-check" name="check" size="lg"/>
            Submit
          </button>
        </div>
      </form>
    )

    return (
      <div className="form-container">
        { this.state.formSubmitted ? <Alert/> : null }
        <div className="form-header">
          <div className="form-step__1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 70 65' width='50' height='50'>
              <circle fill='#fff' r='32' cx='32' cy='32'></circle>
              <text x='32' y='32' textAnchor='middle' stroke='#5B6D79' dy='.3em'>1</text>
            </svg> 
            <span> Enter your personal details </span>
          </div>
          <div className={ this.state.formPreview ? "form-step__2 step__2--prvw" : "form-step__2"  }>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 70 65' width='50' height='50'>
              <circle fill='#fff' r='32' cx='32' cy='32'></circle>
              <text x='32' y='32' textAnchor='middle' stroke='#5B6D79' dy='.3em'>2</text>
            </svg> 
            <span> Confirm your details </span>
          </div>
        </div>
          { this.state.formPreview ? formPreview : // a higher-order component could be more readable here
            <form className="form" onSubmit={this.formSubmit}>
              <div className="form-input">
                <label id="nameLabel" htmlFor="name" className="form-label">Name</label>
                <input ref="name" type="text" name="name" placeholder="Joe Bloggs" value={this.state.name} onChange={this.valueChange} required/>
                <div className="input-error" id="nameError"></div>
              </div>
              <div className="form-input">
                <label id="numberLabel" htmlFor="number" className="form-label">Phone Number</label>
                <input ref="number" type="text" name="number" placeholder="01234 567890" value={this.state.number} onChange={this.valueChange} required pattern="^\s*\(?(020[7,8]{1}\)?[ ]?[1-9]{1}[0-9{2}[ ]?[0-9]{4})|(0[1-8]{1}[0-9]{3}\)?[ ]?[1-9]{1}[0-9]{2}[ ]?[0-9]{3})\s*$"/>
                <div className="input-error" id="numberError"></div>
              </div>
              <div className="form-input">
                <label id="emailLabel" htmlFor="email" className="form-label">Email Address</label>
                  <input ref="email" type="email" name="email" placeholder="joe.bloggs@email.com" value={this.state.email} onChange={this.valueChange} required/>
                  <div className="input-error" id="emailError"></div>
              </div>
              <div className="form-input">
                <label id="userTypeLabel" className="form-label">User Type</label>
                  { this.renderRadioOpts() }
                  <div className="input-error" id="userTypeError"></div>
              </div>
                <div className="form-buttons">
                <button type="button" onClick = { this.previewForm }>
                  <FontAwesome className="btn-eye" name="eye" size="lg"/>
                  Preview
                </button>
                </div>
            </form> 
          }
      </div>
    )
  }
}

export default Form