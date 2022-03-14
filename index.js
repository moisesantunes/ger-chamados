const express = require('express')
const bodyParser = require('body-parser')
var session = require('express-session');
const app = express()
const port = 3000;

app.set('view engine', 'ejs');
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

app.use(session({
  secret: 'super mega senhas',
  resave: false,
  saveUninitialized: true
}))
let id=1;
let ref=1;
function nova_senha(n){
	let obj ={};
	let horabr= new Date();
	obj.criada_em =horabr.toLocaleString("pt-BR");
	obj.estado ="aberta";
	obj.num = n;
	obj.servico="";
	obj.chamado_por="";
	obj.id= id++
	
	return obj;
}


let senhas=[]


const usuarios =[
	{username:"moises", password:"1234"},
	{username:"coiso", password:"senha"}
]



function loga(req, res, next){
	console.log(senhas)
	console.log("__________")
	next()
}
app.use("/coisa",loga)

app.get('/', async (req, res) => {

//if(senhas.length ==0){senhas.push(nova_senha())}
	/*
	let senhas_abertas = await senhas.filter((s)=>{
		return s.estado == "aberta"
	})
	*/
	/*
	let proxima = await senhas.findIndex((s)=>{
 		return s.estado =="aberta"
	})
	*/
	let proxima = await senhas.find((s)=>{
		return s.estado == "aberta"
	})
	
	res.render('home',{
		senhas:senhas,
		prox:proxima,
		user:req.session.user
	})
})

app.get("/atender/id/:id", async (req, res)=>{

/*
	let i = await senhas.findIndex((s)=>{
		return s.num == req.params.num && s.estado == "aberta"
	})

*/
	let senha = await senhas.find((s)=>{
		return s.id == req.params.id;
	})
	
	console.log("senha e:", senha)
	senha.estado = "chamada";
	senha.chamado_por= req.session.user.username;
	console.log("______");
	console.log("senha e:", senha)

	

//	senhas[i].estado = "chamada";
//	senhas[i].chamado_por = req.session.user.username
	req.session.user.atendendo = senha;
	console.log(req.session.user) 
	res.render('senha', {
		senha: senha,
		user: req.session.user
		
	})
	
//	res.redirect("/")
//res.send(s)

})

app.get('/config',(req, res)=>{
	res.render("config")
})

app.get("/finalizar/id/:id",async (req,res)=>{
	let senha = await senhas.find((s)=>{
		return s.id == req.params.id;
	})
	console.log("a finalizar",senha)
	senha.estado = "encerrada";
	console.log("ja finalizada",senha)	
	res.redirect("/")
})

app.post("/config",(req,res)=>{
//	senhas=[]
	ref =Number(req.body.nova)
	
	senhas.push(nova_senha(req.body.servico+ref))
	res.redirect("/")
})

app.get("/nova/:servico",(req, res)=>{


	if(senhas.length ==0){
		senhas.push(nova_senha(req.params.servico+ref))
	}else{

//	let ultima = senhas.length-1
//	let num = senhas[ultima].num+1 ;
		ref = ref+1;
		senhas.push(nova_senha(req.params.servico+ref))


}

	res.redirect("/")

})
app.get("/todas",(req,res)=>{
	res.render("todas",{senhas:senhas})
})

app.post("/login", (req, res)=>{
req.session.user={}
//	console.log("usuario",req.body)
req.session.user.username= req.body.username
req.session.user.guiche= req.body.guiche
//console.log("logado",req.session.user)

/*
	let usuario =usuarios.findIndex((u)=>{
		return u.username == req.body.username
	})
	if (usuario == -1){
		console.log("usuario nao achado")
	} else if(usuarios[req.body.username])
	
	console.log(req.session.username)
*/		
	
	res.redirect("/")
})




/*
app.get("/tempo",function (req, res,){
	let resposta =`Olá, requeste feito em: ${req.tempo}!`
	res.send(resposta)
})


app.use('/user/:id', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});
*/

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
