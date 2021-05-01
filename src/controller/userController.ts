import {Request, Response} from 'express';
import  userModel from '../models/userModel';
import flash from "connect-flash";

//Paso32
const listado=[
	{"id":"1","usuario":"Juan Perez","password":"123456"},
	{"id":"2","usuario":"Pepe Cadena","password":"123456"},
	{"id":"3","usuario":"Martin Gonzalez","password":"123456"}
];

class UserController{

	public signin(req:Request,res:Response){
		console.log(req.body);
        //res.send('Sign In!!!'); //Paso 10 //Comentada en el Paso 12
        res.render("partials/signinForm"); //Paso 12
	}

    public async login(req:Request,res:Response){ //Paso 7 (Ej 4)
		const { usuario, password } = req.body; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.buscarNombre(usuario);
        console.log(usuario);
        console.log(password);
        console.log(result);	
				
        if (!result){
            //res.send({ "Usuario no registrado Recibido": req.body });
			req.flash('error_session','Usuario y/o Password Incorrectos'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
			res.redirect("./error");
			
		} else {
			if (result.nombre == usuario && result.password == password){
				req.session.user=result;
				req.session.auth=true;
				res.redirect("./home");
				return;
			} else {	
				//res.send({ "Usuario y/o contraseña incorrectos": req.body });
				req.flash('error_session','Usuario y/o Password Incorrectos'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
				res.redirect("./error");
			}
		}			
	}

	public showError(req: Request, res: Response){
        //res.send({ "Usuario y/o contraseña incorrectos": req.body });
		res.render("partials/error");
	}

    //registro - Paso 19
	public signup(req:Request,res:Response){
		console.log(req.body);
        //res.send('Sign Up!!!');
		res.render("partials/signupForm");
	}


    public async home(req:Request,res:Response){
		console.log(req.body);
        //res.send('Bienvenido!!!'); //Paso 31.B
		
		if(!req.session.auth){
            req.flash('error_session','Debes iniciar sesion para ver esta seccion'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
			res.redirect("./error");		
        }
		
		res.render("partials/home");
	}

	public process(req:Request,res:Response){
		console.log(req.body);
        res.send('Datos recibidos!!!');
		//res.render("partials/home",{listado});
	}

	//CRUD
	public async list(req:Request,res:Response){
		console.log(req.body); //Paso 7 (Ej4)
        const usuarios = await userModel.listar();
        console.log(usuarios);
        return res.json(usuarios);
        //res.send('Listado de usuarios!!!');
	}

	public async find(req:Request,res:Response){
		console.log(req.params.id); //Paso 7 (Ej4)
        const { id } = req.params;
        const usuario = await userModel.buscarId(id);
        if (usuario)
            return res.json(usuario);
        res.status(404).json({ text: "User doesn't exists" });
	}

	public async addUser(req:Request,res:Response){
		const usuario = req.body; //Paso 7 (Ej4)
        delete usuario.repassword;
        console.log(req.body);
        //res.send('Usuario agregado!!!');
        const busqueda = await userModel.buscarNombre(usuario.nombre);
        if (!busqueda) {
            const result = await userModel.crear(usuario);
            return res.json({ message: 'User saved!!' });
        }
        return res.json({ message: 'User exists!!' });
	}

	public async update(req:Request,res:Response){
		console.log(req.body); //Paso 7 (Ej4)
        const { id } = req.params;
        const result = await userModel.actualizar(req.body, id);
        //res.send('Usuario '+ req.params.id +' actualizado!!!');
        return res.json({ text: 'updating a user ' + id });
	}

	public async delete(req:Request,res:Response){
		console.log(req.body); //Paso 7 (Ej4)
        //res.send('Usuario '+ req.params.id +' Eliminado!!!');
        const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.eliminar(id);
        //return res.json({ text: 'deleting a user ' + id });
		res.redirect('../control');
	}
	//FIN CRUD


	public async control(req:Request,res:Response){
		//res.send('Controles'); //Paso 7 (Ej4)
        if(!req.session.auth){
            req.flash('error_session','Debe iniciar sesion para ver esta seccion'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
			res.redirect("./error");	
        }
        const usuarios = await userModel.listar();       
        res.render('partials/controls', { users: usuarios, mi_session:true });	
	}	

	public async procesar(req:Request,res:Response){
        if(!req.session.auth){
            //res.redirect("/");
			req.flash('error_session','Debes iniciar sesion para ver esta seccion');
			res.redirect("./error");
        }
		console.log(req.body);

		let usuario=req.body.usuario;
        var usuarios:any=[];
        console.log(usuario);

        if(usuario !== undefined){
            for(let elemento of usuario){
                const encontrado = await userModel.buscarId(elemento);
                if (encontrado){
                    usuarios.push(encontrado); //Agrego objeto al array
                    console.log(encontrado);
                }
                    
            }
        }
        console.log(usuarios);

		//res.send("Recibido");     
		res.render("partials/seleccion",{usuarios,home:req.session.user, mi_session:true});
	}

	//METODO PARA CERRAR LA SESION
	public endSession(req: Request, res: Response){
        console.log(req.body);
        req.session.user={}; //Se borran los datos del usuarios guardados en la variable user
        req.session.auth=false; //Se pone autenticado en false
        req.session.destroy(()=>console.log("Sesion finalizada")); //Metodo para destruir datos asociados a la sesion
        res.redirect("/");
    }
}


//Paso 10
const userController = new UserController(); 
export default userController;