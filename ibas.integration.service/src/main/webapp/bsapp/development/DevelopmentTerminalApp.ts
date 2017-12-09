/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as bo from "../../borep/bo/index";
import { BORepositoryIntegrationDevelopment } from "../../borep/BORepositories";

/** 开发终端 */
export class DevelopmentTerminalApp extends ibas.Application<IDevelopmentTerminalView> {

    /** 应用标识 */
    static APPLICATION_ID: string = "7300b8ed-4804-4d47-aa58-692dd6e6e62c";
    /** 应用名称 */
    static APPLICATION_NAME: string = "integrationdevelopment_app_development_terminal";
    /** 构造函数 */
    constructor() {
        super();
        this.id = DevelopmentTerminalApp.APPLICATION_ID;
        this.name = DevelopmentTerminalApp.APPLICATION_NAME;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 注册视图 */
    protected registerView(): void {
        super.registerView();
        // 其他事件
        this.view.runActionEvent = this.runAction;
        this.view.loadActionsEvent = this.loadActions;
        this.view.useActionEvent = this.useAction;
    }
    /** 视图显示后 */
    protected viewShowed(): void {
        // 视图加载完成
    }
    protected loadActions(url: string): void {
        if (ibas.strings.isEmpty(url)) {
            this.messages({
                type: ibas.emMessageType.WARNING,
                title: this.description,
                message: ibas.i18n.prop("integrationdevelopment_please_actions_url")
            });
            return;
        }
        url = ibas.urls.normalize(url);
        let that: this = this;
        let boRepository: BORepositoryIntegrationDevelopment = new BORepositoryIntegrationDevelopment();
        boRepository.loadActions({
            url: url,
            onCompleted(opRslt: ibas.IOperationResult<bo.IntegrationAction>) {
                try {
                    if (opRslt.resultCode !== 0) {
                        throw new Error(opRslt.message);
                    }
                    // 补充地址
                    let rootUrl: string = url.substring(0, url.lastIndexOf("/"));
                    if (!rootUrl.endsWith("/")) {
                        rootUrl += "/";
                    }
                    for (let item of opRslt.resultObjects) {
                        item.group = rootUrl;
                    }
                    that.view.showActions(opRslt.resultObjects);
                    that.busy(false);
                } catch (error) {
                    that.messages(error);
                }
            }
        });
    }
    private usingAction: bo.IntegrationAction;
    protected useAction(data: bo.IntegrationAction): void {
        if (ibas.objects.isNull(data) && ibas.objects.isNull(this.usingAction)) {
            this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                ibas.i18n.prop("bo_integrationaction")
            ));
            return;
        }
        this.usingAction = ibas.objects.isNull(data) ? this.usingAction : data;
        this.view.showAction(this.usingAction);
        this.view.showActionConfigs(this.usingAction.configs);
    }
    protected runAction(): void {
        if (ibas.objects.isNull(this.usingAction)) {
            this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                ibas.i18n.prop("bo_integrationaction")
            ));
            return;
        }
        let baseUrl = this.usingAction.group;
        if (ibas.strings.isEmpty(baseUrl)) {
            baseUrl = ibas.urls.normalize(ibas.urls.ROOT_URL_SIGN);
        }
        if (!baseUrl.toLowerCase().startsWith("http")) {
            baseUrl = ibas.urls.normalize(ibas.urls.ROOT_URL_SIGN) + baseUrl;
        }
        let actionRequire: Function = ibas.requires.create({
            baseUrl: baseUrl,
            context: this.usingAction.name.trim(),
            waitSeconds: ibas.config.get(ibas.requires.CONFIG_ITEM_WAIT_SECONDS, 30)
        }, []);
        let path = this.usingAction.path;
        if (ibas.strings.isEmpty(path)) {
            path = this.usingAction.name.trim()
        }
        if (path.indexOf(".") > 0) {
            path = path.substring(0, path.lastIndexOf("."));
        }
        let that: this = this;
        actionRequire(
            [path],
            function (library: any): void {
                //库加载成功
                try {
                    if (ibas.objects.isNull(library)) {
                        throw new Error("invalid action library.");
                    }
                    if (ibas.objects.isNull(library.default) && !ibas.objects.isAssignableFrom(library.default, ibas.Action)) {
                        throw new Error("invalid action class.");
                    }
                    let action: ibas.Action = new library.default();
                    if (!(ibas.objects.instanceOf(action, ibas.Action))) {
                        throw new Error("invalid action instance.");
                    }
                    // 输入设置
                    for (let item of that.usingAction.configs) {
                        if (ibas.objects.isNull(item.value) || ibas.objects.isNull(item.key)) {
                            continue;
                        }
                        action.addConfig(item.key, ibas.config.applyVariables(item.value));
                    }
                    // 运行
                    action.do();
                } catch (error) {
                    that.messages(error);
                }
            },
            function () {
                // 库加载失败
                that.messages(
                    ibas.emMessageType.ERROR,
                    ibas.i18n.prop("integrationdevelopment_run_action_faild", that.usingAction.name));
            }
        );
    }
}
/** 视图-开发终端 */
export interface IDevelopmentTerminalView extends ibas.IView {
    /** 加载动作，参数1：地址 */
    loadActionsEvent: Function;
    /** 显示动作 */
    showActions(datas: bo.IntegrationAction[]): void;
    /** 使用动作 */
    useActionEvent: Function;
    /** 显示动作 */
    showAction(data: bo.IntegrationAction): void;
    /** 显示动作配置 */
    showActionConfigs(datas: bo.IntegrationActionConfig[]): void;
    /** 运行动作 */
    runActionEvent: Function;
}