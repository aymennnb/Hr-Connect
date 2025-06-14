<?php

use App\Http\Controllers\AlertController;
use App\Http\Controllers\CongeController;
use App\Http\Controllers\ContratsController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\DocumentsController;
use App\Http\Controllers\EmployesController;
use App\Http\Controllers\SalaireController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SitesController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SitesfController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::middleware(['auth'])->get('/error', function () {
    return inertia::render('NotFound');
})->name('notfound');



Route::middleware(['auth','verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', [SitesController::class, 'map'])->name('dashboard');

    Route::prefix('alerts')->controller(AlertController::class)->group(function () {
        Route::post('create', 'create')->name('alert.create');
    });

    Route::prefix('conges')->controller(CongeController::class)->group(function () {
        Route::get('/mes-conges', 'indexpublic')->name('conges.public');
        Route::inertia('add', 'Conges/AddConge')->name('conges.add');
        Route::post('create', 'store')->name('conges.create');
        Route::get('edit/{id}', 'edit')->name('conges.edit');
        Route::post('update', 'update')->name('conges.update');
        Route::delete('delete/{id}', 'delete')->name('conges.delete');
        Route::post('cancel/{id}', 'cancel')->name('conges.cancel');
    });

    Route::prefix('salaires')->controller(SalaireController::class)->group(function () {
                Route::get('/mes-slaires', 'indexPublic')->name('salaires.public');
            });

    Route::middleware('CheckRole:manager,admin,superadmin')->group(function () {
            Route::prefix('sites')->controller(SitesController::class)->group(function(){
                Route::get('/','index')->name('sites');
                Route::inertia('add','Sites/AddSite')->name('sites.add');
                Route::post('create','create')->name('sites.create');
                Route::get('edit/{id}','edit');
                Route::post('update', 'update')->name('sites.update');
                Route::get('details/{id}','show');
                Route::delete('delete/{id}','delete');
                Route::post('Sites-delete', 'SitesDelete')->name('sites.SitesDelete');
                Route::post('sites-import', 'importSites')->name('sites.import');

                Route::get('/personal','personal')->name('sites.personal');
            });

            Route::prefix('documents')->controller(DocumentsController::class)->group(function(){
                Route::get('/','index')->name('documents');
                Route::get('add','SitesRender')->name('documents.add');
                Route::post('create','create')->name('documents.create');
                Route::get('edit/{id}','edit');
                Route::post('update', 'update')->name('documents.update');
                Route::get('details/{id}','show');
                Route::delete('delete/{id}', 'delete')->name('document.destroy');
                Route::get('access/{id}', 'recover')->name('access.recover');
                Route::post('accesschange', 'updateAccess')->name('access.update');
                Route::post('Docs-delete', 'DocsDelete')->name('documents.DocsDelete');
                Route::post('Docs-access', 'DocsAccess')->name('documents.DocsAccess');
                Route::get('Docs-export', 'export')->name('documents.export');
                Route::get('Docs-export-csv', 'exportCSV')->name('documents.exportCSV');
            });
            

            Route::prefix('departements')->controller(DepartementController::class)->group(function () {
                Route::get('/', 'index')->name('departements');
                Route::inertia('add', 'Departements/AddDepartement')->name('departements.add');
                Route::post('create', 'create')->name('departements.create');
                Route::get('edit/{id}', 'edit')->name('departements.edit');
                Route::post('update', 'update')->name('departements.update');
                Route::delete('delete/{id}', 'delete')->name('departements.delete');
                Route::post('departements-delete', 'bulkDelete')->name('departements.bulkDelete');
            });
            
            Route::prefix('conges')->controller(CongeController::class)->group(function () {
                Route::get('/', 'index')->name('conges');
                Route::post('accept/{id}', 'accept')->name('conges.accept');
                Route::post('refuse/{id}', 'refuse')->name('conges.refuse');
            });

            Route::prefix('contrats')->controller(ContratsController::class)->group(function () {
                Route::get('/', 'index')->name('contrats');
                Route::post('create', 'create')->name('contrats.create');
                Route::delete('delete/{id}', 'delete')->name('contrats.delete');
            });

            Route::prefix('employes')->controller(EmployesController::class)->group(function () {
                Route::get('/', 'index')->name('employes');
                Route::inertia('add', 'Employes/AddEmploye')->name('employes.add');
                Route::post('create', 'create')->name('employes.create');
                Route::get('edit/{id}', 'edit')->name('employes.edit');
                Route::post('update', 'update')->name('employes.update');
                Route::delete('delete/{id}', 'delete')->name('employes.delete');
                Route::post('employes-delete', 'bulkDelete')->name('employes.bulkDelete');
            });

            Route::prefix('employes')->controller(EmployesController::class)->group(function () {
                Route::get('/', 'index')->name('employes');
                Route::inertia('add', 'Employes/AddEmploye')->name('employes.add');
                Route::post('create', 'create')->name('employes.create');
                Route::get('edit/{id}', 'edit')->name('employes.edit');
                Route::post('update/{id}', 'update')->name('employes.update');
                Route::delete('delete/{id}', 'delete')->name('employes.delete');
                Route::post('employes-delete', 'bulkDelete')->name('employes.bulkDelete');
            });

            Route::prefix('salaires')->controller(SalaireController::class)->group(function () {
                Route::get('/', 'index')->name('salaires');
            });
    });

    Route::middleware('CheckRole:admin,superadmin')->group(function () {
        Route::prefix('utilisateurs')->controller(UserController::class)->group(function () {
            Route::get('/', 'index')->name('utilisateurs');
            Route::inertia('add', 'Utilisateurs/AddUser')->name('user.add');
            Route::post('create', 'create')->name('user.create');
            Route::post('update-role', 'updateRole')->name('users.updateRole');
            Route::post('reset-password/{id}', 'resetPassword')->name('users.resetPassword');
            Route::get('edit/{id}', 'edit');
            Route::post('update', 'update')->name('utilisateurs.update');
            Route::delete('delete/{id}', 'delete')->name('utilisateurs.destroy');
            Route::post('Users-delete', 'UsersDelete')->name('utilisateurs.UsersDelete');
            Route::post('Users-change-Role', 'changeGroupRole')->name('utilisateurs.changeGroupRole');
            Route::post('User-Access-Delete', 'SupprimerAccessDocs')->name('utilisateurs.suppAccess');
            Route::post('User-Access-Docs', 'updateAccessDocs')->name('utilisateurs.updateAccessDocs');
            Route::post('add-employe', 'AddEmploye')->name('utilisateurs.addemploye');
        });

        Route::prefix('alerts')->controller(AlertController::class)->group(function(){
            Route::get('/','index')->name('alerts');
            Route::get('Logs-export', 'export')->name('logs.export');
            Route::get('Logs-export-csv', 'exportCSV')->name('logs.export.csv');
        });

    });

});

require __DIR__.'/auth.php';
