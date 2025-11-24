import Fastify from 'fastify';
import Kernel from '../Http/Kernel.js';
import ConsoleKernel from '../Console/Kernel.js';
import Handler from '../Exceptions/Handler.js';

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
|
| The first thing we will do is create a new Fastify application instance
| which serves as the "glue" for all the components of the application, and is
| the IoC container for the system binding all of the various parts.
|
*/

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

/*
|--------------------------------------------------------------------------
| Bind Important Interfaces
|--------------------------------------------------------------------------
|
| Next, we need to bind some important interfaces into the container so
| we will be able to resolve them when needed. The kernels serve the
| incoming requests to this application from both the web and CLI.
|
*/

// Bind HTTP Kernel
app.httpKernel = Kernel;

// Bind Console Kernel
app.consoleKernel = ConsoleKernel;

// Bind Exception Handler
app.exceptionHandler = Handler;

/*
|--------------------------------------------------------------------------
| Return The Application
|--------------------------------------------------------------------------
|
| This script returns the application instance. The instance is given to
| the calling script so we can separate the building of the instances
| from the actual running of the application and sending responses.
|
*/

export default app;