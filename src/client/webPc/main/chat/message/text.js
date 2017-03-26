import React from 'react';
import base from './base';
import expressions from '../../../../util/expressions';

const transparentImage = 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==';

const textMessage = {
    shouldRender: messageType => messageType === 'text',
    render: (message, me) => {
        let content = message.get('content');
        content = content.replace(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
            r => (
                `<a href="${r}" rel="noopener noreferrer" target="_blank">${r}</a>`
            ),
        ).replace(
            /#\(([\u4e00-\u9fa5a-z]+)\)/g,
            (r, e) => {
                const index = expressions.baidu.indexOf(e);
                if (index !== -1) {
                    return `<img class="expression-default-message" src="${transparentImage}" style="background-position: left ${-30 * index}px; background-image: url(${require('assets/images/expressions.png')})" onerror="this.style.display='none'" alt="${r}">`;
                }
                return r;
            },
        ).replace(
            /#\(ali(\d+)\)/g,
            (r, e) => {
                const index = expressions.ali.indexOf(e);
                if (index !== -1) {
                    return `<img class="expression-ali-message" src="${transparentImage}" style="background-position: left ${-44 * index}px; background-image: url(${require('assets/images/ali.png')})" onerror="this.style.display='none'" alt="${r}">`;
                }
                return r;
            },
        );
        return base(
            <div
                className="text"
                dangerouslySetInnerHTML={{ __html: content }}
            />,
            message,
            me,
        );
    },
};

export default textMessage;
