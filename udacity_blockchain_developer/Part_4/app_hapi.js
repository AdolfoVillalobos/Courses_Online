const Hapi = require('@hapi/hapi');

/**
 * Class Definition for the REST API
 */
class BlockAPI {

    /**
     * Constructor that allows initialize the class
     */
    constructor() {
		this.server = Hapi.Server({
            port: 3000,
            host: 'localhost'
        });
        this.initControllers();
        this.start();
    }

    /**
     * Initialization of all the controllers
     */
	initControllers() {
		require("./BlockController_@hapi/hapi.js")(this.server);
	}

    async start() {
        await this.server.start();
        console.log(`Server running at: ${this.server.info.uri}`);
    }

}

new BlockAPI();