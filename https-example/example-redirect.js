const redirect = require("./redirect");

const server = redirect(app); // express `app`

server.listen(port, host, callback);