class AuthService {
    async UserLogin(serviceCaller, requestBody) {
        const headers = { 'Content-Type': 'application/json' };
        return await serviceCaller.post("/auth/login", undefined, headers, requestBody)
    }
}

export default new AuthService();