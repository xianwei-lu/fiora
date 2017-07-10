import expressions from './expressions';

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

// export
function handleReceiveMessage(message) {
    message.content = convertExpression(message.content);
}

function handleInitMessages(messages) {
    for (const message of messages) {
        message.content = convertExpression(message.content);
    }
}
function handleSendMessage(message) {
    message.content = convertExpression(message.content);
}

export default {
    handleReceiveMessage,
    handleInitMessages,
    handleSendMessage,
};
