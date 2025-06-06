<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Vérifie si l'utilisateur a le rôle requis pour accéder à la route.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Vérifier si le rôle de l'utilisateur est dans la liste des rôles autorisés
        if (in_array($user->role, $roles)) {
            return $next($request);
        }

        return redirect('error')->with(['error'=> 'Vous n\'êtes pas autorisé à accéder à cette page.']);
    }
}
