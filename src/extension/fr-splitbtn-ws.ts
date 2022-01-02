import { WebSocketServer } from 'ws';
import { get } from './util/nodecg';
import { getTimerState, startTimer, pauseTimer, resetTimer, stopTimer } from './timer';

const nodecg = get();

const SPEEDCTRL_CMD = {
    GetState: '0',
    Start: '1',
    Stop: '2',
    Pause: '3',
    Reset: '5'
};

let TimerState: number = -1; //No connection

const wss = new WebSocketServer({ port: 9091 });

wss.on('connection', function connection(ws)
{
    ws.on('message', function message(data)
    {
        var dataStr;
        dataStr = data.toString("utf-8");

        switch (dataStr)
        {
            case SPEEDCTRL_CMD.GetState:
                getTimerState()
                    .then((timerPhase:number) => {ws.send(timerPhase)})
                    .catch((err:any) => {nodecg.log.debug('[Timer] Cannot get timer state:', err)});
                break;
            case SPEEDCTRL_CMD.Start:
                startTimer();
                break;
            case SPEEDCTRL_CMD.Stop:
                stopTimer(undefined, false);
                break;
            case SPEEDCTRL_CMD.Pause:
                pauseTimer();
                break;
            case SPEEDCTRL_CMD.Reset:
                resetTimer();
                break;
            default:
                nodecg.log.debug('Unknown command: %s\n', dataStr);
                break;
        }
    });
});