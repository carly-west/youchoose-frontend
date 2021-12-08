import ExternalServices from "./externalServices.js";
import { getSessionStorage, qs } from "./utils.js";

export default class pastResults {
  constructor() {
    this.token = getSessionStorage("userToken");
    this.services = new ExternalServices();
    this.results = [];
  }

  init() {
    this.renderPastResults();
  }

  async getResults() {
    this.results = await this.services.pastResultsRequest(this.token);
  }

  async renderPastResults() {
    // get data from backend
    await this.getResults();

    // loop through and insert data into html
    var resultListHtml = "";
    var resultSethtml = "";
    if(!this.results.results[0]) {
      resultListHtml = '<h2>No Saved Results</h2>';
    }
    else{
      this.results.results.forEach((result) => {
        // parse
        const date = new Date(result.date);
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const year = date.getFullYear();
        
      resultSethtml = `<div class="result">
            <button class="btn" data-setid = ${result._id}><i class="fa fa-trash"></i></button>
            <h3 class="date">${month + '/' + day + '/' + year}</h3>
            <ol>`;
      result.resultSet.forEach((resturaunt) => {
        resultSethtml += `<li>${resturaunt}</li>`;
      });
      resultSethtml += `</ol></div>`;
      resultListHtml += resultSethtml;
    });
    }
    qs("#pastResults").innerHTML = resultListHtml;

    const trashButton = document.querySelectorAll(".btn");
    trashButton.forEach((button) => {
      button.addEventListener("click", this.deleteResult.bind(this));
    });
  }

  async deleteResult(e) {
    await this.services.deletePastResult(
      this.token,
      e.target.dataset.setid,
    );
    this.renderPastResults();
  }
}

const results = new pastResults();
results.init();
