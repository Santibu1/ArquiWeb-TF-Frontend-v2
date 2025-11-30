import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { catchError, EMPTY, throwError } from "rxjs";

export const loginInterceptor: HttpInterceptorFn = (req, next) => {
    console.log("Intercepto!!");

    //  NO agregar token a la petición de login
    if (req.url.includes('/api/auth/login')) {
        console.log("Petición de LOGIN detectada → no agrego token.");
        return next(req);
    }

    const token = localStorage.getItem('token');
    console.log("Token recuperado:", token);

    let authReq = req;

    // ✔ 2. Solo agregar Authorization SI existe token
    if (token) {
        authReq = req.clone({
            withCredentials: true,
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("Se terminó de clonar la solicitud");
    }
    return next(authReq).pipe(
        catchError(error => {
            console.log("Error en la petición");

            if (error.status === HttpStatusCode.Forbidden || error.status === HttpStatusCode.Unauthorized) {
                let backendMessage = null;
                if (typeof error.error === 'string') {
                    backendMessage = error.error;
                } else if (error.error?.message) {
                    backendMessage = error.error.message;
                }
                alert(backendMessage || "Acceso denegado");
                if (error.status === HttpStatusCode.Unauthorized) {
                    localStorage.removeItem('token');
                }
            }
            return throwError(() => error);
        })
    );
};
