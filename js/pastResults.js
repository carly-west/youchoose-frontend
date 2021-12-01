import ExternalServices from "./externalServices.js";
import { getSessionStorage, qs } from "./utils.js";


export default class pastResults {
    constructor(){
        this.token = getSessionStorage("userToken");
        this.services = new ExternalServices();
        this.results = []
    }

    init(){
        this.renderPastResults();
    }

    async getResults() {
        this.results = await this.services.pastResultsRequest(this.token);
    }

    async renderPastResults() {
        // this.results = [
        //     {
        //         "_id": "6196b2313c2d67db07ff05c7",
        //         "resultSet": [
        //             "Test1",
        //             "Test2",
        //             "Test3"
        //         ]
        //     },
        //     {
        //         "_id": "6196b2313c2d67db07ff05c8",
        //         "resultSet": [
        //             "Test4",
        //             "Test5",
        //             "Test6"
        //         ]
        //     },
        //     {
        //         "_id": "6196b2313c2d67db07ff05c9",
        //         "resultSet": [
        //             "Test7",
        //             "Test8",
        //             "Test9"
        //         ]
        //     }
        // ];
        
        // get data from backend
        await this.getResults();

        // loop through and insert data into html
        var resultListHtml = "";
        var resultSethtml = "";
        this.results.forEach(result => {
            resultSethtml = `<div class="result">
            <button class="btn" data-setid = ${result._id}><i class="fa fa-trash"></i></button>
            <h3 class="date">DATE ADDED LATER</h3>
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
            button.addEventListener('click', this.deleteResult)
        })
    }

    async deleteResult(e){
        console.log(e.target.dataset.setid);
        const message = await this.services.deletePastResult(this.token, e.target.dataset.setid);
    }

}


const results = new pastResults();
results.init();