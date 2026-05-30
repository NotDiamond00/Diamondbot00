/**
 * ============================================================
 *      💎 DIAMONDBOT - Fixed Version (Messages Spread Out)
 * ============================================================
 */

const mineflayer = require('mineflayer');

// ⚙️ CONFIG
const BOT_USERNAME = 'DiamondBot';
const SERVER_HOST = 'Window-smp.aternos.me';
const SERVER_PORT = 54008;
const SERVER_VERSION = '1.21.1';

const CHAT_MESSAGES = [
    "subscribe to not diamond",
    "hey guys",
    "I M regular player",
    "nice server",
    "anyone here?",
    "lol",
    "gg",
    "diamonds are forever 💎"
];

const TRIGGER_WORDS = ['hay', 'hi', 'hello', 'hey', 'hii'];
const REPLY_MESSAGE = 'Hello';

// ⏱️ TIMINGS - Yahan se control hoga
const FIRST_CHAT_DELAY = 30000;       // Pehla message: 30 sec baad
const CHAT_INTERVAL_MIN = 60000;      // Min: 1 minute
const CHAT_INTERVAL_MAX = 180000;     // Max: 3 minutes

let bot;
let chatCount = 0;
let replyCount = 0;
let isChatScheduled = false;          // ✅ Naya: Track karega

function log(msg, icon='ℹ️') {
    console.log(`[${new Date().toLocaleTimeString()}] ${icon} ${msg}`);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function containsTrigger(msg) {
    return TRIGGER_WORDS.some(w => msg.toLowerCase().includes(w));
}

function createBot() {
    log('Creating DiamondBot...', '💎');
    
    bot = mineflayer.createBot({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: BOT_USERNAME,
        version: SERVER_VERSION,
        auth: 'offline'
    });

    // ✅ SPAWN
    bot.on('spawn', () => {
        log('💎 DiamondBot joined server!', '✅');
        
        setTimeout(() => {
            bot.chat('💎 DiamondBot is here! Type "hay" to say hello!');
        }, 5000);
        
        // ✅ Pehli baar schedule karo
        if (!isChatScheduled) {
            isChatScheduled = true;
            scheduleNextChat(FIRST_CHAT_DELAY);
        }
        
        startMovementLoop();
    });

    // 💬 CHAT HANDLER
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        
        log(`[Chat] ${username}: ${message}`, '👤');
        
        if (containsTrigger(message)) {
            setTimeout(() => {
                bot.chat(`${REPLY_MESSAGE} ${username}! 💎`);
                log(`Replied to ${username}`, '💎');
                replyCount++;
            }, 1000);
        }
        else if (message.toLowerCase().includes('bot') || message.toLowerCase().includes('diamondbot')) {
            setTimeout(() => {
                bot.chat(`Hey ${username}! I am DiamondBot 💎`);
            }, 800);
        }
    });

    // 👤 Players
    bot.on('playerJoined', (player) => {
        log(`Player joined: ${player.username}`, '👤');
        setTimeout(() => bot.chat(`Welcome ${player.username}! 💎`), 3000);
    });

    bot.on('playerLeft', (player) => {
        log(`Player left: ${player.username}`, '👤');
    });

    // 💀 Death
    bot.on('death', () => {
        log('DiamondBot died! Respawning...', '💀');
    });

    // 🔌 Disconnect
    bot.on('end', () => {
        log('Disconnected! Reconnecting in 10s...', '❌');
        isChatScheduled = false;  // ✅ Reset
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => {
        log(`Error: ${err.message}`, '❌');
    });
}

// ✅ FIXED CHAT SYSTEM
function scheduleNextChat(delay) {
    log(`Next chat in ${(delay/1000).toFixed(0)} seconds...`, '⏱️');
    
    setTimeout(() => {
        if (!bot || !bot.entity) {
            isChatScheduled = false;
            return;
        }
        
        // Ek message bhejo
        const msg = randomChoice(CHAT_MESSAGES);
        bot.chat(msg);
        log(`Auto-chat: "${msg}"`, '💬');
        chatCount++;
        
        // ✅ Next schedule karo (alag time)
        const nextDelay = randomInt(CHAT_INTERVAL_MIN, CHAT_INTERVAL_MAX);
        scheduleNextChat(nextDelay);
        
    }, delay);
}

// 🚶 MOVEMENT
function startMovementLoop() {
    function move() {
        if (!bot || !bot.entity) return;
        
        try {
            const keys = ['forward', 'back', 'left', 'right'];
            const key = randomChoice(keys);
            
            bot.setControlState(key, true);
            log(`Moving: ${key}`, '🚶');
            
            setTimeout(() => {
                bot.setControlState(key, false);
                
                if (Math.random() > 0.7) {
                    bot.setControlState('jump', true);
                    setTimeout(() => bot.setControlState('jump', false), 500);
                }
                
                const yaw = Math.random() * Math.PI * 2;
                const pitch = (Math.random() - 0.5) * Math.PI;
                bot.look(yaw, pitch, true);
                
            }, randomInt(500, 1500));
            
        } catch (e) {}
        
        setTimeout(move, randomInt(3000, 8000));
    }
    
    setTimeout(move, 3000);
}

// 🛑 Shutdown
process.on('SIGINT', () => {
    log('Shutting down...', '🛑');
    if (bot) bot.chat('💎 DiamondBot leaving! Bye!');
    setTimeout(() => { if (bot) bot.end(); process.exit(0); }, 1000);
});

// 🚀 START
console.log(`
╔══════════════════════════════════════╗
║     💎 DIAMONDBOT - FIXED 💎         ║
║  Chat every 1-3 minutes              ║
╚══════════════════════════════════════╝
`);

createBot();

