// let token = require('../routes/farmers/token')
module.exports.farmersLandingpageGet = (req, res) => {
    res.render('./farmersLandingpage');
}

module.exports.farmersLoginGet = (req, res) => {
    res.render('./farmersLogin');
}

module.exports.farmersRegisterGet = (req, res) => {
    res.render('./farmersRegister.hbs');
}

module.exports.farmersDashboardGet = (req, res) => {
    res.render('./dashboard')
}

module.exports.farmersAddExpGet = (req, res) => {
    res.render('./farmersMachineAdd');
}