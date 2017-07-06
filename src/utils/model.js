const Group = require('../server/models/group');
const Message = require('../server/models/message');

const tools = {
    async populateGroupInfo(group) {
        const groupOpts = [
            {
                path: 'members',
                select: '_id avatar username',
            },
            {
                path: 'creator',
                select: '_id username',
            },
        ];
        await Group.populate(group, groupOpts);
    },
    async populateGroupMessage(group) {
        const messages = await Message.find({ toGroup: group._id }).populate({ path: 'from', select: '_id username avatar' });
        if (messages.length > 30) {
            messages.splice(0, messages.length - 30);
        }
        group._doc.messages = messages || [];
    },
};

module.exports = tools;
