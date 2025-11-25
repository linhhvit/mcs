// Next.js automatically exposes NEXT_PUBLIC_* env vars to the browser
// This works at build time and runtime
// IMPORTANT: Use localhost (not 'backend') because browser makes requests from client-side
const getApiBaseUrl = () => {
	// Client-side: use NEXT_PUBLIC_API_URL or construct from window.location
	if (typeof window !== "undefined") {
		// Browser environment - must use localhost, not Docker service name
		const publicUrl = process.env.NEXT_PUBLIC_API_URL;
		if (publicUrl) {
			// Replace 'backend' with 'localhost' if present (Docker internal name)
			return publicUrl.replace("http://backend:", "http://localhost:");
		}
		// Fallback: construct from current window location
		const currentPort = window.location.port || "3000";
		const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT || "8000";
		return window.location.origin.replace(`:${currentPort}`, `:${backendPort}`);
	}
	// Server-side: can use backend service name
	return (
		process.env.API_BASE_URL ||
		process.env.NEXT_PUBLIC_API_URL?.replace(
			"http://backend:",
			"http://localhost:"
		) ||
		"http://localhost:8000"
	);
};

const API_BASE_URL = getApiBaseUrl();

export interface LoginResponse {
	access_token: string;
	token_type: string;
}

export interface User {
	user_id: number;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	status: string;
	created_at: string;
	updated_at: string;
	roles?: Array<{
		role_id: number;
		role_name: string;
	}>;
}

export interface Site {
	site_id: number;
	site_name: string;
	location?: string;
	description?: string;
	status: string;
	created_at: string;
	updated_at: string;
}

export interface Zone {
	zone_id: number;
	zone_name: string;
	site_id: number;
	description?: string;
	status: string;
	created_at: string;
	updated_at: string;
}

export interface Camera {
	camera_id: number;
	camera_name: string;
	camera_code?: string;
	zone_id: number;
	camera_type?: string;
	ip_address?: string;
	status: string;
	created_at: string;
	updated_at: string;
}

export interface Checklist {
	checklist_id: number;
	name: string;
	description?: string;
	template_id?: number;
	status: string;
	created_at: string;
	updated_at: string;
}

export interface Execution {
	execution_id: number;
	checklist_id: number;
	user_id: number;
	status: string;
	start_time: string;
	end_time?: string;
	notes?: string;
}

class APIClient {
	private baseUrl: string;
	private token: string | null = null;

	constructor() {
		this.baseUrl = API_BASE_URL;
		// Get token from localStorage if available (client-side only)
		if (typeof window !== "undefined") {
			const storedToken = localStorage.getItem("mcs_auth_token");
			if (storedToken) {
				this.token = storedToken;
			}
		}
	}

	setToken(token: string) {
		this.token = token;
		if (typeof window !== "undefined") {
			localStorage.setItem("mcs_auth_token", token);
		}
	}

	clearToken() {
		this.token = null;
		if (typeof window !== "undefined") {
			localStorage.removeItem("mcs_auth_token");
		}
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...((options.headers as Record<string, string>) || {}),
		};

		// Get token from localStorage if not set (for client-side requests)
		if (typeof window !== "undefined" && !this.token) {
			this.token = localStorage.getItem("mcs_auth_token");
		}

		if (this.token) {
			headers["Authorization"] = `Bearer ${this.token}`;
		}

		const response = await fetch(url, {
			...options,
			headers,
		});

		if (!response.ok) {
			if (response.status === 401) {
				this.clearToken();
				// Only redirect if we're in the browser
				if (typeof window !== "undefined") {
					// Don't redirect if we're already on the login page
					if (!window.location.pathname.includes("/login")) {
						window.location.href = "/login";
					}
				}
				const errorData = await response
					.json()
					.catch(() => ({ detail: "Unauthorized. Please login again." }));
				throw new Error(
					errorData.detail || "Unauthorized. Please login again."
				);
			}
			const error = await response
				.json()
				.catch(() => ({ detail: "Unknown error" }));
			throw new Error(error.detail || `HTTP ${response.status}`);
		}

