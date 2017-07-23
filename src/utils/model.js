const Group = require('../server/models/group');
const Message = require('../server/models/message');
const Socket = require('../server/models/socket');
const User = require('../server/models/user');

const tools = {
    async populateGroupInfo(group) {
        const groupOpts = [
            {
                path: 'creator',
                select: '_id username',
            },
        ];
        await Group.populate(group, groupOpts);
        group._doc.members = group.members.length;
        group.members = group._doc.members;
    },
    async populateGroupMessage(group) {
        const messages = await Message.find({ toGroup: group._id }).populate({ path: 'from', select: '_id username avatar' });
        if (messages.length > 30) {
            messages.splice(0, messages.length - 30);
        }
        group._doc.messages = messages || [];
        group.messages = group._doc.messages;
    },
    async populateGroupOnline(group) {
        let sockets = await Socket.find({ user: { $in: group.members } });
        const unique = {};
        sockets = sockets.filter((s) => {
            const userId = s.user.toString();
            if (unique[userId]) {
                return false;
            }
            return unique[userId] = true;
        });
        await User.populate(sockets, { path: 'user', select: 'avatar username' });
        group._doc.onlines = sockets.map(({ user, os, browser }) => ({
            user,
            os,
            browser,
        }));
        group.onlines = group._doc.onlines;
    },
};

module.exports = tools;
