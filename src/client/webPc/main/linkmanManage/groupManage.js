import React from 'react';
import pureRender from 'pure-render-decorator';

import './groupManage.scss';

import CreateGroup from './createGroup';
import AddGroup from './addGroup';
import ui from '../../../action/pc';
import mask from '../../../util/mask';

@pureRender
class GroupManage extends React.Component {
    static handleCreateGroupClick() {
        ui.openCreateGroupInput();
        mask(ui.closeCreateGroupInput);
    }

    static handleAddGroupClick() {
        ui.openAddGroupInput();
        mask(ui.closeAddGroupInput);
    }

    render() {
        return (
            <div className="group-manage">
                <div
                    onClick={this.handleCreateGroupClick}
                >创建群组</div>
                <div
                    onClick={this.handleAddGroupClick}
                >加入群组</div>
                <CreateGroup />
                <AddGroup />
            </div>
        );
    }
}

export default GroupManage;
