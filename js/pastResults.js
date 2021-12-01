import ExternalServices from "./externalServices.js";
import { getSessionStorage, qs } from "./utils.js";


export default class pastResults {
    constructor(){
        this.token = getSessionStorage("userToken");
        this.userId = getSessionStorage("userId");
        this.services = new ExternalServices();
        this.results = []
    }

    init(){
        this.renderPastResults();
    }

    async getResults() {
        this.results = await this.services.pastResultsRequest(this.token, this.userId);
        console.log(this.results);
    }

    async renderPastResults() {
        
        // get data from backend
        await this.getResults();

        // loop through and insert data into html
        var resultListHtml = "";
        var resultSethtml = "";
        this.results.results.forEach(result => {
            resultSethtml = `<div class="result">
            <button class="btn" data-setid = ${result._id}><i class="fa fa-trash"></i></button>
            <h3 class="date">Will Add Date Later</h3>
            <ol>`
            result.resultSet.forEach(resturaunt => {
                resultSethtml += `<li>${resturaunt}</li>`
            });
            resultSethtml += `</ol></div>`;
            resultListHtml += resultSethtml;
        });
        qs('#pastResults').innerHTML = resultListHtml;

        const trashButton = document.querySelectorAll(".btn");
        trashButton.forEach(button => {
            button.addEventListener('click', this.deleteResult.bind(this))
        })
    }

    async deleteResult(e){
        const message = await this.services.deletePastResult(this.token, e.target.dataset.setid, this.userId);
        console.log(message);
        this.renderPastResults();
    }

}


const results = new pastResults();
results.init();