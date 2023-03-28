const jwt = require('jsonwebtoken');

const gerarJWT = (uid) => {

    return new Promise( (resolve, reject) => {
        const payload = {uid};

        jwt.sign( payload, process.env.JWT_KEY, {
            expiresIn: '24h'
        }, (err, token) => {
            if( err ){
                reject('Não foi possível gerar el JWT');
            } else {
                resolve( token );
            }
        });

    });

}

module.exports = {
    gerarJWT
}