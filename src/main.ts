import "dotenv/config";

import { server } from "./server";
import { env } from "./env";
import { logger } from "./logger";

enum ExitStatus {
  Failure = 1, // Failure code
  Success = 0  // Success code
}

/**
 * HANDLING UNHANDLED AND UNCAUGHT ERRORS
 * Handle promises that get lost in the app.
 */
process.on("unhandledRejection", (reason, promise) => {
  logger.error(`App exiting due an unhandled promise: ${promise} and reason: ${reason}.`);

  // Lets throw the error and let the unhandledException handle below handle it.
  throw reason;
});

/**
 * HANDLING UNHANDLED AND UNCAUGHT ERRORS
 * Handle exceptions
 */
process.on("uncaughtException", (error) => {
  logger.error(`App exiting due to an uncaught exception: ${error}`);
  process.exit(ExitStatus.Failure);
});

async function main() {
  try {
    /**
     * START APP
     */
    const app = server.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}.`);
    });

    /**
     * GRACEFUL SHUTDOWN
     */
    const exitSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];
    exitSignals.map((sig) => process.on(sig, async () => {
      try {
        // Remember: close DB, process and server.
        app.close();
        logger.info("App exited with success.");
        process.exit(ExitStatus.Success);
      } catch (error) {
        logger.error(`App exited with error: ${error}.`);
        process.exit(ExitStatus.Failure);
      }
    }));
  } catch (error) {
    logger.error(`App exited with error: ${error}.`);
    process.exit(ExitStatus.Failure);
  }
}
main();
