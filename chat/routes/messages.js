var express = require("express");
var router = express.Router();
const Joi = require("joi");

const Msg = require("../models/message");


/* GET ALL */

router.get("/",function (req, res, next) {
    Msg.findAll().then((result)=>{
        res.send(result);
    });
});

/* GET BY ID */

router.get('/:ts', function (req, res, next) {
    Msg.findByPk(req.params.id).then((result)=>{
        if(result == null) return res.status(404).send("No existe un mensaje con el ts especificado");
        res.send(result);
    });
});

/* POST */

router.post("/", function (req, res, next) {

    const { error } = validateMsg(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    const { message, author, ts } = req.body;
    Msg.create({message,author,ts}).then((response)=>{
        res.send(response);
    });
});

/* PUT */

router.put("/:ts", function(req,res,next){
  
    //body correcto
    const { error } = validateMsgPut(req.body);
  
    if(error){
      return res.status(400).send(error.details[0].message);
    }
    Msg.update(req.body, { where: {ts: req.params.ts} }).then((result)=>{
      if(result[0] === 0 ) return res.status(404).send("No existe un mensaje con el ts especificado");
      res.status(200).send("Mensaje actualizado");
    });
  });
  

/* DELETE */

router.delete("/:ts", function (req,res,next) {

    Msg.destroy({where:{ts: req.params.ts}}).then((result)=>{
      if(result === 0) return res.status(404).send("No existe un mensaje con el ts especificado");
      res.status(204).send("Mensage eliminado");
    });
  });

/* VALIDATE */

function validateMsg(msg) {
    const schema = Joi.object({
        message: Joi.string().min(5).required(),
        author: Joi.string().required(),
        ts: Joi.string().required()
    });
    return schema.validate(msg);
}

function validateMsgPut(msg) {
    const schema = Joi.object({
        message: Joi.string().min(5).required(),
        author: Joi.string().required(),
        ts: Joi.string()
    });
    return schema.validate(msg);
}