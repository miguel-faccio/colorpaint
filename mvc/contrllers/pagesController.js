const path = require('path')


module.exports = (app) => {


app.get("/recuperarsenha", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin","*")

    res.sendFile(path.resolve('mvc/views/public/senha/recuperarsenha.html'));

});
app.get("/redefinirsenha", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin","*")

    res.sendFile(path.resolve('mvc/views/public/senha/redefinirsenha.html'));

});
}