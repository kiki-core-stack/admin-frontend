import type { AdminLoginFormData } from '@kikiutils/el-plus-admin-pack/types/data/admin';

export const AdminAuthApi = new (class {
	readonly #baseUrl = '/api/admin/auth';

	async login(data: AdminLoginFormData) {
		return await postApi<{ isVerCodeIncorrect?: boolean }>(`${this.#baseUrl}/login`, { ...data, password: sha3512(data.password) });
	}

	async logout() {
		return await postApi(`${this.#baseUrl}/logout`);
	}
})();

export default AdminAuthApi;
