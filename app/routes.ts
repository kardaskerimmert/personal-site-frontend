import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("admin", "routes/admin.tsx"),
	route("admin/dashboard", "routes/dashboard.tsx"),
] satisfies RouteConfig;
