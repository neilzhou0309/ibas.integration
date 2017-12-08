/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as openui5 from "openui5/index";
import * as bo from "../../../borep/bo/index";
import { IIntegrationActionListView } from "../../../bsapp/integration/index";

/**
 * 列表视图-集成任务
 */
export class IntegrationActionListView extends ibas.BOQueryView implements IIntegrationActionListView {
    /** 返回查询的对象 */
    get queryTarget(): any {
        return bo.IntegrationAction;
    }
    /** 上传包 */
    uploadActionPackageEvent: Function;
    /** 删除数据事件，参数：删除对象集合 */
    deleteDataEvent: Function;
    /** 查看代码 */
    viewCodeEvent: Function;
    /** 绘制视图 */
    darw(): any {
        let that: this = this;
        this.form = new sap.ui.layout.form.SimpleForm("");
        this.table = new sap.ui.table.Table("", {
            enableSelectAll: false,
            visibleRowCount: ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, 15),
            visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Interactive,
            rows: "{/rows}",
            columns: [
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_integrationaction_id"),
                    template: new sap.m.Text("", {
                        wrapping: false
                    }).bindProperty("text", {
                        path: "id"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_integrationaction_name"),
                    template: new sap.m.Text("", {
                        wrapping: false
                    }).bindProperty("text", {
                        path: "name"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_integrationaction_group"),
                    template: new sap.m.Text("", {
                        wrapping: false
                    }).bindProperty("text", {
                        path: "group"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_integrationaction_path"),
                    template: new sap.m.Text("", {
                        wrapping: false
                    }).bindProperty("text", {
                        path: "path"
                    })
                }),
            ]
        });
        this.form.addContent(this.table);
        this.page = new sap.m.Page("", {
            showHeader: false,
            subHeader: new sap.m.Toolbar("", {
                content: [
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("integration_delete_package"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://delete",
                        press: function (): void {
                            that.fireViewEvents(that.deleteDataEvent,
                                // 获取表格选中的对象
                                openui5.utils.getTableSelecteds<bo.IntegrationAction>(that.table)
                            );
                        }
                    }),
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("integration_view_code"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://source-code",
                        press: function (): void {
                            that.fireViewEvents(that.viewCodeEvent,
                                // 获取表格选中的对象
                                openui5.utils.getTableSelecteds<bo.IntegrationAction>(that.table)
                            );
                        }
                    }),
                    new sap.m.ToolbarSeparator(""),
                    new sap.ui.unified.FileUploader("", {
                        name: "file",
                        fileType: ["war", "jar", "zip"],
                        icon: "sap-icon://developer-settings",
                        iconOnly: true,
                        placeholder: ibas.i18n.prop("integration_upload_package"),
                        change(event: sap.ui.base.Event): void {
                            if (ibas.objects.isNull(event.getParameters())
                                || ibas.objects.isNull(event.getParameters().files)
                                || event.getParameters().files.length === 0) {
                                return;
                            }
                            let fileData: FormData = new FormData();
                            fileData.append("file", event.getParameters().files[0]);
                            fileData.append("name", event.getParameters().newValue);
                            that.application.viewShower.messages({
                                type: ibas.emMessageType.QUESTION,
                                actions: [
                                    ibas.emMessageAction.YES,
                                    ibas.emMessageAction.NO
                                ],
                                message: ibas.i18n.prop("integration_upload_package"),
                                onCompleted(action: ibas.emMessageAction): void {
                                    if (action === ibas.emMessageAction.YES) {
                                        that.fireViewEvents(that.uploadActionPackageEvent, fileData);
                                    }
                                }
                            });
                        }
                    }),
                ]
            }),
            content: [this.form]
        });
        return this.page;
    }
    /** 嵌入查询面板 */
    embedded(view: any): void {
        this.page.addHeaderContent(view);
        this.page.setShowHeader(true);
    }
    private page: sap.m.Page;
    private form: sap.ui.layout.form.SimpleForm;
    private table: sap.ui.table.Table;
    /** 显示数据 */
    showData(datas: bo.IntegrationAction[]): void {
        this.table.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
    }
    /** 显示代码 */
    showCode(code: Blob): void {
        jQuery.sap.require("sap.ui.codeeditor.CodeEditor");
        let codeEditor: sap.ui.codeeditor.CodeEditor = new sap.ui.codeeditor.CodeEditor;
        let codeView: sap.m.Dialog = new sap.m.Dialog("", {
            title: ibas.i18n.prop("integration_view_code"),
            type: sap.m.DialogType.Standard,
            state: sap.ui.core.ValueState.None,
            stretchOnPhone: true,
            horizontalScrolling: true,
            verticalScrolling: true,
            content: [codeEditor],
            endButton: new sap.m.Button("", {
                text: ibas.i18n.prop("shell_exit"),
                type: sap.m.ButtonType.Transparent,
                press: function (): void {
                    codeView.close();
                }
            })
        });
        if (!ibas.objects.isNull(code)) {
            let fileReader: FileReader = new FileReader();
            fileReader.onload = function (e: ProgressEvent): void {
                let dataUrl: string = (<any>e.target).result;
                codeEditor.setValue(dataUrl);
            };
            fileReader.readAsDataURL(code);
        }
        codeView.open();
    }
}
