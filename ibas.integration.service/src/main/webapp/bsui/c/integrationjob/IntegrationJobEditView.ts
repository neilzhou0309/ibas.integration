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
import { emActionRelationship } from "../../../api/index";
import { IIntegrationJobEditView } from "../../../bsapp/integrationjob/index";

/**
 * 编辑视图-集成任务
 */
export class IntegrationJobEditView extends ibas.BOEditView implements IIntegrationJobEditView {
    /** 删除数据事件 */
    deleteDataEvent: Function;
    /** 新建数据事件，参数1：是否克隆 */
    createDataEvent: Function;
    /** 选择业务对象 */
    chooseBusinessObjectEvent: Function;
    /** 选择应用 */
    chooseApplicationEvent: Function;
    /** 添加集成任务-动作事件 */
    addIntegrationJobActionEvent: Function;
    /** 删除集成任务-动作事件 */
    removeIntegrationJobActionEvent: Function;
    /** 编辑任务动作 */
    editJobActionEvent: Function;
    /** 选择任务动作 */
    chooseJobActionEvent: Function;
    /** 添加集成任务-动作事件 */
    addIntegrationJobActionCfgEvent: Function;
    /** 删除集成任务-动作事件 */
    removeIntegrationJobActionCfgEvent: Function;
    /** 选择任务动作配置-配置项目 */
    chooseJobActionCfgConfigItemEvent: Function;

