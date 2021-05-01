"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
//Paso32
const listado = [
    { "id": "1", "usuario": "Juan Perez", "password": "123456" },
    { "id": "2", "usuario": "Pepe Cadena", "password": "123456" },
    { "id": "3", "usuario": "Martin Gonzalez", "password": "123456" }
];
class UserController {
    signin(req, res) {
        console.log(req.body);
        //res.send('Sign In!!!'); //Paso 10 //Comentada en el Paso 12
        res.render("partials/signinForm"); //Paso 12
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, password } = req.body; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield userModel_1.default.buscarNombre(usuario);
            console.log(usuario);
            console.log(password);
            console.log(result);
            if (!result) {
                //res.send({ "Usuario no registrado Recibido": req.body });
                req.flash('error_session', 'Usuario y/o Password Incorrectos'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
                res.redirect("./error");
            }
            else {
                if (result.nombre == usuario && result.password == password) {
                    req.session.user = result;
                    req.session.auth = true;
                    res.redirect("./home");
                    return;
                }
                else {
                    //res.send({ "Usuario y/o contraseña incorrectos": req.body });
                    req.flash('error_session', 'Usuario y/o Password Incorrectos'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
                    res.redirect("./error");
                }
            }
        });
    }
    showError(req, res) {
        //res.send({ "Usuario y/o contraseña incorrectos": req.body });
        res.render("partials/error");
    }
    //registro - Paso 19
    signup(req, res) {
        console.log(req.body);
        //res.send('Sign Up!!!');
        res.render("partials/signupForm");
    }
    home(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            //res.send('Bienvenido!!!'); //Paso 31.B
            if (!req.session.auth) {
                req.flash('error_session', 'Debes iniciar sesion para ver esta seccion'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
                res.redirect("./error");
            }
            res.render("partials/home");
        });
    }
    process(req, res) {
        console.log(req.body);
        res.send('Datos recibidos!!!');
        //res.render("partials/home",{listado});
    }
    //CRUD
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body); //Paso 7 (Ej4)
            const usuarios = yield userModel_1.default.listar();
            console.log(usuarios);
            return res.json(usuarios);
            //res.send('Listado de usuarios!!!');
        });
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params.id); //Paso 7 (Ej4)
            const { id } = req.params;
            const usuario = yield userModel_1.default.buscarId(id);
            if (usuario)
                return res.json(usuario);
            res.status(404).json({ text: "User doesn't exists" });
        });
    }
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = req.body; //Paso 7 (Ej4)
            delete usuario.repassword;
            console.log(req.body);
            //res.send('Usuario agregado!!!');
            const busqueda = yield userModel_1.default.buscarNombre(usuario.nombre);
            if (!busqueda) {
                const result = yield userModel_1.default.crear(usuario);
                return res.json({ message: 'User saved!!' });
            }
            return res.json({ message: 'User exists!!' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body); //Paso 7 (Ej4)
            const { id } = req.params;
            const result = yield userModel_1.default.actualizar(req.body, id);
            //res.send('Usuario '+ req.params.id +' actualizado!!!');
            return res.json({ text: 'updating a user ' + id });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body); //Paso 7 (Ej4)
            //res.send('Usuario '+ req.params.id +' Eliminado!!!');
            const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield userModel_1.default.eliminar(id);
            //return res.json({ text: 'deleting a user ' + id });
            res.redirect('../control');
        });
    }
    //FIN CRUD
    control(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //res.send('Controles'); //Paso 7 (Ej4)
            if (!req.session.auth) {
                req.flash('error_session', 'Debe iniciar sesion para ver esta seccion'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
                res.redirect("./error");
            }
            const usuarios = yield userModel_1.default.listar();
            res.render('partials/controls', { users: usuarios, mi_session: true });
        });
    }
    procesar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                //res.redirect("/");
                req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
                res.redirect("./error");
            }
            console.log(req.body);
            let usuario = req.body.usuario;
            var usuarios = [];
            console.log(usuario);
            if (usuario !== undefined) {
                for (let elemento of usuario) {
                    const encontrado = yield userModel_1.default.buscarId(elemento);
                    if (encontrado) {
                        usuarios.push(encontrado); //Agrego objeto al array
                        console.log(encontrado);
                    }
                }
            }
            console.log(usuarios);
            //res.send("Recibido");     
            res.render("partials/seleccion", { usuarios, home: req.session.user, mi_session: true });
        });
    }
    //METODO PARA CERRAR LA SESION
    endSession(req, res) {
        console.log(req.body);
        req.session.user = {}; //Se borran los datos del usuarios guardados en la variable user
        req.session.auth = false; //Se pone autenticado en false
        req.session.destroy(() => console.log("Sesion finalizada")); //Metodo para destruir datos asociados a la sesion
        res.redirect("/");
    }
}
//Paso 10
const userController = new UserController();
exports.default = userController;
//# sourceMappingURL=userController.js.map