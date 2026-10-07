import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { ENVIRONMENT } from "../utils/environment";

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const env = inject(ENVIRONMENT);

    const headers: Record<string, string> = {
        apikey: env.supabaseAnonKey,
    };

    const apiReq = req.clone({
        url: env.apiUrl + req.url,
        setHeaders: headers,
    });

    return next(apiReq);
}