		return response.json();
	}

	async login(username: string, password: string): Promise<LoginResponse> {
		const formData = new URLSearchParams();
		formData.append("username", username);
		formData.append("password", password);

		const response = await fetch(`${this.baseUrl}/api/v1/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: formData,
		});

		if (!response.ok) {
			const error = await response
				.json()
				.catch(() => ({ detail: "Invalid username or password" }));
			throw new Error(error.detail || "Invalid username or password");
		}

		const data = await response.json();
		if (data.access_token) {
			this.setToken(data.access_token);
		} else {
			throw new Error("No access token received from server");
		}
		return data;
	}

	async getCurrentUser(): Promise<User> {
		return this.request<User>("/api/v1/me");
	}

	async getCameras(skip = 0, limit = 100): Promise<Camera[]> {
		return this.request<Camera[]>(
			`/api/v1/cameras?skip=${skip}&limit=${limit}`
		);
	}

	async getSites(skip = 0, limit = 100): Promise<any[]> {
		return this.request<any[]>(
			`/api/v1/cameras/sites?skip=${skip}&limit=${limit}`
		);
	}

	async getZones(skip = 0, limit = 100): Promise<any[]> {
		return this.request<any[]>(
			`/api/v1/cameras/zones?skip=${skip}&limit=${limit}`
		);
	}

	async getChecklists(skip = 0, limit = 100): Promise<Checklist[]> {
		return this.request<Checklist[]>(
			`/api/v1/checklists?skip=${skip}&limit=${limit}`
		);
	}

	async getExecutions(skip = 0, limit = 100): Promise<Execution[]> {
		return this.request<Execution[]>(
			`/api/v1/executions?skip=${skip}&limit=${limit}`
		);
	}

	async getUsers(skip = 0, limit = 100): Promise<User[]> {
		return this.request<User[]>(`/api/v1/users?skip=${skip}&limit=${limit}`);
	}

	// Camera CRUD
	async getCamera(cameraId: number): Promise<Camera> {
		return this.request<Camera>(`/api/v1/cameras/${cameraId}`);
	}

	async createCamera(data: Partial<Camera>): Promise<Camera> {
		return this.request<Camera>("/api/v1/cameras", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateCamera(cameraId: number, data: Partial<Camera>): Promise<Camera> {
		return this.request<Camera>(`/api/v1/cameras/${cameraId}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async deleteCamera(cameraId: number): Promise<void> {
		return this.request<void>(`/api/v1/cameras/${cameraId}`, {
			method: "DELETE",
		});
	}

	// Site CRUD
	async getSite(siteId: number): Promise<Site> {
		return this.request<Site>(`/api/v1/cameras/sites/${siteId}`);
	}

	async createSite(data: Partial<Site>): Promise<Site> {
		return this.request<Site>("/api/v1/cameras/sites", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateSite(siteId: number, data: Partial<Site>): Promise<Site> {
		return this.request<Site>(`/api/v1/cameras/sites/${siteId}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async deleteSite(siteId: number): Promise<void> {
		return this.request<void>(`/api/v1/cameras/sites/${siteId}`, {
			method: "DELETE",
		});
	}

	// Zone CRUD
	async getZone(zoneId: number): Promise<Zone> {
		return this.request<Zone>(`/api/v1/cameras/zones/${zoneId}`);
	}

	async createZone(data: Partial<Zone>): Promise<Zone> {
		return this.request<Zone>("/api/v1/cameras/zones", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateZone(zoneId: number, data: Partial<Zone>): Promise<Zone> {
		return this.request<Zone>(`/api/v1/cameras/zones/${zoneId}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async deleteZone(zoneId: number): Promise<void> {
		return this.request<void>(`/api/v1/cameras/zones/${zoneId}`, {
			method: "DELETE",
		});
	}

	// Checklist CRUD
	async getChecklist(checklistId: number): Promise<Checklist> {
		return this.request<Checklist>(`/api/v1/checklists/${checklistId}`);
	}

	async createChecklist(data: Partial<Checklist>): Promise<Checklist> {
		return this.request<Checklist>("/api/v1/checklists", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateChecklist(checklistId: number, data: Partial<Checklist>): Promise<Checklist> {
		return this.request<Checklist>(`/api/v1/checklists/${checklistId}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async deleteChecklist(checklistId: number): Promise<void> {
		return this.request<void>(`/api/v1/checklists/${checklistId}`, {
			method: "DELETE",
		});
	}

	// User CRUD
	async getUser(userId: number): Promise<User> {
		return this.request<User>(`/api/v1/users/${userId}`);
	}

	async createUser(data: Partial<User> & { password: string }): Promise<User> {
		return this.request<User>("/api/v1/users", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateUser(userId: number, data: Partial<User>): Promise<User> {
		return this.request<User>(`/api/v1/users/${userId}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async deleteUser(userId: number): Promise<void> {
		return this.request<void>(`/api/v1/users/${userId}`, {
			method: "DELETE",
		});
	}
}

export const apiClient = new APIClient();
