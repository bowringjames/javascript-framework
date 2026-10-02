import { PageBase } from "../../../core/pageBase.js";

export class TestSearchView extends PageBase {
    constructor() {
        super();

        this.templatePath = "/app/modules/test/templates/test-search.html";
    }

    wireEvents() {
        console.log("TestSearchView wireEvents");
    }

    async loadData() {
        console.log("TestSearchView loadData");
    }
}

customElements.define("test-search-view", TestSearchView);