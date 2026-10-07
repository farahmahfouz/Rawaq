import { InjectionToken } from "@angular/core";


export interface Environment {
    apiUrl: string;
    supabaseAnonKey: string;
}

export const environment: Environment = {
    apiUrl: 'https://nyrnpjrhajarawlpyxdd.supabase.co/',
    supabaseAnonKey: 'sb_publishable_vpkZz8hhkzvgS-E7fs7EXA_qkK4zVzB'
}

export const ENVIRONMENT = new InjectionToken<Environment>('app.environment', {
    providedIn: 'root',
    factory: () => environment,
})