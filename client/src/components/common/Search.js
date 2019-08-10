import React, { Component,Fragment } from "react";

import * as actions from "../../actions";
import { connect } from "react-redux";

import { Field, reduxForm } from "redux-form";

class Search extends Component {
  searchItem = "";
  searchCategory = "";

  componentDidMount() {
    this.props.getCategories();
  }

  componentWillUnmount() {
    this.props.resetCat();
  }

  handleTextChange = ({ target }) => {
    this.searchItem = target.value;
  };

  handleSelectChange = ({ target }) => {
    this.searchCategory = target.value;
  };

  customField = ({ input, title, type, category }) => {
    return (
      <Fragment>
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <select
              className="btn mr-2"
              onChange={event => this.handleSelectChange(event)}
            >
              <option value="-1">Select</option>
              {category &&
                category["type"] === "success" &&
                category["data"].map((cat, index) => (
                  <option key={index} value={cat["_id"]}>
                    {cat["name"]}
                  </option>
                ))}
            </select>
          </div>

          <input
            type="search"
            className="form-control"
            placeholder="Search by name!"
            onChange={event => this.handleTextChange(event)}
          />
        </div>
        <div className="btn input-group-append" style={{ border: "none" }}>
          <button className="input-group-text" type="submit">
            Search!
          </button>
        </div>
      </Fragment>
    );
  };

  renderSearchForm() {
    const { category } = this.props;

    const { handleSubmit } = this.props;

    return (
      <form
        onSubmit={handleSubmit(() =>
          this.props.getSearchProducts(this.searchItem, this.searchCategory)
        )}
      >
        <span className="input-group-text">
          <Field
            name="productCategory"
            title="Product Category"
            category={category}
            component={this.customField}
          />
        </span>
      </form>
    );
  }

  render() {

    return (
      <div className="row">
        <div className="container mb-3">{this.renderSearchForm()}</div>
      </div>
    );
  }
}


Search = reduxForm({
  form: "searchForm"
})(Search);


function mapStateToProps({ category }) {
  return {
    category
  };
}

export default connect(
  mapStateToProps,
  actions
)(Search);
