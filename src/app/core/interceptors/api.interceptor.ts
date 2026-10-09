import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { ENVIRONMENT } from "../utils/environment";
import { CookieService } from "ngx-cookie-service";
import { STORAGE_KEYS } from "../utils/constants";

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const env = inject(ENVIRONMENT);
    const cookieService = inject(CookieService);

    const token = cookieService.get(STORAGE_KEYS.ACCESS_TOKEN);

    const headers: Record<string, string> = {
        apikey: env.supabaseAnonKey,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const apiReq = req.clone({
        url: env.apiUrl + req.url,
        setHeaders: headers,
    });

    return next(apiReq);
}