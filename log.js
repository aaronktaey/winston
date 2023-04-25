const { exceptions } = require("winston");
const logger = require("./logger");


const logAll = () => {
    logger.info("hello world");
    logger.error("hello world");
    logger.warn("hello world");
    logger.debug("hello world");
    logger.verbose("hello world");
    logger.silly("hello world");
    // throw "Exception!";
};
setInterval(()=>{
    logAll();
},5000);