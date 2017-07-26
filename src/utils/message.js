import xss from 'xss';
import toBase64 from 'arraybuffer-base64';
import fileType from 'file-type';
import expressions from './expressions';

const myXss = new xss.FilterXSS({
    whiteList: {
    },
});
const transparentImage = 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==';

function convertExpression(txt) {
    return txt.replace(
        /#\(([\u4e00-\u9fa5a-z]+)\)/g,
        (r, e) => {
            const index = expressions.default.indexOf(e);
            if (index !== -1) {
                return `<img class="expression-default-message" src="${transparentImage}" style="background-position: left ${-30 * index}px; background-image: url(${require('assets/images/expressions.png')})" onerror="this.style.display='none'" alt="${r}">`;
            }
            return r;
        },
    );
}
function handleXss(value) {
    return myXss.process(value);
}
function setPreview(message) {
    if (message.type === 'text') {
        message.preview = `${message.from.username}: ${convertExpression(message.content)}`;
    } else {
        message.preview = `${message.from.username}: [${message.type}]`;
    }
}

// export
function handleReceiveMessage(message) {
    setPreview(message);
    message.content = convertExpression(handleXss(message.content));
}

function handleInitMessages(messages) {
    for (const message of messages) {
        setPreview(message);
        message.content = convertExpression(handleXss(message.content));
    }
}
function handleSendMessage(message) {
    setPreview(message);
    switch (message.type) {
    case 'text': {
        message.content = convertExpression(handleXss(message.content));
        break;
    }
    case 'image': {
        const type = fileType(message.content);
        message.content = `data:image/${type.ext};base64,${toBase64(message.content)}`;
        break;
    }
    default:
        break;
    }
}

export default {
    handleReceiveMessage,
    handleInitMessages,
    handleSendMessage,
};
