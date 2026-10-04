export class ApiClient {
    async get(url) {
        console.log("API GET:", url);

        await new Promise(resolve => {
            setTimeout(resolve, 500);
        });

        if (url === "/payment/not-found") {
            throw new Error("Payment not found");
        }

        return {
            payment: {
                jobNumber: "12345",
                amount: 125.50,
                currency: "GBP"
            },
            customer: {
                name: "James Bowring",
                email: "james@example.com"
            },
            status: "awaiting_payment"
        };
    }
}