export default {
    filesystem: {
        path:"./DB"
    },
    mongodb: { 
        cnxStr:"mongodb://127.0.0.1:27017/ecommerceActiva",
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    }
}