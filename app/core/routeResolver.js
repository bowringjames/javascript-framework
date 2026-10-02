export class RouteResolver {
    resolve(location) {
        const params = new URLSearchParams(location.search);
        const routeParts = (params.get("route") || "").split("/");

        params.delete("route");

        return {
            application: routeParts[0] || "",
            module: routeParts[1] || "",
            page: routeParts[2] || "",
            values: Object.fromEntries(params)
        };
    }
}