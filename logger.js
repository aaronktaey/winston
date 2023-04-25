const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const process = require("process");
const { combine, timestamp, label, printf } = winston.format;

// 로그파일 경로 루트/logs
const logDir = `${process.cwd()}/logs`;

// log 출력 포맷 정의
const logFormat = printf(({ level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    //로그 출력 형식
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
        label({ label: 'Winston 연습 어플리케이션' }), // 어플리케이션 이름
        logFormat, //  로그 출력 포맷
        // format : combine() 에서 정의한 timestamp와 label 형식값이 logFormat에 들어가서 정의되게한다. level, message는 콘솔에서 자동정의
    ),
    //실제 로그를 어떻게 기록할 것인지 정의
    transports: [
        //info 레벨 로그를 저장할 파일 설정 (info: 2보다 높은 error: 0 과 warn: 1 로그들도 자동 포함해서 저장)
        new winstonDaily({
            level: 'info', // info 일 경우
            dataPattern : 'YYYY-MM-DD', // 날짜 형식
            dirname: logDir, // 경로
            filename: `%DATE%.log`, // 파일명
            maxFiles: 30, // 최근 30일 간 로그 남김
            zippedArchive: true, // 아카이브된 로그 파일을 gzip으로 압축하는지 여부
        }),
        // error 레벨 로그를 저장할 파일 설정 (info에 자동 포함되지만 일부러 따로 빼서 설정)
        new winstonDaily({
            level: 'error', // error 일 경우
            dataPattern : 'YYYY-MM-DD', // 날짜 형식
            dirname: logDir + '/error', // 경로
            filename: `%DATE%.error.log`, // 파일명
            maxFiles: 30, // 최근 30일 간 로그 남김
            zippedArchive: true, // 아카이브된 로그 파일을 gzip으로 압축하는지 여부
        }),
        new winstonDaily({
            level: 'silly', // error 일 경우
            dataPattern : 'YYYY-MM-DD', // 날짜 형식
            dirname: logDir, // 경로
            filename: `%DATE%.log`, // 파일명
            maxFiles: 30, // 최근 30일 간 로그 남김
            zippedArchive: true, // 아카이브된 로그 파일을 gzip으로 압축하는지 여부
        })
    ],
    
    //* uncaughtException 발생시 파일 설정
    exceptionHandlers: [
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.exception.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
});
// production(운영)환경이 아닐 경우, 화면에서도 콘솔이 찍히도록 설정 (파일을 동일하게 생성됨)
if(process.env.NODE_ENV !== 'production'){
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // level 별로 색상 적용 
                winston.format.simple()// `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
            )
        })
    )
}

module.exports=logger;