import { PageBase } from "../../../core/pageBase.js";

export class TestView extends PageBase {
    constructor() {
        super();

        this.templatePath = "/app/modules/test/templates/test.html";
    }

    async connectedCallback() {
        const route = this.app.get("store").get("route");

        this.testField = route.values.testField;

        await super.connectedCallback();
    }

    wireEvents() {
        console.log("TestView wireEvents");
    }

    async loadData() {
        const testService = this.app.get("testService");

        this.payment = await testService.getPayment();
    }

    templateData() {
        return {
            jobNumber: this.payment?.payment.jobNumber,
            amount: this.payment?.payment.amount,
            currency: this.payment?.payment.current,
            customerName: this.payment?.customer.name,
            customerEmail: this.payment?.customer.email,
            status: this.payment?.status
        }
    }
}

customElements.define("test-view", TestView);