/**
 * 私信列表私信
 *  @param {*} count 私信数量
 *  @param {*} msgContent 私信话术
 */
PrivateChat = function (count, msgContent, isRepeat, sxjg) {
    if (this.EnterMePage()) {
        let nickList = [], slide_count = 0;
        this.taskCount = 0;
        let followers = className("android.widget.TextView").text("Followers").findOne(5000);
        if (followers) {
            let followerCount = followers.parent().child(0).text();
            followerCount = followerCount.match('K') ? parseFloat(followerCount) * 1000 : (followerCount.match('M') ? parseFloat(followerCount) * 1000000 : parseInt(followerCount.replace(/[^0-9]/ig, "")));
            if (followerCount > 0) {
                this.OnClick(followers);
                if (this.EnterFansList()) {
                    sleep(random(3000, 4000));
                    this.userList = className("android.widget.TextView").id(this.packageName + ':id/zw8').clickable(false).find();
                    this.userList_len = this.userList.length;
                    let configData = undefined;
                    for (var i = 0; i < this.userList_len; i++) {
                        if (this.taskCount >= count) {
                            toastLog('私信任务完成');
                            break;
                        } else {
                            try {
                                let username = this.userList[i].text();
                                if (nickList.indexOf(username) == -1) {
                                    nickList.push(username);
                                    if (isRepeat == 0) {
                                        if (files.isFile('/sdcard/' + this.currAccount + '.txt')) {
                                            configData = files.read('/sdcard/' + this.currAccount + '.txt');
                                            configData = configData.split('\n');
                                        }
                                        if (configData != undefined) {
                                            if (configData.indexOf(username) == -1) {
                                                let success = this._PrivateChat_(msgContent, this.userList[i]);
                                                if (success) {
                                                    this.taskCount++; files.append('/sdcard/' + this.currAccount + '.txt', username + '\n');
                                                    toastLog('已完成私信任务： ' + this.taskCount + ' 条,剩余：' + (count - this.taskCount) + ' 条');
                                                    sleep(Math.ceil(random(parseInt(sxjg.split('-')[0]) * 1000, parseInt(sxjg.split('-')[1]) * 1000)));
                                                }
                                            } else { toastLog('账号：' + username + ' 已发过私信'); sleep(1000); }
                                        } else {
                                            let success = this._PrivateChat_(msgContent, this.userList[i]);
                                            if (success) {
                                                this.taskCount++; files.append('/sdcard/' + this.currAccount + '.txt', username + '\n');
                                                toastLog('已完成私信任务： ' + this.taskCount + ' 条,剩余：' + (count - this.taskCount) + ' 条');
                                                sleep(Math.ceil(random(parseInt(sxjg.split('-')[0]) * 1000, parseInt(sxjg.split('-')[1]) * 1000)));
                                            }
                                        }
                                    } else {
                                        let success = this._PrivateChat_(msgContent, this.userList[i]);
                                        if (success) {
                                            this.taskCount++; toastLog('已完成私信任务： ' + this.taskCount + ' 条,剩余：' + (count - this.taskCount) + ' 条');
                                            sleep(Math.ceil(random(parseInt(sxjg.split('-')[0]) * 1000, parseInt(sxjg.split('-')[1]) * 1000)));
                                        }
                                    }
                                }
                                if (i == 0) { let followers = textMatches(/Followers/).findOne(1000); if (followers) this._OnClick(followers, 500); }
                                if (followerCount == nickList.length) { toastLog('翻页结束'); break; }
                                if (i == this.userList_len - 1) {
                                    this.ScreenSlideUp(); slide_count++; sleep(random(3000, 4000)); toastLog('滑动屏幕');
                                    if (slide_count % 10 == 0) {
                                        let sum = Math.ceil(random(2, 3));
                                        while (sum--) this.SlidingScreen_Down();
                                        this.ScreenSlideUp(); sleep(random(3000, 4000));
                                    }
                                    this.userList = className("android.widget.TextView").id(this.packageName + ':id/zw8').clickable(false).find();
                                    this.userList_len = this.userList.length; i = -1;
                                }
                            } catch (e) { }
                        }
                    }
                }
            } else {
                toastLog('当前账号还没有粉丝');
            }
        }
    }
}


_PrivateChat_ = function (msgContent, item) {
    let success = false;
    this._OnClick(item.parent(), 2000);
    while (className("android.view.View").id(this.packageName + ':id/lbp').findOne(1000)) { toastLog('页面加载中...'); };
    let followback = className("android.widget.TextView").text('Follow back').findOne(2000);
    if (followback) { this.OnClick(followback); }
    let messBut = this.FindMsgBut();
    if (messBut) {
        this.OnClick(messBut);
        let chatEdit = className("android.widget.EditText").textContains('...').clickable(true).findOne(1000) || className("android.widget.EditText").clickable(true).findOne(1000);
        if (chatEdit) {
            chatEdit.setText(msgContent); sleep(1000);
            let sendBut = className("android.widget.FrameLayout").id(chatEdit.parent().id()).clickable(false).findOne(2000);
            if (sendBut) { this.OnClick(sendBut.parent().child(sendBut.indexInParent() + 1).child(1)); toastLog('私信任务完成'); success = true; }
        } else console.error('没找到输入框');
    } else toastLog('私信按钮未找到.');
    do {
        var goBack = className("android.widget.ImageView").id(this.packageName + ':id/a8n').desc('Add person').findOne(1000);
        if (!goBack) { back(); } sleep(1000);
    } while (!goBack);
    return success;
}