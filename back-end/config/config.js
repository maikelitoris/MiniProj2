module.exports = {
    mongodb: {
        // Base de dados local, como pede a Tarefa 3.2 (cópia da base de testes do livro feita com o Studio 3T)
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/test',
        collections: {
            animal: 'animals',
            question: 'questions',
            quiz: 'quizzes',
            user: 'users',
            user_levels: "user_levels",
            sponsor: "sponsors",
            expert: "experts"
        }
    },
    auth: {
        expiration_time: 15000,
        issuer: "FCA"
    },
    sanitize: {
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzŠŒŽšœžŸ¥µÀÁÂÃÄÅÆÇÈÉÊËẼÌÍÎÏĨÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëẽìíîïĩðñòóôõöøùúûüýÿ\\ ",
        numerical: "0123456789"
    },
    email: {
        service: "Gmail",
        auth: {
            // As credenciais do email não ficam no repositório: definem-se em variáveis de ambiente
            user: process.env.EMAIL_USER || "",
            pass: process.env.EMAIL_PASS || ""
        }
    }
}