    /** 绘制视图 */
    darw(): any {
        let that: this = this;
        this.form = new sap.ui.layout.form.SimpleForm("", {
            content: [
                new sap.ui.core.Title("", { text: ibas.i18n.prop("integration_basis_information") }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_integrationjob_jobname") }),
                new sap.m.Input("", {
                    type: sap.m.InputType.Text
                }).bindProperty("value", {
                    path: "/jobName",
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_integrationjob_activated") }),
                new sap.m.Select("", {
                    items: openui5.utils.createComboBoxItems(ibas.emYesNo)
                }).bindProperty("selectedKey", {
                    path: "/activated",
                    type: "sap.ui.model.type.Integer"
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_integrationjob_bocode") }),
                new sap.m.Input("", {
                    showValueHelp: true,
                    valueHelpRequest: function (): void {
                        that.fireViewEvents(that.chooseBusinessObjectEvent);
                    }
                }).bindProperty("value", {
                    path: "/boCode",
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_integrationjob_applicationid") }),
                new sap.m.Input("", {
                    showValueHelp: true,
                    valueHelpRequest: function (): void {
                        that.fireViewEvents(that.chooseApplicationEvent);
                    }
                }).bindProperty("value", {
                    path: "/applicationId",
                }),
                new sap.ui.core.Title("", { text: ibas.i18n.prop("integration_other_information") }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_integrationjob_objectkey") }),
                new sap.m.Input("", {
                    enable: false,
                    type: sap.m.InputType.Text
                }).bindProperty("value", {
                    path: "/objectKey",
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_integrationjob_objectcode") }),
                new sap.m.Input("", {
                    enabled: false,
                    type: sap.m.InputType.Text
                }).bindProperty("value", {
                    path: "/objectCode",
                }),
            ]
        });
        this.tableTitle = new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_integrationjobaction") });
        this.form.addContent(this.tableTitle);
        this.tableIntegrationJobAction = new sap.ui.table.Table("", {
            extension: new sap.m.Toolbar("", {
                content: [
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("shell_data_add"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://add",
                        press: function (): void {
                            that.fireViewEvents(that.addIntegrationJobActionEvent);
                        }
                    }),
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("shell_data_remove"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://less",
                        press: function (): void {
                            that.fireViewEvents(that.removeIntegrationJobActionEvent,
                                // 获取表格选中的对象
                                openui5.utils.getTableSelecteds<bo.IntegrationJobAction>(that.tableIntegrationJobAction)
                            );
                        }
                    })
                ]
            }),
            enableSelectAll: false,
            visibleRowCount: ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, 10),
            rows: "{/rows}",
            rowActionCount: 1,
            rowActionTemplate: new sap.ui.table.RowAction({
                items: [
                    new sap.ui.table.RowActionItem({
                        icon: "sap-icon://slim-arrow-right",
                        press: function (oEvent: any): void {
                            that.fireViewEvents(that.editJobActionEvent
                                , this.getBindingContext().getObject()
                            );
                        },
                    }),
                ]
            }),
            columns: [
                /*
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_integrationjobaction_relationship"),
                    template: new sap.m.Select("", {
                        width: "100%",
                        items: openui5.utils.createComboBoxItems(emActionRelationship)
                    }).bindProperty("selectedKey", {
                        path: "relationship",
                        type: "sap.ui.model.type.Integer"
                    })
                }),
                */
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_integrationjobaction_actionname"),
                    template: new sap.m.Input("", {
                        width: "100%",
                    }).bindProperty("value", {
                        path: "actionName"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_integrationjobaction_actionid"),
                    template: new sap.m.Input("", {
                        width: "100%",
                        showValueHelp: true,
                        valueHelpRequest: function (): void {
                            that.fireViewEvents(that.chooseJobActionEvent,
                                // 获取当前对象
                                this.getBindingContext().getObject()
                            );
                        }
                    }).bindProperty("value", {
                        path: "actionId"
                    })
                }),
            ]
        });
        this.tableIntegrationJobActionCfg = new sap.ui.table.Table("", {
            extension: new sap.m.Toolbar("", {
                content: [
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("shell_data_add"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://add",
                        press: function (): void {
                            that.fireViewEvents(that.addIntegrationJobActionCfgEvent);
                        }
                    }),
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("shell_data_remove"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://less",
                        press: function (): void {
                            that.fireViewEvents(that.removeIntegrationJobActionCfgEvent,
                                // 获取表格选中的对象
                                openui5.utils.getTableSelecteds<bo.IntegrationJobActionCfg>(that.tableIntegrationJobActionCfg)
                            );
                        }
                    }),
                    new sap.m.ToolbarSpacer(""),
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("shell_back"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://nav-back",
                        press: function (): void {
                            that.fireViewEvents(that.editJobActionEvent);
                        }
                    })
                ]
            }),
            enableSelectAll: false,
            visibleRowCount: ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, 10),
            rows: "{/rows}",
            columns: [
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_integrationjobactioncfg_key"),
                    template: new sap.m.Input("", {
                        width: "100%",
                        showValueHelp: true,
                        valueHelpRequest: function (): void {
                            that.fireViewEvents(that.chooseJobActionCfgConfigItemEvent,
                                // 获取当前对象
                                this.getBindingContext().getObject()
                            );
                        }
                    }).bindProperty("value", {
                        path: "key"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_integrationjobactioncfg_value"),
                    template: new sap.m.Input("", {
                        width: "100%",
                    }).bindProperty("value", {
                        path: "value"
                    })
                }),
            ]
        });
        this.splitContainer = new sap.m.SplitContainer("", {
            mode: sap.m.SplitAppMode.HideMode,
            detailPages: [
                this.tableIntegrationJobAction,
                this.tableIntegrationJobActionCfg
            ]
        });
        this.form.addContent(this.splitContainer);
        this.page = new sap.m.Page("", {
            showHeader: false,
            subHeader: new sap.m.Toolbar("", {
                content: [
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("shell_data_save"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://save",
                        press: function (): void {
                            that.fireViewEvents(that.saveDataEvent);
                        }
                    }),
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("shell_data_delete"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://delete",
                        press: function (): void {
                            that.fireViewEvents(that.deleteDataEvent);
                        }
                    }),
                    new sap.m.ToolbarSeparator(""),
                    new sap.m.MenuButton("", {
                        text: ibas.i18n.prop("shell_data_new"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://create",
                        buttonMode: sap.m.MenuButtonMode.Split,
                        defaultAction: function (): void {
                            // 触发新建对象
                            that.fireViewEvents(that.createDataEvent, false);
                        },
                        menu: new sap.m.Menu("", {
                            items: [
                                new sap.m.MenuItem("", {
                                    text: ibas.i18n.prop("shell_data_new"),
                                    icon: "sap-icon://create"
                                }),
                                new sap.m.MenuItem("", {
                                    text: ibas.i18n.prop("shell_data_clone"),
                                    icon: "sap-icon://copy"
                                }),
                            ],
                            itemSelected: function (event: any): void {
                                let item: any = event.getParameter("item");
                                if (item instanceof sap.m.MenuItem) {
                                    if (item.getIcon() === "sap-icon://copy") {
                                        // 触发克隆对象
                                        that.fireViewEvents(that.createDataEvent, true);
                                    } else {
                                        // 触发新建对象
                                        that.fireViewEvents(that.createDataEvent, false);
                                    }
                                }
                            }
                        })
                    }),
                ]
            }),
            content: [this.form]
        });
        this.id = this.page.getId();
        return this.page;
    }
    private page: sap.m.Page;
    private tableTitle: sap.ui.core.Title;
    private splitContainer: sap.m.SplitContainer;
    private form: sap.ui.layout.form.SimpleForm;
    /** 改变视图状态 */
    private changeViewStatus(data: bo.IntegrationJob): void {
        if (ibas.objects.isNull(data)) {
            return;
        }
        // 新建时：禁用删除，
        if (data.isNew) {
            if (this.page.getSubHeader() instanceof sap.m.Toolbar) {
                openui5.utils.changeToolbarDeletable(<sap.m.Toolbar>this.page.getSubHeader(), false);
            }
        }
        // 不可编辑：已批准，
    }
    private tableIntegrationJobAction: sap.ui.table.Table;
    private tableIntegrationJobActionCfg: sap.ui.table.Table;

    /** 显示数据 */
    showIntegrationJob(data: bo.IntegrationJob): void {
        this.form.setModel(new sap.ui.model.json.JSONModel(data));
        // 监听属性改变，并更新控件
        openui5.utils.refreshModelChanged(this.form, data);
        // 改变视图状态
        this.changeViewStatus(data);
    }
    /** 显示数据 */
    showIntegrationJobActions(datas: bo.IntegrationJobAction[]): void {
        this.tableTitle.setText(ibas.i18n.prop("bo_integrationjob_integrationjobactions"));
        this.splitContainer.backToTopDetail(null, null);
        this.tableIntegrationJobAction.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
        // 监听属性改变，并更新控件
        openui5.utils.refreshModelChanged(this.tableIntegrationJobAction, datas);
    }
    /** 显示数据 */
    showIntegrationJobActionCfgs(datas: bo.IntegrationJobActionCfg[]): void {
        this.tableTitle.setText(ibas.i18n.prop("bo_integrationjobaction_integrationjobactioncfgs"));
        this.splitContainer.toDetail(this.tableIntegrationJobActionCfg.getId(), null, null, null);
        this.tableIntegrationJobActionCfg.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
        // 监听属性改变，并更新控件
        openui5.utils.refreshModelChanged(this.tableIntegrationJobActionCfg, datas);
    }
}
