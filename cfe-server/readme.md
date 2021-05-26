# CFE Server v1.0

> Instalar las dependencias

```sh
npm install
```

> Iniciar el servidor

```sh
node .
```

> Modifica el archivo `.env` para sustituir las credenciales de acceso a la base de datos y configuraciones

```txt
PORT=8080
HOST=localhost

DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD="password"
DB_NAME="mydb"
```

> Recuperar los campos del formulario recibido

```js
const {
    username,
    password
} = request.fields;

const email = `${username}@cfe.com.mx`;
```

> Procesar los datos recibidos, insertarlos a la base de datos y devolver la respuesta

```js
const data = {
    nombre: username,
    email: email,
    token: password
};

connection.query("INSERT INTO usuarios SET ?", data, (error, results, fields) => {
    if (error) {
        response.send({
            success: false,
            error: `${error}`
        });
        return;
    }

    response.send({
        success: true,
        results,
        fields
    });
});
```
