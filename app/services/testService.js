export class TestService {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }

    async getPayment() {
        return await this.apiClient.get("/payment/not-found");
    }
}